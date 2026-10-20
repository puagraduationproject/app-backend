# app-backend

The backend of the project: an open ERP and CRM whose only door is its tools.
One backend made of strict modules, one database with one schema per module.
The staff app (`app-web`), the AI layer (`app-ai-agent`) and later outside
websites all use the same tools, with the same permissions and the same audit.

The design is in
[technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md).
This repo follows it; when the design changes, this repo changes with it.

The stack is not chosen yet. Folders hold their pages now; code comes once the
structure is final and the team picks the stack.

## The other repos

| Repo | Holds | Reads from here |
|------|-------|-----------------|
| `app-web` | Staff app, shop pages, landing page | `contracts/` (tools, cards, values, errors) |
| `app-ai-agent` | The AI layer: faces, jobs, planner, skills | `contracts/` (tools, events, packs, training) |
| `app-ai-model` | Training, test set, results, serving | `contracts/` (tools, training), `fake/`, `database/seeds/` |

## Structure

```
app-backend/
├── README.md
├── rules/                      one page each: architecture, modules, tools, events, contracts
├── contracts/                  the backend's promise to everyone else (design 4.4)
│   ├── tools/                  one reference page per tool, one folder per module (161)
│   │   ├── core/ (12)  erp/ (54)  crm/ (31)  channels/ (12)  store/ (10)
│   │   └── studio/ (10)  marketing/ (6)  team/ (10)  reports/ (5)  ai/ (9)
│   ├── packs/                  essentials and one page per pack (30)
│   ├── events/                 the envelope and one page per event (42)
│   ├── cards/                  one page per card (9)
│   ├── values/                 IDs, money, order statuses, roles, channels, payment methods,
│   │                           AI permission settings
│   ├── errors/                 error codes
│   ├── limits/                 shared limits
│   ├── training/               the training example format (owned by the AI team)
│   └── changes/                every change, announced before merging
├── config/                     settings read once at start; example file only
├── templates/                  coffee-shop, small-market: packs on, fields, stages, AI defaults
├── database/
│   ├── migrations/             one folder per schema, with its tables:
│   │                           core, erp, crm, channels, store, studio, marketing, team,
│   │                           reports, ai
│   └── seeds/                  invented demo coffee shop and small market
├── platform/                   shared parts, no business rules:
│                               tenancy, auth, permissions, packs, tool-registry, context,
│                               audit, events, scheduler, idempotency, undo, dry-run,
│                               numbering, money, errors, streaming, realtime
├── api/                        one tool API, four doors: app, ai, public, outside
├── modules/                    one folder per module; each area has tools, service, data,
│   │                           listeners, tests
│   ├── core/
│   ├── erp/                    catalog, orders, payments, sales-screen, shifts, stock,
│   │                           recipes, purchasing, credit, expenses, adapters
│   ├── crm/                    customers, identities, timeline, loyalty, support, bookings,
│   │                           engagement, segments
│   ├── channels/               inbox, conversations, messages, auto-replies, adapters
│   ├── store/                  site, search-presence, adapters
│   ├── studio/                 adapters
│   ├── marketing/
│   ├── team/
│   └── reports/
├── fake/                       answers every tool from its page's examples and the seeds
└── tests/                      isolation, schema-users, roles, tools, pages, packs, undo,
                                order-flow, processes, rebuild
```

## How work happens here

1. **Page first.** A tool, an event or a card is written in `contracts/` before
   any code. The frontend and the AI team build on the page
2. **The page and the code never differ.** The `pages` tests check every tool
   against its page
3. **Never break a caller.** Adding is free; a breaking change is a new version,
   and the old one keeps working for at least one term
4. **Announce before merging.** Every change goes in `contracts/changes/` and is
   announced to the frontend and AI teams first
5. **Stay in your module.** A module writes only its own schema, publishes its
   tools, emits events, and reads others through their services

Start with [rules/](rules/README.md), then [contracts/](contracts/README.md).

## Asking other teams

Requests between teams live in the `team-handoffs` repo, never in chats alone:

- **We need something from frontend** (a screen, texts, a card): a request in
  `fullstack-security/frontend/requests/FE-<number>-<name>.md`, from
  `templates/request.md`, with `from: backend`. It lists the screens, every
  text (Arabic first), the error codes, the tools and cards involved (linked to
  their pages here), and example responses so frontend can build before the
  real API is ready. The same way for security (`SEC-`) and the AI teams
  (`AGT-`, `DATA-`)
- **Others need something from us:** their requests are in
  `fullstack-security/backend/requests/` (`BE-`). We set the status
- After a request is pushed, send its link on WhatsApp or Discord. Changes are
  edited in the file, with a line under Changes saying who agreed
- When frontend delivers in `app-web`, the backend team deploys it with the
  backend

## Never in this repo

No server information: no IP addresses, server names, hosting providers, test
or deploy addresses, server users, folders or setup, and no keys, tokens or real
settings. One exception: the port numbers the project's own parts use may be
written down, never next to the server they run on. The full rule is in the
[project README](https://github.com/puagraduationproject/graduationproject#never-in-any-repo).
If one is pushed by mistake, it is removed from the history.
