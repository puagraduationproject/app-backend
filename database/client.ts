import { CompiledQuery, Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import { config } from '../config/index.js';
import type { Database } from './types.js';

export const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new pg.Pool({ connectionString: config.databaseUrl, max: 5 }),
    onCreateConnection: async (connection) => {
      await connection.executeQuery(CompiledQuery.raw('set role backend'));
    },
  }),
});
