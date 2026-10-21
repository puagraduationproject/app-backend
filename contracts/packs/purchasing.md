# Pack `purchasing`

> Status: **draft.** From the design, section 7.3.

| | |
|-|-|
| Module | ERP |
| Adds | Suppliers, purchase orders, receiving |
| Needs | stock |
| Term | 1 |
| On by default in | Coffee shop, Small market |

## System calls

- [`erp.list_suppliers`](../syscalls/erp/list_suppliers.md)
- [`erp.get_supplier`](../syscalls/erp/get_supplier.md)
- [`erp.create_supplier`](../syscalls/erp/create_supplier.md)
- [`erp.update_supplier`](../syscalls/erp/update_supplier.md)
- [`erp.compare_supplier_prices`](../syscalls/erp/compare_supplier_prices.md)
- [`erp.draft_purchase_order`](../syscalls/erp/draft_purchase_order.md)
- [`erp.update_purchase_order`](../syscalls/erp/update_purchase_order.md)
- [`erp.send_purchase_order`](../syscalls/erp/send_purchase_order.md)
- [`erp.receive_purchase`](../syscalls/erp/receive_purchase.md)
- [`erp.cancel_purchase_order`](../syscalls/erp/cancel_purchase_order.md)

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
