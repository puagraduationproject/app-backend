# Shared IDs

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.4. When the design changes, this page changes with it.

Each module builds its own part with its own tools. What holds them together is
that every shared thing has **one owner and one ID**, and every other module
stores only that ID.

| Thing | Owner | ID | Used by |
|-------|-------|----|---------|
| Business | Core | `business_id` | Every module, every table |
| Member (a person in the business) | Core | `membership_id` | ERP (shifts, sales), Team, Channels (assigned to), audit |
| Location (branch) | Core | `location_id` | ERP, Team, Store |
| **Customer** | CRM | `customer_id` | ERP (orders, credit), Channels (conversations), Marketing (sends), Store (orders), AI (memory notes) |
| Item and variant | ERP | `item_id`, `variant_id` | Store (menu), Studio (designs), Marketing (offers), CRM (usual order) |
| Order | ERP | `order_id`, shown as `#1042` | CRM (cases, timeline), Channels (notifications), Marketing (results) |
| Conversation | Channels | `conversation_id` | CRM (cases), AI (who it is talking to) |
| Design, post | Studio | `design_id`, `post_id` | Channels (publishing), Store (site images), Marketing (campaigns) |

The ID types, money, times, statuses and the event envelope are defined once in
the contracts, so every module, the app and the AI use exactly the same shapes.
