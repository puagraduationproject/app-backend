import cookie from '@fastify/cookie';
import rateLimit from '@fastify/rate-limit';
import Fastify from 'fastify';
import { config } from '../config/index.js';
import { db } from '../database/client.js';
import { authRoutes } from '../platform/auth/routes.js';
import { registerErrorHandler } from '../platform/errors/index.js';
import { healthRoutes } from './app/health.js';

export async function buildServer() {
  const app = Fastify({
    logger: process.env.NODE_ENV !== 'test',
    trustProxy: (_address: string, hop: number) => hop === 0,
  });
  registerErrorHandler(app);
  await app.register(cookie, { secret: config.authSecret });
  await app.register(rateLimit, { max: 60, timeWindow: '1 minute' });
  await app.register(healthRoutes);
  await app.register(authRoutes);
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
