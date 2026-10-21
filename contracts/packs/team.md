# Pack `team`

> Status: **draft.** From the design, section 7.3.

| | |
|-|-|
| Module | Team |
| Adds | Rota, attendance, tasks |
| Needs | only the essentials |
| Term | 2 |
| On by default in | none by default |

## System calls

- [`team.list_staff`](../syscalls/team/list_staff.md)
- [`team.get_rota`](../syscalls/team/get_rota.md)
- [`team.set_rota`](../syscalls/team/set_rota.md)
- [`team.swap_shift`](../syscalls/team/swap_shift.md)
- [`team.record_attendance`](../syscalls/team/record_attendance.md)
- [`team.list_attendance`](../syscalls/team/list_attendance.md)
- [`team.create_task`](../syscalls/team/create_task.md)
- [`team.list_tasks`](../syscalls/team/list_tasks.md)
- [`team.complete_task`](../syscalls/team/complete_task.md)
- [`team.get_staff_performance`](../syscalls/team/get_staff_performance.md)

## Windows and sidebar items

To write.

## Skills that need it

To write (the AI team lists them).

## Listeners that only run when it is on

To write.

## Settings

To write.

## Setup skill

What the AI walks the owner through when the pack is turned on. To write.

## Turning it off

Refused while another pack that is on needs it, or while it has open work. Its
data is kept and hidden, and comes back when it is turned on again.
