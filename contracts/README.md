# Contracts

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 4.4. When the design changes, this page changes with it.

Written once here, used by the backend, `app-web`, `app-ai-agent` and
`app-ai-model`. The backend owns them and keeps its word.

| Folder | Holds |
|--------|-------|
| [syscalls/](syscalls/README.md) | One reference page per system call |
| [packs/](packs/README.md) | The essentials and every pack |
| [events/](events/README.md) | The envelope and one page per event |
| [cards/](cards/README.md) | The cards the windows and the AI show |
| [values/](values/README.md) | Shared IDs, money, statuses, roles, channels, AI settings |
| [errors/](errors/README.md) | Error codes |
| [limits/](limits/README.md) | Shared limits |
| [training/](training/README.md) | The training example format |
| [changes/](changes/README.md) | Every change, announced before merging |

## The backend's promise

1. The page and the code never differ. The page is written first, the backend
   builds to it, and an automatic test checks every system call against its page
2. A published system call never changes in a way that breaks a caller. Adding is
   allowed: a new optional input, a new output field, a new system call
3. A breaking change (renaming an input, removing a field, changing what a call
   does) is a **new version**. The old version keeps working for at least one
   term and is marked as old on its page
4. Every change is announced to all subteams **before** it is merged, with what
   changed and why, and written in the changes list of the reference
5. The backend is responsible for this. A change that breaks a caller without a
   new version is a bug, and it is fixed by restoring the old behaviour
