# Platform

Shared parts every module stands on. No business rules live here.

- [`tenancy`](tenancy/README.md): Every call runs inside one business; sets the row-level security context
- [`auth`](auth/README.md): Sign up, log in, sessions, lock-out
- [`permissions`](permissions/README.md): One check for every tool, for the app and the AI alike: role, pack, face, AI setting
- [`packs`](packs/README.md): Essentials and the packs on for this business; needs, turning on and off (design 7.3)
- [`tool-registry`](tool-registry/README.md): Loads the tool pages from contracts; filters by pack, role and face; serves `ai.find_tools`
- [`context`](context/README.md): Business, actor, correlation ID and retry key on every call and event (design 2.6)
- [`audit`](audit/README.md): An audit row on every write, by people and by the AI
- [`events`](events/README.md): Outbox, dispatcher, retries, listener registry
- [`scheduler`](scheduler/README.md): Time-based events: expiring stock, quiet regulars, morning briefing, scheduled posts
- [`idempotency`](idempotency/README.md): A retried call writes once
- [`undo`](undo/README.md): Runs a tool's undo from the audit log
- [`dry-run`](dry-run/README.md): Runs tools with no real writes, for skill test runs
- [`numbering`](numbering/README.md): Per-business numbers people read: order #1042, purchase #33
- [`money`](money/README.md): Whole piastres plus currency; never floats
- [`errors`](errors/README.md): Error codes from contracts/errors, never message text
- [`streaming`](streaming/README.md): Relays the AI's streamed answer to the app
- [`realtime`](realtime/README.md): Live updates: orders board, inbox, stock
