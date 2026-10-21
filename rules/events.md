# Events

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) sections 2.9, 7.4 and 2.6. When the design changes, this page changes with it.

1. The Kernel writes the change and an outbox row in one transaction
   ([kernel/outbox](../kernel/outbox/README.md))
2. The [Daemons](../daemons/README.md) read undispatched rows and deliver them
   to listeners, including the AI
3. Delivered rows are marked; failures retry
4. The jobs daemon emits time-based events: expiring stock, quiet regulars,
   the morning briefing, scheduled posts

Every event uses the envelope in [contracts/events](../contracts/events/README.md).
