# Card `question`

> Status: **draft.** Used in the AI's answers to owners, staff and customers.

One question from the AI with 2 to 6 choices, and a box to type another
answer when it is allowed. Filled by [`ai.ask_question`](../syscalls/ai/ask_question.md).

## Fields

| Field | Type | Meaning |
|-------|------|---------|
| `question_id` | ID | Sent back with the answer |
| `question` | text | The question, in the person's language |
| `choices` | list | Each `{ id, label }`, one button each |
| `allow_other` | yes/no | Show a box to type another answer |
| `status` | text | `waiting`, `answered`, `expired`; an answered card shows the answer and no buttons |

## Buttons and the system calls they call

Each choice sends the answer back to the waiting `ai.ask_question`. Nothing
else runs until the AI makes its next system call.

## Where it shows

Home and the inbox in the staff app, the website chat, and Telegram (as
buttons under the message). A channel without buttons shows the question and
numbered choices as text.
