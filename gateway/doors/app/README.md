# Door: app

| | |
|-|-|
| Who calls | Logged-in members, by session |
| Sees | Relays the owner's chat to the AI layer; every system call the member's role allows |

Same system calls as every other door; same permissions and audit.

## Setup routes (design 7.7)

| Route | Input | Output |
|-------|-------|--------|
| `GET /api/app/setup` | (logged in) | `business_types`: `{ key, ready }` in the order to show them; `ready` is true when the kind starts from a template |
| `GET /api/app/businesses` | (logged in) | `businesses`: the person's businesses |
| `GET /api/app/handles/:handle` | (logged in) | `handle`, `available`, `reason`: `invalid`, `reserved`, `taken` or null |
| `POST /api/app/businesses` | `name`, `handle`, `business_type` (`coffee_shop`, `small_market`, `grocery`, `bakery`, `restaurant`, `other`), `sells` (optional, up to 120 characters: what they sell, asked after "Something else"), `team_size` (`alone`, `team`), `your_name` (needed when the account has no name) | `201`, `business` |

A business is shown as `{ name, handle, business_type, sells, team_size, role, username, display_name }`,
never with its internal ID; the handle names it. Errors: `not_logged_in`,
`invalid_input` (`field`), `handle_taken`, `limit_reached` (5 businesses per account).

## Kinds of business and their templates

A short list to start with, grown as templates are built (ALL-002 1.2). A kind
with a template starts from it (design 7.2); the rest start with the essentials
only, and the app says so.

| `business_type` | Template (`template_key`) |
|-----------------|---------------------------|
| `coffee_shop` | `coffee_shop` |
| `small_market` | `small_market` |
| `grocery` | `small_market` (one template; packs will differ, ALL-002 open question) |
| `bakery`, `restaurant`, `other` | none yet |

Businesses made before 2026-10-21 with a kind that was removed (`pharmacy`,
`clothing`, `electronics`, `beauty`, `services`, `online`) are now `other`,
with what they picked kept in `sells`.

Creating a business writes the business, the owner's membership
(`username@handle`: the username is the first name in Latin letters, or the email before the `@` when there is none), an audit row and the `BusinessCreated` event, in one
transaction.
