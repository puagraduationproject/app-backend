-- migrate:up

-- The first time each account reached each step of the business setup, to see
-- where people stop and how long setup takes (ALL-002 5.6). Part of the users
-- section, like the account: there is no business yet.
create table core.setup_step (
  account_id uuid not null references core.account (id),
  step       text not null check (step in ('language', 'your_name', 'business_name', 'business_type', 'location', 'done')),
  reached_at timestamptz not null default now(),
  primary key (account_id, step)
);

-- Per step: how many accounts reached it, and the median seconds from their first step.
create view core.setup_funnel as
with started as (select account_id, min(reached_at) as at from core.setup_step group by account_id)
select step,
       array_position(array['language', 'your_name', 'business_name', 'business_type', 'location', 'done'], step) as position,
       count(*)::int as accounts,
       round(percentile_cont(0.5) within group (order by extract(epoch from reached_at - started.at)::float8))::int as median_seconds
from core.setup_step join started using (account_id)
group by step;

-- migrate:down
drop view core.setup_funnel;
drop table core.setup_step;
