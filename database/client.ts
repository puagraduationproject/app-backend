import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { config } from '../config/index.js';

export const db = new Kysely<Record<string, never>>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({ connectionString: config.databaseUrl, max: 5 }),
  }),
});
