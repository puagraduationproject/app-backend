# Pack `orders`

> Status: **draft.** From the design, section 7.3.

| | |
|-|-|
| Module | ERP |
| Adds | Orders from chat and the website, stages, payments, order status page |
| Needs | catalog |
| Term | 1 |
| On by default in | Coffee shop, Small market |

## System calls

- [`erp.create_order`](../syscalls/erp/create_order.md)
- [`erp.get_order`](../syscalls/erp/get_order.md)
- [`erp.list_orders`](../syscalls/erp/list_orders.md)
- [`erp.update_order_status`](../syscalls/erp/update_order_status.md)
- [`erp.edit_order`](../syscalls/erp/edit_order.md)
- [`erp.cancel_order`](../syscalls/erp/cancel_order.md)
- [`erp.apply_discount`](../syscalls/erp/apply_discount.md)
- [`erp.record_payment`](../syscalls/erp/record_payment.md)
- [`erp.list_payments`](../syscalls/erp/list_payments.md)
- [`erp.refund_payment`](../syscalls/erp/refund_payment.md)

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
