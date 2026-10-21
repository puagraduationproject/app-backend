# Pack `search_presence`

> Status: **draft.** From the design, section 7.3.

| | |
|-|-|
| Module | Store |
| Adds | SEO and GEO, the Google profile, reviews |
| Needs | website |
| Term | 2 |
| On by default in | none by default |

## System calls

- [`store.get_search_presence`](../syscalls/store/get_search_presence.md)
- [`store.update_descriptions`](../syscalls/store/update_descriptions.md)
- [`store.sync_listing`](../syscalls/store/sync_listing.md)
- [`store.list_reviews`](../syscalls/store/list_reviews.md)
- [`store.reply_review`](../syscalls/store/reply_review.md)

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
