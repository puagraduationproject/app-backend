import type { ColumnType, Generated } from 'kysely';

type Timestamp = ColumnType<Date, Date | string | undefined, Date | string>;
type NullableTimestamp = ColumnType<Date | null, Date | string | null | undefined, Date | string | null>;

export interface AccountTable {
  id: Generated<string>;
  email: string;
  email_verified_at: NullableTimestamp;
  name: string | null;
  phone: string | null;
  password_hash: string | null;
  google_id: string | null;
  language: Generated<'ar' | 'en'>;
  failed_logins: Generated<number>;
  locked_until: NullableTimestamp;
  created_at: Generated<Date>;
  updated_at: Timestamp;
}

export interface EmailCodeTable {
  id: Generated<string>;
  email: string;
  code_hash: string;
  attempts: Generated<number>;
  expires_at: Timestamp;
  used_at: NullableTimestamp;
  created_at: Generated<Date>;
}

export interface AuthTicketTable {
  id: Generated<string>;
  account_id: string;
  ticket_hash: string;
  expires_at: Timestamp;
  used_at: NullableTimestamp;
  created_at: Generated<Date>;
}

export type SessionEndReason = 'logged_out' | 'ended_by_user' | 'password_changed' | 'device_limit' | 'browser_changed';

export interface SessionTable {
  id: Generated<string>;
  account_id: string;
  token_hash: string;
  browser: string;
  user_agent: string;
  first_ip: string;
  last_ip: string;
  created_at: Generated<Date>;
  last_seen_at: Generated<Date>;
  proved_at: Generated<Date>;
  expires_at: Timestamp;
  ended_at: NullableTimestamp;
  end_reason: SessionEndReason | null;
}

export interface Database {
  'core.account': AccountTable;
  'core.email_code': EmailCodeTable;
  'core.auth_ticket': AuthTicketTable;
  'core.session': SessionTable;
}
