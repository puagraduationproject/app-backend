# How a contract changes

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) section 4.4. When the design changes, this page changes with it.

The system call reference is what everyone builds on: the frontend, the AI team, the
training data, and in term 2 developers outside the team. Anyone must be able to
use a system call from its page alone, without reading the backend's code or asking.

**Each system call's page has:**

| Part | What it says |
|------|--------------|
| Purpose | What it does, in one sentence; when to use it and when not to |
| Inputs | Every parameter: name, type, required or optional, allowed values, default, an example |
| Output | Every field returned, with its type and meaning |
| Errors | Every error code, what it means, and what the caller should do |
| Effects | What it changes, which events it emits, what it never touches |
| Rules | Permission, pack, face, approval default (6.6), retry key, undo, limits |
| Examples | Full calls with their results, including a refused one and an error |
| Version and changes | The current version and every change, with its date |

**The backend's promise:**

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

## The steps

1. Write the change on the page first, in a pull request
2. Add a line to [contracts/changes](../contracts/changes/README.md)
3. Announce it to the frontend and AI teams before merging
4. A breaking change gets a new version; the old one keeps working for at least one term
