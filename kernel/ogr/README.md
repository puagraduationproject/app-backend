# Kernel: OGR (One Global Reference)

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

Answers "what is this, and what is it linked to?". It is the web of links
inside each business: this chat belongs to this customer, who placed order
#1042, which has two lattes.

- Each module owns its own things; the OGR keeps only their IDs, their kind,
  the module that owns them, and the links between them. It never copies a
  module's data
- Each module registers its kinds of things and links
- The Kernel adds links when a system call or an event creates them. A chat
  with no order has no order link; when the customer orders, the link is added
- The AI asks it through its own system calls, for example "which orders is
  this chat connected to?"

Owns the links section (the `ogr` schema). Has its own tests.
