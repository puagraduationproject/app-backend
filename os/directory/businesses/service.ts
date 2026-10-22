import { randomUUID } from 'node:crypto';
import { sql, type Selectable } from 'kysely';
import { BUSINESS_TYPES, type AccountTable, type BusinessTable, type BusinessType, type MembershipTable, type TemplateKey } from '../../../database/types.js';
import { audit } from '../../audit/index.js';
import { AppError } from '../../shared/errors/index.js';
import { emit } from '../../outbox/index.js';
import { inContext, type Trx } from '../../kernel/tenancy/index.js';
import { HANDLE_PATTERN, suggestHandle, usernameFrom } from './names.js';
import { CITIES } from './places.js';
import { RESERVED } from './reserved.js';

const BUSINESSES_PER_ACCOUNT = 5;

// The template each kind starts from (design 7.2). Grocery and small market
// share one template until they need different stages, fields or skills.
const TEMPLATES: Record<BusinessType, TemplateKey | null> = {
  coffee_shop: 'coffee_shop',
  small_market: 'small_market',
  grocery: 'small_market',
  bakery: null,
  restaurant: null,
  other: null,
};

export const businessTypes = () => BUSINESS_TYPES.map((key) => ({ key, ready: TEMPLATES[key] !== null }));

export type City = (typeof CITIES)[number];

type Account = Selectable<AccountTable>;
type Business = Selectable<BusinessTable>;
type Membership = Selectable<MembershipTable>;

export type NewBusiness = {
  name: string;
  handle: string;
  business_type: BusinessType;
  sells?: string;
  city?: City;
  area?: string;
  team_size?: 'alone' | 'team';
  your_name?: string;
  idempotency_key?: string;
};

export function publicBusiness(business: Business, membership: Pick<Membership, 'role' | 'username' | 'display_name'>) {
  return {
    name: business.name,
    handle: business.handle,
    business_type: business.business_type,
    sells: business.sells,
    team_size: business.team_size,
    role: membership.role,
    username: membership.username,
    display_name: membership.display_name,
  };
}

export async function handleStatus(trx: Trx, handle: string): Promise<'available' | 'invalid' | 'reserved' | 'taken'> {
  if (!HANDLE_PATTERN.test(handle) || handle.includes('--')) return 'invalid';
  if (RESERVED.has(handle)) return 'reserved';
  const { rows } = await sql<{ taken: boolean }>`select core.handle_taken(${handle}) as taken`.execute(trx);
  return rows[0]!.taken ? 'taken' : 'available';
}

export function checkHandle(accountId: string, handle: string) {
  return inContext({ accountId }, (trx) => handleStatus(trx, handle));
}

// The names a new business would get from what was typed so far: its handle,
// and the person's username in it (username@handle).
export function suggestNames(account: Account, name: string, yourName?: string) {
  return inContext({ accountId: account.id }, async (trx) => {
    const handle = suggestHandle(name);
    return { handle, status: await handleStatus(trx, handle), username: usernameFrom(yourName?.trim() || account.name, account.email) };
  });
}

function myBusinesses(trx: Trx, accountId: string) {
  return trx
    .selectFrom('core.membership as m')
    .innerJoin('core.business as b', 'b.id', 'm.business_id')
    .selectAll('b')
    .select(['m.role', 'm.username', 'm.display_name'])
    .where('m.user_id', '=', accountId);
}

export function listMine(accountId: string) {
  return inContext({ accountId }, async (trx) => {
    const rows = await myBusinesses(trx, accountId).orderBy('m.joined_at').execute();
    return rows.map((row) => publicBusiness(row, row));
  });
}

// The business an earlier try of the same request made, if there was one.
async function madeEarlier(trx: Trx, accountId: string, key: string | undefined) {
  if (!key) return null;
  const row = await myBusinesses(trx, accountId).where('b.created_by', '=', accountId).where('b.idempotency_key', '=', key).executeTakeFirst();
  return row ? publicBusiness(row, row) : null;
}

export async function createBusiness(account: Account, input: NewBusiness) {
  const name = input.name.trim();
  const sells = input.sells?.trim() || null;
  const area = input.area?.trim();
  const yourName = input.your_name?.trim() || account.name;
  if (!name) throw new AppError('invalid_input', 400, 'The business name is empty', { field: 'name' });
  if (!yourName) throw new AppError('invalid_input', 400, 'Your name is needed', { field: 'your_name' });
  if (input.city && !area) throw new AppError('invalid_input', 400, 'The area is empty', { field: 'area' });

  const businessId = randomUUID();
  try {
    return await inContext({ accountId: account.id, businessId }, async (trx) => {
      const earlier = await madeEarlier(trx, account.id, input.idempotency_key);
      if (earlier) return earlier;

      const { rows } = await sql<{ count: string }>`select count(*) from core.my_business_ids()`.execute(trx);
      if (Number(rows[0]!.count) >= BUSINESSES_PER_ACCOUNT) {
        throw new AppError('business_limit', 403, 'One account can have up to 5 businesses');
      }

      const status = await handleStatus(trx, input.handle);
      if (status === 'taken') throw new AppError('handle_taken', 409, 'This handle is taken', { field: 'handle' });
      if (status !== 'available') throw new AppError('invalid_input', 400, `Handle is ${status}`, { field: 'handle' });

      if (!account.name) {
        await trx.updateTable('core.account').set({ name: yourName, updated_at: new Date() }).where('id', '=', account.id).execute();
      }

      const business = await trx
        .insertInto('core.business')
        .values({
          id: businessId,
          name,
          handle: input.handle,
          business_type: input.business_type,
          template_key: TEMPLATES[input.business_type],
          sells,
          team_size: input.team_size ?? null,
          idempotency_key: input.idempotency_key ?? null,
          created_by: account.id,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      const membership = await trx
        .insertInto('core.membership')
        .values({
          business_id: businessId,
          user_id: account.id,
          username: usernameFrom(yourName, account.email),
          display_name: yourName,
          role: 'owner',
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      const location = input.city && area ? { city: input.city, area } : null;
      if (location) {
        await trx.insertInto('core.location').values({ business_id: businessId, name, ...location }).execute();
      }

      const actor = { type: 'user' as const, id: account.id };
      const shown = publicBusiness(business, membership);
      await audit(trx, { businessId, actor, action: 'business.create', objectType: 'business', objectId: businessId, after: shown });
      await emit(trx, {
        businessId,
        type: 'BusinessCreated',
        version: 1,
        actor,
        data: {
          name: business.name,
          handle: business.handle,
          business_type: business.business_type,
          template_key: business.template_key,
          sells: business.sells,
          location,
          team_size: business.team_size,
          owner_id: account.id,
        },
      });
      return shown;
    });
  } catch (error) {
    const unique = (error as { code?: string }).code === '23505';
    const conflict = error instanceof AppError && (error.code === 'handle_taken' || error.code === 'business_limit');
    if (!unique && !conflict) throw error;
    // Two tries of the same request at once: the one that won has committed by now.
    const earlier = await inContext({ accountId: account.id }, (trx) => madeEarlier(trx, account.id, input.idempotency_key));
    if (earlier) return earlier;
    throw unique ? new AppError('handle_taken', 409, 'This handle is taken', { field: 'handle' }) : error;
  }
}
