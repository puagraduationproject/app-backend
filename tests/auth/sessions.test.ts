import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { CHROME_WINDOWS, FIREFOX_LINUX, client, db, sentInLogMode, signUp, startApp, stopApp } from '../helpers.js';

let app: FastifyInstance;

beforeAll(async () => {
  app = await startApp();
});

afterAll(async () => {
  await stopApp(app);
});

const logIn = async (email: string, password: string, userAgent?: string) => {
  const browser = client(app, userAgent);
  await browser.post('/api/auth/password/login', { email, password });
  return browser;
};

const noticesTo = (email: string) => sentInLogMode.filter((sent) => sent.to === email && sent.subject).length;

describe('staying logged in', () => {
  const email = 'session.owner@example.com';

  it('is logged in right after sign-up, with no new log-in email', async () => {
    const browser = await signUp(app, email, 'a good password');
    expect((await browser.get('/api/auth/me')).json().account.email).toBe(email);
    expect(noticesTo(email)).toBe(0);
  });

  it('is not logged in without the cookie', async () => {
    const response = await client(app).get('/api/auth/me');
    expect(response.statusCode).toBe(401);
    expect(response.json().error.code).toBe('not_logged_in');
  });

  it('emails about a new log-in', async () => {
    await logIn(email, 'a good password');
    expect(noticesTo(email)).toBe(1);
  });

  it('keeps only the hash of the key', async () => {
    const browser = await logIn(email, 'a good password');
    const rows = await db.selectFrom('core.session').select('token_hash').execute();
    expect(rows.some((row) => row.token_hash === browser.token())).toBe(false);
    expect(rows.every((row) => row.token_hash.length === 64)).toBe(true);
  });

  it('logs out', async () => {
    const browser = await logIn(email, 'a good password');
    const token = browser.token();
    await browser.post('/api/auth/logout');
    browser.useToken(token);
    expect((await browser.get('/api/auth/me')).statusCode).toBe(401);
  });

  it('ends after 7 days unused', async () => {
    const browser = await logIn(email, 'a good password');
    await db
      .updateTable('core.session')
      .set({ last_seen_at: new Date(Date.now() - 8 * 86_400_000) })
      .where('ended_at', 'is', null)
      .execute();
    expect((await browser.get('/api/auth/me')).statusCode).toBe(401);
  });

  it('ends after 30 days even when used', async () => {
    const browser = await logIn(email, 'a good password');
    await db.updateTable('core.session').set({ expires_at: new Date(Date.now() - 1000) }).where('ended_at', 'is', null).execute();
    expect((await browser.get('/api/auth/me')).statusCode).toBe(401);
  });
});

describe('the browser check', () => {
  it('ends the session when the key shows up in another browser', async () => {
    await signUp(app, 'stolen.cookie@example.com', 'a good password');
    const owner = await logIn('stolen.cookie@example.com', 'a good password');
    const thief = client(app, FIREFOX_LINUX);
    thief.useToken(owner.token());
    expect((await thief.get('/api/auth/me')).statusCode).toBe(401);
    expect((await owner.get('/api/auth/me')).statusCode).toBe(401);
  });

  it('keeps the session when only the IP changes', async () => {
    const owner = await logIn('stolen.cookie@example.com', 'a good password');
    const response = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: { 'user-agent': CHROME_WINDOWS },
      cookies: { '__Host-gp_session': owner.token() },
      remoteAddress: '2001:db8::5',
    });
    expect(response.statusCode).toBe(200);
  });
});

describe('devices', () => {
  const email = 'many.devices@example.com';

  beforeAll(async () => {
    await signUp(app, email, 'a good password');
    await db.updateTable('core.session').set({ ended_at: new Date(), end_reason: 'logged_out' }).execute();
  });

  it('keeps at most 5 and drops the oldest', async () => {
    const devices = [];
    for (let i = 0; i < 6; i++) devices.push(await logIn(email, 'a good password'));
    expect((await devices[0]!.get('/api/auth/me')).statusCode).toBe(401);
    const list = (await devices[5]!.get('/api/auth/sessions')).json().sessions;
    expect(list).toHaveLength(5);
    expect(list.filter((session: { current: boolean }) => session.current)).toHaveLength(1);
    expect(list[0].browser).toBe('Chrome on Windows');
  });

  it('logs out one device, and not another account\'s', async () => {
    const mine = await logIn(email, 'a good password');
    const other = await signUp(app, 'someone.else@example.com', 'a good password');
    const otherId = (await other.get('/api/auth/sessions')).json().sessions[0].id;
    expect((await mine.post('/api/auth/sessions/end', { id: otherId })).json().error.code).toBe('not_found');
    expect((await other.get('/api/auth/me')).statusCode).toBe(200);

    const target = (await mine.get('/api/auth/sessions')).json().sessions.find((session: { current: boolean }) => !session.current);
    await mine.post('/api/auth/sessions/end', { id: target.id });
    const ids = (await mine.get('/api/auth/sessions')).json().sessions.map((session: { id: string }) => session.id);
    expect(ids).not.toContain(target.id);
  });

  it('logs out every other device', async () => {
    const mine = await logIn(email, 'a good password');
    await mine.post('/api/auth/sessions/end-others');
    const list = (await mine.get('/api/auth/sessions')).json().sessions;
    expect(list).toHaveLength(1);
    expect(list[0].current).toBe(true);
  });

  it('changing the password logs out the other devices, not this one', async () => {
    const phone = await logIn(email, 'a good password');
    const laptop = await logIn(email, 'a good password');
    await laptop.post('/api/auth/password/change', { old_password: 'a good password', new_password: 'a new password' });
    expect((await laptop.get('/api/auth/me')).statusCode).toBe(200);
    expect((await phone.get('/api/auth/me')).statusCode).toBe(401);
  });
});

describe('other sites', () => {
  it('refuses a request sent from another site', async () => {
    const response = await client(app).post(
      '/api/auth/password/login',
      { email: 'x@example.com', password: 'x' },
      { origin: 'https://evil.example' },
    );
    expect(response.statusCode).toBe(403);
    expect(response.json().error.code).toBe('bad_origin');
  });
});
