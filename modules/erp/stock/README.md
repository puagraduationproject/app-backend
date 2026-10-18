# ERP: stock

Movement ledger, levels cache, waste, forecast, rebuild.

| | |
|-|-|
| Tables | stock_movement, stock_level |
| Emits | StockLow, StockExpiring, WasteLogged |

## Tools (7)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.get_stock_levels`](../../../contracts/tools/erp/get_stock_levels.md) | Levels; filter low, expiring, by branch | R | `stock` | 1 |
| [`erp.get_stock_history`](../../../contracts/tools/erp/get_stock_history.md) | Movements for one ingredient or product | R | `stock` | 1 |
| [`erp.forecast_stock`](../../../contracts/tools/erp/forecast_stock.md) | When it runs out, at the current pace | R | `stock` | 1 |
| [`erp.log_waste`](../../../contracts/tools/erp/log_waste.md) | Waste with a reason | W | `stock` | 1 |
| [`erp.adjust_stock`](../../../contracts/tools/erp/adjust_stock.md) | Count correction | W | `stock` | 1 |
| [`erp.record_stock_in`](../../../contracts/tools/erp/record_stock_in.md) | Stock bought without a purchase order | W | `stock` | 1 |
| [`erp.transfer_stock`](../../../contracts/tools/erp/transfer_stock.md) | Between branches | W | `branches` | 2 |

## Parts

`tools`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
