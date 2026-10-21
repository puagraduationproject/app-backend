# Gateway: Shell

Who are you: sign up, log in and sessions (design 7.6). It owns the users
section (accounts, sessions, sign-in codes; today in the `core` schema) and
signs the Pass the Kernel needs for every call. It never reads or writes
business data.

Has its own tests.

## Routes (app door, `/api/auth/`)

| Route | Input | Output |
|-------|-------|--------|
| `POST /api/auth/start` | `email` | `next`: `code` (a code was sent), `password` (the account has one), or `google` (Google-only account; a code can still be asked for) |
| `POST /api/auth/code/send` | `email` | `sent: true`, `retry_after_seconds` |
| `POST /api/auth/code/verify` | `email`, `code` | `ticket`, `needs_password` (true when the account has no password yet), `account` |
| `POST /api/auth/password/set` | `ticket`, `password` | `account`; logs in; logs out every other device |
| `POST /api/auth/password/login` | `email`, `password` | `account`; logs in |
| `POST /api/auth/password/change` | `old_password`, `new_password` (logged in) | `account`; logs out every other device |
| `GET /api/auth/google/start` | | Redirect to Google |
| `GET /api/auth/google/callback` | from Google | Redirect to `/account#ticket=...` |
| `POST /api/auth/ticket` | `ticket` | `account`, `needs_password`; uses the ticket and logs in |
| `GET /api/auth/me` | (logged in) | `account` |
| `POST /api/auth/logout` | | `logged_out: true` |
| `GET /api/auth/sessions` | (logged in) | `sessions`: `{ id, browser, ip, created_at, last_seen_at, current }` |
| `POST /api/auth/sessions/end` | `id` (logged in) | `ended: true` |
| `POST /api/auth/sessions/end-others` | (logged in) | `ended: true` |

`account` is `{ id, email, name, phone, language, has_password, has_google, created_at }`.

A ticket comes from a checked code or from Google. It lasts 10 minutes and
works once, for `password/set` or `ticket`.

`code/verify` logs in when the account already has a password or Google; a new
account is logged in when it sets its password.

## Sessions

| Rule | |
|------|-|
| The key | 32 random bytes in the cookie `__Host-gp_session` (HttpOnly, Secure, SameSite=Lax); the database keeps only its hash |
| How long | Ends after 7 days unused, and 30 days after log-in in any case |
| Devices | At most 5 per account; a sixth log-in ends the least recently used |
| Browser check | The browser and system are saved at log-in ("Chrome on Windows"); if the key shows up from another one, the session ends. An IP change is only recorded |
| New log-in email | Sent for every log-in after the first |
| Password set or changed | Every other device is logged out |
| Other sites | A write request whose `Origin` is not our own site is refused (`bad_origin`) |
| Email checks | `start` and `code/send` tell whether an email has an account, so each allows only 10 an hour from one visitor IP (`limit_reached`), on top of the limits per email |
| `proved_at` | When the person last proved it is them (log-in, code, password); sensitive actions will ask again after 15 minutes |

## Errors

| Code | When |
|------|------|
| `invalid_input` | A field is missing or wrong (`field` names it) |
| `wrong_code` | The code does not match |
| `code_expired` | The code is older than 10 minutes, or was used |
| `too_many_tries` | 5 wrong codes; ask for a new one |
| `too_soon` | A new code was asked for within 60 seconds |
| `wrong_password` | Email and password do not match |
| `locked` | 5 wrong passwords; try again after `retry_after_seconds` |
| `no_password` | The account has no password; use Google or a code |
| `ticket_invalid` | The ticket is wrong, used or expired |
| `outside_failed` | Sending the email or talking to Google failed |
| `limit_reached` | Too many requests from one place |
| `not_logged_in` | No session, or it ended (401) |
| `not_found` | No such device for this account |
| `bad_origin` | The request came from another site (403) |

Response shape: `{ "error": { "code": "wrong_code", "field": "code" } }`. The reason in words goes only to the backend's log, never to the browser.

`account` carries no internal ID; the browser never needs it.
