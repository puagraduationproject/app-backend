# CRM: customers

Customers, stats cache, usual order, merge and forget.

| | |
|-|-|
| Tables | customer, customer_stats |
| Emits | CustomerCreated, CustomerMerged, CustomerForgotten, CustomerInactive |

## System calls (5)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`crm.find_customer`](../../../contracts/syscalls/crm/find_customer.md) | By name or phone | R | `essentials` | 1 |
| [`crm.get_customer`](../../../contracts/syscalls/crm/get_customer.md) | Full view: history, usual order, points, notes, open cases | R | `essentials` | 1 |
| [`crm.list_customers`](../../../contracts/syscalls/crm/list_customers.md) | Filter: regulars, quiet, new, area, spend | R | `essentials` | 1 |
| [`crm.create_customer`](../../../contracts/syscalls/crm/create_customer.md) | New customer | W | `essentials` | 1 |
| [`crm.update_customer`](../../../contracts/syscalls/crm/update_customer.md) | Name, area, template fields | W | `essentials` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
