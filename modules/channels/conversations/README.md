# Channels: conversations

AI or staff, take over, hand back, tags.

| | |
|-|-|
| Tables | conversation |
| Emits | ConversationHandedOff |

## System calls (7)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`channels.list_conversations`](../../../contracts/syscalls/channels/list_conversations.md) | Open, waiting, by channel, handled by AI or staff | R | `essentials` | 1 |
| [`channels.get_conversation`](../../../contracts/syscalls/channels/get_conversation.md) | Messages and state | R | `essentials` | 1 |
| [`channels.handoff_to_staff`](../../../contracts/syscalls/channels/handoff_to_staff.md) | Pass the chat to a person, with the reason | W | `essentials` | 1 |
| [`channels.hand_back_to_ai`](../../../contracts/syscalls/channels/hand_back_to_ai.md) | Staff give the chat back | W | `essentials` | 1 |
| [`channels.assign_conversation`](../../../contracts/syscalls/channels/assign_conversation.md) | To a staff member | W | `essentials` | 1 |
| [`channels.tag_conversation`](../../../contracts/syscalls/channels/tag_conversation.md) | Add or remove tags | W | `essentials` | 1 |
| [`channels.close_conversation`](../../../contracts/syscalls/channels/close_conversation.md) | Close | W | `essentials` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
