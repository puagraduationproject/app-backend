# `ai.ask_question`

> Status: **draft, version 0, not published.** Written from section
> 6 of the design. Every part below must be filled before the backend
> builds this system call (design 4.4).

| | |
|-|-|
| Module | AI module |
| Reads or writes | Reads (AI module) |
| Pack | `essentials` |
| Approval default | None; asking changes nothing |
| Customer face | yes |
| Term | 1 |
| Retry key | Required: a retried call shows the question once |
| Undo | Not needed (changes nothing) |
| Permission | Anyone the AI is talking to |

## Purpose

Asks the person the AI is talking to one question with a few choices, shows a [question card](../../cards/question.md), and waits for the answer.

- **Use it when:** the AI is unsure and the answer is one of a few choices ("which Mariam?", "a muffin instead?", "for today or tomorrow?")
- **Do not use it when:** the answer is approving an action: use `ai.ask_approval`. Or the answer is free text: just ask in the reply

## Inputs

| Name | Type | Required | Allowed values | Default | Example |
|------|------|:--------:|----------------|---------|---------|
| `question` | text | yes | up to 200 characters, in the person's language | | `الكرواسون خلص، تحب مافن بداله؟` |
| `choices` | list | yes | 2 to 6, each `{ id, label }`, label up to 40 characters | | `[{ "id": "muffin", "label": "مافن" }, { "id": "none", "label": "من غير" }]` |
| `allow_other` | yes/no | no | | yes | yes: the person can also type an answer |
| `about` | list of IDs | no | IDs in this business | | `["item_44b1..."]` |
| `expires_in_minutes` | number | no | 1 to 1440 | 60 | 30 |

## Output

| Field | Type | Meaning |
|-------|------|---------|
| `question_id` | ID | The question, to match the answer |
| `answer` | `{ choice_id, text }` or null | The choice picked, or what was typed; null until answered |
| `status` | text | `waiting`, `answered`, `expired` |

## Errors

| Code | Meaning | What the caller should do |
|------|---------|---------------------------|
| `not_allowed` | The role, the pack, the face or the AI setting does not allow it | Do not retry; explain or hand off |
| `invalid_input` | Fewer than 2 or more than 6 choices, or a label too long (`field` names it) | Fix the input |

## Effects

- **Changes:** saves the question and its answer in the AI module's own data (the thread)
- **Events emitted:** none
- **Never touches:** business data. Whatever the answer leads to is a separate system call with its own checks

## Examples

A normal call shows the card in Home, on the website chat, or as buttons on
Telegram, and returns `{ "question_id": "q_...", "answer": { "choice_id": "muffin", "text": null }, "status": "answered" }`.
A refused call and an error: to write.

## Changes

| Version | Date | Change |
|---------|------|--------|
| 0 | 2026-10-21 | Draft from the design |
