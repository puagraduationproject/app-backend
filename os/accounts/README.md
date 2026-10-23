# OS: Accounts

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) sections 2.9 and 7.6. When the design changes, this page changes with it.

The people of each business, kept in that business's own slot of the
[`accounts` schema](../../database/migrations/accounts/README.md): username,
role, password, the second step, lock-out, each account's log-in methods
(email, Google) and the pending invites.

**One log-in, one business.** An account belongs to one business. Its log-in
name is `username@handle` (`mona@nova`), made by the system. An email is
optional for staff and needed for the owner (or Google). An email or Google
ID already used by any business is refused with `email_in_other_business`,
checked in the [Directory](../directory/README.md)'s `login` table.

Asked by the Kernel at log-in, and when a log-in method, a role or a member
changes:

| Change | What happens |
|--------|--------------|
| Owner makes a member with no email | `mona@nova` with a first password; she must change it at her first log-in; the owner resets it |
| Invite by email | Refused at once if another business has the email. Several businesses may invite a free email; the first accepted wins |
| Email or Google changed | The new value is checked in the Directory; a code to the new email, a notice to the old; one transaction changes the account and its `login` row; the other sessions end |
| Role changed, member removed | Tells the Kernel; the Kernel has [Sessions](../sessions/README.md) replace or end that account's sessions |

Not built yet; today's accounts are in `core.account` and `core.membership`.
