# Module: Core

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 7. When the design changes, this page changes with it.

The business's profile, notifications, and the `core.*` system calls.

Section 7's Core is split by role (design 2.9): sign-up and log-in are the
[Shell](../../gateway/shell/README.md); businesses, members, roles, locations
and packs are the [Index](../../kernel/index/README.md); audit and outbox
are the [Kernel](../../kernel/README.md). Their tables all stay in the `core`
schema for now.

Its system calls are its only public face. It never writes another module's tables;
it emits events and reads other modules through their services.

Every area folder holds the same parts. File names and extensions follow the
stack once it is chosen:

| Part | Holds |
|------|-------|
| `syscalls` | One handler per system call page; checks inputs, calls the service, returns the output |
| `service` | The area's rules; the only code that changes its data |
| `data` | Access to the area's own tables, in the module's own schema |
| `listeners` | Handlers for events from other modules |
| `tests` | The area's own tests: every system call, every rule |

## Data (schema `core`)

```
business          id, name, handle (unique), business_type, sells,
                  currency, timezone, locale, template_key,
                  team_size(alone|team, empty for new businesses),
                  settings(jsonb), idempotency_key, created_by, created_at
                  UNIQUE (created_by, idempotency_key)
account           (gateway/shell: account, email_code, auth_ticket, session, setup_step)
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

## Events

- **Emits:** BusinessCreated, MemberInvited, MemberJoined, PackTurnedOff, PackTurnedOn, RoleChanged
- **Listens to:** none

## System calls (12)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`core.get_business`](../../contracts/syscalls/core/get_business.md) | Profile, hours, location, delivery areas | R | `essentials` | 1 |
| [`core.update_business`](../../contracts/syscalls/core/update_business.md) | Hours, settings, profile | W | `essentials` | 1 |
| [`core.list_packs`](../../contracts/syscalls/core/list_packs.md) | Packs on, packs in the library, what each needs | R | `essentials` | 1 |
| [`core.turn_on_pack`](../../contracts/syscalls/core/turn_on_pack.md) | Turn a pack on, with the packs it needs (undo: turn off) | W | `essentials` | 1 |
| [`core.turn_off_pack`](../../contracts/syscalls/core/turn_off_pack.md) | Turn a pack off; its data is kept (undo: turn on) | W | `essentials` | 1 |
| [`core.list_members`](../../contracts/syscalls/core/list_members.md) | Members and roles | R | `essentials` | 1 |
| [`core.invite_member`](../../contracts/syscalls/core/invite_member.md) | Invite by phone or email with a role | W | `essentials` | 1 |
| [`core.change_role`](../../contracts/syscalls/core/change_role.md) | Change a member's role | W | `essentials` | 1 |
| [`core.remove_member`](../../contracts/syscalls/core/remove_member.md) | Remove a member | W | `essentials` | 1 |
| [`core.list_locations`](../../contracts/syscalls/core/list_locations.md) | Branches | R | `essentials` | 1 |
| [`core.get_audit_log`](../../contracts/syscalls/core/get_audit_log.md) | Who changed what | R | `essentials` | 1 |
| [`core.notify`](../../contracts/syscalls/core/notify.md) | Notification to a member | W | `essentials` | 1 |
