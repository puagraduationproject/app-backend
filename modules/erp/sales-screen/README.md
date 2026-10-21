# ERP: sales-screen

Counter sales: created and paid in one step.

| | |
|-|-|
| Tables | uses order, order_line, payment |
| Emits | none |

## System calls (1)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.record_counter_sale`](../../../contracts/syscalls/erp/record_counter_sale.md) | Sale created and paid in one step | W | `sales_screen` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
