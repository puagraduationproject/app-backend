# OS: Sessions

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) sections 2.9 and 7.6. When the design changes, this page changes with it.

The tokens and devices of each business, kept in that business's own slot of
the [`sessions` schema](../../database/migrations/sessions/README.md). It holds
no passwords.

- A token reads `<business_id>.<secret>` and is made only after the password
  and the second step pass. The Kernel opens only that business's slot, so a
  token with a changed business ID matches nothing
- On every call it is the one real lookup: whose token is this, with which
  role. The business's place comes from the Directory in the Kernel's memory
- Replaces or ends an account's sessions when the Kernel says its role
  changed or it was removed
- Records each session's device, for the business's entry rules (approved
  devices, network, hours, by role)

The session rules (how long, 5 devices, the browser check) are in
[Login](../../gateway/login/README.md#sessions).

Not built yet; today's sessions are in `core.session`.
