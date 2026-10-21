# Pack `credit`

> Status: **draft.** From the design, section 7.3.

| | |
|-|-|
| Module | ERP |
| Adds | Customer debts, limits, reminders |
| Needs | orders |
| Term | 1 basic, 2 full |
| On by default in | Small market |

## System calls

- [`erp.get_credit_account`](../syscalls/erp/get_credit_account.md)
- [`erp.list_debts`](../syscalls/erp/list_debts.md)
- [`erp.charge_on_account`](../syscalls/erp/charge_on_account.md)
- [`erp.record_debt_payment`](../syscalls/erp/record_debt_payment.md)
- [`erp.set_credit_limit`](../syscalls/erp/set_credit_limit.md)

## Windows and sidebar items

To write.

## Skills that need it

To write (the AI team lists them).

## Listeners that only run when it is on

To write.

## Settings

To write.

## Setup skill

What the AI walks the owner through when the pack is turned on. To write.

## Turning it off

Refused while another pack that is on needs it, or while it has open work. Its
data is kept and hidden, and comes back when it is turned on again.
