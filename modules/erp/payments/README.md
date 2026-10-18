# ERP: payments

Payments and refunds.

| | |
|-|-|
| Tables | payment |
| Emits | PaymentReceived, RefundIssued |

## Tools (3)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.record_payment`](../../../contracts/tools/erp/record_payment.md) | Cash, card, wallet, on account | W | `orders` | 1 |
| [`erp.list_payments`](../../../contracts/tools/erp/list_payments.md) | By period, method, shift | R | `orders` | 1 |
| [`erp.refund_payment`](../../../contracts/tools/erp/refund_payment.md) | Full or partial refund | W | `orders` | 1 |

## Parts

`tools`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
