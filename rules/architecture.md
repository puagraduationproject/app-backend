# Architecture rules

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2. When the design changes, this page changes with it.

One backend made of strict modules and one database. Not microservices.

1. **One owner per piece of data.** Others reference it by ID, never copy it
2. **Modules talk through events.** No module touches another module's tables
3. **Reading across modules is a service call**
4. **System calls are the only door.** The app, the AI and outside callers use the
   same system calls. There is no second, hidden way in
5. **The AI acts only through system calls.** It owns no business data and never reads
   the business tables
6. **Every write is audited, every state change emits an event**
7. **Only the Kernel reads and writes business data** ([parts.md](parts.md)).
   Modules, daemons and doors all go through it

## Data rules

- Money as whole numbers in piastres (`_cents` style) plus a currency. Never floats
- Stock is a ledger of movements. Levels are a cache that can be rebuilt
- Numbers people read are per business (order #1042, purchase #33), not random IDs
- Idempotency keys on anything that can be retried (orders, webhooks, AI actions)
- Order lines snapshot name, price and cost at the time of sale
- Every business-scoped table has `business_id`, locked by row-level security
- Events go through an outbox, written in the same transaction as the change
- Outside services (channels, payments, couriers, image model) sit behind drivers
- A test that tries to read another business's data, and must fail
