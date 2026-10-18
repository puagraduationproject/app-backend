# Error codes

Tools return error codes, never message text. The frontend and the AI turn a code
into words in the user's language.

| Code | Meaning |
|------|---------|
| `not_found` | The thing does not exist in this business |
| `not_allowed` | The role, the pack, the face or the AI setting does not allow it |
| `needs_approval` | The action is waiting for approval |
| `invalid_input` | An input is missing or wrong; the details name the input |
| `conflict` | The state changed (for example, the order is already preparing) |
| `limit_reached` | A limit was hit (credit limit, discount limit, rate limit) |
| `pack_off` | The pack this needs is off for this business |
| `outside_failed` | An outside service (channel, payment, courier) failed |

More codes are added here before any tool uses them.
