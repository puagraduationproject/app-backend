# Module: Team

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 14. When the design changes, this page changes with it.

Helping the owner manage the staff (term 2; the team decides if any of it moves
to term 1).

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

## Data (schema `team`)

```
staff_profile    membership_id, business_id, phone, hourly_rate_cents, skills,
                 availability(jsonb)
rota_shift       id, business_id, location_id, membership_id, starts_at, ends_at,
                 role, status(planned|swapped|done|missed)
attendance       id, business_id, membership_id, clock_in_at, clock_out_at, source
task             id, business_id, assigned_to, title, due_at, status, created_by_type
```

## Events

- **Emits:** ShiftMissed, TaskOverdue
- **Listens to:** none

## System calls (10)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`team.list_staff`](../../contracts/syscalls/team/list_staff.md) | Staff, roles, availability | R | `team` | 2 |
| [`team.get_rota`](../../contracts/syscalls/team/get_rota.md) | Who works when | R | `team` | 2 |
| [`team.set_rota`](../../contracts/syscalls/team/set_rota.md) | Plan shifts for the week | W | `team` | 2 |
| [`team.swap_shift`](../../contracts/syscalls/team/swap_shift.md) | Swap between two staff | W | `team` | 2 |
| [`team.record_attendance`](../../contracts/syscalls/team/record_attendance.md) | Clock in or out | W | `team` | 2 |
| [`team.list_attendance`](../../contracts/syscalls/team/list_attendance.md) | Late, missed, hours worked | R | `team` | 2 |
| [`team.create_task`](../../contracts/syscalls/team/create_task.md) | Task for a staff member | W | `team` | 2 |
| [`team.list_tasks`](../../contracts/syscalls/team/list_tasks.md) | Open and overdue tasks | R | `team` | 2 |
| [`team.complete_task`](../../contracts/syscalls/team/complete_task.md) | Mark done | W | `team` | 2 |
| [`team.get_staff_performance`](../../contracts/syscalls/team/get_staff_performance.md) | Sales, waste, cash gaps per staff member | R | `team` | 2 |
