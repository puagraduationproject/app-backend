# Kernel: system

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

The internal system calls Login needs before anyone is logged in. The Kernel
accepts them only from the Gateway, with the actor "gateway" and no business.
They are never offered to the app, the AI or outside callers, and they are
checked, limited and audited like any other call.

| System call | Does |
|-------------|------|
| `system.find_account` | The account for an email, if there is one |
| `system.create_account` | A new account |
| `system.check_password` | Checks a password; counts wrong tries and locks |
| `system.set_password` | Sets or changes a password |
| `system.create_code` | A new email code, stored only as its hash |
| `system.check_code` | Checks a code; counts tries |
| `system.start_session` | A new session for a device |
| `system.check_session` | The account behind a session key, or none |
| `system.end_session` | Ends one session, or all the others |
| `system.send_mail` | Sends a code or a notice through the [mail driver](../drivers/mail/README.md) |

Their pages will be in [contracts/syscalls/system](../../contracts/syscalls/system/README.md).
Not built yet; today Login does these steps itself.

Has its own tests.
