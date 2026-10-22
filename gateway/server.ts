import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import { config } from '../config/index.js';
import { db } from '../os/kernel/database.js';
import { authRoutes } from './login/routes.js';
import { AppError, registerErrorHandler } from '../os/shared/errors/index.js';
import { healthRoutes } from './doors/app/health.js';
import { setupRoutes } from './doors/app/setup.js';

export async function buildServer() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test',
    trustProxy: (_address: string, hop: number) => hop === 0,
  });
  registerErrorHandler(app);
  const ownOrigin = new URL(config.publicUrl).origin;
  app.addHook('onRequest', async (request) => {
    const origin = request.headers.origin;
    if (!['GET', 'HEAD', 'OPTIONS'].includes(request.method) && origin && origin !== ownOrigin) {
      throw new AppError('bad_origin', 403, 'Requests must come from our own site');
    }
  });
  await app.register(cookie, { secret: config.authSecret });
  await app.register(rateLimit, {
    max: 60,
    timeWindow: '1 minute',
    addHeadersOnExceeding: { 'x-ratelimit-limit': false, 'x-ratelimit-remaining': false, 'x-ratelimit-reset': false },
    addHeaders: { 'x-ratelimit-limit': false, 'x-ratelimit-remaining': false, 'x-ratelimit-reset': false, 'retry-after': true },
  });
  app.addHook('onSend', async (_request, reply) => {
    reply.header('cache-control', 'no-store');
    reply.header('x-content-type-options', 'nosniff');
  });
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(setupRoutes);
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const app = await buildServer();
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, async () => {
      await app.close();
      await db.destroy();
      process.exit(0);
    });
  }
  await app.listen({ host: '0.0.0.0', port: config.port });
}
