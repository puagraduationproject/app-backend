# Schema `marketing`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 13.1. When the design changes, this page changes with it.

Only the `marketing` module's database user has rights here. One migration per
change, never edited after it runs. Every business table has `business_id` and
row-level security.

```
offer            id, business_id, name, rules(jsonb), starts_at, ends_at, status
campaign         id, business_id, name, segment_id, offer_id, message, channels,
                 status(draft|approved|sending|done), scheduled_at
campaign_send    id, campaign_id, customer_id, channel, status, sent_at
```
