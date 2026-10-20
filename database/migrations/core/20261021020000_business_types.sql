-- migrate:up
alter table core.business drop constraint business_business_type_check;
alter table core.business add constraint business_business_type_check check (business_type in (
  'coffee_shop', 'restaurant', 'bakery', 'small_market', 'pharmacy', 'clothing',
  'electronics', 'beauty', 'services', 'online', 'other'
));

-- migrate:down
alter table core.business drop constraint business_business_type_check;
alter table core.business add constraint business_business_type_check
  check (business_type in ('coffee_shop', 'small_market', 'other'));
