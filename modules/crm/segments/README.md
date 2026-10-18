# CRM: segments

Segments and consent (term 2).

| | |
|-|-|
| Tables | segment, consent |
| Emits | ConsentChanged |

## Tools (4)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`crm.create_segment`](../../../contracts/tools/crm/create_segment.md) | Saved filter: "Tuesday regulars" | W | `segments_consent` | 2 |
| [`crm.list_segment_members`](../../../contracts/tools/crm/list_segment_members.md) | Who is in it | R | `segments_consent` | 2 |
| [`crm.get_consent`](../../../contracts/tools/crm/get_consent.md) | Who agreed to marketing messages, on which channel | R | `segments_consent` | 2 |
| [`crm.record_consent`](../../../contracts/tools/crm/record_consent.md) | Opt in or out ("stop" in chat = opt out) | W | `segments_consent` | 2 |

## Parts

`tools`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
