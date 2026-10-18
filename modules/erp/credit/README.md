# ERP: credit

Customer debts and limits.

| | |
|-|-|
| Tables | credit_account, credit_entry |
| Emits | DebtDue |

## Tools (5)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.get_credit_account`](../../../contracts/tools/erp/get_credit_account.md) | Balance, limit, history | R | `credit` | 1 |
| [`erp.list_debts`](../../../contracts/tools/erp/list_debts.md) | Due and overdue | R | `credit` | 1 |
| [`erp.charge_on_account`](../../../contracts/tools/erp/charge_on_account.md) | Sale on credit | W | `credit` | 1 |
| [`erp.record_debt_payment`](../../../contracts/tools/erp/record_debt_payment.md) | Payment against a debt | W | `credit` | 1 |
| [`erp.set_credit_limit`](../../../contracts/tools/erp/set_credit_limit.md) | Change a customer's limit | W | `credit` | 1 |

## Parts

`tools`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
