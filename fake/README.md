# Fake backend

Answers every system call from the examples on its page and the demo businesses in
`database/seeds`. Same doors, same inputs and outputs as the real backend.

Used by:

- `app-web`, to build windows before the real system calls exist
- `app-ai-agent` and `app-ai-model`, to record conversations and run the test
  set without the real backend (design 6.10)

When a system call page changes, the fake changes with it.
