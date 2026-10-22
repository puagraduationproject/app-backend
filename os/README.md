# OS (mode 0)

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

The Kernel and the parts around it. Modules, daemons and doors all go
through the Kernel.

The [Kernel](kernel/README.md) works like a CPU: it only **processes** calls.
It manages nothing itself and owns no data; each part below does its own job.
And like the CPU is the only one that reaches memory, the Kernel holds the
only connection to the database: the parts around it work inside the
transaction the Kernel hands them, and never open the database themselves.

## The Kernel

- [`kernel`](kernel/README.md): processes each system call; the only database connection
  - [`call`](kernel/call/README.md): takes a system call with its Pass and runs it in one transaction
  - [`checks`](kernel/checks/README.md): the five checks
  - [`tenancy`](kernel/tenancy/README.md): every call inside one business; sets the row-level security context
  - [`context`](kernel/context/README.md): business, actor, correlation ID and retry key on every call and event (design 2.6)
  - `database.ts`: the database connection

## The parts around it

- [`directory`](directory/README.md): whose is it, what may this person do: businesses, members,
  roles, locations, templates, packs on, AI settings
- [`ogr`](ogr/README.md): One Global Reference: what is this, and what is it linked to
- [`registry`](registry/README.md): every system call, from its JSON file in the contracts
- [`system`](system/README.md): the internal `system.*` calls Login uses before anyone is logged in
- [`drivers`](drivers/README.md): the system's own drivers, called only by the Kernel: mail, files; push and sms in term 2
- [`audit`](audit/README.md): an audit row on every write, by people and by the AI
- [`outbox`](outbox/README.md): the event, saved with the change
- [`approvals`](approvals/README.md): saves and checks approvals itself
- [`idempotency`](idempotency/README.md): a retried call writes once
- [`undo`](undo/README.md): runs a system call's undo from the audit log
- [`dry-run`](dry-run/README.md): runs system calls with no real writes, for skill test runs
- [`shared`](shared/): small helpers every part uses
  - [`numbering`](shared/numbering/README.md): per-business numbers people read: order #1042, purchase #33
  - [`money`](shared/money/README.md): whole piastres plus currency; never floats
  - [`errors`](shared/errors/README.md): error codes from contracts/errors, never message text
