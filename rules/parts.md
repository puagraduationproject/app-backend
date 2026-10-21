# The parts

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) sections 2.9 to 2.11. When the design changes, this page changes with it.

The backend works like a computer's operating system, but for a business, and
driven by the AI. People use the ERP, CRM and Channels from the screens, the
way a person types commands in a shell; the AI uses the very same system calls.
A system call is one small action, like `cat` on a computer.

| Computer | Ours | Folder |
|----------|------|--------|
| User mode | Gateway (mode 1): the doors and the Shell | [`gateway/`](../gateway/README.md) |
| Shell: log-in, who you are | Shell: signs a Pass for one call | [`gateway/shell/`](../gateway/shell/README.md) |
| Kernel mode | Kernel (mode 0): five checks, then runs; the only part that reads and writes business data | [`kernel/`](../kernel/README.md) |
| Users, groups, home folders | Index: whose is it, what may this person do | [`kernel/index/`](../kernel/index/README.md) |
| Links between files | OGR: what is this, and what is it linked to | [`kernel/ogr/`](../kernel/ogr/README.md) |
| System call table | Registry: every system call, from its page | [`kernel/syscall-registry/`](../kernel/syscall-registry/README.md) |
| Daemons, cron | Daemons: events, jobs, retries; they call the Kernel as "system" | [`daemons/`](../daemons/README.md) |
| Programs | Modules: ERP, CRM, Channels, Store, Reports, the AI module | [`modules/`](../modules/README.md) |
| Drivers | Drivers: the only parts that talk to outside services | `modules/*/drivers/` |

## How one call runs

1. A caller comes in through a door: the app (session), the AI (token and who
   it acts for), public (shop page, webhooks) or outside (API key, term 2)
2. The Shell checks who is calling and signs a Pass: account, business,
   actor, expiry. No Pass, no call
3. The Kernel finds the system call in the Registry, asks the Index and the
   OGR, and runs five checks: may he, same business, data rules, already done,
   within limits. It can block a call even when it was approved
4. In one transaction it runs the module's code and writes the change, the
   audit row, the event (outbox) and the new OGR links
5. The Daemons deliver the event to the listeners and the live updates

## Rules

1. Only the Kernel reads and writes business data. A module never opens the
   database; a daemon calls the Kernel like anyone else
2. The Shell owns only the users section and never touches business data
3. Messages come **in** through the public door, and go **out** only through
   a driver, when a system call or a daemon asks for it through the Kernel
4. A new module plugs in without changing the Shell, the Kernel or any other
   module: its data section, its system calls, its rules, its kinds of things
   for the OGR, its listeners and jobs, its pack, its drivers
