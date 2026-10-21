# Error codes

System calls return error codes, never message text. The frontend and the AI turn a code
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
| `outside_failed` | An outside service (channel, payment, courier, email, Google) failed |
| `wrong_code` | An email code does not match (auth) |
| `code_expired` | An email code is too old or was used (auth) |
| `too_many_tries` | Too many wrong codes; a new one is needed (auth) |
| `too_soon` | A new code was asked for too soon (auth) |
| `wrong_password` | Email and password do not match (auth) |
| `locked` | Too many wrong passwords; wait (auth) |
| `no_password` | The account has no password yet (auth) |
| `ticket_invalid` | A sign-up ticket is wrong, used or expired (auth) |
| `not_logged_in` | No session, or it ended (auth) |
| `bad_origin` | A write request came from another site (auth) |
| `handle_taken` | Another business has this handle (setup) |

More codes are added here before any system call uses them.
