# System calls

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 4. When the design changes, this page changes with it.

## What a system call is

A system call is one action a module offers, in business words, with its rules
attached. Every system call is one entry in the contracts:

| Field | Example (`erp.change_price`) |
|-------|-------------------------------|
| Name | `erp.change_price`, always `module.verb_noun` |
| Description | What the model reads to decide when to use it |
| Inputs and outputs | Shapes, with the IDs the next step needs |
| Reads or writes | Writes |
| Retry key | Required |
| Undo | `erp.change_price` back to the old price |
| Permission | `change_price` |
| Capability (its pack, 7.3) | `catalog` (essentials) |
| Approval | Always |
| Faces | Owner only |
| Examples | Become test cases and training data |

## How the AI finds and loads system calls

- The full list is long (about 150) and can keep growing. The number is not a
  limit, the same way the number of functions in a library is not: each module
  and each pack adds its own, and the model never loads all of them
- A skill names the system calls it needs, so one task loads 5 to 15
- When no skill fits, the AI calls `ai.find_syscalls` with what it wants to do and
  gets the few that match, already filtered for this person
- Each loaded system call is filtered three times: the business's packs (section 7.3),
  the person's role, and the face (customer or owner)

## Rules for building system calls

1. One system call does one thing, and its output feeds the next system call (IDs, numbers)
2. The same names everywhere: a `customer_id` from CRM is what Marketing takes
3. Reads are free and can run in parallel; writes go into a plan (section 6.5)
4. Every write has a retry key and an undo, or a matching action that reverses it
5. Exact data (prices, stock, totals) only ever comes from a system call result
6. A new ability is usually a new skill; then a new action on an existing area;
   a new system call only when neither works

## Outside system calls

Outside services are system calls too, published by a driver in the module that owns
them:

| Outside service | Driver lives in | Term |
|-----------------|------------------|:----:|
| Telegram, website chat | Channels | 1 |
| WhatsApp, Instagram, Facebook (messages and posts) | Channels | 2 (WhatsApp in term 1 if Meta approves) |
| Google business profile and reviews | Store website | 2 |
| Payments, couriers | ERP | 2 |
| Speech to text (voice notes) | AI layer | 2 |
| Reading images (menu photos, invoices) | AI layer | 2 |
| Image model (post backgrounds, product shots) | Studio | 2 |

The models in this list follow the same rule as the main models: open models
the team runs by default, and a commercial one only where the owner picks it.
The system calls never depend on which model calls them.
