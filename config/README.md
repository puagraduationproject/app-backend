# Config

Settings read once at start: database, secrets by name, model server address,
outside services. An example settings file lives here; real values never do.

- `index.ts`: the backend's settings (database, log-in, mail)
- `services.ts`: the Shell's and the Kernel's settings
- `env.ts`: reading a setting

| Setting | Read by | Default |
|---------|---------|---------|
| `KERNEL_START_KEY` | Shell and Kernel (the same value) | required, at least 32 characters |
| `KERNEL_PORT`, `KERNEL_CORES` | Kernel | 11003, 2 |
| `KEY_OVERLAP_SECONDS`, `KERNEL_MAX_CALLS_PER_CORE` | Kernel | 60, 20 |
| `SHELL_PORT`, `KERNEL_URL` | Shell | 11002, `http://kernel:11003` |
| `KEY_EVERY_SECONDS` | Shell | 300 |
