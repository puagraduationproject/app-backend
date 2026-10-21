# Store website: search-presence

Descriptions, structured data, score, reviews (term 2).

| | |
|-|-|
| Tables | search_profile, review |
| Emits | ReviewReceived |

## System calls (5)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`store.get_search_presence`](../../../contracts/syscalls/store/get_search_presence.md) | Score and issues | R | `search_presence` | 2 |
| [`store.update_descriptions`](../../../contracts/syscalls/store/update_descriptions.md) | Descriptions and structured data | W | `search_presence` | 2 |
| [`store.sync_listing`](../../../contracts/syscalls/store/sync_listing.md) | Push hours, menu and photos to the Google profile | W | `search_presence` | 2 |
| [`store.list_reviews`](../../../contracts/syscalls/store/list_reviews.md) | New and unanswered reviews | R | `search_presence` | 2 |
| [`store.reply_review`](../../../contracts/syscalls/store/reply_review.md) | Answer a review | W | `search_presence` | 2 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
