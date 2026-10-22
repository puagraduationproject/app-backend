export function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing setting ${name}`);
  return value;
}

export function number(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(value) || value <= 0) throw new Error(`Setting ${name} must be a positive number`);
  return value;
}

export function startKey(): string {
  const value = required('KERNEL_START_KEY');
  if (value.length < 32) throw new Error('KERNEL_START_KEY must be at least 32 characters');
  return value;
}
