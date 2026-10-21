import { sql } from 'kysely';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { admin, client, db, signUp, startApp, stopApp } from '../helpers.js';

let app: FastifyInstance;
let owner: ReturnType<typeof client>;
let other: ReturnType<typeof client>;

const UUID = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/;
const nova = { name: 'Nova Café', handle: 'nova', business_type: 'coffee_shop', team_size: 'alone' };

beforeAll(async () => {
  app = await startApp();
  owner = await signUp(app, 'ahmed.owner@example.com', 'a good password');
  other = await signUp(app, 'mona.other@example.com', 'a good password');
});

afterAll(async () => {
  await stopApp(app);
});

describe('business setup', () => {
  it('needs to be logged in', async () => {
    expect((await client(app).post('/api/app/businesses', nova)).statusCode).toBe(401);
    expect((await client(app).get('/api/app/handles/nova')).statusCode).toBe(401);
  });

  it('checks handles', async () => {
    expect((await owner.get('/api/app/handles/nova')).json()).toEqual({ handle: 'nova', available: true, reason: null });
    expect((await owner.get('/api/app/handles/login')).json().reason).toBe('reserved');
    expect((await owner.get('/api/app/handles/No%20Va')).json().reason).toBe('invalid');
    expect((await owner.get('/api/app/handles/ab')).json().reason).toBe('invalid');
  });

  it('asks for your name when the account has none', async () => {
    const response = await owner.post('/api/app/businesses', nova);
    expect(response.json().error).toEqual({ code: 'invalid_input', field: 'your_name' });
  });

  it('creates the business, with you as its owner, named from your name', async () => {
    const response = await owner.post('/api/app/businesses', { ...nova, your_name: 'Ahmed Nassem' });
    expect(response.statusCode).toBe(201);
    expect(response.json().business).toEqual({
      name: 'Nova Café',
      handle: 'nova',
      business_type: 'coffee_shop',
      sells: null,
      team_size: 'alone',
      role: 'owner',
      username: 'ahmed',
      display_name: 'Ahmed Nassem',
    });
    expect((await owner.get('/api/auth/me')).json().account.name).toBe('Ahmed Nassem');
  });

  it('starts a café from its template', async () => {
    const row = await sql<{ template_key: string | null }>`select template_key from core.business where handle = 'nova'`.execute(admin);
    expect(row.rows[0]!.template_key).toBe('coffee_shop');
  });

  it('writes an audit row and a BusinessCreated event', async () => {
    const audit = await sql<{ action: string }>`select action from core.audit_log`.execute(admin);
    expect(audit.rows.map((row) => row.action)).toContain('business.create');
    const events = await sql<{ event_type: string; payload: { data: { handle: string } } }>`select event_type, payload from core.outbox`.execute(admin);
    expect(events.rows[0]!.event_type).toBe('BusinessCreated');
    expect(events.rows[0]!.payload.data.handle).toBe('nova');
  });

  it('refuses a handle that is taken', async () => {
    expect((await other.get('/api/app/handles/nova')).json().reason).toBe('taken');
    const response = await other.post('/api/app/businesses', { ...nova, name: 'Another Nova', your_name: 'Mona' });
    expect(response.statusCode).toBe(409);
    expect(response.json().error.code).toBe('handle_taken');
  });

  it('lists the kinds of business, and which have a template ready', async () => {
    expect((await owner.get('/api/app/setup')).json().business_types).toEqual([
      { key: 'coffee_shop', ready: true },
      { key: 'small_market', ready: true },
      { key: 'grocery', ready: true },
      { key: 'bakery', ready: false },
      { key: 'restaurant', ready: false },
      { key: 'other', ready: false },
    ]);
    expect((await client(app).get('/api/app/setup')).statusCode).toBe(401);
  });

  it('starts a kind with no template from the essentials only', async () => {
    const response = await other.post('/api/app/businesses', { name: 'Glow', handle: 'glow', business_type: 'bakery', team_size: 'alone', your_name: 'Mona' });
    expect(response.json().business.business_type).toBe('bakery');
    const row = await sql<{ template_key: string | null }>`select template_key from core.business where handle = 'glow'`.execute(admin);
    expect(row.rows[0]!.template_key).toBeNull();
  });

  it('refuses the kinds that were removed', async () => {
    for (const kind of ['pharmacy', 'online', 'services', 'spaceship']) {
      expect((await other.post('/api/app/businesses', { ...nova, handle: 'x-y-z', business_type: kind })).json().error.code).toBe('invalid_input');
    }
  });

  it('keeps what a business sells, in the owner\'s words', async () => {
    const response = await other.post('/api/app/businesses', { name: 'Mona Style', handle: 'mona-style', business_type: 'other', sells: '  Clothes for kids ', team_size: 'alone' });
    expect(response.json().business).toMatchObject({ business_type: 'other', sells: 'Clothes for kids' });
    const events = await sql<{ payload: { data: { sells: string; template_key: null } } }>`select payload from core.outbox where payload->'data'->>'handle' = 'mona-style'`.execute(admin);
    expect(events.rows[0]!.payload.data).toMatchObject({ sells: 'Clothes for kids', template_key: null });
  });

  it('takes the username from the email when the name has no Latin letters', async () => {
    const arabic = await signUp(app, 'mostafa.k@example.com', 'a good password');
    const response = await arabic.post('/api/app/businesses', { ...nova, handle: 'sokkar', your_name: 'مصطفى كمال' });
    expect(response.json().business.username).toBe('mostafa.k');
  });

  it('lists only your own businesses, with no internal IDs', async () => {
    await other.post('/api/app/businesses', { name: 'Bean', handle: 'bean', business_type: 'grocery', team_size: 'team', your_name: 'Mona' });
    const row = await sql<{ template_key: string | null }>`select template_key from core.business where handle = 'bean'`.execute(admin);
    expect(row.rows[0]!.template_key).toBe('small_market');
    const mine = await owner.get('/api/app/businesses');
    expect(mine.json().businesses.map((business: { handle: string }) => business.handle)).toEqual(['nova']);
    expect(mine.body).not.toMatch(UUID);
    expect((await owner.get('/api/auth/me')).body).not.toMatch(UUID);
  });
});

