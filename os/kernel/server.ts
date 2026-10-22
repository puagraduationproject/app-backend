import Fastify, { type FastifyReply } from 'fastify';
import { kernelSettings } from '../../config/services.js';
import { loadCalls } from '../registry/index.js';
import { failure, isFresh, type Answer, type Call, type KeyAnswer, type KeyRequest } from '../shared/protocol/index.js';
import { START_KEY_ID, SealError, isEnvelope, open, seal, type Key } from '../shared/seal/index.js';
import { CoreManager } from './cores/manager.js';
import { KeyRing, ReplayGuard } from './cores/keys.js';

/** The Kernel service: the manager opens every sealed call, checks it, and hands it to a core. */

export async function buildKernel(settings = kernelSettings()) {
  const calls = loadCalls();
  const keys = new KeyRing(settings.startKey, settings.keyOverlapSeconds * 1000);
  const guard = new ReplayGuard();
  const cores = new CoreManager(settings.cores, settings.maxCallsPerCore);
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });

  const refuse = (reply: FastifyReply, code: 'bad_seal' | 'unknown_key') =>
    reply.code(code === 'unknown_key' ? 401 : 400).send({ error: { code } });

  function unseal<T>(body: unknown, purpose: 'call' | 'key'): { key: Key; message: T } | SealError {
    if (!isEnvelope(body)) return new SealError('bad_seal');
    const key = keys.find(body.key_id);
    if (!key || (purpose === 'call' && key.id === START_KEY_ID)) return new SealError('unknown_key');
    try {
      return { key, message: open<T>(key, purpose, body) };
    } catch (error) {
      return error as SealError;
    }
  }

  function checkRequest(message: { request_id?: unknown; sent_at?: unknown }): string | null {
    if (typeof message.request_id !== 'string' || typeof message.sent_at !== 'string') return 'invalid_input';
    if (!isFresh(message.sent_at)) return 'stale_request';
    if (!guard.firstTime(message.request_id)) return 'replayed_request';
    return null;
  }

  app.get('/health', async () => ({ ok: true, cores: cores.status() }));

  app.post('/key', async (request, reply) => {
    const opened = unseal<KeyRequest>(request.body, 'key');
    if (opened instanceof SealError) return refuse(reply, opened.code);
    const { key, message } = opened;
    const problem = checkRequest(message);
    if (problem) return seal(key, 'key-answer', failure(String(message.request_id), problem));
    const next = keys.rotate();
    const answer: KeyAnswer = { request_id: message.request_id, key_id: next.id, secret: next.secret.toString('base64url') };
    return seal(key, 'key-answer', answer);
  });

  app.post('/call', async (request, reply) => {
    const opened = unseal<Call>(request.body, 'call');
    if (opened instanceof SealError) return refuse(reply, opened.code);
    const { key, message } = opened;
    const answer = async (): Promise<Answer> => {
      const problem = checkRequest(message);
      if (problem) return failure(String(message.request_id), problem);
      const definition = calls.get(message.call);
      if (!definition || definition.version !== message.version) {
        return failure(message.request_id, 'not_found', { call: message.call, version: message.version });
      }
      if (definition.connection.delivery === 'fire_and_forget') {
        void cores.run(message);
        return { request_id: message.request_id, ok: true, result: { accepted: true } };
      }
      return { request_id: message.request_id, ...(await cores.run(message)) } as Answer;
    };
    return seal(key, 'answer', await answer());
  });

  app.addHook('onClose', async () => cores.stop());
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const settings = kernelSettings();
  const app = await buildKernel(settings);
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, async () => {
      await app.close();
      process.exit(0);
    });
  }
  await app.listen({ host: '0.0.0.0', port: settings.port });
}
