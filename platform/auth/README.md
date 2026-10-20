# Platform: auth

Sign up and log in (design 7.6). Sessions come in a later step.

Used by every module. Has its own tests.

## Routes (app door, `/api/auth/`)

| Route | Input | Output |
|-------|-------|--------|
| `POST /api/auth/start` | `email` | `next`: `code` (a code was sent), `password` (the account has one), or `google` (Google-only account; a code can still be asked for) |
| `POST /api/auth/code/send` | `email` | `sent: true`, `retry_after_seconds` |
| `POST /api/auth/code/verify` | `email`, `code` | `ticket`, `needs_password` (true when the account has no password yet), `account` |
| `POST /api/auth/password/set` | `ticket`, `password` | `account` |
| `POST /api/auth/password/login` | `email`, `password` | `account` |
| `POST /api/auth/password/change` | `email`, `old_password`, `new_password` | `account` |
| `GET /api/auth/google/start` | | Redirect to Google |
| `GET /api/auth/google/callback` | from Google | Redirect to `/account#ticket=...` |
| `POST /api/auth/ticket` | `ticket` | `account`, `needs_password` |

`account` is `{ id, email, name, phone, language, has_password, has_google, created_at }`.

A ticket comes from a checked code or from Google. It lasts 10 minutes and
works once for `password/set`; `ticket` only reads the account it belongs to.

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

Response shape: `{ "error": { "code": "wrong_code", "message": "for logs only", "field": "code" } }`.
