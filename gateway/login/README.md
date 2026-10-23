# Gateway: Login

The log-in engine: sign up, log in, email codes, passwords, Google, sessions
and devices, lock-out (design 7.6). It answers "who is this person?" once, at
log-in, and gives the browser its session. It keeps nothing itself: to save
an account, check a password, start a session or send a code, it asks the
Kernel through the internal [`system.*` calls](../../os/system/README.md),
through the [Shell](../shell/README.md) like every other command (design 2.9).
The users section (accounts, sessions, sign-in codes) is in the `core` schema
today.

> **Today's code** still saves accounts and sends mail itself; it moves behind
> the internal `system.*` calls when [`os/kernel/call`](../../os/kernel/call/README.md) is built.

## Next: one log-in, one business (design 7.6)

The routes below are today's. With the database grid they change:

- An account lives inside its business ([Accounts](../../os/accounts/README.md)).
  There is no list of businesses after log-in and no business switcher
- The log-in box takes an email, a Google account, or `username@handle`
  (`mona@nova`). Each business also has its own log-in page (`/nova/login`)
- The [Directory](../../os/directory/README.md) first says which business the
  email, Google ID or handle is in; the password, the second step and the
  business's entry rules are then checked in that business's slot, and the
  token (`<business_id>.<secret>`) is made in its
  [Sessions](../../os/sessions/README.md) slot
- Sign-up makes the business and its owner together, at the end of the setup
  (design 7.7). Until then the sign-up waits in `directory.signup`, so there
  is never an account with no business
- An email or Google account already in another business is refused with
  `email_in_other_business`
- Staff with no email log in with `mona@nova` and a first password from the
  owner, changed at the first log-in; the owner resets it

Has its own tests.

Also keeps, per account, how far the person got in the business setup
(`funnel.ts`, the table `core.setup_step`): it belongs to the users section, since
there is no business yet. The route is on the [app door](../doors/app/README.md).

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
| `POST /api/auth/language` | `language`: `ar` or `en` (logged in) | `account`; the language the app and the AI use with this person. New accounts start in Arabic |
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
