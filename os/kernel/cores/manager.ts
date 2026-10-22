import { fork, type ChildProcess } from 'node:child_process';
import type { Call, Outcome } from '../../shared/protocol/index.js';
import type { Done, Job } from './core.js';

type Result = Outcome;

type Core = {
  number: number;
  process: ChildProcess | null;
  calls: Map<number, (result: Result) => void>;
  restarts: number;
  startedAt: Date;
};

/** Starts the cores, gives each call to the least busy one, and starts a core again when it dies. */
export class CoreManager {
  private readonly cores: Core[] = [];
  private nextJob = 1;
  private stopping = false;

  constructor(count: number, private readonly maxCallsPerCore: number) {
    for (let number = 1; number <= count; number++) {
      const core: Core = { number, process: null, calls: new Map(), restarts: 0, startedAt: new Date() };
      this.cores.push(core);
      this.start(core);
    }
  }

  private start(core: Core) {
    const child = fork(new URL('./core.js', import.meta.url), [], {
      env: { ...process.env, CORE_NUMBER: String(core.number) },
    });
    core.process = child;
    core.startedAt = new Date();
    child.on('message', (message: Done) => {
      if (message?.type !== 'done') return;
      const resolve = core.calls.get(message.job);
      core.calls.delete(message.job);
      resolve?.(message.answer);
    });
    child.on('exit', () => {
      if (core.process !== child) return;
      core.process = null;
      for (const resolve of core.calls.values()) resolve({ ok: false, error: { code: 'core_stopped' } });
      core.calls.clear();
      if (this.stopping) return;
      core.restarts++;
      setTimeout(() => this.start(core), 200);
    });
  }

  run(call: Call): Promise<Result> {
    const free = this.cores
      .filter((core) => core.process?.connected)
      .sort((a, b) => a.calls.size - b.calls.size)[0];
    if (!free || free.calls.size >= this.maxCallsPerCore) {
      return Promise.resolve({ ok: false, error: { code: 'kernel_busy' } });
    }
    const job = this.nextJob++;
    return new Promise((resolve) => {
      free.calls.set(job, resolve);
      free.process!.send({ type: 'run', job, call } satisfies Job);
    });
  }

  status() {
    return this.cores.map((core) => ({
      core: core.number,
      alive: Boolean(core.process?.connected),
      calls: core.calls.size,
      restarts: core.restarts,
      started_at: core.startedAt.toISOString(),
    }));
  }

  stop() {
    this.stopping = true;
    for (const core of this.cores) core.process?.kill();
  }
}
