# Channels: messages

One message shape.

| | |
|-|-|
| Tables | message, attachment |
| Emits | MessageReceived, MessageSent |

## System calls (2)

| System call | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`channels.reply`](../../../contracts/syscalls/channels/reply.md) | Reply in a conversation | W | `essentials` | 1 |
| [`channels.send_message`](../../../contracts/syscalls/channels/send_message.md) | Start a message to one customer | W | `essentials` | 1 |

## Parts

`syscalls`, `service`, `data`, `listeners`, `tests` (see the [module page](../README.md)).
