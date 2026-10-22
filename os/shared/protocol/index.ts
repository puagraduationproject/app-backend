/** The Shell and Kernel protocol, version 1 (contracts/protocol). */

export const FRESH_SECONDS = 30;

export type Call = {
  request_id: string;
  sent_at: string;
  call: string;
  version: number;
  business_id: string | null;
  session: string | null;
  input: Record<string, unknown>;
  idempotency_key: string | null;
  correlation_id: string;
};

export type KeyRequest = { request_id: string; sent_at: string };

export type KeyAnswer = { request_id: string; key_id: string; secret: string };

export type Failure = { code: string; details?: Record<string, unknown> };

export type Outcome = { ok: true; result: unknown } | { ok: false; error: Failure };

export type Answer = { request_id: string } & Outcome;

export function failure(request_id: string, code: string, details?: Record<string, unknown>): Answer {
  return { request_id, ok: false, error: details ? { code, details } : { code } };
}

export function isFresh(sentAt: string, now = Date.now()): boolean {
  const at = Date.parse(sentAt);
  return Number.isFinite(at) && Math.abs(now - at) <= FRESH_SECONDS * 1000;
}
