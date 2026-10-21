import type { Trx } from '../tenancy/index.js';

export type Actor = { type: 'user' | 'ai' | 'system'; id: string | null };

export async function audit(trx: Trx, row: {
  businessId: string;
  actor: Actor;
  action: string;
  objectType: string;
  objectId: string | null;
  before?: unknown;
  after?: unknown;
}) {
  await trx
    .insertInto('core.audit_log')
    .values({
      business_id: row.businessId,
      actor_type: row.actor.type,
      actor_id: row.actor.id,
      action: row.action,
      object_type: row.objectType,
      object_id: row.objectId,
      before: row.before === undefined ? null : JSON.stringify(row.before),
      after: row.after === undefined ? null : JSON.stringify(row.after),
    })
    .execute();
}
