# Pack `recipes`

> Status: **draft.** From the design, section 7.3.

| | |
|-|-|
| Module | ERP |
| Adds | Ingredients, recipes, cost and margin per item |
| Needs | stock |
| Term | 1 |
| On by default in | Coffee shop |

## System calls

- [`erp.list_ingredients`](../syscalls/erp/list_ingredients.md)
- [`erp.create_ingredient`](../syscalls/erp/create_ingredient.md)
- [`erp.update_ingredient`](../syscalls/erp/update_ingredient.md)
- [`erp.get_recipe`](../syscalls/erp/get_recipe.md)
- [`erp.set_recipe`](../syscalls/erp/set_recipe.md)
- [`erp.get_item_cost`](../syscalls/erp/get_item_cost.md)
- [`erp.suggest_price`](../syscalls/erp/suggest_price.md)

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
