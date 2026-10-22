# System driver: mail

Sends the system's own emails from our own address: sign-in codes, log-in
notices, and later invites and alerts to owners and staff. In tests and when
`MAIL_MODE=log`, it writes the mail to the log instead of sending it.

Today Login calls it directly; it moves behind `system.send_mail` when the
Kernel's call is built.

Has its own tests (through the log-in tests).
