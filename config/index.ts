function required(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing setting ${name}`);
  return value;
}

const mailMode = process.env.MAIL_MODE === 'log' ? 'log' : 'gmail';

export const config = {
  port: Number(process.env.PORT ?? 11001),
  databaseUrl: required('DATABASE_URL'),
  publicUrl: required('PUBLIC_URL').replace(/\/$/, ''),
  authSecret: required('AUTH_SECRET'),
  mail: {
    mode: mailMode,
    gmailUser: mailMode === 'gmail' ? required('GMAIL_USER') : '',
    gmailAppPassword: mailMode === 'gmail' ? required('GMAIL_APP_PASSWORD').replace(/\s/g, '') : '',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID?.trim() ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET?.trim() ?? '',
  },
};
