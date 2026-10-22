# Doors

One system call API, four doors. There is no second, hidden way in. Every door
sends the caller to the [Shell](../shell/README.md) first; the app door's
log-in routes (`/api/auth/`) go to [Login](../login/README.md), which then
asks the Kernel through the Shell.

- [`app`](app/README.md): logged-in members, by session
- [`ai`](ai/README.md): the AI: a service token plus who it acts for. Offering it as an
  MCP server is proposed (design section 26)
- [`public`](public/README.md): shop pages, the chat widget, the webhooks of outside
  services (Telegram, Meta); rate limits
- [`outside`](outside/README.md): outside websites with an API key per business (term 2)

Messages from outside services come **in** through the public door. Messages
go **out** only through a module's drivers, never through a door.
