import { Ajv, type ValidateFunction } from 'ajv';
import Fastify from 'fastify';
import { shellSettings } from '../../config/services.js';
import { loadCalls } from '../../os/registry/index.js';
import { KernelLink, type Command } from './link.js';

/** The Shell service: checks each command's shape against its call's JSON file, then sends it sealed to the Kernel. */

const commandSchema = {
  type: 'object',
  required: ['call', 'business_id', 'session', 'input'],
  additionalProperties: false,
  properties: {
    call: { type: 'string', pattern: '^[a-z]+\\.[a-z_]+$' },
    business_id: { type: ['string', 'null'], maxLength: 100 },
    session: { type: ['string', 'null'], maxLength: 200 },
    input: { type: 'object' },
    idempotency_key: { type: 'string', maxLength: 100 },
    correlation_id: { type: 'string', maxLength: 100 },
  },
};

export async function buildShell(settings = shellSettings()) {
  const calls = loadCalls();
  const ajv = new Ajv({ allErrors: false });
  const inputs = new Map<string, ValidateFunction>();
  for (const [name, definition] of calls) inputs.set(name, ajv.compile(definition.input));

  const link = new KernelLink(settings.kernelUrl, settings.startKey, settings.keyEverySeconds * 1000, calls);
  const app = Fastify({ logger: process.env.NODE_ENV !== 'test' });

  app.get('/health', async (_request, reply) => reply.code(link.ready ? 200 : 503).send({ ok: link.ready, key_changes: link.keyChanges }));

  app.post<{ Body: Command }>('/call', { schema: { body: commandSchema } }, async (request, reply) => {
    const command = request.body;
    const validate = inputs.get(command.call);
    if (!validate) return reply.code(404).send({ ok: false, error: { code: 'not_found', details: { call: command.call } } });
    if (!validate(command.input)) {
      const field = validate.errors?.[0]?.instancePath.replace(/^\//, '') || validate.errors?.[0]?.params?.missingProperty;
      return reply.code(400).send({ ok: false, error: { code: 'invalid_input', details: { field } } });
    }
    const answer = await link.call(command);
    if (!answer.ok && ['timeout', 'unknown_key'].includes(answer.error.code)) return reply.code(504).send(answer);
    return answer;
  });

  app.setErrorHandler((error: { validation?: unknown }, _request, reply) => {
    if (error.validation) return reply.code(400).send({ ok: false, error: { code: 'invalid_input' } });
    return reply.code(500).send({ ok: false, error: { code: 'server_error' } });
  });

  app.addHook('onReady', async () => void link.begin());
  app.addHook('onClose', async () => link.end());
  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const settings = shellSettings();
  const app = await buildShell(settings);
  for (const signal of ['SIGINT', 'SIGTERM'] as const) {
    process.on(signal, async () => {
      await app.close();
      process.exit(0);
    });
  }
  await app.listen({ host: '0.0.0.0', port: settings.port });
}
