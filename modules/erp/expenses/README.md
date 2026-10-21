# ERP: expenses

Expenses.

| | |
|-|-|
| Tables | expense |
| Emits | none |

## System calls (2)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.record_expense`](../../../contracts/syscalls/erp/record_expense.md) | Rent, salaries, bills, with a receipt photo | W | `expenses` | 1 |
| [`erp.list_expenses`](../../../contracts/syscalls/erp/list_expenses.md) | By period and category | R | `expenses` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
