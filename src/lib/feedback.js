import * as Haptics from 'expo-haptics';

/**
 * Umpan balik getar. Semua panggilan dibungkus penangkap galat karena getaran
 * hanyalah pemanis: perangkat tanpa motor getar (atau web) tidak boleh membuat
 * aksi utamanya gagal.
 */
const safely = (run) => {
  try {
    const result = run();
    if (result && typeof result.catch === 'function') result.catch(() => {});
  } catch {
    // diabaikan dengan sengaja
  }
};

/** Getaran ringan saat memilih opsi. */
export const selectionFeedback = () => safely(() => Haptics.selectionAsync());

/** Getaran saat menekan tombol aksi. */
export const impactFeedback = () =>
  safely(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));

/** Getaran penanda operasi berhasil. */
export const successFeedback = () =>
  safely(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));

/** Getaran penanda operasi gagal / ditolak. */
export const warningFeedback = () =>
  safely(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning));
