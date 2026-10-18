# Tools

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 4. When the design changes, this page changes with it.

## What a tool is

A tool is one action a module offers, in business words, with its rules
attached. Every tool is one entry in the contracts:

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

## How the AI finds and loads tools

- The full list is long (about 150) and can keep growing. The number is not a
  limit, the same way the number of functions in a library is not: each module
  and each pack adds its own, and the model never loads all of them
- A skill names the tools it needs, so one task loads 5 to 15
- When no skill fits, the AI calls `ai.find_tools` with what it wants to do and
  gets the few that match, already filtered for this person
- Each loaded tool is filtered three times: the business's packs (section 7.3),
  the person's role, and the face (customer or owner)

## Rules for building tools

1. One tool does one thing, and its output feeds the next tool (IDs, numbers)
2. The same names everywhere: a `customer_id` from CRM is what Marketing takes
3. Reads are free and can run in parallel; writes go into a plan (section 6.5)
4. Every write has a retry key and an undo, or a matching action that reverses it
5. Exact data (prices, stock, totals) only ever comes from a tool result
6. A new ability is usually a new skill; then a new action on an existing area;
   a new tool only when neither works

## Outside tools

Outside services are tools too, published by an adapter in the module that owns
them:

| Outside service | Adapter lives in | Term |
|-----------------|------------------|:----:|
| Telegram, website chat | Channels | 1 |
| WhatsApp, Instagram, Facebook (messages and posts) | Channels | 2 (WhatsApp in term 1 if Meta approves) |
| Google business profile and reviews | Store website | 2 |
| Payments, couriers | ERP | 2 |
| Speech to text (voice notes) | AI layer | 2 |
| Reading images (menu photos, invoices) | AI layer | 2 |
| Image model (post backgrounds, product shots) | Studio | 2 |

Every model in this list is an open model the team runs, the same rule as the
main models. Using a commercial model for any of them needs the team to change
that rule first.
