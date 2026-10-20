import { sql, type Transaction } from 'kysely';
import { db } from '../../database/client.js';
import type { Database } from '../../database/types.js';

export type Trx = Transaction<Database>;
export type Context = { accountId: string; businessId?: string };

export function inContext<T>(context: Context, work: (trx: Trx) => Promise<T>): Promise<T> {
  return db.transaction().execute(async (trx) => {
    await sql`select set_config('app.account_id', ${context.accountId}, true),
                     set_config('app.business_id', ${context.businessId ?? ''}, true)`.execute(trx);
    return work(trx);
  });
}
