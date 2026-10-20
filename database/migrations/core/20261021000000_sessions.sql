-- migrate:up
create table core.session (
  id           uuid primary key default gen_random_uuid(),
  account_id   uuid not null references core.account (id),
  token_hash   text not null unique,
  browser      text not null,
  user_agent   text not null,
  first_ip     text not null,
  last_ip      text not null,
  created_at   timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  proved_at    timestamptz not null default now(),
  expires_at   timestamptz not null,
  ended_at     timestamptz,
  end_reason   text check (end_reason in ('logged_out', 'ended_by_user', 'password_changed', 'device_limit', 'browser_changed'))
);

create index session_open_idx on core.session (account_id, last_seen_at desc) where ended_at is null;

-- migrate:down
drop table core.session;
