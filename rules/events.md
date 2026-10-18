# Events

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 7.4 and 2.6. When the design changes, this page changes with it.

1. A service writes the change and an outbox row in one transaction
2. A dispatcher reads undispatched rows and delivers them to listeners,
   including the AI layer
3. Delivered rows are marked; failures retry
4. A scheduler emits time-based events: expiring stock, quiet regulars, the
   morning briefing, scheduled posts

Every event uses the envelope in [contracts/events](../contracts/events/README.md).
