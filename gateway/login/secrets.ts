import { createHmac, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { hash, verify } from '@node-rs/argon2';
import { config } from '../../config/index.js';

export function newCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

export function newTicket(): string {
  return randomBytes(32).toString('base64url');
}

export function keyedHash(value: string): string {
  return createHmac('sha256', config.authSecret).update(value).digest('hex');
}

export function sameHash(a: string, b: string): boolean {
  const left = Buffer.from(a, 'hex');
  const right = Buffer.from(b, 'hex');
  return left.length === right.length && timingSafeEqual(left, right);
}

export function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export function checkPassword(passwordHash: string, password: string): Promise<boolean> {
  return verify(passwordHash, password);
}
