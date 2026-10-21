# ERP: shifts

Shifts, cash movements, the cash gap.

| | |
|-|-|
| Tables | shift, cash_movement |
| Emits | CashGapFound |

## System calls (3)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.get_shift`](../../../contracts/syscalls/erp/get_shift.md) | The open shift: expected cash so far | R | `shifts_cash` | 1 |
| [`erp.list_shifts`](../../../contracts/syscalls/erp/list_shifts.md) | Past shifts with gaps | R | `shifts_cash` | 1 |
| [`erp.record_cash_movement`](../../../contracts/syscalls/erp/record_cash_movement.md) | Cash in or out of the drawer | W | `shifts_cash` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
