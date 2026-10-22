import type { FastifyInstance, FastifyReply } from 'fastify';
import type { Selectable } from 'kysely';
import { sql } from 'kysely';
import { db } from '../../database/client.js';
import type { AccountTable } from '../../database/types.js';
import { AppError } from '../../kernel/errors/index.js';
import { googleFinish, googleReady, googleStart } from './google.js';
import { sendCode } from '../../kernel/drivers/mail/index.js';
import { checkPassword, hashPassword, keyedHash, newCode, newTicket, sameHash } from './secrets.js';
import { endOneSession, endOtherSessions, listSessions, requireSession, signIn, signOut } from './sessions.js';

const CODE_MINUTES = 10;
const CODE_TRIES = 5;
const CODE_WAIT_SECONDS = 60;
const CODES_PER_HOUR = 10;
const TICKET_MINUTES = 10;
const PASSWORD_TRIES = 5;
const LOCK_MINUTES = 15;
const GOOGLE_COOKIE = 'gp_google';
const EMAIL_CHECKS_PER_HOUR = 10;

type Account = Selectable<AccountTable>;

const email = { type: 'string', minLength: 3, maxLength: 254, pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$' } as const;
const password = { type: 'string', minLength: 8, maxLength: 128 } as const;
const body = (properties: Record<string, object>) => ({
  body: { type: 'object', required: Object.keys(properties), additionalProperties: false, properties },
});

const emailChecks = (properties: Record<string, object>) => ({
  schema: body(properties),
  config: { rateLimit: { max: EMAIL_CHECKS_PER_HOUR, timeWindow: '1 hour', keyGenerator: (request: { ip: string; url: string }) => `${request.url} ${request.ip}` } },
});

const minutesFromNow = (minutes: number) => new Date(Date.now() + minutes * 60_000);
const normalize = (value: string) => value.trim().toLowerCase();

function publicAccount(account: Account) {
  return {
    email: account.email,
    name: account.name,
    phone: account.phone,
    language: account.language,
    has_password: Boolean(account.password_hash),
    has_google: Boolean(account.google_id),
    created_at: account.created_at,
  };
}

function findAccount(address: string) {
  return db
    .selectFrom('core.account')
    .selectAll()
    .where(sql<string>`lower(email)`, '=', address)
    .executeTakeFirst();
}

async function sendNewCode(address: string) {
  const recent = await db
    .selectFrom('core.email_code')
    .select(['created_at'])
    .where(sql<string>`lower(email)`, '=', address)
    .where('created_at', '>', new Date(Date.now() - 3_600_000))
    .orderBy('created_at', 'desc')
    .execute();
  const last = recent[0];
  if (last) {
    const waited = (Date.now() - last.created_at.getTime()) / 1000;
    if (waited < CODE_WAIT_SECONDS) {
      const retry = Math.ceil(CODE_WAIT_SECONDS - waited);
      throw new AppError('too_soon', 429, 'A code was sent less than a minute ago', { retry_after_seconds: retry });
    }
  }
  if (recent.length >= CODES_PER_HOUR) {
    throw new AppError('limit_reached', 429, 'Too many codes for this email in one hour');
  }
  const code = newCode();
  await db
    .insertInto('core.email_code')
    .values({ email: address, code_hash: keyedHash(code), expires_at: minutesFromNow(CODE_MINUTES) })
    .execute();
  await sendCode(address, code);
  return { sent: true, retry_after_seconds: CODE_WAIT_SECONDS };
}

async function issueTicket(accountId: string) {
  const ticket = newTicket();
  await db
    .insertInto('core.auth_ticket')
    .values({ account_id: accountId, ticket_hash: keyedHash(ticket), expires_at: minutesFromNow(TICKET_MINUTES) })
    .execute();
  return ticket;
}

async function accountForTicket(ticket: string) {
  const row = await db
    .selectFrom('core.auth_ticket')
    .select(['id', 'account_id'])
    .where('ticket_hash', '=', keyedHash(ticket))
    .where('used_at', 'is', null)
    .where('expires_at', '>', new Date())
    .executeTakeFirst();
  if (!row) throw new AppError('ticket_invalid', 400, 'The ticket is wrong, used or expired');
  const account = await db.selectFrom('core.account').selectAll().where('id', '=', row.account_id).executeTakeFirstOrThrow();
  return { ticketId: row.id, account };
}

async function checkAccountPassword(address: string, given: string): Promise<Account> {
  const account = await findAccount(address);
  if (!account) throw new AppError('wrong_password', 401, 'Email and password do not match');
  if (account.locked_until && account.locked_until > new Date()) {
    const retry = Math.ceil((account.locked_until.getTime() - Date.now()) / 1000);
    throw new AppError('locked', 423, 'Too many wrong passwords', { retry_after_seconds: retry });
  }
  if (!account.password_hash) throw new AppError('no_password', 400, 'This account has no password yet');
  if (await checkPassword(account.password_hash, given)) {
    if (account.failed_logins > 0 || account.locked_until) {
      await db
        .updateTable('core.account')
        .set({ failed_logins: 0, locked_until: null, updated_at: new Date() })
        .where('id', '=', account.id)
        .execute();
    }
    return account;
  }
  const failed = account.failed_logins + 1;
  if (failed >= PASSWORD_TRIES) {
    await db
      .updateTable('core.account')
      .set({ failed_logins: 0, locked_until: minutesFromNow(LOCK_MINUTES), updated_at: new Date() })
      .where('id', '=', account.id)
      .execute();
    throw new AppError('locked', 423, 'Too many wrong passwords', { retry_after_seconds: LOCK_MINUTES * 60 });
  }
  await db.updateTable('core.account').set({ failed_logins: failed, updated_at: new Date() }).where('id', '=', account.id).execute();
  throw new AppError('wrong_password', 401, 'Email and password do not match');
}

function googleFailed(reply: FastifyReply, reason: string) {
  return reply.redirect(`/login?google=${encodeURIComponent(reason)}`);
}

export async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: { email: string } }>('/api/auth/start', emailChecks({ email }), async (request) => {
    const address = normalize(request.body.email);
    const account = await findAccount(address);
    if (account?.password_hash) return { next: 'password' };
    if (account?.google_id) return { next: 'google' };
    await sendNewCode(address);
    return { next: 'code', retry_after_seconds: CODE_WAIT_SECONDS };
  });

  app.post<{ Body: { email: string } }>('/api/auth/code/send', emailChecks({ email }), async (request) =>
    sendNewCode(normalize(request.body.email)),
  );

  app.post<{ Body: { email: string; code: string } }>(
    '/api/auth/code/verify',
    { schema: body({ email, code: { type: 'string', pattern: '^[0-9]{6}$' } }) },
    async (request, reply) => {
      const address = normalize(request.body.email);
      const row = await db
        .selectFrom('core.email_code')
        .selectAll()
        .where(sql<string>`lower(email)`, '=', address)
        .orderBy('created_at', 'desc')
        .executeTakeFirst();
      if (!row || row.used_at || row.expires_at < new Date()) {
        throw new AppError('code_expired', 400, 'The code is too old or was used', { field: 'code' });
      }
      if (row.attempts >= CODE_TRIES) {
        throw new AppError('too_many_tries', 400, 'Too many wrong codes', { field: 'code' });
      }
      if (!sameHash(row.code_hash, keyedHash(request.body.code))) {
        const attempts = row.attempts + 1;
        await db.updateTable('core.email_code').set({ attempts }).where('id', '=', row.id).execute();
        if (attempts >= CODE_TRIES) throw new AppError('too_many_tries', 400, 'Too many wrong codes', { field: 'code' });
        throw new AppError('wrong_code', 400, 'The code does not match', { field: 'code' });
      }
      await db.updateTable('core.email_code').set({ used_at: new Date() }).where('id', '=', row.id).execute();

      let account = await findAccount(address);
      if (!account) {
        account = await db
          .insertInto('core.account')
          .values({ email: address, email_verified_at: new Date(), updated_at: new Date() })
          .returningAll()
          .executeTakeFirstOrThrow();
      } else if (!account.email_verified_at) {
        account = await db
          .updateTable('core.account')
          .set({ email_verified_at: new Date(), updated_at: new Date() })
          .where('id', '=', account.id)
          .returningAll()
          .executeTakeFirstOrThrow();
      }
      if (account.password_hash || account.google_id) await signIn(request, reply, account);
      return { ticket: await issueTicket(account.id), needs_password: !account.password_hash, account: publicAccount(account) };
    },
  );

  app.post<{ Body: { ticket: string } }>(
    '/api/auth/ticket',
    { schema: body({ ticket: { type: 'string', maxLength: 100 } }) },
    async (request, reply) => {
      const { ticketId, account } = await accountForTicket(request.body.ticket);
      await db.updateTable('core.auth_ticket').set({ used_at: new Date() }).where('id', '=', ticketId).execute();
      await signIn(request, reply, account);
      return { needs_password: !account.password_hash, account: publicAccount(account) };
    },
  );

  app.post<{ Body: { ticket: string; password: string } }>(
    '/api/auth/password/set',
    { schema: body({ ticket: { type: 'string', maxLength: 100 }, password }) },
    async (request, reply) => {
      const { ticketId, account } = await accountForTicket(request.body.ticket);
      const updated = await db.transaction().execute(async (trx) => {
        await trx.updateTable('core.auth_ticket').set({ used_at: new Date() }).where('id', '=', ticketId).execute();
        return trx
          .updateTable('core.account')
          .set({ password_hash: await hashPassword(request.body.password), failed_logins: 0, locked_until: null, updated_at: new Date() })
          .where('id', '=', account.id)
          .returningAll()
          .executeTakeFirstOrThrow();
      });
      const session = await signIn(request, reply, updated);
      await endOtherSessions(updated.id, session.id, 'password_changed');
      return { account: publicAccount(updated) };
    },
  );

  app.post<{ Body: { email: string; password: string } }>(
    '/api/auth/password/login',
    { schema: body({ email, password: { type: 'string', minLength: 1, maxLength: 128 } }) },
    async (request, reply) => {
      const account = await checkAccountPassword(normalize(request.body.email), request.body.password);
      await signIn(request, reply, account);
      return { account: publicAccount(account) };
    },
  );

  app.post<{ Body: { old_password: string; new_password: string } }>(
    '/api/auth/password/change',
    { schema: body({ old_password: { type: 'string', minLength: 1, maxLength: 128 }, new_password: password }) },
    async (request, reply) => {
      const { session, account } = await requireSession(request);
      await checkAccountPassword(normalize(account.email), request.body.old_password);
      const updated = await db
        .updateTable('core.account')
        .set({ password_hash: await hashPassword(request.body.new_password), updated_at: new Date() })
        .where('id', '=', account.id)
        .returningAll()
        .executeTakeFirstOrThrow();
      await signIn(request, reply, updated);
      await endOtherSessions(updated.id, session.id, 'password_changed');
      return { account: publicAccount(updated) };
    },
  );

  app.get('/api/auth/me', async (request) => ({ account: publicAccount((await requireSession(request)).account) }));

  app.post<{ Body: { language: 'ar' | 'en' } }>(
    '/api/auth/language',
    { schema: body({ language: { enum: ['ar', 'en'] } }) },
    async (request) => {
      const { account } = await requireSession(request);
      const updated = await db
        .updateTable('core.account')
        .set({ language: request.body.language, updated_at: new Date() })
        .where('id', '=', account.id)
        .returningAll()
        .executeTakeFirstOrThrow();
      return { account: publicAccount(updated) };
    },
  );

  app.post('/api/auth/logout', async (request, reply) => {
    await signOut(request, reply);
    return { logged_out: true };
  });

  app.get('/api/auth/sessions', async (request) => {
    const { session, account } = await requireSession(request);
    return { sessions: await listSessions(account.id, session.id) };
  });

  app.post<{ Body: { id: string } }>(
    '/api/auth/sessions/end',
    { schema: body({ id: { type: 'string', format: 'uuid' } }) },
    async (request) => {
      const { account } = await requireSession(request);
      await endOneSession(account.id, request.body.id);
      return { ended: true };
    },
  );

  app.post('/api/auth/sessions/end-others', async (request) => {
    const { session, account } = await requireSession(request);
    await endOtherSessions(account.id, session.id, 'ended_by_user');
    return { ended: true };
  });

  app.get('/api/auth/google/start', async (_request, reply) => {
    if (!googleReady()) return googleFailed(reply, 'not_ready');
    const { url, state, verifier } = googleStart();
    reply.setCookie(GOOGLE_COOKIE, `${state}.${verifier}`, {
      path: '/api/auth/google',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 600,
      signed: true,
    });
    return reply.redirect(url);
  });

  app.get<{ Querystring: { code?: string; state?: string; error?: string } }>('/api/auth/google/callback', async (request, reply) => {
    const raw = request.cookies[GOOGLE_COOKIE];
    reply.clearCookie(GOOGLE_COOKIE, { path: '/api/auth/google' });
    if (request.query.error) return googleFailed(reply, 'cancelled');
    const unsigned = raw ? request.unsignCookie(raw) : null;
    const [state, verifier] = unsigned?.valid && unsigned.value ? unsigned.value.split('.') : [];
    if (!state || !verifier || state !== request.query.state || !request.query.code) {
      return googleFailed(reply, 'expired');
    }

    let profile;
    try {
      profile = await googleFinish(request.query.code, verifier);
    } catch (error) {
      request.log.warn(error, 'google sign-in failed');
      return googleFailed(reply, 'failed');
    }

    let account =
      (await db.selectFrom('core.account').selectAll().where('google_id', '=', profile.sub).executeTakeFirst()) ??
      (await findAccount(profile.email));
    if (!account) {
      account = await db
        .insertInto('core.account')
        .values({ email: profile.email, email_verified_at: new Date(), name: profile.name, google_id: profile.sub, updated_at: new Date() })
        .returningAll()
        .executeTakeFirstOrThrow();
    } else if (account.google_id !== profile.sub || !account.email_verified_at || !account.name) {
      account = await db
        .updateTable('core.account')
        .set({
          google_id: profile.sub,
          email_verified_at: account.email_verified_at ?? new Date(),
          name: account.name ?? profile.name,
          updated_at: new Date(),
        })
        .where('id', '=', account.id)
        .returningAll()
        .executeTakeFirstOrThrow();
    }
    return reply.redirect(`/account#ticket=${await issueTicket(account.id)}`);
  });
}
