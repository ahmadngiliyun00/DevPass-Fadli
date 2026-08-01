import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Card from './Card';
import { MAX_BARS } from '../lib/strength';
import { levelColor } from '../lib/levelColor';
import { colors, mono, radius, spacing, typography } from '../theme';

/** Satu baris statistik: nama di kiri, nilai di kanan. */
function StatRow({ label, value, valueColor }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={[styles.statValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
    </View>
  );
}

/**
 * Panel analisis kekuatan: bilah tingkat, entropi dalam bit, dan perkiraan
 * waktu yang dibutuhkan penyerang untuk menebaknya.
 */
export default function StrengthPanel({ strength }) {
  const accent = levelColor(strength.level.key);

  return (
    <Card>
      <View style={styles.bars}>
        {Array.from({ length: MAX_BARS }, (_, index) => (
          <View
            key={index}
            style={[styles.bar, index < strength.bars ? { backgroundColor: accent } : null]}
          />
        ))}
      </View>

      <View style={styles.stats}>
        <StatRow label="Tingkat" value={strength.level.label} valueColor={accent} />
        <View style={styles.divider} />
        <StatRow label="Entropi" value={`${strength.bits} bit`} />
        <View style={styles.divider} />
        <StatRow label="Perkiraan waktu bobol" value={strength.crackTime} />
      </View>

      <Text style={styles.footnote}>
        Perkiraan memakai asumsi serangan luring 10 miliar tebakan per detik.
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  bars: {
    flexDirection: 'row',
    gap: spacing.sm,
    height: 8,
    marginBottom: spacing.lg,
  },
  bar: {
    flex: 1,
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceAlt,
  },
  stats: {
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statValue: {
    ...typography.body,
    fontFamily: mono,
    color: colors.text,
    flexShrink: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
  footnote: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textFaint,
    marginTop: spacing.md,
    lineHeight: 16,
  },
});
