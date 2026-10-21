# CRM: support

Cases, case events, vouchers, follow-ups.

| | |
|-|-|
| Tables | support_case, case_event, voucher |
| Emits | CaseOpened, CaseResolved |

## System calls (7)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`crm.open_case`](../../../contracts/syscalls/crm/open_case.md) | Complaint or request, linked to the order and the chat | W | `support` | 1 |
| [`crm.get_case`](../../../contracts/syscalls/crm/get_case.md) | Status and history | R | `support` | 1 |
| [`crm.list_cases`](../../../contracts/syscalls/crm/list_cases.md) | Open, by priority, by staff member | R | `support` | 1 |
| [`crm.update_case`](../../../contracts/syscalls/crm/update_case.md) | Status, priority, assign to staff | W | `support` | 1 |
| [`crm.add_case_note`](../../../contracts/syscalls/crm/add_case_note.md) | Note on a case | W | `support` | 1 |
| [`crm.issue_voucher`](../../../contracts/syscalls/crm/issue_voucher.md) | Voucher as compensation | W | `support` | 1 |
| [`crm.resolve_case`](../../../contracts/syscalls/crm/resolve_case.md) | Close with a result: apology, replacement, voucher, or refund (calls `erp.refund_payment`) | W | `support` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
