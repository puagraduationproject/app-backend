# ERP: purchasing

Suppliers, purchase orders, receiving.

| | |
|-|-|
| Tables | supplier, purchase_order, purchase_line |
| Emits | PurchaseReceived |

## Tools (10)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.list_suppliers`](../../../contracts/tools/erp/list_suppliers.md) | Suppliers and what they supply | R | `purchasing` | 1 |
| [`erp.get_supplier`](../../../contracts/tools/erp/get_supplier.md) | Prices, history, delivery days | R | `purchasing` | 1 |
| [`erp.create_supplier`](../../../contracts/tools/erp/create_supplier.md) | New supplier | W | `purchasing` | 1 |
| [`erp.update_supplier`](../../../contracts/tools/erp/update_supplier.md) | Contact, items, prices | W | `purchasing` | 1 |
| [`erp.compare_supplier_prices`](../../../contracts/tools/erp/compare_supplier_prices.md) | Same ingredient across suppliers | R | `purchasing` | 1 |
| [`erp.draft_purchase_order`](../../../contracts/tools/erp/draft_purchase_order.md) | Draft from low stock or by request | W | `purchasing` | 1 |
| [`erp.update_purchase_order`](../../../contracts/tools/erp/update_purchase_order.md) | Lines, quantities | W | `purchasing` | 1 |
| [`erp.send_purchase_order`](../../../contracts/tools/erp/send_purchase_order.md) | Send to the supplier | W | `purchasing` | 1 |
| [`erp.receive_purchase`](../../../contracts/tools/erp/receive_purchase.md) | Full or partial delivery, actual costs | W | `purchasing` | 1 |
| [`erp.cancel_purchase_order`](../../../contracts/tools/erp/cancel_purchase_order.md) | Cancel | W | `purchasing` | 1 |

## Parts

`tools`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
