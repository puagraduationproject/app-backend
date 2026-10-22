# app-backend

The backend of the project: an operating system for a business, driven by the
AI. One backend made of strict modules (ERP, CRM, Channels, ...) and one
database. Its only door is its **system calls**: the staff app (`app-web`), the
AI (`app-ai-agent`) and later outside websites all use the same system calls,
with the same checks and the same audit.

- The **Gateway** takes every request: the doors, **Login** (sign up, log in,
  sessions) and the **Shell**, the only door into the Kernel, which checks
  each command and signs a **Pass**
- The **Kernel** runs five checks and then the system call. It is the only
  part that reads and writes data, and the only one that uses drivers, even
  for log-in and the system's own email. It asks the **Index** (whose is
  it?), the **OGR** (what is it linked to?) and the **Registry** (which call?)
- The **Daemons** always run: events, jobs, retries
- The **modules** bring their data, system calls and rules; their **drivers**
  talk to outside services (Telegram, Meta, payments)

How they fit is in [rules/parts.md](rules/parts.md).

The design is in
[technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md).
This repo follows it; when the design changes, this repo changes with it.

The stack is agreed (design section 22, can change later): TypeScript on
Node 22, Fastify, Kysely, plain SQL migrations per module schema, PostgreSQL 16
with row-level security, pg-boss, JSON Schema contracts, Vitest. Folders hold
their pages now; code follows the pages.

## The other repos

| Repo | Holds | Reads from here |
|------|-------|-----------------|
| `app-web` | Staff app, shop pages, landing page | `contracts/` (system calls, cards, values, errors) |
| `app-ai-agent` | The AI layer: faces, jobs, planner, skills | `contracts/` (system calls, events, packs, training) |
| `app-ai-model` | Training, test set, results, serving | `contracts/` (system calls, training), `fake/`, `database/seeds/` |

## Structure

```
app-backend/
├── README.md
├── rules/                      one page each: parts, architecture, modules, system calls,
│                               events, contracts
├── contracts/                  the backend's promise to everyone else (design 4.4)
│   ├── syscalls/               one reference page per system call, one folder per module (164)
│   │   ├── core/ (12)  erp/ (54)  crm/ (31)  channels/ (12)  store/ (10)
│   │   ├── studio/ (10)  marketing/ (6)  team/ (10)  reports/ (5)  ai/ (12)
│   │   └── ogr/ (2)
│   ├── packs/                  essentials and one page per pack (30)
│   ├── events/                 the envelope and one page per event (42)
│   ├── cards/                  one page per card (10)
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
│   │                           core, ogr, erp, crm, channels, store, studio, marketing, team,
│   │                           reports, ai
│   └── seeds/                  invented demo coffee shop and small market
├── gateway/                    mode 1: everything that comes in
│   ├── doors/                  app, ai, public, outside (term 2)
│   ├── login/                  sign up, log in, codes, sessions; asks the Kernel (system.*)
│   ├── shell/                  the only door into the Kernel: checks each command, signs the Pass
│   ├── streaming/  realtime/
│   └── server.ts               starts the program and puts the doors together
├── kernel/                     mode 0: the only part that reads and writes data and uses drivers
│                               call, checks, tenancy, context, index, ogr, syscall-registry,
│                               approvals, system (internal calls for Login), drivers (mail,
│                               files), audit, outbox, idempotency, undo, dry-run,
│                               numbering, money, errors
├── daemons/                    always running: events, jobs, retries
├── modules/                    one folder per module; each area has system calls, service,
│   │                           data, listeners, tests
│   ├── ai/                     the AI module: memory, skills, schedules, the AI action log
│   ├── core/                   business profile, notifications
│   ├── erp/                    catalog, orders, payments, sales-screen, shifts, stock,
│   │                           recipes, purchasing, credit, expenses, drivers
│   ├── crm/                    customers, identities, timeline, loyalty, support, bookings,
│   │                           engagement, segments
│   ├── channels/               inbox, conversations, messages, auto-replies, drivers
│   ├── store/                  site, search-presence, drivers
│   ├── studio/                 drivers
│   ├── marketing/
│   ├── team/
│   └── reports/
├── deploy/                     the test setup: our router (port 11000, owns every path) and
│                               the compose file; real settings are never in the repo
├── fake/                       answers every system call from its page's examples and the seeds
└── tests/                      isolation, schema-users, roles, syscalls, pages, packs, undo,
                                order-flow, processes, rebuild; login and index tests
```

## How work happens here

1. **Page first.** A system call, an event or a card is written in `contracts/` before
   any code. The frontend and the AI team build on the page
2. **The page and the code never differ.** The `pages` tests check every system call
   against its page
3. **Never break a caller.** Adding is free; a breaking change is a new version,
   and the old one keeps working for at least one term
4. **Announce before merging.** Every change goes in `contracts/changes/` and is
   announced to the frontend and AI teams first
5. **Stay in your module.** A module writes only its own schema, publishes its
   system calls, emits events, and reads others through their services
6. **Only the Kernel touches the data.** A module's code runs inside the
   Kernel's transaction; it never opens the database itself

Start with [rules/](rules/README.md), then [contracts/](contracts/README.md).

## Asking other teams

Requests between teams live in the `team-handoffs` repo, never in chats alone:

- **We need something from frontend** (a screen, texts, a card): a request in
  `fullstack-security/frontend/requests/FE-<number>-<name>.md`, from
  `templates/request.md`, with `from: backend`. It lists the screens, every
  text (Arabic first), the error codes, the system calls and cards involved (linked to
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
