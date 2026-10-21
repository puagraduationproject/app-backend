import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { Kysely, PostgresDialect, sql } from 'kysely';
import pg from 'pg';
import type { FastifyInstance } from 'fastify';

process.env.NODE_ENV = 'test';
process.env.MAIL_MODE = 'log';
process.env.PUBLIC_URL ??= 'http://localhost';
process.env.AUTH_SECRET ??= 'test-secret';

const { buildServer } = await import('../gateway/server.js');
export const { db } = await import('../database/client.js');
export const { sentInLogMode } = await import('../gateway/shell/mail.js');
export const SESSION_COOKIE = '__Host-gp_session';

export const CHROME_WINDOWS =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141 Safari/537';
export const FIREFOX_LINUX = 'Mozilla/5.0 (X11; Linux x86_64; rv:144.0) Gecko/20100101 Firefox/144';

export const admin = new Kysely<unknown>({
  dialect: new PostgresDialect({ pool: new pg.Pool({ connectionString: process.env.DATABASE_URL, max: 1 }) }),
});

export async function stopApp(app: FastifyInstance) {
  await app.close();
  await db.destroy();
  await admin.destroy();
}

export async function startApp(): Promise<FastifyInstance> {
  await sql`drop schema if exists core cascade`.execute(admin);
  const folder = join(import.meta.dirname, '../database/migrations/core');
  for (const file of readdirSync(folder).filter((name) => name.endsWith('.sql')).sort()) {
    const up = readFileSync(join(folder, file), 'utf8').split('-- migrate:down')[0];
    await sql.raw(up).execute(admin);
  }
  return buildServer();
}

export const lastCode = (to: string) => [...sentInLogMode].reverse().find((sent) => sent.to === to && sent.code)!.code!;

export const allowNewCode = (to: string) =>
  db.updateTable('core.email_code').set({ created_at: new Date(Date.now() - 120_000) }).where('email', '=', to).execute();

export const someIp = () => `2001:db8::${Math.floor(Math.random() * 0xffff).toString(16)}:${Math.floor(Math.random() * 0xffff).toString(16)}`;

export function client(app: FastifyInstance, userAgent = CHROME_WINDOWS, ip = someIp()) {
  let token = '';
  async function call(method: 'GET' | 'POST', url: string, payload?: object, headers: Record<string, string> = {}) {
    const response = await app.inject({
      method,
      url,
      payload,
      headers: { 'user-agent': userAgent, ...headers },
      cookies: token ? { [SESSION_COOKIE]: token } : {},
      remoteAddress: ip,
    });
    const set = response.cookies.find((cookie) => cookie.name === SESSION_COOKIE);
    if (set) token = set.value;
    return response;
  }
  return {
    get: (url: string) => call('GET', url),
    post: (url: string, payload: object = {}, headers?: Record<string, string>) => call('POST', url, payload, headers),
    token: () => token,
    useToken: (value: string) => { token = value; },
  };
}

export async function signUp(app: FastifyInstance, email: string, password: string) {
  const browser = client(app);
  await browser.post('/api/auth/start', { email });
  const { ticket } = (await browser.post('/api/auth/code/verify', { email, code: lastCode(email) })).json();
  await browser.post('/api/auth/password/set', { ticket, password });
  return browser;
}
