import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Selectable } from 'kysely';
import { db } from '../../database/client.js';
import type { AccountTable, SessionEndReason, SessionTable } from '../../database/types.js';
import { AppError } from '../errors/index.js';
import { sendNotice } from './mail.js';
import { keyedHash, newTicket } from './secrets.js';

export const SESSION_COOKIE = '__Host-gp_session';
const IDLE_DAYS = 7;
const MAX_DAYS = 30;
const DEVICES = 5;
const TOUCH_SECONDS = 60;

const DAY = 86_400_000;

type Account = Selectable<AccountTable>;
type Session = Selectable<SessionTable>;
export type Signed = { session: Session; account: Account };

export function browserOf(userAgent: string): string {
  const browser =
    /Edg(e|A|iOS)?\//.test(userAgent) ? 'Edge'
    : /OPR\/|Opera/.test(userAgent) ? 'Opera'
    : /SamsungBrowser\//.test(userAgent) ? 'Samsung Internet'
    : /Firefox\/|FxiOS\//.test(userAgent) ? 'Firefox'
    : /Chrome\/|CriOS\//.test(userAgent) ? 'Chrome'
    : /Safari\//.test(userAgent) ? 'Safari'
    : 'Unknown browser';
  const system =
    /Android/.test(userAgent) ? 'Android'
    : /iPhone|iPad|iPod/.test(userAgent) ? 'iOS'
    : /Windows/.test(userAgent) ? 'Windows'
    : /Mac OS X|Macintosh/.test(userAgent) ? 'macOS'
    : /CrOS/.test(userAgent) ? 'ChromeOS'
    : /Linux/.test(userAgent) ? 'Linux'
    : 'an unknown system';
  return `${browser} on ${system}`;
}

const userAgentOf = (request: FastifyRequest) => (request.headers['user-agent'] ?? '').slice(0, 500);

function endSessions(ids: string[], reason: SessionEndReason) {
  if (ids.length === 0) return Promise.resolve();
  return db
    .updateTable('core.session')
    .set({ ended_at: new Date(), end_reason: reason })
    .where('id', 'in', ids)
    .where('ended_at', 'is', null)
    .execute();
}

export async function currentSession(request: FastifyRequest): Promise<Signed | null> {
  const token = request.cookies[SESSION_COOKIE];
  if (!token) return null;
  const now = Date.now();
  const session = await db
    .selectFrom('core.session')
    .selectAll()
    .where('token_hash', '=', keyedHash(token))
    .where('ended_at', 'is', null)
    .where('expires_at', '>', new Date(now))
    .where('last_seen_at', '>', new Date(now - IDLE_DAYS * DAY))
    .executeTakeFirst();
  if (!session) return null;

  if (browserOf(userAgentOf(request)) !== session.browser) {
    await endSessions([session.id], 'browser_changed');
    return null;
  }

  if (now - session.last_seen_at.getTime() > TOUCH_SECONDS * 1000 || session.last_ip !== request.ip) {
    await db
      .updateTable('core.session')
      .set({ last_seen_at: new Date(now), last_ip: request.ip })
      .where('id', '=', session.id)
      .execute();
  }

  const account = await db.selectFrom('core.account').selectAll().where('id', '=', session.account_id).executeTakeFirstOrThrow();
  return { session, account };
}

export async function requireSession(request: FastifyRequest): Promise<Signed> {
  const signed = await currentSession(request);
  if (!signed) throw new AppError('not_logged_in', 401, 'Log in first');
  return signed;
}

export async function signIn(request: FastifyRequest, reply: FastifyReply, account: Account): Promise<Session> {
  const existing = await currentSession(request);
  if (existing?.account.id === account.id) {
    return db
      .updateTable('core.session')
      .set({ proved_at: new Date() })
      .where('id', '=', existing.session.id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
  if (existing) await endSessions([existing.session.id], 'logged_out');

  const hadSessions = await db.selectFrom('core.session').select('id').where('account_id', '=', account.id).executeTakeFirst();
  const token = newTicket();
  const userAgent = userAgentOf(request);
  const session = await db
    .insertInto('core.session')
    .values({
      account_id: account.id,
      token_hash: keyedHash(token),
      browser: browserOf(userAgent),
      user_agent: userAgent,
      first_ip: request.ip,
      last_ip: request.ip,
      expires_at: new Date(Date.now() + MAX_DAYS * DAY),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  const extra = await db
    .selectFrom('core.session')
    .select('id')
    .where('account_id', '=', account.id)
    .where('ended_at', 'is', null)
    .orderBy('last_seen_at', 'desc')
    .orderBy('created_at', 'desc')
    .offset(DEVICES)
    .limit(100)
    .execute();
  await endSessions(extra.map((row) => row.id), 'device_limit');

  reply.setCookie(SESSION_COOKIE, token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: MAX_DAYS * 86_400,
  });

  if (hadSessions && account.email) {
    sendNotice(
      account.email,
      'New log-in to your account',
      `Someone logged in to your account from ${session.browser} on ` +
        `${session.created_at.toLocaleString('en-GB', { timeZone: 'Africa/Cairo' })} (Cairo time).\n\n` +
        'If this was you, there is nothing to do. If it was not, change your password from My account: that logs out every other device.',
    ).catch((error) => request.log.warn(error, 'new log-in email failed'));
  }
  return session;
}

export async function signOut(request: FastifyRequest, reply: FastifyReply) {
  const signed = await currentSession(request);
  if (signed) await endSessions([signed.session.id], 'logged_out');
  reply.clearCookie(SESSION_COOKIE, { path: '/' });
}

export async function endOtherSessions(accountId: string, keepId: string | null, reason: SessionEndReason) {
  let query = db.selectFrom('core.session').select('id').where('account_id', '=', accountId).where('ended_at', 'is', null);
  if (keepId) query = query.where('id', '!=', keepId);
  await endSessions((await query.execute()).map((row) => row.id), reason);
}

export async function endOneSession(accountId: string, id: string) {
  const row = await db
    .selectFrom('core.session')
    .select('id')
    .where('id', '=', id)
    .where('account_id', '=', accountId)
    .where('ended_at', 'is', null)
    .executeTakeFirst();
  if (!row) throw new AppError('not_found', 404, 'No such device');
  await endSessions([row.id], 'ended_by_user');
}

export async function listSessions(accountId: string, currentId: string) {
  const rows = await db
    .selectFrom('core.session')
    .select(['id', 'browser', 'last_ip', 'created_at', 'last_seen_at'])
    .where('account_id', '=', accountId)
    .where('ended_at', 'is', null)
    .where('expires_at', '>', new Date())
    .where('last_seen_at', '>', new Date(Date.now() - IDLE_DAYS * DAY))
    .orderBy('last_seen_at', 'desc')
    .execute();
  return rows.map((row) => ({
    id: row.id,
    browser: row.browser,
    ip: row.last_ip,
    created_at: row.created_at,
    last_seen_at: row.last_seen_at,
    current: row.id === currentId,
  }));
}
