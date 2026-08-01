import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Card from './Card';
import { TYPES } from '../lib/generator';
import { evaluate } from '../lib/strength';
import { levelColor } from '../lib/levelColor';
import { colors, mono, radius, spacing, typography, withAlpha } from '../theme';

const typeLabel = (key) => TYPES.find((item) => item.key === key)?.label ?? key;

/** Riwayat hasil terakhir. Menyentuh sebuah baris menyalinnya kembali. */
export default function HistoryPanel({ items, onCopy }) {
  if (items.length === 0) {
    return (
      <Card style={styles.emptyCard}>
        <Text style={styles.emptyTitle}>Belum ada riwayat</Text>
        <Text style={styles.emptyText}>
          Hasil akan tercatat di sini setiap kali kamu menyalin atau menekan Acak Ulang.
        </Text>
      </Card>
    );
  }

  return (
    <Card style={styles.card}>
      {items.map((item, index) => {
        const strength = evaluate(item.value, item.type);
        const accent = levelColor(strength.level.key);
        return (
          <View key={item.id}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <Pressable
              onPress={() => onCopy(item.value, item.type)}
              accessibilityRole="button"
              accessibilityLabel={`Salin ${typeLabel(item.type)} dari riwayat nomor ${index + 1}`}
              style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            >
              <View
                style={[styles.typeTag, { borderColor: withAlpha(accent, 0.35) }]}
                accessible={false}
              >
                <Text style={[styles.typeTagText, { color: accent }]}>{typeLabel(item.type)}</Text>
              </View>
              <Text style={styles.value} numberOfLines={1} ellipsizeMode="middle">
                {item.value}
              </Text>
              <Text style={styles.copyHint}>Salin</Text>
            </Pressable>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.xs,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyTitle: {
    ...typography.body,
    color: colors.textMuted,
  },
  emptyText: {
    ...typography.caption,
    color: colors.textFaint,
    textAlign: 'center',
    marginTop: spacing.xs,
    lineHeight: 18,
    maxWidth: 260,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rowPressed: {
    opacity: 0.6,
  },
  typeTag: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    minWidth: 54,
    alignItems: 'center',
  },
  typeTagText: {
    ...typography.micro,
    fontSize: 9,
  },
  value: {
    flex: 1,
    fontFamily: mono,
    fontSize: 13,
    color: colors.text,
    letterSpacing: 0.5,
  },
  copyHint: {
    ...typography.micro,
    color: colors.textFaint,
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
