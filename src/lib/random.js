import * as Crypto from 'expo-crypto';

/**
 * Sumber acak kriptografis.
 *
 * `Math.random()` tidak layak dipakai untuk membangkitkan kata sandi karena
 * keluarannya dapat diprediksi. Modul ini memakai `expo-crypto` yang meneruskan
 * permintaan ke penyedia acak milik sistem operasi.
 *
 * Nilai diambil sekaligus dalam satu kolam (pool) berukuran 1024 byte — batas
 * maksimum satu panggilan `getRandomValues` — lalu dikonsumsi satu per satu,
 * sehingga membangkitkan 64 karakter hanya butuh satu panggilan native.
 */
const POOL_LENGTH = 256; // 256 x Uint32 = 1024 byte
const pool = new Uint32Array(POOL_LENGTH);
let cursor = POOL_LENGTH; // memaksa pengisian ulang pada pemakaian pertama

const nextUint32 = () => {
  if (cursor >= POOL_LENGTH) {
    Crypto.getRandomValues(pool);
    cursor = 0;
  }
  return pool[cursor++];
};

const UINT32_RANGE = 4294967296; // 2^32

/**
 * Mengembalikan bilangan bulat acak seragam pada rentang [0, max).
 *
 * Memakai rejection sampling: nilai yang jatuh di sisa pembagian yang tidak
 * genap dibuang, supaya tidak ada karakter yang berpeluang lebih besar muncul
 * (bias modulo).
 *
 * @param {number} max - Batas atas eksklusif, harus > 0.
 * @returns {number} Bilangan bulat acak.
 */
export const randomInt = (max) => {
  if (!Number.isInteger(max) || max <= 0) {
    throw new RangeError('randomInt: max harus bilangan bulat positif');
  }
  if (max === 1) return 0;

  const limit = Math.floor(UINT32_RANGE / max) * max;
  let value = nextUint32();
  while (value >= limit) {
    value = nextUint32();
  }
  return value % max;
};

/**
 * Mengambil satu karakter acak dari sebuah string.
 *
 * @param {string} characters - Kumpulan karakter sumber.
 * @returns {string} Satu karakter acak.
 */
export const randomChar = (characters) => characters.charAt(randomInt(characters.length));

/**
 * Mengacak isi array di tempat memakai Fisher-Yates dengan sumber acak aman.
 *
 * @param {Array} items - Array yang akan diacak.
 * @returns {Array} Array yang sama setelah diacak.
 */
export const shuffle = (items) => {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = randomInt(i + 1);
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
};
