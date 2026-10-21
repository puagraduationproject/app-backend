# Changes

Every change to a system call, an event, a card, a pack or a value, newest first.
Written and announced to all subteams **before** the change is merged.

| Date | What changed | Why | Breaking? | Old version kept until |
|------|--------------|-----|:---------:|------------------------|
| 2026-10-21 | Setup: `city` and `area` make the business's first location (`core.location`), `cities` in `GET /api/app/setup`; `team_size` is optional and null when not given; `location` in `BusinessCreated`; `POST /api/app/setup/steps` and the view `core.setup_funnel`; `POST /api/auth/language` | "Where is it?" replaces "Who works in it?"; see where people stop; setup starts with the language (ALL-002 4.1, 5.2, 5.3, 5.6) | no for callers; `team_size` in the event can now be null, and nothing listens to it yet | |
| 2026-10-21 | `GET /api/app/names`: the handle suggested from the business name (Arabic in Latin letters) and the person's username; more reserved handles: future paths and brands | An Arabic name gave an empty handle box; anyone could register a chain's name (ALL-002 2.2, 2.4) | no | |
| 2026-10-21 | `POST /api/app/businesses`: optional `idempotency_key`; the 5-business limit answers `business_limit` (403) instead of `limit_reached` (429) | A lost reply made people create a second business; "Too many tries, please wait" was wrong for a limit that waiting never lifts (ALL-002 3.2, 3.3) | yes for the limit's code; only our setup page reads it, and it changes in the same release | |
| 2026-10-21 | Business setup: six kinds (`coffee_shop`, `small_market`, `grocery`, `bakery`, `restaurant`, `other`); `template_key` set from the kind; `sells` on the business and in `BusinessCreated`; `GET /api/app/setup` | Remarks on the first deploy (team-handoffs ALL-002 1.1 to 1.4, 4.2 to 4.4, 5.4) | yes for `business_type`: the removed kinds are refused. Only our setup page sends it, and it changes in the same release | |
| 2026-10-21 | Tools are now **system calls**: `contracts/tools/` is `contracts/syscalls/`, and `ai.find_tools` is `ai.find_syscalls`. Adapters are now **drivers** | The design calls the backend an operating system for a business (2.9) | no: every page is still a draft, version 0, and nothing calls them yet | |
| 2026-10-19 | First draft of all pages from the design | Start | no | |
