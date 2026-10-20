-- migrate:up
create schema if not exists core;

create table core.account (
  id                uuid primary key default gen_random_uuid(),
  email             text not null,
  email_verified_at timestamptz,
  name              text,
  phone             text,
  password_hash     text,
  google_id         text unique,
  language          text not null default 'ar' check (language in ('ar', 'en')),
  failed_logins     integer not null default 0,
  locked_until      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create unique index account_email_key on core.account (lower(email));

create table core.email_code (
  id         uuid primary key default gen_random_uuid(),
  email      text not null,
  code_hash  text not null,
  attempts   integer not null default 0,
  expires_at timestamptz not null,
  used_at    timestamptz,
  created_at timestamptz not null default now()
);

create index email_code_email_idx on core.email_code (lower(email), created_at desc);

create table core.auth_ticket (
  id          uuid primary key default gen_random_uuid(),
  account_id  uuid not null references core.account (id),
  ticket_hash text not null unique,
  expires_at  timestamptz not null,
  used_at     timestamptz,
  created_at  timestamptz not null default now()
);

-- migrate:down
drop table core.auth_ticket;
drop table core.email_code;
drop table core.account;
