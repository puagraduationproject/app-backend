# `core.invite_member`

> Status: **draft, version 0, not published.** Written from section
> 7 of the design. Every part below must be filled before the backend
> builds this system call (design 4.4).

| | |
|-|-|
| Module | Core |
| Reads or writes | Writes |
| Pack | `essentials` |
| Approval default | None by default; the owner's settings decide for the AI (6.6) |
| Customer face | no (owner and staff only) |
| Term | 1 |
| Retry key | Required |
| Undo | To write: the system call or action that reverses it |
| Permission | To write |

## Purpose

Invite by email with a role, or make a member with no email (a username and a first password). An email another business already has is refused with `email_in_other_business`. One log-in, one business (design 7.6).

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
