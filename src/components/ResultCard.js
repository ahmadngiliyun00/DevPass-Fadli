import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Button from './Button';
import Card from './Card';
import { levelColor } from '../lib/levelColor';
import { colors, mono, radius, spacing, typography, withAlpha } from '../theme';

/** Ukuran huruf menyesuaikan panjang hasil agar tetap muat dalam satu kotak. */
const fontSizeFor = (length) => {
  if (length <= 12) return 26;
  if (length <= 20) return 22;
  if (length <= 32) return 18;
  if (length <= 48) return 15;
  return 13;
};

/** Warna per karakter membantu membaca dan menyalin sandi secara manual. */
const colorForChar = (char) => {
  if (/[0-9]/.test(char)) return colors.charDigit;
  if (/[a-zA-Z]/.test(char)) return colors.charLetter;
  if (char === '-') return colors.textFaint;
  return colors.charSymbol;
};

/** Kartu hasil: menampilkan nilai yang dibangkitkan beserta aksinya. */
export default function ResultCard({ value, strength, onCopy, onRegenerate }) {
  const accent = levelColor(strength.level.key);

  const characters = useMemo(
    () =>
      value.split('').map((char, index) => (
        // Indeks aman sebagai kunci: daftar ini dirender ulang utuh setiap
        // nilai berubah dan tidak pernah disusun ulang sebagian.
        <Text key={`${index}-${char}`} style={{ color: colorForChar(char) }}>
          {char}
        </Text>
      )),
    [value]
  );

  return (
    <Card style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Hasil</Text>
        <View
          style={[
            styles.badge,
            { borderColor: withAlpha(accent, 0.4), backgroundColor: withAlpha(accent, 0.12) },
          ]}
        >
          <View style={[styles.badgeDot, { backgroundColor: accent }]} />
          <Text style={[styles.badgeText, { color: accent }]}>{strength.level.label}</Text>
        </View>
      </View>

      <View
        style={styles.valueBox}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`Hasil yang dibangkitkan: ${value.split('').join(' ')}`}
      >
        <Text
          style={[styles.valueText, { fontSize: fontSizeFor(value.length) }]}
          selectable
          numberOfLines={3}
        >
          {characters}
        </Text>
      </View>

      <View style={styles.actions}>
        <Button
          label="Salin"
          onPress={onCopy}
          style={styles.copyButton}
          accessibilityLabel="Salin hasil ke papan klip"
        />
        <Button
          label="Acak Ulang"
          variant="secondary"
          onPress={onRegenerate}
          style={styles.regenerateButton}
          accessibilityLabel="Bangkitkan nilai baru"
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderColor: colors.borderStrong,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  label: {
    ...typography.section,
    color: colors.textFaint,
    textTransform: 'uppercase',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    ...typography.micro,
  },
  valueBox: {
    backgroundColor: colors.surfaceSunken,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    minHeight: 96,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontFamily: mono,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
    lineHeight: 30,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  copyButton: {
    flex: 1,
  },
  regenerateButton: {
    flex: 1,
  },
});
