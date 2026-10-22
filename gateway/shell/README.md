# Gateway: Shell

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

The only door into the Kernel. For every command (system call) that comes in,
from any door or from [Login](../login/README.md):

1. Checks the credential: the session cookie, the AI's token and who it acts
   for, an API key, or the secret an outside service sends with its webhook
2. Reads the command and checks its inputs have the right shape
3. Signs a **Pass** for that one call: account, business, actor, expiry
4. Hands it to the Kernel, and the answer back to the caller

It answers "who is sending this command, and for which business?" on every
call. It never reads or writes data: checking a session is itself a call to
the Kernel (`system.check_session`).

Not built yet; today the routes check the session themselves.
