# Module: AI

> From [technical-structure.md](https://github.com/puagraduationproject/graduationproject/blob/main/technical-structure.md) sections 2.9 and 6.9. When the design changes, this page changes with it.

The AI's own part inside the backend: its own data and its own system calls,
checked by the Kernel like any other module. The AI itself (the agent, the
models, the planner) lives with the AI team in `app-ai-agent` and `app-ai-model`.

## Data (schema `ai`)

Memory, the business's skills, schedules, AI permission settings, threads, knowledge, the AI action log. No business data.

Whether the business brain is stored here, the same for every model, is
proposed; the AI team agrees it with the backend (design section 26).

## System calls (12)

The `ai.*` pages are in [contracts/syscalls/ai](../../contracts/syscalls/README.md),
for example `ai.find_syscalls`, `ai.remember`, `ai.schedule`, `ai.save_skill`
and `ai.ask_question`.
