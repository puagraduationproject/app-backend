# ERP: catalog

Items, variants, modifiers, categories (essentials).

| | |
|-|-|
| Tables | item, variant, modifier_group, modifier, category |
| Emits | PriceChanged |

## System calls (9)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`erp.search_items`](../../../contracts/syscalls/erp/search_items.md) | Search the menu by name, category, available now | R | `essentials` | 1 |
| [`erp.get_item`](../../../contracts/syscalls/erp/get_item.md) | Item with sizes, options, price, photo, and its cost if the role allows | R | `essentials` | 1 |
| [`erp.list_categories`](../../../contracts/syscalls/erp/list_categories.md) | Menu sections | R | `essentials` | 1 |
| [`erp.create_item`](../../../contracts/syscalls/erp/create_item.md) | New item with sizes and options | W | `essentials` | 1 |
| [`erp.update_item`](../../../contracts/syscalls/erp/update_item.md) | Name, description, photo, category, template fields | W | `essentials` | 1 |
| [`erp.change_price`](../../../contracts/syscalls/erp/change_price.md) | New price | W | `essentials` | 1 |
| [`erp.set_availability`](../../../contracts/syscalls/erp/set_availability.md) | Sold out today, back in stock | W | `essentials` | 1 |
| [`erp.manage_modifiers`](../../../contracts/syscalls/erp/manage_modifiers.md) | Option groups: milk type, extra shot, sugar | W | `options` | 1 |
| [`erp.archive_item`](../../../contracts/syscalls/erp/archive_item.md) | Hide an item (undo: restore) | W | `essentials` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
