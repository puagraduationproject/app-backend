import { randomUUID } from 'node:crypto';
import type { Actor } from '../audit/index.js';
import type { Trx } from '../tenancy/index.js';

export async function emit(trx: Trx, event: {
  businessId: string;
  type: string;
  version: number;
  actor: Actor;
  about?: Record<string, string>;
  data: Record<string, unknown>;
  correlationId?: string;
  causationId?: string;
}) {
  const envelope = {
    event_id: randomUUID(),
    type: event.type,
    version: event.version,
    business_id: event.businessId,
    occurred_at: new Date().toISOString(),
    actor: event.actor,
    correlation_id: event.correlationId ?? randomUUID(),
    causation_id: event.causationId ?? null,
    ...event.about,
    data: event.data,
  };
  await trx
    .insertInto('core.outbox')
    .values({ id: envelope.event_id, business_id: event.businessId, event_type: event.type, payload: JSON.stringify(envelope) })
    .execute();
}
