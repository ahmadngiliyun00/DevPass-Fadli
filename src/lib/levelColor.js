import { colors } from '../theme';

/** Warna untuk setiap tingkat kekuatan: merah → oranye → emas → hijau. */
const LEVEL_COLORS = {
  weak: colors.danger,
  fair: colors.warning,
  strong: colors.primaryBright,
  excellent: colors.success,
};

/**
 * @param {string} levelKey - Kunci tingkat dari `LEVELS`.
 * @returns {string} Warna heksadesimal untuk tingkat tersebut.
 */
export const levelColor = (levelKey) => LEVEL_COLORS[levelKey] ?? colors.textMuted;