describe('the wall between businesses', () => {
  const asAccount = (email: string) =>
    sql<{ id: string }>`select id from core.account where email = ${email}`.execute(admin).then((result) => result.rows[0]!.id);

  it('another account cannot read, change or join a business', async () => {
    const mona = await asAccount('mona.other@example.com');
    const novaId = (await sql<{ id: string }>`select id from core.business where handle = 'nova'`.execute(admin)).rows[0]!.id;

    await db.transaction().execute(async (trx) => {
      await sql`select set_config('app.account_id', ${mona}, true)`.execute(trx);
      const seen = await trx.selectFrom('core.business').select('handle').execute();
      expect(seen.map((row) => row.handle).sort()).toEqual(['bean', 'glow', 'mona-style']);
      expect(await trx.selectFrom('core.membership').select('username').where('business_id', '=', novaId).execute()).toEqual([]);
      expect(await trx.selectFrom('core.audit_log').selectAll().execute()).toEqual([]);
      const changed = await trx.updateTable('core.business').set({ name: 'Taken over' }).where('id', '=', novaId).executeTakeFirst();
      expect(Number(changed.numUpdatedRows)).toBe(0);
    });

    await expect(
      db.transaction().execute(async (trx) => {
        await sql`select set_config('app.account_id', ${mona}, true)`.execute(trx);
        await trx
          .insertInto('core.membership')
          .values({ business_id: novaId, user_id: mona, username: 'mona', display_name: 'Mona', role: 'owner' })
          .execute();
      }),
    ).rejects.toThrow(/row-level security/);
  });

  it('sees nothing without a context', async () => {
    expect(await db.selectFrom('core.business').selectAll().execute()).toEqual([]);
    expect(await db.selectFrom('core.membership').selectAll().execute()).toEqual([]);
  });
});
