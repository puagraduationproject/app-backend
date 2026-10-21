import type { FastifyInstance } from 'fastify';
import { businessTypes, checkHandle, createBusiness, listMine, suggestNames, type NewBusiness } from '../../../kernel/index/businesses/service.js';
import { CITIES } from '../../../kernel/index/businesses/places.js';
import { BUSINESS_TYPES, SETUP_STEPS, type SetupStep } from '../../../database/types.js';
import { recordSetupStep } from '../../shell/funnel.js';
import { requireSession } from '../../shell/sessions.js';

const handle = { type: 'string', minLength: 1, maxLength: 30 } as const;
const name = { type: 'string', minLength: 1, maxLength: 80 } as const;
const yourName = { type: 'string', maxLength: 80 } as const;

const handleAnswer = (status: Awaited<ReturnType<typeof checkHandle>>) => ({
  available: status === 'available',
  reason: status === 'available' ? null : status,
});

export async function setupRoutes(app: FastifyInstance) {
  app.get('/api/app/setup', async (request) => {
    await requireSession(request);
    return { business_types: businessTypes(), cities: CITIES };
  });

  app.post<{ Body: { step: SetupStep } }>(
    '/api/app/setup/steps',
    { schema: { body: { type: 'object', required: ['step'], additionalProperties: false, properties: { step: { enum: [...SETUP_STEPS] } } } } },
    async (request) => {
      const { account } = await requireSession(request);
      await recordSetupStep(account.id, request.body.step);
      return { recorded: true };
    },
  );

  app.get('/api/app/businesses', async (request) => {
    const { account } = await requireSession(request);
    return { businesses: await listMine(account.id) };
  });

  app.get<{ Params: { handle: string } }>(
    '/api/app/handles/:handle',
    { schema: { params: { type: 'object', required: ['handle'], properties: { handle } } } },
    async (request) => {
      const { account } = await requireSession(request);
      return { handle: request.params.handle, ...handleAnswer(await checkHandle(account.id, request.params.handle)) };
    },
  );

  app.get<{ Querystring: { name: string; your_name?: string } }>(
    '/api/app/names',
    { schema: { querystring: { type: 'object', required: ['name'], properties: { name, your_name: yourName } } } },
    async (request) => {
      const { account } = await requireSession(request);
      const names = await suggestNames(account, request.query.name, request.query.your_name);
      return { handle: names.handle, ...handleAnswer(names.status), username: names.username };
    },
  );

  app.post<{ Body: NewBusiness }>(
    '/api/app/businesses',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'handle', 'business_type'],
          additionalProperties: false,
          dependencies: { city: ['area'], area: ['city'] },
          properties: {
            name,
            handle,
            business_type: { enum: [...BUSINESS_TYPES] },
            sells: { type: 'string', maxLength: 120 },
            city: { enum: [...CITIES] },
            area: { type: 'string', minLength: 1, maxLength: 60 },
            team_size: { enum: ['alone', 'team'] },
            your_name: yourName,
            idempotency_key: { type: 'string', format: 'uuid' },
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
