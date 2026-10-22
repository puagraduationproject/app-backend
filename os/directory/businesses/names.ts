import { createHash } from 'node:crypto';

// Names work like email addresses: username@handle (design 7.7).

export const HANDLE_PATTERN = /^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/;

// Arabic letters in Latin, the way Egyptians write names in chats ("kafeh-elnil").
// Short vowels are not written in Arabic, so the result is a start the owner can edit.
const LETTERS: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'a', 'ٱ': 'a', 'ب': 'b', 'ت': 't', 'ث': 's', 'ج': 'g', 'ح': 'h',
  'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't',
  'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h',
  'ة': 'a', 'ى': 'a', 'ئ': 'e', 'ؤ': 'o', 'ء': '', 'پ': 'p', 'چ': 'ch', 'ڤ': 'v', 'گ': 'g', 'ک': 'k',
};

function arabicWord(word: string): string {
  const article = word.length > 3 && word.startsWith('ال');
  const letters = [...(article ? word.slice(2) : word)];
  let out = article ? 'el' : '';
  letters.forEach((letter, i) => {
    const before = letters[i - 1];
    const after = letters[i + 1];
    if (letter === 'و') {
      out += i === 0 || before === 'ا' ? 'w' : 'ou';
    } else if (letter === 'ي' || letter === 'ی') {
      if (i === 0 || before === 'ا' || after === undefined || (after === 'ة' && i === letters.length - 2)) out += 'y';
      else if (after === 'ه' && i === letters.length - 2) out += 'e';
      else out += 'i';
    } else {
      out += LETTERS[letter] ?? letter;
    }
  });
  return out;
}

export function transliterate(text: string): string {
  return text
    .replace(/[ً-ٰٟـ]/g, '')
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0))
    .replace(/[؀-ۿ]+/g, arabicWord)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

export function handleFrom(name: string): string {
  return transliterate(name).replace(/[^a-z0-9]+/g, '-').replace(/^-+/, '').slice(0, 30).replace(/-+$/, '');
}

// A handle for a new business: from its name, or "shop-" and four digits when the
// name gives too little. The digits come from the name, so the same name gives the same handle.
export function suggestHandle(name: string): string {
  const handle = handleFrom(name);
  if (handle.length >= 3) return handle;
  const digits = 1000 + (parseInt(createHash('sha256').update(name.trim()).digest('hex').slice(0, 8), 16) % 9000);
  return `shop-${digits}`;
}

export function usernameFrom(name: string | null, email: string): string {
  const clean = (value: string) => value.toLowerCase().replace(/[^a-z0-9._-]/g, '').slice(0, 30).replace(/^[._-]+|[._-]+$/g, '');
  const fromName = clean((name ?? '').trim().split(/\s+/)[0] ?? '');
  if (fromName.length >= 2) return fromName;
  const fromEmail = clean(email.split('@')[0]!.split('+')[0]!);
  return fromEmail.length >= 2 ? fromEmail : 'me';
}
