# Schema `core`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 7.1. When the design changes, this page changes with it.

Only the `core` module's database user has rights here. One migration per
change, never edited after it runs. Every business table has `business_id` and
row-level security.

```
business          id, name, handle (unique), business_type, currency,
                  timezone, locale, template_key, team_size(alone|team),
                  settings(jsonb), created_at
account           id, email (one account per email), email_verified_at, name,
                  phone, password_hash (empty for Google-only), google_id,
                  language, failed_logins, locked_until, created_at, updated_at
email_code        id, email, code_hash, attempts, expires_at, used_at
auth_ticket       id, account_id, ticket_hash, expires_at, used_at
session           id, account_id, token_hash, browser, user_agent, first_ip,
                  last_ip, created_at, last_seen_at, proved_at, expires_at,
                  ended_at, end_reason
membership        id, business_id, user_id, username, display_name, role,
                  invited_by, joined_at
                  UNIQUE (business_id, user_id), UNIQUE (business_id, username)
invite            id, business_id, phone_or_email, role, token_hash, expires_at
role              business_id, name, permissions(jsonb)
                  defaults: owner, manager, staff, viewer
location          id, business_id, name, address, area      (branches)
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
