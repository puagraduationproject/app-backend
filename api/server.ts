import Fastify from 'fastify';
import { config } from '../config/index.js';
import { db } from '../database/client.js';
import { healthRoutes } from './app/health.js';

const app = Fastify({ logger: true });

await app.register(healthRoutes);

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    await app.close();
    await db.destroy();
    process.exit(0);
  });
}

await app.listen({ host: '0.0.0.0', port: config.port });
