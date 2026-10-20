function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing setting ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 11001),
  databaseUrl: required('DATABASE_URL'),
};
