import { describe, expect, it } from 'vitest';
import { HANDLE_PATTERN, handleFrom, suggestHandle, transliterate, usernameFrom } from '../../os/directory/businesses/names.js';
import { RESERVED } from '../../os/directory/businesses/reserved.js';

describe('handles from business names', () => {
  it('writes Arabic names in Latin letters', () => {
    expect(handleFrom('كافيه النيل')).toBe('kafeh-elnil');
    expect(handleFrom('فول ونور')).toBe('foul-wnour');
    expect(handleFrom('صيدلية الحرية')).toBe('sidlya-elhrya');
    expect(handleFrom('مخبز ٢٠٠٠')).toBe('mkhbz-2000');
    expect(handleFrom('شاي')).toBe('shay');
  });

  it('ignores the marks over and under the letters', () => {
    expect(transliterate('كَافِيه')).toBe(transliterate('كافيه'));
    expect(transliterate('كـــافيه')).toBe('kafeh');
  });

  it('keeps Latin names, without accents, and mixes both', () => {
    expect(handleFrom('Nova Café')).toBe('nova-cafe');
    expect(handleFrom('  Tree -- Smouha!! ')).toBe('tree-smouha');
    expect(handleFrom('Café النيل')).toBe('cafe-elnil');
  });

  it('gives at most 30 characters, never ending in a dash', () => {
    const handle = handleFrom('The Very Long Name Of A Coffee Shop In Alexandria');
    expect(handle.length).toBeLessThanOrEqual(30);
    expect(HANDLE_PATTERN.test(handle)).toBe(true);
  });

  it('falls back to shop and four digits when the name gives too little, the same each time', () => {
    expect(suggestHandle('ك')).toMatch(/^shop-\d{4}$/);
    expect(suggestHandle('ك')).toBe(suggestHandle('ك'));
    expect(suggestHandle('🙂')).toMatch(/^shop-\d{4}$/);
    expect(suggestHandle('كافيه النيل')).toBe('kafeh-elnil');
  });
});

describe('usernames', () => {
  it('take the first name in Latin letters, or the email when there is none', () => {
    expect(usernameFrom('Ahmed Nassem', 'a@example.com')).toBe('ahmed');
    expect(usernameFrom('مصطفى كمال', 'mostafa.k+shop@example.com')).toBe('mostafa.k');
  });
});

describe('reserved handles', () => {
  it('are all real handles, so none of them is dead weight', () => {
    for (const word of RESERVED) expect(HANDLE_PATTERN.test(word), word).toBe(true);
  });
});
