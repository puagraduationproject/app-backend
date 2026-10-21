# `ogr.get_thing`

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

What one ID is: its kind, the module that owns it, and the label people read (order #1042, the customer Mariam).

- **Use it when:** the AI holds an ID and does not know what it is, or needs its label to show it
- **Do not use it when:** the details are needed (lines, prices, stock): call the owning module, for example `erp.get_order`

## Inputs

| Name | Type | Required | Allowed values | Default | Example |
|------|------|:--------:|----------------|---------|---------|
| `id` | ID | yes | any ID in this business | | `ord_7f3a...` |

## Output

| Field | Type | Meaning |
|-------|------|---------|
| `id` | ID | The same ID |
| `kind` | text | `order`, `customer`, `conversation`, `item`, `post`, ... (each module registers its kinds) |
| `module` | text | The owner: `erp`, `crm`, `channels`, ... |
| `label` | text | What people read: `#1042`, `Mariam Adel`, `Latte` |
| `get_with` | text | The owning module's system call for the details, for example `erp.get_order` |
| `archived` | yes/no | Archived things keep their ID and links (design 2.8) |

## Errors

| Code | Meaning | What the caller should do |
|------|---------|---------------------------|
| `not_allowed` | The role, the pack, the face or the AI setting does not allow it | Do not retry; explain or hand off |
| `not_found` | No such ID in this business. An ID from another business is also `not_found`, never "not yours" | Do not retry; ask which one was meant |

## Effects

- **Changes:** nothing (read only)
- **Events emitted:** none
- **Never touches:** the modules' data. It returns IDs, kinds and short labels; the details come from the owning module's own system call

## Examples

A normal call: `{ "id": "ord_7f3a..." }` returns
`{ "id": "ord_7f3a...", "kind": "order", "module": "erp", "label": "#1042", "get_with": "erp.get_order", "archived": false }`.
A refused call and an error: to write.

## Changes

| Version | Date | Change |
|---------|------|--------|
| 0 | 2026-10-21 | Draft from the design |
