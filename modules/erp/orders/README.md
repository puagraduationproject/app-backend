# ERP: orders

Orders, lines with snapshots, the order stages.

| | |
|-|-|
| Tables | order, order_line, order_event |
| Emits | OrderCreated, OrderReady, OrderCompleted, OrderCancelled |

## Tools (7)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.create_order`](../../../contracts/tools/erp/create_order.md) | Pickup, delivery or dine-in order | W | `orders` | 1 |
| [`erp.get_order`](../../../contracts/tools/erp/get_order.md) | One order by number, with lines, status, payment | R | `orders` | 1 |
| [`erp.list_orders`](../../../contracts/tools/erp/list_orders.md) | Open, today, by channel, by customer | R | `orders` | 1 |
| [`erp.update_order_status`](../../../contracts/tools/erp/update_order_status.md) | Move to the next stage | W | `orders` | 1 |
| [`erp.edit_order`](../../../contracts/tools/erp/edit_order.md) | Add or remove lines before preparing | W | `orders` | 1 |
| [`erp.cancel_order`](../../../contracts/tools/erp/cancel_order.md) | Cancel; releases stock | W | `orders` | 1 |
| [`erp.apply_discount`](../../../contracts/tools/erp/apply_discount.md) | Discount on an order | W | `orders` | 1 |

## Parts

`tools`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
