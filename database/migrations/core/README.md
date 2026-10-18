# Schema `core`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 7.1. When the design changes, this page changes with it.

Only the `core` module's database user has rights here. One migration per
change, never edited after it runs. Every business table has `business_id` and
row-level security.

```
business          id, name, slug, business_type, currency, timezone, locale,
                  template_key, settings(jsonb), created_at
user              id, email, phone, name, password_hash, locale
session           id, user_id, created_at, expires_at, last_seen_at
membership        id, business_id, user_id, role, invited_by, joined_at
                  UNIQUE (business_id, user_id)
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
