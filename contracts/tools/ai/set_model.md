# `ai.set_model`

> Status: **draft, version 0, not published.** Written from section
> 6 of the design. Every part below must be filled before the backend
> builds this tool (design 4.4).

| | |
|-|-|
| Module | AI layer |
| Reads or writes | Writes (AI layer) |
| Pack | `essentials` |
| Approval default | Owner only; never called by the AI (6.2) |
| Customer face | no (owner only) |
| Term | 2 |
| Retry key | Required |
| Undo | `ai.set_model` back to the old model |
| Permission | To write |

## Purpose

Sets the model per face. Called only by the app when the owner taps it; never by the AI.

- **Use it when:** to write
- **Do not use it when:** to write

## Inputs

| Name | Type | Required | Allowed values | Default | Example |
|------|------|:--------:|----------------|---------|---------|
| | | | | | |

## Output

| Field | Type | Meaning |
|-------|------|---------|
| | | |

## Errors

| Code | Meaning | What the caller should do |
|------|---------|---------------------------|
| `not_allowed` | The role, the pack, the face or the AI setting does not allow it | Do not retry; explain or hand off |
| | | |

## Effects

- **Changes:** the model used for one face of this business
- **Events emitted:** [`AiModelChanged`](../../events/AiModelChanged.md)
- **Never touches:** another module's data

## Examples

A normal call, a refused call, and an error, each with its full result.

## Changes

| Version | Date | Change |
|---------|------|--------|
| 0 | 2026-10-20 | Draft from the design |
