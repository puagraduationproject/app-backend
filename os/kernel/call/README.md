# Kernel: call

Takes a system call with its Pass, finds it in the registry, runs the five
checks, then runs the module's code in one transaction: the change, the audit
row, the outbox event and the new OGR links.

Has its own tests.
