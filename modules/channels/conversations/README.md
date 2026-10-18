# Channels: conversations

AI or staff, take over, hand back, tags.

| | |
|-|-|
| Tables | conversation |
| Emits | ConversationHandedOff |

## Tools (7)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`channels.list_conversations`](../../../contracts/tools/channels/list_conversations.md) | Open, waiting, by channel, handled by AI or staff | R | `essentials` | 1 |
| [`channels.get_conversation`](../../../contracts/tools/channels/get_conversation.md) | Messages and state | R | `essentials` | 1 |
| [`channels.handoff_to_staff`](../../../contracts/tools/channels/handoff_to_staff.md) | Pass the chat to a person, with the reason | W | `essentials` | 1 |
| [`channels.hand_back_to_ai`](../../../contracts/tools/channels/hand_back_to_ai.md) | Staff give the chat back | W | `essentials` | 1 |
| [`channels.assign_conversation`](../../../contracts/tools/channels/assign_conversation.md) | To a staff member | W | `essentials` | 1 |
| [`channels.tag_conversation`](../../../contracts/tools/channels/tag_conversation.md) | Add or remove tags | W | `essentials` | 1 |
| [`channels.close_conversation`](../../../contracts/tools/channels/close_conversation.md) | Close | W | `essentials` | 1 |

## Parts

`tools`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
