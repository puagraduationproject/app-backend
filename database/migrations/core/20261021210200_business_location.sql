-- migrate:up

-- Where the business is (design 7.1, ALL-002 5.3). Setup makes its first
-- location; more come with the branches pack.
create table core.location (
  id          uuid primary key default gen_random_uuid(),
  business_id uuid not null references core.business (id),
  name        text not null check (length(name) between 1 and 80),
  city        text not null check (length(city) between 1 and 40),
  area        text not null check (length(area) between 1 and 60),
  address     text check (length(address) between 1 and 200),
  created_at  timestamptz not null default now()
);

create index location_business_idx on core.location (business_id);

alter table core.location enable row level security;
alter table core.location force row level security;
create policy location_wall on core.location for all
  using (business_id = core.current_business())
  with check (business_id = core.current_business());

-- "Who works in it?" is no longer asked (ALL-002 4.1): a new business has no
-- answer, rather than a made-up "alone".
alter table core.business alter column team_size drop default, alter column team_size drop not null;

-- migrate:down
update core.business set team_size = 'alone' where team_size is null;
alter table core.business alter column team_size set default 'alone', alter column team_size set not null;
drop table core.location;
