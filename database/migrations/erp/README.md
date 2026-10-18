# Schema `erp`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 8.1. When the design changes, this page changes with it.

Only the `erp` module's database user has rights here. One migration per
change, never edited after it runs. Every business table has `business_id` and
row-level security.

```
item            id, business_id, name, category_id, type(product|menu_item|service),
                custom_fields(jsonb), photo_url, active
variant         id, item_id, name, sku, barcode, attributes(jsonb),
                price_cents, currency, active
modifier_group  id, business_id, name (milk type, extra shot), rules(jsonb)
modifier        id, group_id, name, price_cents, ingredient_effects(jsonb)
category        id, business_id, name, parent_id
ingredient      id, business_id, name, unit (g, ml, piece), cost_cents_per_unit
recipe_line     variant_id, ingredient_id, qty             (what one sale uses)

stock_movement  id, business_id, location_id, stock_ref(ingredient|variant),
                type(in|out|sale|waste|adjust|transfer|reserve|release),
                qty, unit_cost_cents, reason, expiry_date, ref_type, ref_id,
                created_at, created_by
stock_level     business_id, location_id, stock_ref, on_hand, reserved   (cache)

order           id, business_id, number, location_id, customer_id, channel
                (counter|website|chat|phone), type(dine_in|pickup|delivery),
                status, subtotal_cents, discount_cents, delivery_cents,
                total_cents, currency, shift_id, created_by_type(user|ai),
                idempotency_key, notes, created_at
order_line      id, order_id, variant_id, modifiers(jsonb),
                name_snapshot, price_snapshot_cents, cost_snapshot_cents,
                qty, line_total_cents
order_event     id, order_id, from_status, to_status, actor_type, actor_id,
                reason, created_at
payment         id, business_id, order_id, method(cash|card|wallet|on_account),
                amount_cents, status, paid_at

shift           id, business_id, location_id, opened_by, opened_at,
                opening_cash_cents, closed_by, closed_at, counted_cash_cents,
                expected_cash_cents, difference_cents, note
cash_movement   id, shift_id, type(in|out), amount_cents, reason, created_by

supplier        id, business_id, name, phone, items_supplied(jsonb)
purchase_order  id, business_id, number, supplier_id, status
                (draft|approved|sent|received|cancelled), total_cents, created_by_type
purchase_line   id, purchase_order_id, stock_ref, qty, unit_cost_cents

credit_account  id, business_id, customer_id, limit_cents, balance_cents
credit_entry    id, account_id, type(charge|payment), amount_cents, ref, created_at

expense         id, business_id, category, amount_cents, date, note, receipt_url
```
