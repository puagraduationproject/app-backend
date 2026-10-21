# Daemons

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

The parts that always run. A daemon never touches the data itself: it calls
the Kernel like anyone else, with the actor "system".

- [`events`](events/README.md): delivers the outbox to the listeners; retries; the listener registry
- [`jobs`](jobs/README.md): every few minutes or at a set time: expiring stock, quiet regulars,
  the morning briefing, scheduled posts, what the AI scheduled (`ai.schedule`)
- [`retries`](retries/README.md): messages and calls an outside service did not accept
