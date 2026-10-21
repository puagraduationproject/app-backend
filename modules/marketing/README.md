# Module: Marketing

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 13. When the design changes, this page changes with it.

Offers and campaigns, measured in pounds (term 2).

Its system calls are its only public face. It never writes another module's tables;
it emits events and reads other modules through their services.

Every area folder holds the same parts. File names and extensions follow the
stack once it is chosen:

| Part | Holds |
|------|-------|
| `syscalls` | One handler per system call page; checks inputs, calls the service, returns the output |
| `service` | The area's rules; the only code that changes its data |
| `data` | Access to the area's own tables, in the module's own schema |
| `listeners` | Handlers for events from other modules |
| `tests` | The area's own tests: every system call, every rule |

## Data (schema `marketing`)

```
offer            id, business_id, name, rules(jsonb), starts_at, ends_at, status
campaign         id, business_id, name, segment_id, offer_id, message, channels,
                 status(draft|approved|sending|done), scheduled_at
campaign_send    id, campaign_id, customer_id, channel, status, sent_at
```

## Events

- **Emits:** CampaignSent, OfferStarted
- **Listens to:** CustomerForgotten, CustomerMerged, OrderCompleted

## System calls (6)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`marketing.list_offers`](../../contracts/syscalls/marketing/list_offers.md) | Current and past offers | R | `marketing` | 2 |
| [`marketing.create_offer`](../../contracts/syscalls/marketing/create_offer.md) | Discount or bundle with dates and hours | W | `marketing` | 2 |
| [`marketing.end_offer`](../../contracts/syscalls/marketing/end_offer.md) | End early | W | `marketing` | 2 |
| [`marketing.create_campaign`](../../contracts/syscalls/marketing/create_campaign.md) | Draft: segment, offer, message, channels | W | `marketing` | 2 |
| [`marketing.send_campaign`](../../contracts/syscalls/marketing/send_campaign.md) | Send to the segment, consent checked | W | `marketing` | 2 |
| [`marketing.get_campaign_results`](../../contracts/syscalls/marketing/get_campaign_results.md) | Reach, orders, money earned | R | `marketing` | 2 |
