# Schema `channels`

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 10.1. When the design changes, this page changes with it.

Only the `channels` module's database user has rights here. One migration per
change, never edited after it runs. Every business table has `business_id` and
row-level security.

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
