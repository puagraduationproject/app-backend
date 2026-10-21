-- migrate:up

-- What the owner sells, in their words: asked after "Something else" (ALL-002 5.4).
alter table core.business add column sells text check (length(sells) between 1 and 120);

-- A short list of kinds to start with (ALL-002 1.2): grocery is no longer one
-- choice with small market, and pharmacy, online shop, other services, clothes,
-- electronics and beauty are gone. A business that picked one of those becomes
-- "something else", and what it picked is kept in sells.
update core.business set
  sells = coalesce(sells, case business_type
    when 'pharmacy' then 'Pharmacy'
    when 'clothing' then 'Clothes and fashion'
    when 'electronics' then 'Phones and electronics'
    when 'beauty' then 'Salon, barber or beauty'
    when 'services' then 'Other services'
    when 'online' then 'Online shop'
  end),
  business_type = 'other'
where business_type in ('pharmacy', 'clothing', 'electronics', 'beauty', 'services', 'online');

alter table core.business drop constraint business_business_type_check;
alter table core.business add constraint business_business_type_check check (business_type in (
  'coffee_shop', 'small_market', 'grocery', 'bakery', 'restaurant', 'other'
));

-- The kinds with a term 1 template start from it (ALL-002 1.3).
update core.business set template_key = case business_type
  when 'coffee_shop' then 'coffee_shop'
  when 'small_market' then 'small_market'
  when 'grocery' then 'small_market'
end
where template_key is null;

-- migrate:down
update core.business set business_type = 'small_market' where business_type = 'grocery';
update core.business set template_key = null;
alter table core.business drop constraint business_business_type_check;
alter table core.business add constraint business_business_type_check check (business_type in (
  'coffee_shop', 'restaurant', 'bakery', 'small_market', 'pharmacy', 'clothing',
  'electronics', 'beauty', 'services', 'online', 'other'
));
alter table core.business drop column sells;
