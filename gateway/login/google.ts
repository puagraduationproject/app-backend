import { createHash, randomBytes } from 'node:crypto';
import { config } from '../../config/index.js';
import { AppError } from '../../os/shared/errors/index.js';

const issuers = new Set(['https://accounts.google.com', 'accounts.google.com']);

export const googleRedirectUri = () => `${config.publicUrl}/api/auth/google/callback`;

export function googleReady(): boolean {
  return Boolean(config.google.clientId && config.google.clientSecret);
}

export function googleStart() {
  const state = randomBytes(16).toString('base64url');
  const verifier = randomBytes(32).toString('base64url');
  const challenge = createHash('sha256').update(verifier).digest('base64url');
  const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  url.search = new URLSearchParams({
    client_id: config.google.clientId,
    redirect_uri: googleRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    code_challenge: challenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  }).toString();
  return { url: url.toString(), state, verifier };
}

export type GoogleProfile = { sub: string; email: string; name: string | null };

export async function googleFinish(code: string, verifier: string): Promise<GoogleProfile> {
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: config.google.clientId,
      client_secret: config.google.clientSecret,
      redirect_uri: googleRedirectUri(),
      grant_type: 'authorization_code',
      code_verifier: verifier,
    }),
  });
  if (!response.ok) {
    throw new AppError('outside_failed', 502, `Google refused the sign-in: ${response.status}`);
  }
  const { id_token: idToken } = (await response.json()) as { id_token?: string };
  if (!idToken) throw new AppError('outside_failed', 502, 'Google sent no id token');

  // The token comes straight from Google over TLS, so its claims are read, not re-verified.
  const claims = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64url').toString()) as Record<string, unknown>;
  if (!issuers.has(String(claims.iss)) || claims.aud !== config.google.clientId) {
    throw new AppError('outside_failed', 502, 'Google id token is not for this app');
  }
  if (Number(claims.exp) * 1000 < Date.now()) {
    throw new AppError('outside_failed', 502, 'Google id token expired');
  }
  if (claims.email_verified !== true || typeof claims.email !== 'string') {
    throw new AppError('outside_failed', 502, 'Google account has no verified email');
  }
  return {
    sub: String(claims.sub),
    email: claims.email.toLowerCase(),
    name: typeof claims.name === 'string' ? claims.name : null,
  };
}
