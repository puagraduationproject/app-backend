# Internal system calls (`system.*`)

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

Used only by Login in the Gateway, with the actor "gateway" and no business.
Never offered to the app, the AI or outside callers, so they are not counted
in the system call list and never appear in `ai.find_syscalls`.

The list is in [os/system](../../../os/system/README.md). One page per
call will be written here before it is built.
