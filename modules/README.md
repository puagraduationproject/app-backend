# Modules

One folder per module. Each owns its data and publishes its system calls.
A module never opens the database itself: the [Kernel](../os/README.md)
runs its code (design 2.9). Each module brings its own data section, its
system calls, its rules, its kinds of things for the OGR, its listeners and
jobs, its pack, and its drivers if it talks to an outside service.

- [`ai`](ai/README.md): the AI module, 12 system calls

- [`core`](core/README.md): Core, 12 system calls
- [`erp`](erp/README.md): ERP, 54 system calls
- [`crm`](crm/README.md): CRM, 31 system calls
- [`channels`](channels/README.md): Channels, 12 system calls
- [`store`](store/README.md): Store website, 10 system calls
- [`studio`](studio/README.md): Studio, 10 system calls
- [`marketing`](marketing/README.md): Marketing, 6 system calls
- [`team`](team/README.md): Team, 10 system calls
- [`reports`](reports/README.md): Reports, 5 system calls

The AI agent and the models live in `app-ai-agent` and `app-ai-model`.
