# CRM: identities

Resolve identity, phone to +20, merge suggestions.

| | |
|-|-|
| Tables | customer_identity |
| Emits | none |

## System calls (2)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`crm.suggest_merge`](../../../contracts/syscalls/crm/suggest_merge.md) | Possible duplicates | R | `essentials` | 1 |
| [`crm.merge_customers`](../../../contracts/syscalls/crm/merge_customers.md) | Merge two records | W | `essentials` | 2 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
