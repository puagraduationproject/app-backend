import { FRESH_SECONDS } from '../../shared/protocol/index.js';
import { START_KEY_ID, keyFromStart, newKey, type Key } from '../../shared/seal/index.js';

/** The keys the Kernel accepts: the start key (only to ask for a key), the current one, and the one before it for a short overlap. */
export class KeyRing {
  readonly start: Key;
  private current: Key | null = null;
  private previous: { key: Key; until: number } | null = null;

  constructor(startKey: string, private readonly overlapMs: number, private readonly now = () => Date.now()) {
    this.start = keyFromStart(startKey);
  }

  find(id: string): Key | null {
    if (id === START_KEY_ID) return this.start;
    if (this.current?.id === id) return this.current;
    if (this.previous?.key.id === id && this.now() < this.previous.until) return this.previous.key;
    return null;
  }

  rotate(): Key {
    if (this.current) this.previous = { key: this.current, until: this.now() + this.overlapMs };
    this.current = newKey();
    return this.current;
  }
}

/** Remembers every request ID for as long as a request can still be fresh, and refuses one seen before. */
export class ReplayGuard {
  private readonly seen = new Map<string, number>();

  constructor(private readonly now = () => Date.now()) {}

  firstTime(requestId: string): boolean {
    const now = this.now();
    if (this.seen.size > 1000) {
      for (const [id, until] of this.seen) if (until <= now) this.seen.delete(id);
    }
    const until = this.seen.get(requestId);
    if (until !== undefined && until > now) return false;
    this.seen.set(requestId, now + 2 * FRESH_SECONDS * 1000);
    return true;
  }
}
