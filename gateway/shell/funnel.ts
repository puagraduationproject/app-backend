import { db } from '../../database/client.js';
import type { SetupStep } from '../../database/types.js';

// The first time an account reaches each setup step; later visits change nothing.
// The numbers are in the view core.setup_funnel.
export async function recordSetupStep(accountId: string, step: SetupStep) {
  await db.insertInto('core.setup_step').values({ account_id: accountId, step }).onConflict((conflict) => conflict.doNothing()).execute();
}
