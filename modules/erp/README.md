# Module: ERP

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 8. When the design changes, this page changes with it.

Operations: what the business sells and what happens to it.

Its system calls are its only public face. It never writes another module's tables;
it emits events and reads other modules through their services.

## Areas

| Folder | Holds |
|--------|-------|
| [`catalog`](catalog/README.md) | Items, variants, modifiers, categories (essentials) |
| [`orders`](orders/README.md) | Orders, lines with snapshots, the order stages |
| [`payments`](payments/README.md) | Payments and refunds |
| [`sales-screen`](sales-screen/README.md) | Counter sales: created and paid in one step |
| [`shifts`](shifts/README.md) | Shifts, cash movements, the cash gap |
| [`stock`](stock/README.md) | Movement ledger, levels cache, waste, forecast, rebuild |
| [`recipes`](recipes/README.md) | Ingredients, recipe lines, cost per item |
| [`purchasing`](purchasing/README.md) | Suppliers, purchase orders, receiving |
| [`credit`](credit/README.md) | Customer debts and limits |
| [`expenses`](expenses/README.md) | Expenses |
| [`drivers`](drivers/README.md) | Payments and couriers (term 2) |

Every area folder holds the same parts. File names and extensions follow the
stack once it is chosen:

| Part | Holds |
|------|-------|
| `syscalls` | One handler per system call page; checks inputs, calls the service, returns the output |
| `service` | The area's rules; the only code that changes its data |
| `data` | Access to the area's own tables, in the module's own schema |
| `listeners` | Handlers for events from other modules |
| `tests` | The area's own tests: every system call, every rule |

## Data (schema `erp`)

```
item            id, business_id, name, category_id, type(product|menu_item|service),
                custom_fields(jsonb), photo_url, active
variant         id, item_id, name, sku, barcode, attributes(jsonb),
                price_cents, currency, active
modifier_group  id, business_id, name (milk type, extra shot), rules(jsonb)
modifier        id, group_id, name, price_cents, ingredient_effects(jsonb)
category        id, business_id, name, parent_id
ingredient      id, business_id, name, unit (g, ml, piece), cost_cents_per_unit
recipe_line     variant_id, ingredient_id, qty             (what one sale uses)

stock_movement  id, business_id, location_id, stock_ref(ingredient|variant),
                type(in|out|sale|waste|adjust|transfer|reserve|release),
                qty, unit_cost_cents, reason, expiry_date, ref_type, ref_id,
                created_at, created_by
stock_level     business_id, location_id, stock_ref, on_hand, reserved   (cache)

order           id, business_id, number, location_id, customer_id, channel
                (counter|website|chat|phone), type(dine_in|pickup|delivery),
                status, subtotal_cents, discount_cents, delivery_cents,
                total_cents, currency, shift_id, created_by_type(user|ai),
                idempotency_key, notes, created_at
order_line      id, order_id, variant_id, modifiers(jsonb),
                name_snapshot, price_snapshot_cents, cost_snapshot_cents,
                qty, line_total_cents
order_event     id, order_id, from_status, to_status, actor_type, actor_id,
                reason, created_at
payment         id, business_id, order_id, method(cash|card|wallet|on_account),
                amount_cents, status, paid_at

shift           id, business_id, location_id, opened_by, opened_at,
                opening_cash_cents, closed_by, closed_at, counted_cash_cents,
                expected_cash_cents, difference_cents, note
cash_movement   id, shift_id, type(in|out), amount_cents, reason, created_by

supplier        id, business_id, name, phone, items_supplied(jsonb)
purchase_order  id, business_id, number, supplier_id, status
                (draft|approved|sent|received|cancelled), total_cents, created_by_type
purchase_line   id, purchase_order_id, stock_ref, qty, unit_cost_cents

credit_account  id, business_id, customer_id, limit_cents, balance_cents
credit_entry    id, account_id, type(charge|payment), amount_cents, ref, created_at

expense         id, business_id, category, amount_cents, date, note, receipt_url
```

## Events

