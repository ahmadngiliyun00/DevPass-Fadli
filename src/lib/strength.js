import { CHAR_SETS, TOKEN_CHARS } from './generator';

/**
 * Tingkat kekuatan, diurutkan dari terlemah. `min` adalah ambang entropi (bit)
 * minimum untuk masuk ke tingkat tersebut. Ambang mengikuti skala entropi yang
 * lazim dipakai: di bawah 36 bit rapuh, 36-59 memadai, 60-79 kuat, 80 ke atas
 * praktis tak mungkin ditebak dengan perangkat keras masa kini.
 */
export const LEVELS = [
  { key: 'weak', label: 'Lemah', min: 0, bars: 1 },
  { key: 'fair', label: 'Sedang', min: 36, bars: 2 },
  { key: 'strong', label: 'Kuat', min: 60, bars: 3 },
  { key: 'excellent', label: 'Sangat Kuat', min: 80, bars: 4 },
];

export const MAX_BARS = 4;

/** Asumsi kecepatan tebakan penyerang luring: 10 miliar percobaan per detik. */
const GUESSES_PER_SECOND = 1e10;

const SECOND = 1;
const MINUTE = 60;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const YEAR = 365 * DAY;

/**
 * Menghitung ukuran ruang karakter (pool) yang benar-benar terpakai pada sebuah
 * hasil. Dihitung dari isi string, bukan dari saklar di antarmuka, supaya
 * riwayat pun bisa dinilai tanpa menyimpan konfigurasinya.
 *
 * @param {string} value - Kata sandi / PIN / token.
 * @param {string} type - Tipe keluaran.
 * @returns {number} Jumlah kemungkinan karakter per posisi.
 */
const poolSize = (value, type) => {
  if (type === 'pin') return CHAR_SETS.numbers.length;
  if (type === 'token') return TOKEN_CHARS.length;

  let size = 0;
  if (/[a-z]/.test(value)) size += CHAR_SETS.lowercase.length;
  if (/[A-Z]/.test(value)) size += CHAR_SETS.uppercase.length;
  if (/[0-9]/.test(value)) size += CHAR_SETS.numbers.length;
  // Karakter apa pun di luar alfanumerik dihitung sebagai simbol.
  if (/[^a-zA-Z0-9]/.test(value)) size += CHAR_SETS.symbols.length;
  return size;
};

/** Panjang bermakna: tanda hubung pada token bukan bagian dari rahasia. */
const significantLength = (value, type) =>
  type === 'token' ? value.replace(/-/g, '').length : value.length;

/**
 * Mengubah durasi dalam detik menjadi teks yang mudah dibaca (bahasa Indonesia).
 *
 * @param {number} seconds - Durasi dalam detik.
 * @returns {string} Misal `3 hari`, `12 tahun`, `lebih dari 1 miliar tahun`.
 */
export const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds)) return 'lebih dari 1 miliar tahun';
  if (seconds < SECOND) return 'kurang dari 1 detik';
  if (seconds < MINUTE) return `${Math.round(seconds)} detik`;
  if (seconds < HOUR) return `${Math.round(seconds / MINUTE)} menit`;
  if (seconds < DAY) return `${Math.round(seconds / HOUR)} jam`;
  if (seconds < YEAR) return `${Math.round(seconds / DAY)} hari`;

  const years = seconds / YEAR;
  if (years < 1e3) return `${Math.round(years)} tahun`;
  if (years < 1e6) return `${Math.round(years / 1e3)} ribu tahun`;
  if (years < 1e9) return `${Math.round(years / 1e6)} juta tahun`;
  return 'lebih dari 1 miliar tahun';
};

/**
 * Menilai kekuatan sebuah hasil pembangkitan.
 *
 * Entropi dihitung sebagai `panjang x log2(ukuran pool)` — ukuran baku untuk
 * rahasia yang dibangkitkan secara acak seragam, yang persis seperti keluaran
 * aplikasi ini.
 *
 * @param {string} value - Kata sandi / PIN / token.
 * @param {string} type - 'password' | 'pin' | 'token'.
 * @returns {{bits: number, level: object, bars: number, crackTime: string}}
 */
export const evaluate = (value, type) => {
  const empty = { bits: 0, level: LEVELS[0], bars: 0, crackTime: 'kurang dari 1 detik' };
  if (!value) return empty;

  const pool = poolSize(value, type);
  const length = significantLength(value, type);
  if (pool <= 1 || length === 0) return empty;

  const bits = length * Math.log2(pool);

  // Rata-rata penyerang menemukan rahasia setelah separuh ruang kunci ditelusuri.
  const seconds = Math.pow(2, bits - 1) / GUESSES_PER_SECOND;

  let level = LEVELS[0];
  for (const candidate of LEVELS) {
    if (bits >= candidate.min) level = candidate;
  }

  return {
    bits: Math.round(bits),
    level,
    bars: level.bars,
    crackTime: formatDuration(seconds),
  };
};
