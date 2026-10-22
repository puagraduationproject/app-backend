import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import type { Answer, Call, KeyAnswer } from '../../os/shared/protocol/index.js';
import { keyFromStart, open, seal, type Envelope, type Key } from '../../os/shared/seal/index.js';

const START = 'a-start-key-for-tests-only-0123456789';
const SHELL = 'http://127.0.0.1:11902';
const KERNEL = 'http://127.0.0.1:11903';
const OWNER = { business_id: 'fake-business-nova', session: 'fake-session-owner-nova' };

const root = join(import.meta.dirname, '../..');
const built = join(root, 'dist-tests');
let kernel: ChildProcess;
let shell: ChildProcess;

function startKernel() {
  return spawn('node', [join(built, 'os/kernel/server.js')], {
    cwd: root,
    stdio: 'ignore',
    env: { ...process.env, NODE_ENV: 'production', KERNEL_PORT: '11903', KERNEL_CORES: '2', KERNEL_START_KEY: START, KEY_OVERLAP_SECONDS: '2' },
  });
}

async function waitFor(url: string, ready: (body: any) => boolean = () => true) {
  for (let i = 0; i < 100; i++) {
    const body = await fetch(url).then((r) => (r.ok ? r.json() : null)).catch(() => null);
    if (body && ready(body)) return body;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`${url} did not come up`);
}

const allAlive = (body: any) => body.cores.length === 2 && body.cores.every((core: any) => core.alive);

async function send(call: string, input: Record<string, unknown>, who = OWNER) {
  const response = await fetch(`${SHELL}/call`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ call, input, ...who }),
  });
  return { status: response.status, answer: (await response.json()) as Answer & { result?: any } };
}

