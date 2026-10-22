# OS: Registry

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 2.9. When the design changes, this page changes with it.

Every system call the system has. Loads each call's JSON file from
[`contracts/syscalls/`](../../contracts/syscalls/README.md) (it sits next to
the call's page), with its module, pack, roles, AI default and its own rules;
filters by pack, role and face; serves `ai.find_syscalls`.

The JSON file is what the AI reads to know which commands it can use, and the
contract every other part builds on. Each call's file is written when that
call is built, one by one.

Has its own tests.
