# Kernel

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

Works like a CPU: it only processes calls. It takes a system call with its
Pass, runs five checks by asking the parts around it (the Directory, the OGR,
the Registry, approvals, idempotency), then runs the module's code in one
transaction. It is the only part that reaches the data (business data and
accounts alike) and the only part that calls drivers.

## The five checks

It can block a call even when the AI or a person approved it.

1. **May he:** the role, the packs on, the face, and the owner's AI settings
   (design 6.6), with the approval when the call needs one
2. **Same business:** every thing the call touches belongs to the Pass's
   business (asked of the Directory and the OGR)
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
- `database.ts`: the only database connection; the parts around the Kernel get its transaction