async function post(path: string, body: unknown) {
  const response = await fetch(`${KERNEL}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: (await response.json()) as any };
}

/** Plays a Shell by hand: gets a key with the start key, the way only a holder of the start key can. */
async function ownKey(): Promise<Key> {
  const start = keyFromStart(START);
  const request_id = randomUUID();
  const { body } = await post('/key', seal(start, 'key', { request_id, sent_at: new Date().toISOString() }));
  const answer = open<KeyAnswer>(start, 'key-answer', body as Envelope);
  return { id: answer.key_id, secret: Buffer.from(answer.secret, 'base64url') };
}

function echoCall(sentAt = new Date()): Call {
  return {
    request_id: randomUUID(),
    sent_at: sentAt.toISOString(),
    call: 'test.echo',
    version: 1,
    ...OWNER,
    input: { text: 'by hand' },
    idempotency_key: null,
    correlation_id: randomUUID(),
  };
}

beforeAll(async () => {
  execFileSync('npx', ['tsc', '-p', 'tsconfig.json', '--outDir', built], { cwd: root, stdio: 'ignore' });
  kernel = startKernel();
  await waitFor(`${KERNEL}/health`, allAlive);
  shell = spawn('node', [join(built, 'gateway/shell/server.js')], {
    cwd: root,
    stdio: 'ignore',
    env: { ...process.env, NODE_ENV: 'production', SHELL_PORT: '11902', KERNEL_URL: KERNEL, KERNEL_START_KEY: START, KEY_EVERY_SECONDS: '1' },
  });
  await waitFor(`${SHELL}/health`);
}, 120_000);

afterAll(() => {
  shell?.kill();
  kernel?.kill();
  rmSync(built, { recursive: true, force: true });
});

describe('the road from the Shell to the Kernel', () => {
  it('sends a call sealed and gets the answer back', async () => {
    const { status, answer } = await send('test.echo', { text: 'hello' });
    expect(status).toBe(200);
    expect(answer.ok).toBe(true);
    expect(answer.result).toMatchObject({ text: 'hello', account_id: 'fake-account-1' });
    expect([1, 2]).toContain(answer.result.core);
  });

  it('checks the input against the call JSON file before sending', async () => {
    expect((await send('test.echo', { text: 5 })).answer).toMatchObject({ ok: false, error: { code: 'invalid_input' } });
    expect((await send('test.echo', {})).status).toBe(400);
    expect((await send('test.nothing', {})).answer).toMatchObject({ ok: false, error: { code: 'not_found' } });
  });

  it('lets the Kernel check the session and the business itself', async () => {
    const stranger = await send('test.echo', { text: 'hi' }, { business_id: OWNER.business_id, session: 'made-up' });
    expect(stranger.answer).toMatchObject({ ok: false, error: { code: 'not_logged_in' } });
    const other = await send('test.echo', { text: 'hi' }, { business_id: 'fake-business-basma', session: OWNER.session });
    expect(other.answer).toMatchObject({ ok: false, error: { code: 'not_allowed' } });
  });

  it('answers on another core while one core is busy', async () => {
    const busy = send('test.busy', { seconds: 3 });
    await new Promise((resolve) => setTimeout(resolve, 200));
    const started = Date.now();
    const echo = await send('test.echo', { text: 'not waiting' });
    expect(Date.now() - started).toBeLessThan(1000);
    expect(echo.answer.ok).toBe(true);
    const done = await busy;
    expect(done.answer.ok).toBe(true);
    expect(done.answer.result.core).not.toBe(echo.answer.result.core);
  }, 20_000);

  it('keeps answering when a core dies, and starts it again', async () => {
    const crash = await send('test.crash', {});
    expect(crash.answer).toMatchObject({ ok: true, result: { accepted: true } });
    const health = await waitFor(`${KERNEL}/health`, (body) => allAlive(body) && body.cores.some((core: any) => core.restarts > 0));
    expect(health.cores.reduce((sum: number, core: any) => sum + core.restarts, 0)).toBe(1);
    expect((await send('test.echo', { text: 'still here' })).answer.ok).toBe(true);
  }, 20_000);

  it('changes the key every period with no failed call', async () => {
    const before = (await waitFor(`${SHELL}/health`)).key_changes;
    const until = Date.now() + 3500;
    while (Date.now() < until) {
      const { answer } = await send('test.echo', { text: 'during the change' });
      expect(answer.ok).toBe(true);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    expect((await waitFor(`${SHELL}/health`)).key_changes).toBeGreaterThanOrEqual(before + 2);
  }, 20_000);
});

describe('what the Kernel refuses', () => {
  it('refuses something that is not sealed, or sealed with a key it does not know', async () => {
    expect(await post('/call', { call: 'test.echo' })).toMatchObject({ status: 400, body: { error: { code: 'bad_seal' } } });
    const madeUp: Key = { id: 'made-up', secret: Buffer.alloc(32, 7) };
    expect(await post('/call', seal(madeUp, 'call', echoCall()))).toMatchObject({ status: 401, body: { error: { code: 'unknown_key' } } });
  });

  it('never runs a call sealed with the start key', async () => {
    const start = keyFromStart(START);
    expect(await post('/call', seal(start, 'call', echoCall()))).toMatchObject({ status: 401, body: { error: { code: 'unknown_key' } } });
  });

  it('refuses a changed byte, a copied request and a late request', async () => {
    const key = await ownKey();
    const good = seal(key, 'call', echoCall());
    const bytes = Buffer.from(good.sealed, 'base64url');
    bytes[3] ^= 1;
    expect(await post('/call', { ...good, sealed: bytes.toString('base64url') })).toMatchObject({ status: 400 });

    const first = await post('/call', good);
    expect(open<Answer>(key, 'answer', first.body)).toMatchObject({ ok: true });
    const copy = await post('/call', good);
    expect(open<Answer>(key, 'answer', copy.body)).toMatchObject({ ok: false, error: { code: 'replayed_request' } });

    const late = await post('/call', seal(key, 'call', echoCall(new Date(Date.now() - 60_000))));
    expect(open<Answer>(key, 'answer', late.body)).toMatchObject({ ok: false, error: { code: 'stale_request' } });
  });
});

describe('when the Kernel restarts', () => {
  it('the Shell gets a new key by itself and goes on', async () => {
    kernel.kill('SIGTERM');
    await new Promise((resolve) => kernel.once('exit', resolve));
    kernel = startKernel();
    await waitFor(`${KERNEL}/health`, allAlive);
    const { answer } = await send('test.echo', { text: 'after the restart' });
    expect(answer.ok).toBe(true);
  }, 30_000);
});
