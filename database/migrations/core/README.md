# Schema `core`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 7.1. When the design changes, this page changes with it.

Each business's own settings, in its own slot (design 2.3): its profile,
what each role may do, locations, packs on, AI settings, entry rules,
numbering, the audit log, the outbox and notifications. One migration per
change, never edited after it runs.

**Today** the schema still holds everything below, not split yet: Login's
accounts, codes and sessions, the businesses, the memberships, the audit log
and the outbox. With the grid they move: `business` to
[`directory`](../directory/README.md) (the map) and `core.profile` (the rest),
`account`, `membership`, `invite` and `email_code` to
[`accounts`](../accounts/README.md), `session` to
[`sessions`](../sessions/README.md), `setup_step` to `directory.signup_step`,
and `auth_ticket` goes away when sign-up waits in `directory.signup`.

Today's tables:

```
business          id, name, handle (unique), business_type, sells,
                  currency, timezone, locale, template_key,
                  team_size(alone|team, empty for new businesses),
                  settings(jsonb), idempotency_key, created_by, created_at
                  UNIQUE (created_by, idempotency_key)
account           id, email (one account per email), email_verified_at, name,
                  phone, password_hash (empty for Google-only), google_id,
                  language, failed_logins, locked_until, created_at, updated_at
email_code        id, email, code_hash, attempts, expires_at, used_at
auth_ticket       id, account_id, ticket_hash, expires_at, used_at
session           id, account_id, token_hash, browser, user_agent, first_ip,
                  last_ip, created_at, last_seen_at, proved_at, expires_at,
                  ended_at, end_reason
setup_step        account_id, step, reached_at   (the first time only)
membership        id, business_id, user_id, username, display_name, role,
                  invited_by, joined_at
                  UNIQUE (business_id, user_id), UNIQUE (business_id, username)
invite            id, business_id, phone_or_email, role, token_hash, expires_at
role              business_id, name, permissions(jsonb)
                  defaults: owner, manager, staff, viewer
location          id, business_id, name, city, area, address
                  (the first one is made at setup; more with branches)
template          key, version, content(jsonb)              (files, versioned)
pack              key, version, module, needs, content(jsonb) (files, versioned)
business_pack     business_id, pack_key, status(on|off), settings(jsonb),
                  changed_by, changed_at
audit_log         id, business_id, actor_type(user|ai|system), actor_id,
                  action, object_type, object_id, before, after, created_at
outbox            id, business_id, event_type, payload, created_at,
                  dispatched_at, attempts, last_error
notification      id, business_id, user_id, type, title, body,
                  ref_type, ref_id, read_at, created_at
api_key           id, business_id, name, scopes, created_at   (term 2)
```
