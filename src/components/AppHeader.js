import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, mono, radius, spacing, typography } from '../theme';

/** Kepala layar: monogram merek, nama aplikasi, dan penanda versi. */
export default function AppHeader({ version }) {
  return (
    <View style={styles.container}>
      <View style={styles.monogram}>
        <Text style={styles.monogramText}>DP</Text>
      </View>
      <View style={styles.titleBlock}>
        <Text style={styles.title}>Dev Pass</Text>
        <Text style={styles.subtitle}>Pembangkit sandi &amp; token aman</Text>
      </View>
      <View style={styles.versionPill}>
        <Text style={styles.versionText}>v{version}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  monogram: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monogramText: {
    fontFamily: mono,
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1,
  },
  titleBlock: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    ...typography.title,
    color: colors.text,
  },
  subtitle: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: 2,
  },
  versionPill: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  versionText: {
    ...typography.micro,
    fontFamily: mono,
    color: colors.textFaint,
  },
});
