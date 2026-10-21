# CRM: engagement

Notes, tags, follow-ups.

| | |
|-|-|
| Tables | tag, customer_tag, note, follow_up |
| Emits | none |

## System calls (3)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`crm.add_note`](../../../contracts/syscalls/crm/add_note.md) | Note on a customer | W | `essentials` | 1 |
| [`crm.tag_customer`](../../../contracts/syscalls/crm/tag_customer.md) | Add or remove tags | W | `essentials` | 1 |
| [`crm.create_follow_up`](../../../contracts/syscalls/crm/create_follow_up.md) | "Call Mariam Thursday", for staff or the AI | W | `essentials` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
