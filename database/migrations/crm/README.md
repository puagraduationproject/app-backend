# Schema `crm`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 9.1. When the design changes, this page changes with it.

Only the `crm` module's database user has rights here. One migration per
change, never edited after it runs. Every business table has `business_id` and
row-level security.

```
customer          id, business_id, name, area, lifecycle_stage, owner_user_id,
                  custom_fields(jsonb), first_seen_at, merged_into, forgotten_at
customer_identity id, business_id, customer_id, type(phone|whatsapp|telegram|
                  instagram|email), value_normalized, value_raw, verified
                  UNIQUE (business_id, type, value_normalized)
activity          id, business_id, customer_id, type(message|order|payment|note|
                  task|loyalty|booking|case), source_module, ref_type, ref_id,
                  summary, actor_type, occurred_at
customer_stats    customer_id, orders_count, total_spent_cents, avg_order_cents,
                  usual_order(jsonb), last_order_at, last_message_at      (cache)
loyalty_account   customer_id, points, tier
loyalty_entry     id, customer_id, points, reason, ref, created_at
support_case      id, business_id, number, customer_id, order_id, conversation_id,
                  type(complaint|request|question), status(open|waiting|resolved),
                  priority, assigned_to, resolution, created_at, resolved_at
case_event        id, case_id, type, note, actor_type, actor_id, created_at
voucher           id, business_id, customer_id, value_cents, reason, case_id,
                  expires_at, used_at
booking           id, business_id, customer_id, starts_at, party_size,
                  deposit_cents, status, note
tag, customer_tag, note, follow_up                           (engagement)
segment           id, business_id, name, filter(jsonb)        (term 2)
consent           id, business_id, customer_id, channel, status (term 2)
```
