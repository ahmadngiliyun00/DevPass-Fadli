import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing } from '../theme';

/**
 * Tombol aplikasi dengan tiga varian:
 * - `primary`   : latar emas, untuk aksi utama.
 * - `secondary` : garis tepi emas di atas permukaan gelap.
 * - `ghost`     : tanpa latar, untuk aksi sekunder ringan.
 */
export default function Button({
  label,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  accessibilityLabel,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, styles[`${variant}Label`], disabled && styles.disabledLabel]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  secondary: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.primaryBorder,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
  },
  pressed: {
    opacity: 0.75,
  },
  disabled: {
    backgroundColor: colors.surfaceAlt,
    borderColor: colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  primaryLabel: {
    color: colors.onPrimary,
  },
  secondaryLabel: {
    color: colors.primary,
  },
  ghostLabel: {
    color: colors.textMuted,
    fontSize: 12,
  },
  disabledLabel: {
    color: colors.textFaint,
  },
});
