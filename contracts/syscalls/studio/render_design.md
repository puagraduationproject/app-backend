# `studio.render_design`

> Status: **draft, version 0, not published.** Written from section
> 12 of the design. Every part below must be filled before the backend
> builds this system call (design 4.4).

| | |
|-|-|
| Module | Studio |
| Reads or writes | Writes |
| Pack | `studio` |
| Approval default | None by default; the owner's settings decide for the AI (6.6) |
| Customer face | no (owner and staff only) |
| Term | 2 |
| Retry key | Required |
| Undo | To write: the system call or action that reverses it |
| Permission | To write |

## Purpose

Template + data -> image or PDF preview.

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

- **Changes:** to write
- **Events emitted:** to write
- **Never touches:** another module's data

## Examples

A normal call, a refused call, and an error, each with its full result.

## Changes

| Version | Date | Change |
|---------|------|--------|
| 0 | 2026-10-19 | Draft from the design |
