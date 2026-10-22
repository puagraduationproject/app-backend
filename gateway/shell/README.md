# Gateway: Shell

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

The only door into the Kernel, and a service of its own (port 11002, inside
the network only). For every command (system call) that comes in, from any
door or from [Login](../login/README.md):

1. Reads the command and checks its inputs against the call's JSON file
2. Seals it into a **Pass**: the business, the person's session token, the
   call and its input, sealed with the current key
   ([protocol](../../contracts/protocol/README.md))
3. Hands it to the Kernel, sends it again when a sure call gets no answer,
   and gives the answer back to the caller

The Kernel checks the session token itself; the Shell never reads or writes
data. The Shell asks the Kernel for a new key every 5 minutes.

- `server.ts`: the service: `POST /call` (from the doors), `GET /health`
- `link.ts`: the Shell's side of the protocol: the keys, sealing, sending again

The doors do not call the Shell yet (the next road); today the routes still
check the session themselves. Tests: `tests/road/`.
