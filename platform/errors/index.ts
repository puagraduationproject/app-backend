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
      return reply.code(error.status).send({ error: { code: error.code, message: error.message, ...error.extra } });
    }
    if ((error as FastifyError).validation) {
      const field = (error as FastifyError).validation?.[0]?.instancePath?.replace(/^\//, '') || undefined;
      return reply.code(400).send({ error: { code: 'invalid_input', message: error.message, field } });
    }
    if ((error as FastifyError).statusCode === 429) {
      return reply.code(429).send({ error: { code: 'limit_reached', message: 'Too many requests' } });
    }
    request.log.error(error);
    return reply.code(500).send({ error: { code: 'server_error', message: 'Something went wrong' } });
  });
}
