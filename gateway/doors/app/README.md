# Door: app

| | |
|-|-|
| Who calls | Logged-in members, by session |
| Sees | Relays the owner's chat to the AI layer; every system call the member's role allows |

Same system calls as every other door; same permissions and audit.

## Setup routes (design 7.7)

| Route | Input | Output |
|-------|-------|--------|
| `GET /api/app/setup` | (logged in) | `business_types`: `{ key, ready }` in the order to show them; `ready` is true when the kind starts from a template. `cities`: the city keys for "Where is it?", in the order to show them |
| `POST /api/app/setup/steps` | (logged in) `step`: `language`, `your_name`, `business_name`, `business_type`, `location`, `done` | `recorded: true`. The app sends each step when it is shown; only the first time counts |
| `GET /api/app/businesses` | (logged in) | `businesses`: the person's businesses |
| `GET /api/app/handles/:handle` | (logged in) | `handle`, `available`, `reason`: `invalid`, `reserved`, `taken` or null |
| `GET /api/app/names?name=&your_name=` | (logged in) `name`: the business name typed so far; `your_name` (optional): the person's name, when the account has none yet | `handle` (suggested from the name), `available`, `reason` (as above), `username` (the person's username in the new business, so the app can show `username@handle`) |
| `POST /api/app/businesses` | `name`, `handle`, `business_type` (`coffee_shop`, `small_market`, `grocery`, `bakery`, `restaurant`, `other`), `sells` (optional, up to 120 characters: what they sell, asked after "Something else"), `city` and `area` (optional, both or neither: `city` is one of the `cities`, `area` up to 60 characters), `team_size` (optional, `alone` or `team`; no longer asked), `your_name` (needed when the account has no name), `idempotency_key` (a uuid, one per setup; see below) | `201`, `business` |

A business is shown as `{ name, handle, business_type, sells, team_size, role, username, display_name }`,
never with its internal ID; the handle names it. Errors: `not_logged_in`,
`invalid_input` (`field`), `handle_taken`, `business_limit` (the account already
has 5 businesses; 403).

**Retries (design 2.1).** The app makes one `idempotency_key` when setup starts
and sends it with every try. When a try with the same key already made a
business for this account, the answer is that business (`201`, the same body),
even if the handle or other fields changed since: the reply was lost, not the
business. Two tries at the same moment also make one business. Without a key,
every try is a new business.

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
(`username@handle`: the username is the first name in Latin letters, or the email before the `@` when there is none), its first location (from `city` and `area`; named like the business), an audit row and the `BusinessCreated` event, in one
transaction.

`team_size` is null for a business made after 2026-10-21: "Who works in it?" is
no longer asked (ALL-002 4.1).

## Where people stop

`POST /api/app/setup/steps` records, per account, the first time each step was
reached. The numbers are in the view `core.setup_funnel` (step, `position`,
`accounts`, `median_seconds` from the account's first step), read straight from
the database for now. The table belongs to the [Shell](../../shell/README.md):
there is no business yet.

## Handles

**From the name.** `GET /api/app/names` makes the handle from the business
name, in one place (`kernel/index/businesses/names.ts`) so the app, the AI and
imports all get the same answer. Arabic is written in Latin letters the way
Egyptians write names in chats (`كافيه النيل` gives `kafeh-elnil`); Latin
letters lose their accents (`Nova Café` gives `nova-cafe`). When the name gives
fewer than 3 characters, the handle is `shop-` and four digits, the same digits
for the same name. The owner can always change it before the business is made.

**Reserved** (`kernel/index/businesses/reserved.ts`), answered as `reserved`:

- our own words: the app's pages and paths (`login`, `setup`, `api`, ...)
- paths we will need later: `menu`, `order`, `pay`, `checkout`, `invite`,
  `join`, `faq`, `legal`, `verify`, `official`, `telegram`, `whatsapp`, ...
- known chains and brands in Egypt (`starbucks`, `costa`, `cilantro`,
  `seoudi`, `carrefour`, `talabat`, `fawry`, ...): only names that are a brand
  first, so a café can still be called "Panda" or "Metro"
- our own brand name, once the team picks it

**Report and reclaim** (a draft; SEC or BE will own it, ALL-002 open question):

1. Someone who thinks a handle uses their name writes to us with the handle and
   proof: a trademark, a commercial register entry, or the brand's official
   page
2. We look within 7 days. The business keeps working meanwhile
3. If the claim holds, we tell the owner first and give them 7 days to pick a
   new handle; then the old one moves to the brand, or is reserved
4. We write down every claim and what was decided, and add the brand to the
   reserved list
