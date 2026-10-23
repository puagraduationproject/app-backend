# OS: Directory

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) sections 2.3, 2.9 and 7.1. When the design changes, this page changes with it.

The map above every business, and the one part not split by business. It
answers "where does this business live?" and "which business is this log-in
in?". Its tables are in the [`directory` schema](../../database/migrations/directory/README.md):

- `business`: each business ID (it never changes), its handle (a label on the
  ID), where it lives, which slots it has, active or paused
- `login`: each email or Google ID, scrambled, pointing to its one business.
  One business has many log-ins; each value belongs to one business
- `signup`: sign-ups in progress, before their business exists

The Kernel keeps `business` in memory and refreshes it on the events that
change it, so a normal call never reads it. `login` is opened only at log-in,
sign-up, invites and email changes. The Kernel's Registry says where the
Directory is.

What a role may do, the packs on, locations and the AI settings belong to the
business itself, in its [Core](../../modules/core/README.md) slot.

- `businesses`: creating a business and its owner, its handle and the owner's
  username, Arabic names in Latin letters, and the reserved handles (design 7.7)
- [`packs`](packs/README.md): essentials and the packs on for this business; needs, turning on and off (design 7.3)

Today its tables are still in the `core` schema (`core.business`), and the code
still lets one account make up to 5 businesses; both change with the grid.

Has its own tests.
