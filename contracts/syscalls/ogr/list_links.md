# `ogr.list_links`

> Status: **draft, version 0, not published.** Written from section
> 2.9 of the design. Every part below must be filled before the backend
> builds this system call (design 4.4).

| | |
|-|-|
| Module | OGR (part of the Kernel) |
| Reads or writes | Reads |
| Pack | `essentials` |
| Approval default | None; a read |
| Customer face | yes, only things linked to the customer of this conversation |
| Term | 1 |
| Retry key | Not needed (read) |
| Undo | Not needed (read) |
| Permission | The same as reading the thing itself: a link to an order is shown only to someone who may read orders |

## Purpose

What one thing is linked to: this chat belongs to Mariam, who placed order #1042, which has two lattes.

- **Use it when:** the AI needs the whole picture around one thing before it answers or acts ("which order is this chat about?", "what did this customer order last?")
- **Do not use it when:** one module already answers it directly, for example the order lines: call `erp.get_order`

## Inputs

| Name | Type | Required | Allowed values | Default | Example |
|------|------|:--------:|----------------|---------|---------|
| `id` | ID | yes | any ID in this business | | `conv_19c2...` |
| `kinds` | list of text | no | registered kinds | all | `["order"]` |
| `relation` | text | no | registered relations, for example `placed`, `about`, `contains` | all | `placed` |
| `depth` | number | no | 1 to 3 | 1 | 2 |
| `limit` | number | no | 1 to 50 | 20 | 10 |

## Output

| Field | Type | Meaning |
|-------|------|---------|
| `links` | list | Each `{ from, relation, to, kind, module, label, created_at }`, newest first |
| `more` | yes/no | There are more links than `limit` |

## Errors

| Code | Meaning | What the caller should do |
|------|---------|---------------------------|
| `not_allowed` | The role, the pack, the face or the AI setting does not allow it | Do not retry; explain or hand off |
| `not_found` | No such ID in this business | Do not retry; ask which one was meant |
| `invalid_input` | A kind or relation that no module registered, or `depth` out of range (`field` names it) | Fix the input |

## Effects

- **Changes:** nothing (read only)
- **Events emitted:** none
- **Never touches:** the modules' data. It returns IDs, kinds and short labels; the details come from the owning module's own system call
- Links the caller may not read (by role or face) are left out, never shown as hidden

## Examples

A normal call: `{ "id": "conv_19c2...", "depth": 2 }` returns the chat's customer
(Mariam Adel), her orders (#1042, #1038) and their items, each with its
label and `get_with`. A refused call and an error: to write.

## Changes

| Version | Date | Change |
|---------|------|--------|
| 0 | 2026-10-21 | Draft from the design |
