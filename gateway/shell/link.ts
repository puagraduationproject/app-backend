import { randomUUID } from 'node:crypto';
import type { CallDefinition } from '../../os/registry/index.js';
import { failure, type Answer, type Call, type KeyAnswer } from '../../os/shared/protocol/index.js';
import { isEnvelope, keyFromStart, open, seal, type Envelope, type Key, type Purpose } from '../../os/shared/seal/index.js';

export type Command = {
  call: string;
  business_id: string | null;
  session: string | null;
  input: Record<string, unknown>;
  idempotency_key?: string;
  correlation_id?: string;
};

type Sent = { status: number; body: unknown };

/** The Shell's side of the protocol: holds the current key, changes it, seals every call and sends it again when no answer comes. */
export class KernelLink {
  private readonly start: Key;
  private key: Key | null = null;
  private timer: NodeJS.Timeout | null = null;
  private changing: Promise<void> | null = null;
  keyChanges = 0;

  constructor(
    private readonly kernelUrl: string,
    startKey: string,
    private readonly keyEveryMs: number,
    private readonly calls: Map<string, CallDefinition>,
  ) {
    this.start = keyFromStart(startKey);
  }

  get ready() {
    return this.key !== null;
  }

  /** Gets the first key and changes it on a timer. Keeps trying while the Kernel is not up yet. */
  async begin() {
    this.timer = setInterval(() => void this.changeKey().catch(() => undefined), this.keyEveryMs);
    while (!this.key && this.timer) {
      await this.changeKey().catch(() => new Promise((resolve) => setTimeout(resolve, 1000)));
    }
  }

  end() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
  }

  /** Asks for a new key with the current one; with no current key, or one the Kernel forgot, with the start key. */
  changeKey(): Promise<void> {
    this.changing ??= (async () => {
      try {
        if (this.key) {
          try {
            this.key = await this.askKey(this.key);
            this.keyChanges++;
            return;
          } catch {
            // the Kernel restarted and forgot the key: start again
          }
        }
        this.key = await this.askKey(this.start);
        this.keyChanges++;
      } finally {
        this.changing = null;
      }
    })();
    return this.changing;
  }

  private async askKey(using: Key): Promise<Key> {
    const request_id = randomUUID();
    const sent = await this.post('/key', seal(using, 'key', { request_id, sent_at: new Date().toISOString() }), 5000);
    const answer = this.openAnswer<KeyAnswer | Answer>(using, 'key-answer', sent);
    if (!answer || answer.request_id !== request_id || !('key_id' in answer)) throw new Error('no key');
    return { id: answer.key_id, secret: Buffer.from(answer.secret, 'base64url') };
  }

  async call(command: Command): Promise<Answer> {
    const definition = this.calls.get(command.call);
    const firstId = randomUUID();
    if (!definition) return failure(firstId, 'not_found', { call: command.call });
    const { tries, time_limit_ms } = definition.connection;
    const idempotency_key = command.idempotency_key ?? (tries > 1 ? randomUUID() : null);
    let lastProblem = 'timeout';
    for (let attempt = 1; attempt <= tries + 1; attempt++) {
      if (!this.key) await this.changeKey().catch(() => undefined);
      const key = this.key;
      if (!key) break;
      const call: Call = {
        request_id: attempt === 1 ? firstId : randomUUID(),
        sent_at: new Date().toISOString(),
        call: command.call,
        version: definition.version,
        business_id: command.business_id,
        session: command.session,
        input: command.input,
        idempotency_key,
        correlation_id: command.correlation_id ?? firstId,
      };
      try {
        const sent = await this.post('/call', seal(key, 'call', call), time_limit_ms);
        if (sent.status === 401) {
          await this.changeKey().catch(() => undefined);
          lastProblem = 'unknown_key';
          continue;
        }
        const answer = this.openAnswer<Answer>(key, 'answer', sent);
        if (!answer || answer.request_id !== call.request_id) return failure(call.request_id, 'bad_seal');
        if (!answer.ok && answer.error.code === 'core_stopped' && attempt < tries) continue;
        return answer;
      } catch {
        lastProblem = 'timeout';
        if (attempt >= tries) break;
        await new Promise((resolve) => setTimeout(resolve, 100 * attempt));
      }
    }
    return failure(firstId, lastProblem === 'unknown_key' ? 'unknown_key' : 'timeout');
  }

  private openAnswer<T>(key: Key, purpose: Purpose, sent: Sent): T | null {
    if (sent.status !== 200 || !isEnvelope(sent.body)) return null;
    try {
      return open<T>(key, purpose, sent.body);
    } catch {
      return null;
    }
  }

  private async post(path: string, envelope: Envelope, timeoutMs: number): Promise<Sent> {
    const response = await fetch(`${this.kernelUrl}${path}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(envelope),
      signal: AbortSignal.timeout(timeoutMs),
    });
    return { status: response.status, body: await response.json().catch(() => null) };
  }
}
