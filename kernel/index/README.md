# Kernel: Index

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) sections 2.9 and 7.1. When the design changes, this page changes with it.

Answers "whose is it, and what may this person do?". It keeps one business's
data apart from every other's, like home folders on a computer.

Owns the where section: businesses, members, roles, locations, templates, the
packs on for each business, and the AI settings. Today its tables are in the
`core` schema.

- `businesses`: creating a business and its owner's membership, its handle and the owner's
  username, Arabic names in Latin letters, and the reserved handles (design 7.7)
- [`packs`](packs/README.md): essentials and the packs on for this business; needs, turning on and off (design 7.3)

The `core.*` system calls (members, roles, packs, locations) work on this data.

Has its own tests.
