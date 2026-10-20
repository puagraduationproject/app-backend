# Door: app

| | |
|-|-|
| Who calls | Logged-in members, by session |
| Sees | Relays the owner's chat to the AI layer; every tool the member's role allows |

Same tools as every other door; same permissions and audit.

## Setup routes (design 7.7)

| Route | Input | Output |
|-------|-------|--------|
| `GET /api/app/businesses` | (logged in) | `businesses`: the person's businesses |
| `GET /api/app/handles/:handle` | (logged in) | `handle`, `available`, `reason`: `invalid`, `reserved`, `taken` or null |
| `POST /api/app/businesses` | `name`, `handle`, `business_type` (`coffee_shop`, `restaurant`, `bakery`, `small_market`, `pharmacy`, `clothing`, `electronics`, `beauty`, `services`, `online`, `other`), `team_size` (`alone`, `team`), `your_name` (needed when the account has no name) | `201`, `business` |

A business is shown as `{ name, handle, business_type, team_size, role, username, display_name }`,
never with its internal ID; the handle names it. Errors: `not_logged_in`,
`invalid_input` (`field`), `handle_taken`, `limit_reached` (5 businesses per account).

For now `business_type` is only a name: it links no template and turns nothing
on, until the team decides what each type means.

Creating a business writes the business, the owner's membership
(`username@handle`: the username is the first name in Latin letters, or the email before the `@` when there is none), an audit row and the `BusinessCreated` event, in one
transaction.
