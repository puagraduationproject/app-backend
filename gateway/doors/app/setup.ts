import type { FastifyInstance } from 'fastify';
import { checkHandle, createBusiness, listMine, type NewBusiness } from '../../../kernel/index/businesses/service.js';
import { BUSINESS_TYPES } from '../../../database/types.js';
import { requireSession } from '../../shell/sessions.js';

const handle = { type: 'string', minLength: 1, maxLength: 30 } as const;

export async function setupRoutes(app: FastifyInstance) {
  app.get('/api/app/businesses', async (request) => {
    const { account } = await requireSession(request);
    return { businesses: await listMine(account.id) };
  });

  app.get<{ Params: { handle: string } }>(
    '/api/app/handles/:handle',
    { schema: { params: { type: 'object', required: ['handle'], properties: { handle } } } },
    async (request) => {
      const { account } = await requireSession(request);
      const status = await checkHandle(account.id, request.params.handle);
      return { handle: request.params.handle, available: status === 'available', reason: status === 'available' ? null : status };
    },
  );

  app.post<{ Body: NewBusiness }>(
    '/api/app/businesses',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'handle', 'business_type', 'team_size'],
          additionalProperties: false,
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 80 },
            handle,
            business_type: { enum: [...BUSINESS_TYPES] },
            team_size: { enum: ['alone', 'team'] },
            your_name: { type: 'string', maxLength: 80 },
          },
        },
      },
    },
    async (request, reply) => {
      const { account } = await requireSession(request);
      return reply.code(201).send({ business: await createBusiness(account, request.body) });
    },
  );
}
