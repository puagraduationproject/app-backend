# ERP: purchasing

Suppliers, purchase orders, receiving.

| | |
|-|-|
| Tables | supplier, purchase_order, purchase_line |
| Emits | PurchaseReceived |

## System calls (10)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.list_suppliers`](../../../contracts/syscalls/erp/list_suppliers.md) | Suppliers and what they supply | R | `purchasing` | 1 |
| [`erp.get_supplier`](../../../contracts/syscalls/erp/get_supplier.md) | Prices, history, delivery days | R | `purchasing` | 1 |
| [`erp.create_supplier`](../../../contracts/syscalls/erp/create_supplier.md) | New supplier | W | `purchasing` | 1 |
| [`erp.update_supplier`](../../../contracts/syscalls/erp/update_supplier.md) | Contact, items, prices | W | `purchasing` | 1 |
| [`erp.compare_supplier_prices`](../../../contracts/syscalls/erp/compare_supplier_prices.md) | Same ingredient across suppliers | R | `purchasing` | 1 |
| [`erp.draft_purchase_order`](../../../contracts/syscalls/erp/draft_purchase_order.md) | Draft from low stock or by request | W | `purchasing` | 1 |
| [`erp.update_purchase_order`](../../../contracts/syscalls/erp/update_purchase_order.md) | Lines, quantities | W | `purchasing` | 1 |
| [`erp.send_purchase_order`](../../../contracts/syscalls/erp/send_purchase_order.md) | Send to the supplier | W | `purchasing` | 1 |
| [`erp.receive_purchase`](../../../contracts/syscalls/erp/receive_purchase.md) | Full or partial delivery, actual costs | W | `purchasing` | 1 |
| [`erp.cancel_purchase_order`](../../../contracts/syscalls/erp/cancel_purchase_order.md) | Cancel | W | `purchasing` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
