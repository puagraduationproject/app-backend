# Kernel: drivers

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

The system's own drivers. They use our settings, never a business's, and only
the Kernel uses them. Module drivers (Telegram, Meta, payments) live in their
module's `drivers/` folder.

| Driver | Used for | Term |
|--------|----------|:----:|
| [`mail`](mail/README.md) | Sign-in codes, log-in notices, invites, alerts to owners and staff | 1 |
| `files` | Photos and uploads: menu photos, logos, invoices | 1 |
| `push` | Notifications to the mobile app | 2 |
| `sms` | Codes by phone | 2 |

Login sends a code with `system.send_mail`. Anything else that emails a member
calls `core.notify`, and the Daemons send it, with retries. A message to a
**customer** never uses these: it comes from the business, through Channels.
