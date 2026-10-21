# Migrations

One folder per schema. Only the Kernel opens the database; for each system
call it switches to the owning module's database user, which has rights only on
its own schema. Migrations run in order and are never edited after they run.

core, ogr, erp, crm, channels, store, studio, marketing, team, reports, ai

The five sections of the design (2.9) and where they are today:

| Section | Owner | Schema |
|---------|-------|--------|
| users | Shell | `core` (accounts, sessions, sign-in codes); its own schema later |
| where | Index | `core` (businesses, members, roles, locations, packs) |
| links | OGR | `ogr` |
| system | Kernel and Daemons | `core` (audit log, outbox); the jobs library's tables |
| data | each module | one schema per module |
