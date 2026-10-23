# Schema `sessions`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) sections 2.3, 7.1 and 7.6. When the design changes, this page changes with it.

The tokens and devices of each business, split by business: one slot per
business. No passwords here.

```
session           business_id, id, account_id, role, token_hash, device_id,
                  browser, user_agent, first_ip, last_ip, created_at,
                  last_seen_at, proved_at, expires_at, ended_at, end_reason
device            business_id, id, account_id, name, approved_by,
                  approved_at, last_seen_at
```

- A token reads `<business_id>.<secret>`. The Kernel opens only that
  business's slot, and the hash of the secret exists only there
- Replaces today's `core.session`

No migrations yet.
