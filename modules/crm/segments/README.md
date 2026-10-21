# CRM: segments

Segments and consent (term 2).

| | |
|-|-|
| Tables | segment, consent |
| Emits | ConsentChanged |

## System calls (4)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`crm.create_segment`](../../../contracts/syscalls/crm/create_segment.md) | Saved filter: "Tuesday regulars" | W | `segments_consent` | 2 |
| [`crm.list_segment_members`](../../../contracts/syscalls/crm/list_segment_members.md) | Who is in it | R | `segments_consent` | 2 |
| [`crm.get_consent`](../../../contracts/syscalls/crm/get_consent.md) | Who agreed to marketing messages, on which channel | R | `segments_consent` | 2 |
| [`crm.record_consent`](../../../contracts/syscalls/crm/record_consent.md) | Opt in or out ("stop" in chat = opt out) | W | `segments_consent` | 2 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
