-- migrate:up

-- The backend works as this role, never as the database owner, so row-level
-- security applies to it.
do $$
begin
  if not exists (select 1 from pg_roles where rolname = 'backend') then
    create role backend nologin;
  end if;
end
$$;

grant backend to current_user;
grant usage on schema core to backend;
grant select, insert, update, delete on all tables in schema core to backend;
alter default privileges in schema core grant select, insert, update, delete on tables to backend;

create function core.current_account() returns uuid
  language sql stable as $$ select nullif(current_setting('app.account_id', true), '')::uuid $$;

create function core.current_business() returns uuid
  language sql stable as $$ select nullif(current_setting('app.business_id', true), '')::uuid $$;

create table core.business (
  id            uuid primary key default gen_random_uuid(),
  name          text not null check (length(name) between 1 and 80),
  handle        text not null check (handle ~ '^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$'),
  business_type text not null check (business_type in ('coffee_shop', 'small_market', 'other')),
  template_key  text check (template_key in ('coffee_shop', 'small_market')),
  team_size     text not null default 'alone' check (team_size in ('alone', 'team')),
  currency      text not null default 'EGP',
  timezone      text not null default 'Africa/Cairo',
  locale        text not null default 'ar-EG',
  settings      jsonb not null default '{}',
  created_by    uuid not null references core.account (id),
  created_at    timestamptz not null default now()
);

create unique index business_handle_key on core.business (handle);

create table core.membership (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references core.business (id),
  user_id      uuid not null references core.account (id),
  username     text not null check (username ~ '^[a-z0-9][a-z0-9._-]{0,28}[a-z0-9]$'),
  display_name text not null check (length(display_name) between 1 and 80),
  role         text not null check (role in ('owner', 'manager', 'staff', 'viewer')),
  invited_by   uuid references core.account (id),
  joined_at    timestamptz not null default now(),
  unique (business_id, user_id),
  unique (business_id, username)
);

create index membership_user_idx on core.membership (user_id);

create table core.audit_log (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references core.business (id),
  actor_type  text not null check (actor_type in ('user', 'ai', 'system')),
  actor_id    uuid,
  action      text not null,
  object_type text not null,
  object_id   uuid,
  before      jsonb,
  after       jsonb,
  created_at  timestamptz not null default now()
);

create index audit_log_business_idx on core.audit_log (business_id, created_at desc);

create table core.outbox (
  id            uuid primary key default gen_random_uuid(),
  business_id   uuid not null references core.business (id),
  event_type    text not null,
  payload       jsonb not null,
  created_at    timestamptz not null default now(),
  dispatched_at timestamptz,
  attempts      integer not null default 0,
  last_error    text
);

create index outbox_waiting_idx on core.outbox (created_at) where dispatched_at is null;

-- Reads across businesses that the walls below would block, kept narrow.
create function core.my_business_ids() returns setof uuid
  language sql stable security definer set search_path = core, pg_temp as $$
  select business_id from core.membership where user_id = core.current_account()
$$;

create function core.handle_taken(wanted text) returns boolean
  language sql stable security definer set search_path = core, pg_temp as $$
  select exists (select 1 from core.business where handle = wanted)
$$;

revoke all on function core.my_business_ids() from public;
revoke all on function core.handle_taken(text) from public;
grant execute on function core.my_business_ids() to backend;
grant execute on function core.handle_taken(text) to backend;

alter table core.business enable row level security;
alter table core.business force row level security;
create policy business_read on core.business for select
  using (id = core.current_business() or id in (select core.my_business_ids()));
create policy business_create on core.business for insert
  with check (created_by = core.current_account());
create policy business_change on core.business for update
  using (id = core.current_business());

alter table core.membership enable row level security;
alter table core.membership force row level security;
create policy membership_read on core.membership for select
  using (business_id = core.current_business() or user_id = core.current_account());
create policy membership_write on core.membership for all
  using (business_id = core.current_business())
  with check (business_id = core.current_business());

alter table core.audit_log enable row level security;
alter table core.audit_log force row level security;
create policy audit_log_wall on core.audit_log for all
  using (business_id = core.current_business())
  with check (business_id = core.current_business());

alter table core.outbox enable row level security;
alter table core.outbox force row level security;
create policy outbox_wall on core.outbox for all
  using (business_id = core.current_business())
  with check (business_id = core.current_business());

-- migrate:down
drop table core.outbox;
drop table core.audit_log;
drop table core.membership;
drop table core.business;
drop function core.handle_taken(text);
drop function core.my_business_ids();
drop function core.current_business();
drop function core.current_account();
