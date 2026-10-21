import nodemailer from 'nodemailer';
import { config } from '../../config/index.js';
import { AppError } from '../../kernel/errors/index.js';

const transport =
  config.mail.mode === 'gmail'
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: { user: config.mail.gmailUser, pass: config.mail.gmailAppPassword },
      })
    : null;

export const sentInLogMode: { to: string; code?: string; subject?: string }[] = [];

export async function sendNotice(to: string, subject: string, text: string): Promise<void> {
  if (!transport) {
    sentInLogMode.push({ to, subject });
    return;
  }
  await transport.sendMail({ from: `PUA Graduation Project <${config.mail.gmailUser}>`, to, subject, text });
}

export async function sendCode(to: string, code: string): Promise<void> {
  if (!transport) {
    sentInLogMode.push({ to, code });
    return;
  }
  try {
    await transport.sendMail({
      from: `PUA Graduation Project <${config.mail.gmailUser}>`,
      to,
      subject: `Your code: ${code}`,
      text: `Your code is ${code}\n\nIt works for 10 minutes. If you did not ask for it, you can ignore this email.`,
      html: `<p>Your code is</p><p style="font-size:28px;font-weight:bold;letter-spacing:6px">${code}</p><p>It works for 10 minutes. If you did not ask for it, you can ignore this email.</p>`,
    });
  } catch (error) {
    throw new AppError('outside_failed', 502, `Sending the email failed: ${(error as Error).message}`);
  }
}
