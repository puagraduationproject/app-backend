# Migrations

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.3. When the design changes, this page changes with it.

One folder per schema. Only the Kernel opens the database; for each system
call it sets the business and switches to the owning module's database user,
which has rights only on its own schema. Migrations run in order and are never
edited after they run.

## The grid

The database is a grid. The **columns** are the parts, each a schema. The
**rows** are the businesses: every schema except `directory` is split by
business ID (PostgreSQL `PARTITION BY LIST (business_id)`), one slot per
business. The code sees one table, `erp.order`; business 1042's rows sit in
their own slot.

| Schema | Part | Split by business |
|--------|------|:-----------------:|
| [`directory`](directory/README.md) | Directory: each business and where it lives, each log-in's business, sign-ups | no |
| [`accounts`](accounts/README.md) | Accounts | yes |
| [`sessions`](sessions/README.md) | Sessions | yes |
| [`kernel`](kernel/README.md) | The Kernel's own records | yes |
| [`core`](core/README.md) | Core: each business's profile, roles, locations, packs on, AI settings, entry rules, audit log, outbox, numbering | yes |
| `ogr`, `erp`, `crm`, `channels`, `store`, `studio`, `marketing`, `team`, `reports`, `ai` | the OGR and the modules | yes |

Rules for every split table:

- `business_id` is the first column of the primary key and of every link:
  `PRIMARY KEY (business_id, id)`, `FOREIGN KEY (business_id, order_id)`. A row
  can never point into another business
- Row-level security on the parent table, on top of the split
- A business gets only the slots it uses: Accounts, Sessions, Kernel and Core
  when it is made, a module's slots when its pack is turned on
- A value unique across all businesses cannot be checked inside a slot; that
  is why each email and Google ID is kept in `directory.login`
- A migration changes the parent table, so every slot changes at once
- Past about 500 businesses, the split moves to a fixed number of hash slots,
  each holding several businesses; the code does not change. A large business
  can later move to its own database; `directory.business.home` says where

## Today

Today's tables are all in [`core`](core/README.md), not split yet: `account`,
`email_code`, `auth_ticket`, `session`, `setup_step`, `business`,
`membership`, `location`, plus the audit log and the outbox. They move to the
grid in the next build step.
