import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { sql } from 'kysely';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';

process.env.NODE_ENV = 'test';
process.env.MAIL_MODE = 'log';
process.env.PUBLIC_URL ??= 'http://localhost';
process.env.AUTH_SECRET ??= 'test-secret';

const { buildServer } = await import('../../api/server.js');
const { db } = await import('../../database/client.js');
const { sentInLogMode } = await import('../../platform/auth/mail.js');

let app: FastifyInstance;

const post = (url: string, payload: object) => app.inject({ method: 'POST', url, payload });
const lastCode = (to: string) => [...sentInLogMode].reverse().find((sent) => sent.to === to)!.code;
const allowNewCode = (to: string) =>
  db.updateTable('core.email_code').set({ created_at: new Date(Date.now() - 120_000) }).where('email', '=', to).execute();

beforeAll(async () => {
  await sql`drop schema if exists core cascade`.execute(db);
  const folder = join(import.meta.dirname, '../../database/migrations/core');
  for (const file of readdirSync(folder).filter((name) => name.endsWith('.sql')).sort()) {
    const up = readFileSync(join(folder, file), 'utf8').split('-- migrate:down')[0];
    await sql.raw(up).execute(db);
  }
  app = await buildServer();
});

afterAll(async () => {
  await app.close();
  await db.destroy();
});

describe('sign up with email', () => {
  const email = 'new.owner@example.com';
  let ticket = '';

  it('sends a code for a new email', async () => {
    const response = await post('/api/auth/start', { email: 'New.Owner@Example.com' });
    expect(response.statusCode).toBe(200);
    expect(response.json().next).toBe('code');
    expect(lastCode(email)).toMatch(/^\d{6}$/);
  });

  it('refuses a new code within 60 seconds', async () => {
    const response = await post('/api/auth/code/send', { email });
    expect(response.json().error.code).toBe('too_soon');
  });

  it('refuses a wrong code, then accepts the right one', async () => {
    const wrong = lastCode(email) === '000000' ? '111111' : '000000';
    expect((await post('/api/auth/code/verify', { email, code: wrong })).json().error.code).toBe('wrong_code');

    const response = await post('/api/auth/code/verify', { email, code: lastCode(email) });
    expect(response.statusCode).toBe(200);
    expect(response.json().needs_password).toBe(true);
    expect(response.json().account.email).toBe(email);
    ticket = response.json().ticket;
  });

  it('does not accept the same code twice', async () => {
    expect((await post('/api/auth/code/verify', { email, code: lastCode(email) })).json().error.code).toBe('code_expired');
  });

  it('sets a password with the ticket, once', async () => {
    expect((await post('/api/auth/password/set', { ticket, password: 'short' })).json().error.code).toBe('invalid_input');

    const response = await post('/api/auth/password/set', { ticket, password: 'a good password' });
    expect(response.json().account.has_password).toBe(true);

    expect((await post('/api/auth/password/set', { ticket, password: 'another password' })).json().error.code).toBe('ticket_invalid');
  });

  it('asks for the password next time', async () => {
    expect((await post('/api/auth/start', { email })).json().next).toBe('password');
  });
});

describe('log in with a password', () => {
  const email = 'lock.test@example.com';

  beforeAll(async () => {
    await post('/api/auth/start', { email });
    const { ticket } = (await post('/api/auth/code/verify', { email, code: lastCode(email) })).json();
    await post('/api/auth/password/set', { ticket, password: 'right password' });
  });

  it('logs in with the right password, any letter case in the email', async () => {
    const response = await post('/api/auth/password/login', { email: 'LOCK.test@example.com', password: 'right password' });
    expect(response.json().account.email).toBe(email);
  });

  it('locks the account after 5 wrong passwords', async () => {
    for (let i = 0; i < 4; i++) {
      expect((await post('/api/auth/password/login', { email, password: 'wrong' })).json().error.code).toBe('wrong_password');
    }
    expect((await post('/api/auth/password/login', { email, password: 'wrong' })).json().error.code).toBe('locked');
    const response = await post('/api/auth/password/login', { email, password: 'right password' });
    expect(response.statusCode).toBe(423);
    expect(response.json().error.retry_after_seconds).toBeGreaterThan(0);
  });
});

describe('changing a password needs proof', () => {
  const email = 'change.test@example.com';

  beforeAll(async () => {
    await post('/api/auth/start', { email });
    const { ticket } = (await post('/api/auth/code/verify', { email, code: lastCode(email) })).json();
    await post('/api/auth/password/set', { ticket, password: 'first password' });
  });

  it('refuses without the right old password', async () => {
    const response = await post('/api/auth/password/change', { email, old_password: 'not it', new_password: 'second password' });
    expect(response.json().error.code).toBe('wrong_password');
  });

  it('changes with the old password', async () => {
    await post('/api/auth/password/change', { email, old_password: 'first password', new_password: 'second password' });
    expect((await post('/api/auth/password/login', { email, password: 'second password' })).statusCode).toBe(200);
  });

  it('changes with a code instead of the old password', async () => {
    await allowNewCode(email);
    await post('/api/auth/code/send', { email });
    const { ticket, needs_password } = (await post('/api/auth/code/verify', { email, code: lastCode(email) })).json();
    expect(needs_password).toBe(false);
    await post('/api/auth/password/set', { ticket, password: 'third password' });
    expect((await post('/api/auth/password/login', { email, password: 'third password' })).statusCode).toBe(200);
  });
});

describe('codes', () => {
  const email = 'code.test@example.com';

  it('stops after 5 wrong codes', async () => {
    await post('/api/auth/start', { email });
    const right = lastCode(email);
    const wrong = right === '000000' ? '111111' : '000000';
    for (let i = 0; i < 4; i++) await post('/api/auth/code/verify', { email, code: wrong });
    expect((await post('/api/auth/code/verify', { email, code: wrong })).json().error.code).toBe('too_many_tries');
    expect((await post('/api/auth/code/verify', { email, code: right })).json().error.code).toBe('too_many_tries');
  });

  it('never stores the code itself', async () => {
    const rows = await db.selectFrom('core.email_code').select('code_hash').where('email', '=', email).execute();
    expect(rows.every((row) => row.code_hash !== lastCode(email) && row.code_hash.length === 64)).toBe(true);
  });

  it('refuses a bad email', async () => {
    const response = await post('/api/auth/start', { email: 'not an email' });
    expect(response.json().error.code).toBe('invalid_input');
  });
});
