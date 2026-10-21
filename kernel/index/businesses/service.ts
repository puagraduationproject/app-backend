import { randomUUID } from 'node:crypto';
import { sql, type Selectable } from 'kysely';
import { BUSINESS_TYPES, type AccountTable, type BusinessTable, type BusinessType, type MembershipTable, type TemplateKey } from '../../../database/types.js';
import { audit } from '../../audit/index.js';
import { AppError } from '../../errors/index.js';
import { emit } from '../../outbox/index.js';
import { inContext, type Trx } from '../../tenancy/index.js';

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

export const HANDLE_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

const RESERVED = new Set([
  'about', 'account', 'admin', 'api', 'app', 'assets', 'auth', 'billing', 'blog', 'dashboard', 'docs', 'help',
  'home', 'login', 'logout', 'mail', 'new', 'owner', 'pricing', 'privacy', 'root', 'settings', 'setup', 'shop',
  'signup', 'static', 'status', 'store', 'support', 'system', 'team', 'terms', 'test', 'webhooks', 'www',
]);

type Account = Selectable<AccountTable>;
type Business = Selectable<BusinessTable>;
type Membership = Selectable<MembershipTable>;

export type NewBusiness = {
  name: string;
  handle: string;
  business_type: BusinessType;
  sells?: string;
  team_size: 'alone' | 'team';
  your_name?: string;
};

export function publicBusiness(business: Business, membership: Membership) {
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

export function usernameFrom(name: string | null, email: string): string {
  const clean = (value: string) => value.toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 30).replace(/^[._-]+|[._-]+$/g, '');
  const fromName = clean((name ?? '').trim().split(/\s+/)[0] ?? '');
  if (fromName.length >= 2) return fromName;
  const fromEmail = clean(email.split('@')[0]!.split('+')[0]!);
  return fromEmail.length >= 2 ? fromEmail : 'me';
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

export function listMine(accountId: string) {
  return inContext({ accountId }, async (trx) => {
    const rows = await trx
      .selectFrom('core.membership as m')
      .innerJoin('core.business as b', 'b.id', 'm.business_id')
      .selectAll('b')
      .select(['m.id as membership_id', 'm.role', 'm.username', 'm.display_name', 'm.user_id', 'm.business_id', 'm.invited_by', 'm.joined_at'])
      .where('m.user_id', '=', accountId)
      .orderBy('m.joined_at')
      .execute();
    return rows.map((row) =>
      publicBusiness(row, {
        id: row.membership_id,
        business_id: row.business_id,
        user_id: row.user_id,
        username: row.username,
        display_name: row.display_name,
        role: row.role,
        invited_by: row.invited_by,
        joined_at: row.joined_at,
      }),
    );
  });
}

export async function createBusiness(account: Account, input: NewBusiness) {
  const name = input.name.trim();
  const sells = input.sells?.trim() || null;
  const yourName = input.your_name?.trim() || account.name;
  if (!name) throw new AppError('invalid_input', 400, 'The business name is empty', { field: 'name' });
  if (!yourName) throw new AppError('invalid_input', 400, 'Your name is needed', { field: 'your_name' });

  const businessId = randomUUID();
  try {
    return await inContext({ accountId: account.id, businessId }, async (trx) => {
      const status = await handleStatus(trx, input.handle);
      if (status === 'taken') throw new AppError('handle_taken', 409, 'This handle is taken', { field: 'handle' });
      if (status !== 'available') throw new AppError('invalid_input', 400, `Handle is ${status}`, { field: 'handle' });

      const { rows } = await sql<{ count: string }>`select count(*) from core.my_business_ids()`.execute(trx);
      if (Number(rows[0]!.count) >= BUSINESSES_PER_ACCOUNT) {
        throw new AppError('limit_reached', 429, 'Too many businesses for one account');
      }

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
          team_size: input.team_size,
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
          team_size: business.team_size,
          owner_id: account.id,
        },
      });
      return shown;
    });
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      throw new AppError('handle_taken', 409, 'This handle is taken', { field: 'handle' });
    }
    throw error;
  }
}
