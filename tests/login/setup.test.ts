import { sql } from 'kysely';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { admin, client, signUp, startApp, stopApp } from '../helpers.js';

let app: FastifyInstance;
let person: ReturnType<typeof client>;

beforeAll(async () => {
  app = await startApp();
  person = await signUp(app, 'layla.setup@example.com', 'a good password');
});

afterAll(async () => {
  await stopApp(app);
});

describe('the language of an account', () => {
  it('is Arabic until the person picks English', async () => {
    expect((await person.get('/api/auth/me')).json().account.language).toBe('ar');
    const response = await person.post('/api/auth/language', { language: 'en' });
    expect(response.json().account.language).toBe('en');
    expect((await person.get('/api/auth/me')).json().account.language).toBe('en');
  });

  it('is only Arabic or English, and needs a log-in', async () => {
    expect((await person.post('/api/auth/language', { language: 'fr' })).json().error).toEqual({ code: 'invalid_input', field: 'language' });
    expect((await client(app).post('/api/auth/language', { language: 'ar' })).statusCode).toBe(401);
  });
});

describe('where people stop in the setup', () => {
  it('records the first time each step is reached', async () => {
    for (const step of ['language', 'business_name', 'business_name', 'business_type']) {
      expect((await person.post('/api/app/setup/steps', { step })).json()).toEqual({ recorded: true });
    }
    const second = await signUp(app, 'karim.setup@example.com', 'a good password');
    await second.post('/api/app/setup/steps', { step: 'language' });

    const funnel = await sql<{ step: string; position: number; accounts: number }>`select step, position, accounts from core.setup_funnel order by position`.execute(admin);
    expect(funnel.rows).toEqual([
      { step: 'language', position: 1, accounts: 2 },
      { step: 'business_name', position: 3, accounts: 1 },
      { step: 'business_type', position: 4, accounts: 1 },
    ]);
  });

  it('takes only the setup steps, and needs a log-in', async () => {
    expect((await person.post('/api/app/setup/steps', { step: 'payment' })).json().error.code).toBe('invalid_input');
    expect((await client(app).post('/api/app/setup/steps', { step: 'language' })).statusCode).toBe(401);
  });
});
