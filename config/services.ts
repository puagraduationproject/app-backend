import { number, startKey } from './env.js';

export const kernelSettings = () => ({
  port: number('KERNEL_PORT', 11003),
  cores: number('KERNEL_CORES', 2),
  startKey: startKey(),
  keyOverlapSeconds: number('KEY_OVERLAP_SECONDS', 60),
  maxCallsPerCore: number('KERNEL_MAX_CALLS_PER_CORE', 20),
});

export const shellSettings = () => ({
  port: number('SHELL_PORT', 11002),
  kernelUrl: (process.env.KERNEL_URL ?? 'http://kernel:11003').replace(/\/$/, ''),
  startKey: startKey(),
  keyEverySeconds: number('KEY_EVERY_SECONDS', 300),
});
