# Store website: site

Shop page, pages, banner, menu display, public ordering.

| | |
|-|-|
| Tables | store_settings, store_page |
| Emits | SitePublished |

## Tools (5)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`store.get_site`](../../../contracts/tools/store/get_site.md) | Pages, sections, theme, what is published | R | `website` | 1 |
| [`store.update_page`](../../../contracts/tools/store/update_page.md) | Edit a page or section | W | `website` | 1 |
| [`store.set_banner`](../../../contracts/tools/store/set_banner.md) | Announcement banner ("closed Friday until 2") | W | `website` | 1 |
| [`store.set_menu_display`](../../../contracts/tools/store/set_menu_display.md) | Which items and sections show | W | `website` | 1 |
| [`store.update_theme`](../../../contracts/tools/store/update_theme.md) | Look of the site, from the brand kit | W | `website` | 2 |

## Parts

`tools`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
