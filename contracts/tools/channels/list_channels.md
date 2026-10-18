# `channels.list_channels`

> Status: **draft, version 0, not published.** Written from section
> 10 of the design. Every part below must be filled before the backend
> builds this tool (design 4.4).

| | |
|-|-|
| Module | Channels, adapters |
| Reads or writes | Reads |
| Pack | `essentials` |
| Approval default | None by default; the owner's settings decide for the AI (6.6) |
| Customer face | no (owner and staff only) |
| Term | 1 |
| Retry key | Not needed (read) |
| Undo | Not needed (read) |
| Permission | To write |

## Purpose

Connected channels and their status.

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

- **Changes:** nothing (read only)
- **Events emitted:** none
- **Never touches:** another module's data

## Examples

A normal call, a refused call, and an error, each with its full result.

## Changes

| Version | Date | Change |
|---------|------|--------|
| 0 | 2026-10-19 | Draft from the design |
