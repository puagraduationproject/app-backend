# `BusinessCreated`

> Status: **version 1**, emitted since 2026-10-21 by the business setup (design 7.7).

| | |
|-|-|
| Emitted by | Core |
| Listened to by | AI layer |
| Envelope | The standard envelope ([README](README.md)) |

## Data

| Field | Type | Meaning |
|-------|------|---------|
| `name` | string | The business name |
| `handle` | string | Its unique handle (`nova`) |
| `business_type` | `coffee_shop`, `small_market`, `grocery`, `bakery`, `restaurant`, `other` | What the owner picked |
| `template_key` | `coffee_shop`, `small_market` or null | The template it starts from: `coffee_shop` for a café, `small_market` for a small market or a grocery, null for the kinds with no template yet |
| `sells` | string or null | What the owner sells, in their words (asked after "Something else") |
| `team_size` | `alone`, `team` | The owner's answer to "just me or with a team" |
| `owner_id` | uuid | The account that created it and owns it |

## The IDs it is about

`business_id` (in the envelope).

## Changes

| Version | Date | Change |
|---------|------|--------|
| 0 | 2026-10-19 | Draft from the design |
| 1 | 2026-10-21 | The data, first emitted by the business setup |
| 1 | 2026-10-21 | Fewer kinds and `grocery` added; `template_key` set from the kind; `sells` added (ALL-002) |
