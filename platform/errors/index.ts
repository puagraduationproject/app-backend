import type { FastifyError, FastifyInstance } from 'fastify';

export class AppError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message: string,
    readonly extra: { field?: string; retry_after_seconds?: number } = {},
  ) {
    super(message);
  }
}

export function registerErrorHandler(app: FastifyInstance) {
  app.setErrorHandler((error: FastifyError | AppError, request, reply) => {
    if (error instanceof AppError) {
      request.log.info({ code: error.code }, error.message);
      return reply.code(error.status).send({ error: { code: error.code, ...error.extra } });
    }
    if ((error as FastifyError).validation) {
      const field = (error as FastifyError).validation?.[0]?.instancePath?.replace(/^\//, '') || undefined;
      request.log.info({ code: 'invalid_input' }, error.message);
      return reply.code(400).send({ error: { code: 'invalid_input', field } });
    }
    if ((error as FastifyError).statusCode === 429) {
      return reply.code(429).send({ error: { code: 'limit_reached' } });
    }
    request.log.error(error);
    return reply.code(500).send({ error: { code: 'server_error' } });
  });
}
