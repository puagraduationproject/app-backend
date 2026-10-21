# Gateway (mode 1)

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

Everything that comes in. The Gateway asks every caller who they are, then
hands the call to the Kernel with a Pass. It never reads or writes business
data.

- [`doors`](doors/README.md): one system call API, four doors: app, ai, public, outside
- [`shell`](shell/README.md): who are you: sign up, log in, sessions, lock-out; owns the
  users section; signs the Pass
- [`streaming`](streaming/README.md): relays the AI's streamed answer to the app
- [`realtime`](realtime/README.md): live updates: orders board, inbox, stock
- `server.ts`: starts the program and puts the doors together

## The Pass

The Shell signs a Pass for one call. The Kernel takes no call without one.

| Field | What |
|-------|------|
| `account_id` | Who is calling |
| `business_id` | Which business the call is for |
| `actor` | A member, the AI (and who it acts for), the system, or a customer |
| `expires_at` | When it stops being valid |
