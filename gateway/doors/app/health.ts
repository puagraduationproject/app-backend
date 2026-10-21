import type { FastifyInstance } from 'fastify';
import { sql } from 'kysely';
import { db } from '../../../database/client.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/api/health', async (_request, reply) => {
    let database: 'up' | 'down' = 'up';
    try {
      await sql`select 1`.execute(db);
    } catch (error) {
      app.log.error(error, 'database check failed');
      database = 'down';
    }
    const status = database === 'up' ? 'up' : 'degraded';
    return reply.code(database === 'up' ? 200 : 503).send({
      status,
      backend: 'up',
      database,
      time: new Date().toISOString(),
    });
  });
}
