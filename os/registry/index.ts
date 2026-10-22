import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

export type Delivery = 'sure' | 'fire_and_forget';

/** One system call's JSON file (contracts/syscalls/README.md). */
export type CallDefinition = {
  name: string;
  version: number;
  module: string;
  description: string;
  connection: { delivery: Delivery; time_limit_ms: number; tries: number };
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  errors: string[];
  rules: Record<string, unknown>;
};

/** Folders read from the program's working folder; the real calls join when they are built. */
const FOLDERS = ['fake/syscalls'];

export function loadCalls(root = process.cwd()): Map<string, CallDefinition> {
  const calls = new Map<string, CallDefinition>();
  for (const folder of FOLDERS) {
    const dir = join(root, folder);
    for (const file of readdirSync(dir).filter((name) => name.endsWith('.json')).sort()) {
      const call = JSON.parse(readFileSync(join(dir, file), 'utf8')) as CallDefinition;
      if (calls.has(call.name)) throw new Error(`System call ${call.name} is defined twice`);
      calls.set(call.name, call);
    }
  }
  return calls;
}
