import { Platform } from 'react-native';

/**
 * Sistem desain Dev Pass.
 *
 * Warna aksen diambil dari palet resmi Universitas Insan Mahardika. Warna
 * utama aplikasi mengikuti Program Studi Informatika (kuning emas), sedangkan
 * warna fakultas lain dipakai sebagai warna status (berhasil, peringatan,
 * bahaya) dengan versi yang dicerahkan agar terbaca di atas latar gelap.
 */
const palette = {
  informatika: '#F0B90B',
  informatikaTerang: '#FFD75E',
  fmt: '#FB7A1E',
  fkes: '#7ED957',
  rmikTerang: '#E85555',
  kesmasTerang: '#8B5BD6',
};

export const colors = {
  // Latar dan permukaan
  background: '#0B0D10',
  surface: '#14171C',
  surfaceAlt: '#1A1E25',
  surfaceSunken: '#0F1216',
  border: '#242A33',
  borderStrong: '#333B47',

  // Teks
  text: '#F2F4F7',
  textMuted: '#98A2B3',
  textFaint: '#667085',

  // Merek
  primary: palette.informatika,
  primaryBright: palette.informatikaTerang,
  primarySoft: 'rgba(240, 185, 11, 0.12)',
  primaryBorder: 'rgba(240, 185, 11, 0.35)',
  onPrimary: '#17130A',

  // Status
  danger: palette.rmikTerang,
  warning: palette.fmt,
  success: palette.fkes,
  accent: palette.kesmasTerang,

  // Warna per kelas karakter pada tampilan hasil
  charLetter: '#F2F4F7',
  charDigit: palette.informatikaTerang,
  charSymbol: palette.fmt,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

/** Font monospace bawaan sistem untuk menampilkan kata sandi. */
export const mono = Platform.select({
  ios: 'Menlo',
  android: 'monospace',
  default: 'monospace',
});

export const typography = {
  title: { fontSize: 26, fontWeight: '800', letterSpacing: 0.5 },
  section: { fontSize: 11, fontWeight: '700', letterSpacing: 1.4 },
  body: { fontSize: 14, fontWeight: '600' },
  caption: { fontSize: 12, fontWeight: '500' },
  micro: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8 },
};

/** Menambahkan alpha pada warna heksadesimal 6 digit. */
export const withAlpha = (hex, alpha) => {
  const value = Math.round(Math.min(Math.max(alpha, 0), 1) * 255)
    .toString(16)
    .padStart(2, '0');
  return `${hex}${value}`;
};
