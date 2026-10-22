# Fake backend

Answers every system call from the examples on its page and the demo businesses in
`database/seeds`. Same doors, same inputs and outputs as the real backend.

Used by:

- `app-web`, to build windows before the real system calls exist
- `app-ai-agent` and `app-ai-model`, to record conversations and run the test
  set without the real backend (design 6.10)

When a system call page changes, the fake changes with it.

## Today

- `syscalls/`: the fake test calls the Kernel answers while it has no real
  ones: `test.echo` (gives back its input and the core), `test.busy` (keeps
  one core busy), `test.crash` (stops its own core). Each is a JSON file in
  the format of [contracts/syscalls](../contracts/syscalls/README.md)
- `sessions.json`: fake session tokens, their accounts and the businesses
  they may enter, checked by the Kernel until the real sessions move to it

Both are in the backend image, for the Kernel and the Shell.
