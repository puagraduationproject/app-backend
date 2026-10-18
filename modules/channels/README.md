# Module: Channels

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 10. When the design changes, this page changes with it.

Where messages come from and go to. Separate from CRM, so a new channel never
touches CRM.

Its tools are its only public face. It never writes another module's tables;
it emits events and reads other modules through their services.

## Areas

| Folder | Holds |
|--------|-------|
| [`inbox`](inbox/README.md) | Incoming queue; duplicates dropped |
| [`conversations`](conversations/README.md) | AI or staff, take over, hand back, tags |
| [`messages`](messages/README.md) | One message shape |
| [`auto-replies`](auto-replies/README.md) | Away, opening hours, greeting |
| [`adapters`](adapters/README.md) | Website chat, Telegram; WhatsApp, Instagram, Facebook later |

Every area folder holds the same parts. File names and extensions follow the
stack once it is chosen:

| Part | Holds |
|------|-------|
| `tools` | One handler per tool page; checks inputs, calls the service, returns the output |
| `service` | The area's rules; the only code that changes its data |
| `data` | Access to the area's own tables, in the module's own schema |
| `listeners` | Handlers for events from other modules |
| `tests` | The area's own tests: every tool, every rule |

## Data (schema `channels`)

```
channel_account  id, business_id, type(website_chat|telegram|whatsapp|instagram|
                 facebook), external_id, token_ref, status, connected_at
conversation     id, business_id, channel_account_id, customer_id,
                 external_thread_id, state(open|waiting|closed),
                 handled_by(ai|user), assigned_to, tags, last_message_at,
                 window_expires_at
message          id, business_id, conversation_id, direction(in|out), external_id,
                 body, type(text|image|audio|location|template|card), sender_type
                 (customer|ai|user), delivery_status, created_at
                 UNIQUE (business_id, external_id)
attachment       id, message_id, type, url, transcript
auto_reply       id, business_id, channel_account_id, kind(away|hours|greeting),
                 body, schedule(jsonb), active
```

## Events

- **Emits:** ConversationHandedOff, MessageReceived, MessageSent, PostPublished
- **Listens to:** CustomerForgotten, CustomerMerged, OrderCreated, OrderReady

## Tools (12)

| Tool | Does | R/W | Pack | Term |
|------|------|:---:|------|:----:|
| [`channels.list_conversations`](../../contracts/tools/channels/list_conversations.md) | Open, waiting, by channel, handled by AI or staff | R | `essentials` | 1 |
| [`channels.get_conversation`](../../contracts/tools/channels/get_conversation.md) | Messages and state | R | `essentials` | 1 |
| [`channels.reply`](../../contracts/tools/channels/reply.md) | Reply in a conversation | W | `essentials` | 1 |
| [`channels.send_message`](../../contracts/tools/channels/send_message.md) | Start a message to one customer | W | `essentials` | 1 |
| [`channels.handoff_to_staff`](../../contracts/tools/channels/handoff_to_staff.md) | Pass the chat to a person, with the reason | W | `essentials` | 1 |
| [`channels.hand_back_to_ai`](../../contracts/tools/channels/hand_back_to_ai.md) | Staff give the chat back | W | `essentials` | 1 |
| [`channels.assign_conversation`](../../contracts/tools/channels/assign_conversation.md) | To a staff member | W | `essentials` | 1 |
| [`channels.tag_conversation`](../../contracts/tools/channels/tag_conversation.md) | Add or remove tags | W | `essentials` | 1 |
| [`channels.close_conversation`](../../contracts/tools/channels/close_conversation.md) | Close | W | `essentials` | 1 |
| [`channels.list_channels`](../../contracts/tools/channels/list_channels.md) | Connected channels and their status | R | `essentials` | 1 |
| [`channels.set_auto_reply`](../../contracts/tools/channels/set_auto_reply.md) | Away, opening hours, greeting | W | `essentials` | 1 |
| [`channels.publish_post`](../../contracts/tools/channels/publish_post.md) | Publish a Studio post to a channel | W | `studio` | 2 |
