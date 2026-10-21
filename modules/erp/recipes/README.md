# ERP: recipes

Ingredients, recipe lines, cost per item.

| | |
|-|-|
| Tables | ingredient, recipe_line |
| Emits | CostChanged |

## System calls (7)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.list_ingredients`](../../../contracts/syscalls/erp/list_ingredients.md) | Ingredients with unit and cost | R | `recipes` | 1 |
| [`erp.create_ingredient`](../../../contracts/syscalls/erp/create_ingredient.md) | New ingredient | W | `recipes` | 1 |
| [`erp.update_ingredient`](../../../contracts/syscalls/erp/update_ingredient.md) | Unit, cost, supplier | W | `recipes` | 1 |
| [`erp.get_recipe`](../../../contracts/syscalls/erp/get_recipe.md) | What one sale uses | R | `recipes` | 1 |
| [`erp.set_recipe`](../../../contracts/syscalls/erp/set_recipe.md) | Recipe lines for an item or size | W | `recipes` | 1 |
| [`erp.get_item_cost`](../../../contracts/syscalls/erp/get_item_cost.md) | Cost now, margin, change since last month | R | `recipes` | 1 |
| [`erp.suggest_price`](../../../contracts/syscalls/erp/suggest_price.md) | Price for a target margin | R | `recipes` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
