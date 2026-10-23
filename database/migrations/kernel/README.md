# Schema `kernel`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.3. When the design changes, this page changes with it.

The Kernel's own records for each business, split by business: for example
the retried calls already answered (idempotency), so a retry writes once.
Every table has `business_id` first in its key.

No migrations yet.
