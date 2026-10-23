# Kernel: system

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

The internal system calls Login needs before anyone is logged in. The Kernel
accepts them only from the Gateway, with the actor "gateway". The Directory,
[Accounts](../accounts/README.md) and [Sessions](../sessions/README.md) do the
work: the Directory first says which business, then everything happens in that
business's slots.
They are never offered to the app, the AI or outside callers, and they are
checked, limited and audited like any other call.

| System call | Does |
|-------------|------|
| `system.find_business` | The business of an email, a Google ID or a handle (`mona@nova`), from the Directory |
| `system.find_account` | The account in that business for an email, a Google ID or a username |
| `system.start_signup` | A sign-up waiting in the Directory: scrambled email, code, expiry |
| `system.create_business` | In one transaction: the business in the Directory, its slots, the owner's account and its log-in row |
| `system.create_account` | A member in a business (from an invite, or made by the owner with a first password) |
| `system.check_password` | Checks a password; counts wrong tries and locks |
| `system.set_password` | Sets or changes a password |
| `system.create_code` | A new email code, stored only as its hash |
| `system.check_code` | Checks a code; counts tries |
| `system.start_session` | A new session for a device, in the account's business; the token names that business |
| `system.check_session` | The account and role behind a token, looked up only in the token's business, or none |
| `system.end_session` | Ends one session, or all the others |
| `system.send_mail` | Sends a code or a notice through the [mail driver](../drivers/mail/README.md) |

Their pages will be in [contracts/syscalls/system](../../contracts/syscalls/system/README.md).
Not built yet; today Login does these steps itself.

Has its own tests.
