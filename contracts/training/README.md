# Training example format

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 6.10. When the design changes, this page changes with it.

Shared by `app-ai-agent` and `app-ai-model`. The AI team owns the format; the
backend keeps it here so every repo reads the same one.

One example = the request, the skill if any, the system calls with their inputs,
the system call results, and the final answer. Personal data removed.

The system call names, inputs and outputs in examples come from the
[system call reference](../syscalls/README.md). When a system call gets a new version, examples
that use the old one are marked.
