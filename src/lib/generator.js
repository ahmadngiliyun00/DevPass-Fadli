import { randomChar, shuffle } from './random';

/** Kumpulan karakter per kategori. */
export const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{}:;,.?',
};

/** Urutan kategori sebagaimana ditampilkan pada antarmuka. */
export const OPTION_KEYS = ['lowercase', 'uppercase', 'numbers', 'symbols'];

/** Karakter yang dipakai token (alfanumerik kapital, tanpa pemisah). */
export const TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

/** Panjang setiap kelompok token sebelum tanda hubung. */
export const TOKEN_GROUP = 4;

/**
 * Batas panjang untuk tiap tipe keluaran. Setiap tipe punya rentang sendiri
 * karena PIN 64 digit dan token 9 karakter sama-sama tidak masuk akal.
 */
export const LENGTH_RANGE = {
  password: { min: 8, max: 64, step: 1, initial: 16 },
  pin: { min: 4, max: 12, step: 1, initial: 6 },
  token: { min: 8, max: 32, step: TOKEN_GROUP, initial: 16 },
};

/** Metadata tipe untuk pemilih tipe pada antarmuka. */
export const TYPES = [
  { key: 'password', label: 'Sandi', description: 'Huruf, angka, dan simbol' },
  { key: 'pin', label: 'PIN', description: 'Angka saja' },
  { key: 'token', label: 'Token', description: 'Serial alfanumerik' },
];

/**
 * Membatasi panjang agar berada dalam rentang tipe dan kelipatan langkahnya.
 *
 * @param {number} length - Panjang yang diminta.
 * @param {string} type - 'password' | 'pin' | 'token'.
 * @returns {number} Panjang yang sudah dinormalkan.
 */
export const clampLength = (length, type) => {
  const range = LENGTH_RANGE[type] ?? LENGTH_RANGE.password;
  const rounded = Math.round(length / range.step) * range.step;
  return Math.min(Math.max(rounded, range.min), range.max);
};

/**
 * Membangkitkan kata sandi acak.
 *
 * Menjamin minimal satu karakter dari setiap kategori aktif. Bila panjang yang
 * diminta lebih kecil daripada jumlah kategori aktif, kategori yang dijamin
 * dipilih secara acak sehingga hasilnya tetap sepanjang yang diminta.
 *
 * @param {number} length - Panjang kata sandi.
 * @param {{lowercase: boolean, uppercase: boolean, numbers: boolean, symbols: boolean}} options
 * @returns {string} Kata sandi acak, atau string kosong bila tak ada kategori aktif.
 */
export const generatePassword = (length, options) => {
  const activeSets = OPTION_KEYS.filter((key) => options[key]).map((key) => CHAR_SETS[key]);
  if (activeSets.length === 0 || length <= 0) return '';

  const allChars = activeSets.join('');

  // Satu karakter wajib dari setiap kategori aktif (dipangkas bila panjang
  // yang diminta lebih pendek daripada jumlah kategori).
  const guaranteed = shuffle([...activeSets])
    .slice(0, length)
    .map((set) => randomChar(set));

  const result = [...guaranteed];
  while (result.length < length) {
    result.push(randomChar(allChars));
  }

  return shuffle(result).join('');
};

/**
 * Membangkitkan PIN numerik.
 *
 * @param {number} length - Jumlah digit.
 * @returns {string} PIN acak.
 */
export const generatePin = (length) => {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += randomChar(CHAR_SETS.numbers);
  }
  return result;
};

/**
 * Membangkitkan token berformat serial, misal `AB3K-X92P-Q8TR`.
 *
 * @param {number} length - Jumlah karakter (dinormalkan ke kelipatan 4).
 * @returns {string} Token dengan pemisah tanda hubung tiap 4 karakter.
 */
export const generateToken = (length) => {
  const total = clampLength(length, 'token');
  const groups = [];
  for (let g = 0; g < total / TOKEN_GROUP; g += 1) {
    let group = '';
    for (let i = 0; i < TOKEN_GROUP; i += 1) {
      group += randomChar(TOKEN_CHARS);
    }
    groups.push(group);
  }
  return groups.join('-');
};

/**
 * Pintu masuk tunggal pembangkit: memilih algoritma sesuai tipe.
 *
 * @param {string} type - 'password' | 'pin' | 'token'.
 * @param {number} length - Panjang yang diminta.
 * @param {object} options - Kategori karakter (khusus tipe 'password').
 * @returns {string} Hasil pembangkitan.
 */
export const generate = (type, length, options) => {
  const safeLength = clampLength(length, type);
  if (type === 'pin') return generatePin(safeLength);
  if (type === 'token') return generateToken(safeLength);
  return generatePassword(safeLength, options);
};

