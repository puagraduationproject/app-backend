# Pack `support`

> Status: **draft.** From the design, section 7.3.

| | |
|-|-|
| Module | CRM |
| Adds | Support cases and vouchers |
| Needs | only the essentials |
| Term | 1 |
| On by default in | Coffee shop, Small market |

## System calls

- [`crm.open_case`](../syscalls/crm/open_case.md)
- [`crm.get_case`](../syscalls/crm/get_case.md)
- [`crm.list_cases`](../syscalls/crm/list_cases.md)
- [`crm.update_case`](../syscalls/crm/update_case.md)
- [`crm.add_case_note`](../syscalls/crm/add_case_note.md)
- [`crm.issue_voucher`](../syscalls/crm/issue_voucher.md)
- [`crm.resolve_case`](../syscalls/crm/resolve_case.md)

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
