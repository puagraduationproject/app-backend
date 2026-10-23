# Schema `directory`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) sections 2.3, 2.9 and 7.1. When the design changes, this page changes with it.

The map above every business, and the one schema not split by business. It
holds no business data, no names and no passwords: only where each business
lives and which business each log-in belongs to.

```
business          id (never changes), handle (unique), old_handle,
                  old_handle_until (30 days), status(active|paused),
                  home (where it lives: shared, or its own database later),
                  slots (the parts it has), created_at
login             value_hash (a scrambled email or Google ID, unique),
                  kind(email|google), business_id
                  (one business has many; each value belongs to one business)
signup            id, email_hash, code_hash, attempts, expires_at,
                  idempotency_key, created_at
                  (deleted when the business is made, or after a day)
signup_step       signup_id, step, reached_at   (the first time only)
```

- `login.value_hash` is a keyed hash of the lowercased email (or the Google
  ID), so the table answers "which business?" without holding readable emails
- A handle is unique across `handle` and every `old_handle` still blocked
- The Kernel keeps `business` in memory and refreshes it on `BusinessCreated`,
  `HandleChanged`, `BusinessPaused`, `PackTurnedOn` and `PackTurnedOff`

No migrations yet.
