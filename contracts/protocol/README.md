# The Shell and Kernel protocol (version 1)

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

How the [Shell](../../gateway/shell/README.md) and the [Kernel](../../os/kernel/README.md),
two services of their own, talk to each other. It defines two things: how
they connect, and in what format. Code: `os/shared/seal/`, `os/shared/protocol/`.

## How they connect

- HTTP over TCP, inside our network only. Nothing outside reaches the Kernel
- `POST /call` sends one sealed call; `POST /key` asks for a new key;
  `GET /health` is the only thing not sealed (it shows the cores, never a key)
- Each call's JSON file (`connection`) says how it is delivered:

| Field | Means |
|-------|-------|
| `delivery: sure` | The Shell waits for the answer. With no answer within the time limit, or `core_stopped`, it sends the call again with the **same** `idempotency_key` and a new `request_id`, so a write happens once |
| `delivery: fire_and_forget` | The Kernel answers `{ "accepted": true }` at once and runs the call; nobody waits for its result |
| `time_limit_ms` | How long the Shell waits for one try |
| `tries` | How many times the Shell sends it, at most |

Reads can always be sent again; writes are always `sure`.

## The seal

Every message, both ways, is encrypted and sealed with **AES-256-GCM**: nobody
on the line can read it, a changed byte is refused, and only a holder of the
key could have made it. What travels:

```json
{ "key_id": "4f1c0a9e2b7d3c55", "nonce": "base64url, 12 bytes", "sealed": "base64url, the message and its 16-byte seal" }
```

The seal also covers the key ID and what the message is (`call`, `answer`,
`key`, `key-answer`), so an answer cannot be sent back as a call.

**The keys**

1. Both services start with the **start key** from the settings
   (`KERNEL_START_KEY`, at least 32 characters, never in the repo). It is
   used only to ask for a key; the Kernel never runs a call sealed with it
2. The Shell asks `POST /key`, sealed with the key it holds. The Kernel makes
   a new random key and sends it back sealed with that same key: the key
   itself never travels in the open
3. The Shell asks for a new key every **5 minutes** (`KEY_EVERY_SECONDS`).
   The Kernel still accepts the key before it for **60 seconds**
   (`KEY_OVERLAP_SECONDS`), so no call fails during the change
4. When the Kernel restarts it forgets its keys and answers `unknown_key`;
   the Shell gets a new key with the start key and sends the call again

**Copied and late requests**: each request has a `request_id` and a
`sent_at`. The Kernel refuses one more than 30 seconds old or ahead
(`stale_request`), and one whose ID it has seen before (`replayed_request`).

## The format (inside the seal)

A call:

```json
{
  "request_id": "9eaa967b-8842-475f-a9b6-d706e5c33b84",
  "sent_at": "2026-10-22T13:10:49.805Z",
  "call": "test.echo",
  "version": 1,
  "business_id": "fake-business-nova",
  "session": "fake-session-owner-nova",
  "input": { "text": "hello" },
  "idempotency_key": "2d0c...",
  "correlation_id": "9eaa967b-8842-475f-a9b6-d706e5c33b84"
}
```

The `session` is the person's session token. The Kernel checks it itself (it
made it, at log-in), and checks that the account may enter `business_id`.

An answer, with the same `request_id`:

```json
{ "request_id": "9eaa967b-8842-475f-a9b6-d706e5c33b84", "ok": true, "result": { "text": "hello", "core": 1 } }
```

```json
{ "request_id": "9eaa967b-8842-475f-a9b6-d706e5c33b84", "ok": false, "error": { "code": "not_allowed", "details": { "business_id": "fake-business-basma" } } }
```

Asking for a key: `{ "request_id", "sent_at" }`; the answer:
`{ "request_id", "key_id", "secret" }` (the secret in base64url, 32 bytes).

## When it is refused

| Code | Sealed? | When |
|------|:-------:|------|
| `bad_seal` | no (400) | Not an envelope, a changed byte, or the wrong key |
| `unknown_key` | no (401) | A key the Kernel does not know or no longer accepts, or a call sealed with the start key |
| `stale_request` | yes | `sent_at` more than 30 seconds away |
| `replayed_request` | yes | The `request_id` was seen before |
| `kernel_busy` | yes | Every core already has its limit of calls |
| `core_stopped` | yes | The core running the call stopped; safe to send again |
| `timeout` | from the Shell (504) | No answer after every try |

## The Kernel's cores

The Kernel's manager opens and checks every call, then hands it to the least
busy core. A core is a process of its own: a heavy call holds only its core,
and a core that dies is started again while the others keep answering. The
cores never see a key.
