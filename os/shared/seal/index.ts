import { createCipheriv, createDecipheriv, hkdfSync, randomBytes } from 'node:crypto';

export type Key = { id: string; secret: Buffer };

/** What a sealed message is for. It is sealed in, so a message cannot be replayed as another kind. */
export type Purpose = 'call' | 'answer' | 'key' | 'key-answer';

export type Envelope = { key_id: string; nonce: string; sealed: string };

export const START_KEY_ID = 'start';

export class SealError extends Error {
  constructor(readonly code: 'bad_seal' | 'unknown_key') {
    super(code);
  }
}

export function newKey(): Key {
  return { id: randomBytes(8).toString('hex'), secret: randomBytes(32) };
}

export function keyFromStart(startKey: string): Key {
  const secret = Buffer.from(hkdfSync('sha256', startKey, 'shell-kernel-protocol-v1', 'start key', 32));
  return { id: START_KEY_ID, secret };
}

export function seal(key: Key, purpose: Purpose, payload: unknown): Envelope {
  const nonce = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key.secret, nonce);
  cipher.setAAD(Buffer.from(`${key.id}|${purpose}`));
  const body = Buffer.concat([cipher.update(JSON.stringify(payload), 'utf8'), cipher.final(), cipher.getAuthTag()]);
  return { key_id: key.id, nonce: nonce.toString('base64url'), sealed: body.toString('base64url') };
}

export function open<T = unknown>(key: Key, purpose: Purpose, envelope: Envelope): T {
  try {
    const nonce = Buffer.from(envelope.nonce, 'base64url');
    const body = Buffer.from(envelope.sealed, 'base64url');
    if (nonce.length !== 12 || body.length < 17) throw new Error('short');
    const decipher = createDecipheriv('aes-256-gcm', key.secret, nonce);
    decipher.setAAD(Buffer.from(`${envelope.key_id}|${purpose}`));
    decipher.setAuthTag(body.subarray(body.length - 16));
    const text = Buffer.concat([decipher.update(body.subarray(0, body.length - 16)), decipher.final()]).toString('utf8');
    return JSON.parse(text) as T;
  } catch {
    throw new SealError('bad_seal');
  }
}

export function isEnvelope(value: unknown): value is Envelope {
  const v = value as Envelope;
  return (
    typeof v === 'object' && v !== null &&
    typeof v.key_id === 'string' && typeof v.nonce === 'string' && typeof v.sealed === 'string'
  );
}
