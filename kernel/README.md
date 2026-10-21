# Kernel (mode 0)

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

The only part that reads and writes business data. It takes a system call
with its Pass, runs five checks, then runs the module's code in one
transaction. Modules, daemons and doors all go through it.

## The five checks

It can block a call even when the AI or a person approved it.

1. **May he:** the role, the packs on, the face, and the owner's AI settings
   (design 6.6), with the approval when the call needs one
2. **Same business:** every thing the call touches belongs to the Pass's
   business (asked of the Index and the OGR)
3. **Data rules:** the module's own rules
4. **Already done:** a retried call with the same retry key writes once
5. **Within limits:** rate limits, money limits, the size of a bulk action

Then, in **one transaction**: it sets the business for row-level security,
switches to the owning module's database user, runs the module's code, and
writes the change, the audit row, the event (outbox) and the new OGR links.
All of it is saved, or none of it.

## Its parts

- [`call`](call/README.md): takes a system call with its Pass and runs it in one transaction
- [`checks`](checks/README.md): the five checks
- [`tenancy`](tenancy/README.md): every call inside one business; sets the row-level security context
- [`context`](context/README.md): business, actor, correlation ID and retry key on every call and event (design 2.6)
- [`index`](index/README.md): whose is it, what may this person do: businesses, members,
  roles, locations, templates, packs on, AI settings
- [`ogr`](ogr/README.md): One Global Reference: what is this, and what is it linked to
- [`syscall-registry`](syscall-registry/README.md): every system call, from its page in the contracts
- [`approvals`](approvals/README.md): saves and checks approvals itself
- [`audit`](audit/README.md): an audit row on every write, by people and by the AI
- [`outbox`](outbox/README.md): the event, saved with the change
- [`idempotency`](idempotency/README.md): a retried call writes once
- [`undo`](undo/README.md): runs a system call's undo from the audit log
- [`dry-run`](dry-run/README.md): runs system calls with no real writes, for skill test runs
- [`numbering`](numbering/README.md): per-business numbers people read: order #1042, purchase #33
- [`money`](money/README.md): whole piastres plus currency; never floats
- [`errors`](errors/README.md): error codes from contracts/errors, never message text
