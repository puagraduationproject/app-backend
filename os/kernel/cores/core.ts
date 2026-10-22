import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Call, Outcome } from '../../shared/protocol/index.js';

/** One core: a process of its own that runs the calls the manager hands it, one message per call. */

export type Job = { type: 'run'; job: number; call: Call };
export type Done = { type: 'done'; job: number; answer: Outcome };

type Session = { session: string; account_id: string; businesses: string[] };
type Who = { account_id: string; business_id: string };

const CORE = Number(process.env.CORE_NUMBER ?? 0);
const sessions: Session[] = JSON.parse(readFileSync(join(process.cwd(), 'fake/sessions.json'), 'utf8'));

const handlers: Record<string, (input: Record<string, unknown>, who: Who) => unknown> = {
  'test.echo': (input, who) => ({ text: input.text, core: CORE, account_id: who.account_id }),
  'test.busy': (input) => {
    const seconds = Number(input.seconds);
    const until = Date.now() + seconds * 1000;
    while (Date.now() < until) {
      // the whole core is busy on purpose
    }
    return { core: CORE, seconds };
  },
  'test.crash': () => {
    setImmediate(() => process.exit(1));
    return { accepted: true };
  },
};

function run(call: Call): Outcome {
  const found = sessions.find((s) => s.session === call.session);
  if (!found) return { ok: false, error: { code: 'not_logged_in' } };
  if (!call.business_id || !found.businesses.includes(call.business_id)) {
    return { ok: false, error: { code: 'not_allowed', details: { business_id: call.business_id } } };
  }
  const handler = handlers[call.call];
  if (!handler) return { ok: false, error: { code: 'not_found', details: { call: call.call } } };
  return { ok: true, result: handler(call.input, { account_id: found.account_id, business_id: call.business_id }) };
}

process.on('message', (message: Job) => {
  if (message?.type !== 'run') return;
  let answer: Outcome;
  try {
    answer = run(message.call);
  } catch {
    answer = { ok: false, error: { code: 'server_error' } };
  }
  process.send?.({ type: 'done', job: message.job, answer } satisfies Done);
});
