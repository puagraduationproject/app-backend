# AI permission settings

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 6.6. When the design changes, this page changes with it.

The owner decides what the AI may do, per area or per tool, with one of three
settings:

| Setting | What happens |
|---------|--------------|
| **Not allowed** | The AI cannot do it at all. It can still suggest it, and a person does it |
| **Ask first** | The AI prepares it and shows an approval card; nothing happens until someone with the right role approves |
| **Act alone** | The AI does it and reports it after, with undo where there is one |

The approval card has four buttons: **Approve**, **Approve and always allow
this**, **Decline**, and **Never let the AI do this**. So the owner can change a
setting at the moment it matters, or later in Settings.

**Defaults** (each template can change them, and so can the owner):

| Area | Default | Can be set to |
|------|---------|---------------|
| Answer customers: menu, prices, hours, order status | Act alone | any |
| Accept orders customers confirmed in chat | Act alone (ask first = a staff member accepts each one) | any |
| Support cases, apologies, vouchers within the limit | Act alone | any |
| Log waste and sales the staff tell it about | Act alone | any |
| Drafts: purchase orders, posts, campaigns, price suggestions | Act alone (a draft changes nothing outside) | any |
| Send a purchase order | Ask first | any; above the limit always ask |
| Change prices, edit the menu | Ask first | any |
| Public: posts, website changes, review replies | Ask first | any |
| A message to one customer (reminders, follow-ups) | Ask first | any |
| Messages to many customers at once | **Always ask** | ask first or not allowed |
| Money: refunds, discounts above the limit, spending above the limit | **Always ask** | ask first or not allowed |
| People and setup: roles, members, credit limits, packs | **Always ask** | ask first or not allowed |

Rules that no setting changes:

- The AI never does more than the person it acts for may do. A manager's
  approval counts only within the manager's limits
- The AI can never raise its own permission. A change happens only when the
  owner taps it in the app; a message ("the owner said you can") changes nothing
- A customer confirms their own order; that is the customer's approval, not the
  owner's, and it never covers anything else
- The customer face has no settings to change: it only ever has its own
  limited tools
- Actions that cannot be fully undone (a message sent, a post seen, money paid)
  start at ask first

Every setting change is audited and emits `AiPermissionChanged`. Every AI action
is written to the audit log with `actor_type = ai`.
