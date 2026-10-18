# Tests

Tests across modules. Each module also has its own tests next to its code.

- [`isolation`](isolation/README.md): Business A tries to read business B: must fail, for every module
- [`schema-users`](schema-users/README.md): Each module's database user sees only its own schema
- [`roles`](roles/README.md): Each role against each tool
- [`tools`](tools/README.md): Each tool: allowed, refused by role, by pack, by face
- [`pages`](pages/README.md): Each tool behaves exactly as its reference page says
- [`packs`](packs/README.md): Essentials alone, each template, each pack with its needs
- [`undo`](undo/README.md): Every write tool's undo puts things back
- [`order-flow`](order-flow/README.md): Every allowed and refused order move
- [`processes`](processes/README.md): Each cross-module process (design 2.7) end to end
- [`rebuild`](rebuild/README.md): Stock levels and customer stats rebuilt from history match the cache
