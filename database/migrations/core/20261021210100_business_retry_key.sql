-- migrate:up

-- A retried "create my business" gets the business the first try made, never a
-- second one (design 2.1, ALL-002 3.2).
alter table core.business add column idempotency_key uuid;
create unique index business_idempotency_key on core.business (created_by, idempotency_key);

-- migrate:down
drop index core.business_idempotency_key;
alter table core.business drop column idempotency_key;
