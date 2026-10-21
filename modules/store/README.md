# Module: Store website

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 11. When the design changes, this page changes with it.

### 11.1 Store website

Its system calls are its only public face. It never writes another module's tables;
it emits events and reads other modules through their services.

## Areas

| Folder | Holds |
|--------|-------|
| [`site`](site/README.md) | Shop page, pages, banner, menu display, public ordering |
| [`search-presence`](search-presence/README.md) | Descriptions, structured data, score, reviews (term 2) |
| [`drivers`](drivers/README.md) | Google business profile and reviews (term 2) |

Every area folder holds the same parts. File names and extensions follow the
stack once it is chosen:

| Part | Holds |
|------|-------|
| `syscalls` | One handler per system call page; checks inputs, calls the service, returns the output |
| `service` | The area's rules; the only code that changes its data |
| `data` | Access to the area's own tables, in the module's own schema |
| `listeners` | Handlers for events from other modules |
| `tests` | The area's own tests: every system call, every rule |

## Data (schema `store`)

```
store_settings   business_id, slug, domain, theme(jsonb), sections(jsonb), published
store_page       id, business_id, kind(home|menu|about|custom), content(jsonb),
                 seo(jsonb), published_at
search_profile   business_id, descriptions(jsonb), structured_data(jsonb),
                 listing_status(jsonb), score, checked_at          (term 2)
review           id, business_id, source, rating, body, reply, replied_at (term 2)
```

## Events

- **Emits:** ReviewReceived, SitePublished
- **Listens to:** none

## System calls (10)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`store.get_site`](../../contracts/syscalls/store/get_site.md) | Pages, sections, theme, what is published | R | `website` | 1 |
| [`store.update_page`](../../contracts/syscalls/store/update_page.md) | Edit a page or section | W | `website` | 1 |
| [`store.set_banner`](../../contracts/syscalls/store/set_banner.md) | Announcement banner ("closed Friday until 2") | W | `website` | 1 |
| [`store.set_menu_display`](../../contracts/syscalls/store/set_menu_display.md) | Which items and sections show | W | `website` | 1 |
| [`store.update_theme`](../../contracts/syscalls/store/update_theme.md) | Look of the site, from the brand kit | W | `website` | 2 |
| [`store.get_search_presence`](../../contracts/syscalls/store/get_search_presence.md) | Score and issues | R | `search_presence` | 2 |
| [`store.update_descriptions`](../../contracts/syscalls/store/update_descriptions.md) | Descriptions and structured data | W | `search_presence` | 2 |
| [`store.sync_listing`](../../contracts/syscalls/store/sync_listing.md) | Push hours, menu and photos to the Google profile | W | `search_presence` | 2 |
| [`store.list_reviews`](../../contracts/syscalls/store/list_reviews.md) | New and unanswered reviews | R | `search_presence` | 2 |
| [`store.reply_review`](../../contracts/syscalls/store/reply_review.md) | Answer a review | W | `search_presence` | 2 |
