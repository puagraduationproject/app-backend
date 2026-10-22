import { describe, expect, it } from 'vitest';
import { KeyRing, ReplayGuard } from '../../os/kernel/cores/keys.js';
import { isFresh } from '../../os/shared/protocol/index.js';
import { SealError, keyFromStart, newKey, open, seal } from '../../os/shared/seal/index.js';

const START = 'a-start-key-for-tests-only-0123456789';

describe('the seal', () => {
  it('opens what it sealed, and nobody can read it on the way', () => {
    const key = newKey();
    const envelope = seal(key, 'call', { call: 'test.echo', session: 'secret-token' });
    expect(envelope.sealed).not.toContain('secret-token');
    expect(Buffer.from(envelope.sealed, 'base64url').toString('utf8')).not.toContain('secret-token');
    expect(open(key, 'call', envelope)).toEqual({ call: 'test.echo', session: 'secret-token' });
  });

  it('refuses a message with one changed byte', () => {
    const key = newKey();
    const envelope = seal(key, 'call', { text: 'hello' });
    const bytes = Buffer.from(envelope.sealed, 'base64url');
    bytes[0] ^= 1;
    expect(() => open(key, 'call', { ...envelope, sealed: bytes.toString('base64url') })).toThrow(SealError);
  });

  it('refuses another key, and a message opened as another kind', () => {
    const key = newKey();
    const envelope = seal(key, 'answer', { ok: true });
    expect(() => open(newKey(), 'answer', envelope)).toThrow(SealError);
    expect(() => open(key, 'call', envelope)).toThrow(SealError);
  });

  it('makes the same start key on both sides', () => {
    expect(keyFromStart(START).secret.equals(keyFromStart(START).secret)).toBe(true);
    expect(keyFromStart(START).secret.equals(keyFromStart(`${START}x`).secret)).toBe(false);
  });
});

describe('the key ring', () => {
  it('keeps the old key for the overlap only', () => {
    let now = 0;
    const ring = new KeyRing(START, 60_000, () => now);
    const first = ring.rotate();
    const second = ring.rotate();
    expect(ring.find(second.id)).toBe(second);
    expect(ring.find(first.id)).toBe(first);
    now = 60_001;
    expect(ring.find(first.id)).toBeNull();
    expect(ring.find(second.id)).toBe(second);
    expect(ring.find('start')).toBe(ring.start);
    expect(ring.find('made-up')).toBeNull();
  });
});

describe('copied and late requests', () => {
  it('refuses a request ID seen before', () => {
    const guard = new ReplayGuard();
    expect(guard.firstTime('r1')).toBe(true);
    expect(guard.firstTime('r1')).toBe(false);
    expect(guard.firstTime('r2')).toBe(true);
  });

  it('refuses a request older or newer than 30 seconds', () => {
    const now = Date.parse('2026-10-22T12:00:00Z');
    expect(isFresh('2026-10-22T11:59:40Z', now)).toBe(true);
    expect(isFresh('2026-10-22T11:59:20Z', now)).toBe(false);
    expect(isFresh('2026-10-22T12:00:40Z', now)).toBe(false);
    expect(isFresh('not a time', now)).toBe(false);
  });
});