- **Emits:** CashGapFound, CostChanged, DebtDue, OrderCancelled, OrderCompleted, OrderCreated, OrderReady, PaymentReceived, PriceChanged, PurchaseReceived, RefundIssued, StockExpiring, StockLow, WasteLogged
- **Listens to:** CustomerForgotten, CustomerMerged

## System calls (54)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.search_items`](../../contracts/syscalls/erp/search_items.md) | Search the menu by name, category, available now | R | `essentials` | 1 |
| [`erp.get_item`](../../contracts/syscalls/erp/get_item.md) | Item with sizes, options, price, photo, and its cost if the role allows | R | `essentials` | 1 |
| [`erp.list_categories`](../../contracts/syscalls/erp/list_categories.md) | Menu sections | R | `essentials` | 1 |
| [`erp.create_item`](../../contracts/syscalls/erp/create_item.md) | New item with sizes and options | W | `essentials` | 1 |
| [`erp.update_item`](../../contracts/syscalls/erp/update_item.md) | Name, description, photo, category, template fields | W | `essentials` | 1 |
| [`erp.change_price`](../../contracts/syscalls/erp/change_price.md) | New price | W | `essentials` | 1 |
| [`erp.set_availability`](../../contracts/syscalls/erp/set_availability.md) | Sold out today, back in stock | W | `essentials` | 1 |
| [`erp.manage_modifiers`](../../contracts/syscalls/erp/manage_modifiers.md) | Option groups: milk type, extra shot, sugar | W | `options` | 1 |
| [`erp.archive_item`](../../contracts/syscalls/erp/archive_item.md) | Hide an item (undo: restore) | W | `essentials` | 1 |
| [`erp.list_ingredients`](../../contracts/syscalls/erp/list_ingredients.md) | Ingredients with unit and cost | R | `recipes` | 1 |
| [`erp.create_ingredient`](../../contracts/syscalls/erp/create_ingredient.md) | New ingredient | W | `recipes` | 1 |
| [`erp.update_ingredient`](../../contracts/syscalls/erp/update_ingredient.md) | Unit, cost, supplier | W | `recipes` | 1 |
| [`erp.get_recipe`](../../contracts/syscalls/erp/get_recipe.md) | What one sale uses | R | `recipes` | 1 |
| [`erp.set_recipe`](../../contracts/syscalls/erp/set_recipe.md) | Recipe lines for an item or size | W | `recipes` | 1 |
| [`erp.get_item_cost`](../../contracts/syscalls/erp/get_item_cost.md) | Cost now, margin, change since last month | R | `recipes` | 1 |
| [`erp.suggest_price`](../../contracts/syscalls/erp/suggest_price.md) | Price for a target margin | R | `recipes` | 1 |
| [`erp.get_stock_levels`](../../contracts/syscalls/erp/get_stock_levels.md) | Levels; filter low, expiring, by branch | R | `stock` | 1 |
| [`erp.get_stock_history`](../../contracts/syscalls/erp/get_stock_history.md) | Movements for one ingredient or product | R | `stock` | 1 |
| [`erp.forecast_stock`](../../contracts/syscalls/erp/forecast_stock.md) | When it runs out, at the current pace | R | `stock` | 1 |
| [`erp.log_waste`](../../contracts/syscalls/erp/log_waste.md) | Waste with a reason | W | `stock` | 1 |
| [`erp.adjust_stock`](../../contracts/syscalls/erp/adjust_stock.md) | Count correction | W | `stock` | 1 |
| [`erp.record_stock_in`](../../contracts/syscalls/erp/record_stock_in.md) | Stock bought without a purchase order | W | `stock` | 1 |
| [`erp.transfer_stock`](../../contracts/syscalls/erp/transfer_stock.md) | Between branches | W | `branches` | 2 |
| [`erp.create_order`](../../contracts/syscalls/erp/create_order.md) | Pickup, delivery or dine-in order | W | `orders` | 1 |
| [`erp.record_counter_sale`](../../contracts/syscalls/erp/record_counter_sale.md) | Sale created and paid in one step | W | `sales_screen` | 1 |
| [`erp.get_order`](../../contracts/syscalls/erp/get_order.md) | One order by number, with lines, status, payment | R | `orders` | 1 |
| [`erp.list_orders`](../../contracts/syscalls/erp/list_orders.md) | Open, today, by channel, by customer | R | `orders` | 1 |
| [`erp.update_order_status`](../../contracts/syscalls/erp/update_order_status.md) | Move to the next stage | W | `orders` | 1 |
| [`erp.edit_order`](../../contracts/syscalls/erp/edit_order.md) | Add or remove lines before preparing | W | `orders` | 1 |
| [`erp.cancel_order`](../../contracts/syscalls/erp/cancel_order.md) | Cancel; releases stock | W | `orders` | 1 |
| [`erp.apply_discount`](../../contracts/syscalls/erp/apply_discount.md) | Discount on an order | W | `orders` | 1 |
| [`erp.record_payment`](../../contracts/syscalls/erp/record_payment.md) | Cash, card, wallet, on account | W | `orders` | 1 |
| [`erp.list_payments`](../../contracts/syscalls/erp/list_payments.md) | By period, method, shift | R | `orders` | 1 |
| [`erp.refund_payment`](../../contracts/syscalls/erp/refund_payment.md) | Full or partial refund | W | `orders` | 1 |
| [`erp.get_shift`](../../contracts/syscalls/erp/get_shift.md) | The open shift: expected cash so far | R | `shifts_cash` | 1 |
| [`erp.list_shifts`](../../contracts/syscalls/erp/list_shifts.md) | Past shifts with gaps | R | `shifts_cash` | 1 |
| [`erp.record_cash_movement`](../../contracts/syscalls/erp/record_cash_movement.md) | Cash in or out of the drawer | W | `shifts_cash` | 1 |
| [`erp.list_suppliers`](../../contracts/syscalls/erp/list_suppliers.md) | Suppliers and what they supply | R | `purchasing` | 1 |
| [`erp.get_supplier`](../../contracts/syscalls/erp/get_supplier.md) | Prices, history, delivery days | R | `purchasing` | 1 |
| [`erp.create_supplier`](../../contracts/syscalls/erp/create_supplier.md) | New supplier | W | `purchasing` | 1 |
| [`erp.update_supplier`](../../contracts/syscalls/erp/update_supplier.md) | Contact, items, prices | W | `purchasing` | 1 |
| [`erp.compare_supplier_prices`](../../contracts/syscalls/erp/compare_supplier_prices.md) | Same ingredient across suppliers | R | `purchasing` | 1 |
| [`erp.draft_purchase_order`](../../contracts/syscalls/erp/draft_purchase_order.md) | Draft from low stock or by request | W | `purchasing` | 1 |
| [`erp.update_purchase_order`](../../contracts/syscalls/erp/update_purchase_order.md) | Lines, quantities | W | `purchasing` | 1 |
| [`erp.send_purchase_order`](../../contracts/syscalls/erp/send_purchase_order.md) | Send to the supplier | W | `purchasing` | 1 |
| [`erp.receive_purchase`](../../contracts/syscalls/erp/receive_purchase.md) | Full or partial delivery, actual costs | W | `purchasing` | 1 |
| [`erp.cancel_purchase_order`](../../contracts/syscalls/erp/cancel_purchase_order.md) | Cancel | W | `purchasing` | 1 |
| [`erp.get_credit_account`](../../contracts/syscalls/erp/get_credit_account.md) | Balance, limit, history | R | `credit` | 1 |
| [`erp.list_debts`](../../contracts/syscalls/erp/list_debts.md) | Due and overdue | R | `credit` | 1 |
| [`erp.charge_on_account`](../../contracts/syscalls/erp/charge_on_account.md) | Sale on credit | W | `credit` | 1 |
| [`erp.record_debt_payment`](../../contracts/syscalls/erp/record_debt_payment.md) | Payment against a debt | W | `credit` | 1 |
| [`erp.set_credit_limit`](../../contracts/syscalls/erp/set_credit_limit.md) | Change a customer's limit | W | `credit` | 1 |
| [`erp.record_expense`](../../contracts/syscalls/erp/record_expense.md) | Rent, salaries, bills, with a receipt photo | W | `expenses` | 1 |
| [`erp.list_expenses`](../../contracts/syscalls/erp/list_expenses.md) | By period and category | R | `expenses` | 1 |
