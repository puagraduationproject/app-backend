# ERP: stock

Movement ledger, levels cache, waste, forecast, rebuild.

| | |
|-|-|
| Tables | stock_movement, stock_level |
| Emits | StockLow, StockExpiring, WasteLogged |

## System calls (7)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.get_stock_levels`](../../../contracts/syscalls/erp/get_stock_levels.md) | Levels; filter low, expiring, by branch | R | `stock` | 1 |
| [`erp.get_stock_history`](../../../contracts/syscalls/erp/get_stock_history.md) | Movements for one ingredient or product | R | `stock` | 1 |
| [`erp.forecast_stock`](../../../contracts/syscalls/erp/forecast_stock.md) | When it runs out, at the current pace | R | `stock` | 1 |
| [`erp.log_waste`](../../../contracts/syscalls/erp/log_waste.md) | Waste with a reason | W | `stock` | 1 |
| [`erp.adjust_stock`](../../../contracts/syscalls/erp/adjust_stock.md) | Count correction | W | `stock` | 1 |
| [`erp.record_stock_in`](../../../contracts/syscalls/erp/record_stock_in.md) | Stock bought without a purchase order | W | `stock` | 1 |
| [`erp.transfer_stock`](../../../contracts/syscalls/erp/transfer_stock.md) | Between branches | W | `branches` | 2 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
