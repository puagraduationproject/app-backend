# ERP: payments

Payments and refunds.

| | |
|-|-|
| Tables | payment |
| Emits | PaymentReceived, RefundIssued |

## System calls (3)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.record_payment`](../../../contracts/syscalls/erp/record_payment.md) | Cash, card, wallet, on account | W | `orders` | 1 |
| [`erp.list_payments`](../../../contracts/syscalls/erp/list_payments.md) | By period, method, shift | R | `orders` | 1 |
| [`erp.refund_payment`](../../../contracts/syscalls/erp/refund_payment.md) | Full or partial refund | W | `orders` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
