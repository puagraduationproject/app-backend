# Schema `team`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 14.1. When the design changes, this page changes with it.

Only the `team` module's database user has rights here. One migration per
change, never edited after it runs. Every business table has `business_id` and
row-level security.

```
staff_profile    membership_id, business_id, phone, hourly_rate_cents, skills,
                 availability(jsonb)
rota_shift       id, business_id, location_id, membership_id, starts_at, ends_at,
                 role, status(planned|swapped|done|missed)
attendance       id, business_id, membership_id, clock_in_at, clock_out_at, source
task             id, business_id, assigned_to, title, due_at, status, created_by_type
```
