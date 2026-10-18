# Module: Marketing

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 13. When the design changes, this page changes with it.

Offers and campaigns, measured in pounds (term 2).

Its tools are its only public face. It never writes another module's tables;
it emits events and reads other modules through their services.

Every area folder holds the same parts. File names and extensions follow the
stack once it is chosen:

| Part | Holds |
|------|-------|
| `tools` | One handler per tool page; checks inputs, calls the service, returns the output |
| `service` | The area's rules; the only code that changes its data |
| `data` | Access to the area's own tables, in the module's own schema |
| `listeners` | Handlers for events from other modules |
| `tests` | The area's own tests: every tool, every rule |

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

## Tools (6)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`marketing.list_offers`](../../contracts/tools/marketing/list_offers.md) | Current and past offers | R | `marketing` | 2 |
| [`marketing.create_offer`](../../contracts/tools/marketing/create_offer.md) | Discount or bundle with dates and hours | W | `marketing` | 2 |
| [`marketing.end_offer`](../../contracts/tools/marketing/end_offer.md) | End early | W | `marketing` | 2 |
| [`marketing.create_campaign`](../../contracts/tools/marketing/create_campaign.md) | Draft: segment, offer, message, channels | W | `marketing` | 2 |
| [`marketing.send_campaign`](../../contracts/tools/marketing/send_campaign.md) | Send to the segment, consent checked | W | `marketing` | 2 |
| [`marketing.get_campaign_results`](../../contracts/tools/marketing/get_campaign_results.md) | Reach, orders, money earned | R | `marketing` | 2 |
