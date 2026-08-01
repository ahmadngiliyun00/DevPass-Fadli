import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { TYPES } from '../lib/generator';
import { colors, radius, spacing, typography } from '../theme';

/** Pemilih tipe keluaran: Sandi, PIN, atau Token. */
export default function TypeSelector({ value, onChange }) {
  const active = TYPES.find((item) => item.key === value) ?? TYPES[0];

  return (
    <View>
      <View style={styles.track} accessibilityRole="tablist">
        {TYPES.map((item) => {
          const selected = item.key === value;
          return (
            <Pressable
              key={item.key}
              onPress={() => onChange(item.key)}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={`Tipe ${item.label}`}
              style={({ pressed }) => [
                styles.segment,
                selected && styles.segmentActive,
                pressed && !selected && styles.segmentPressed,
              ]}
            >
              <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <Text style={styles.description}>{active.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentPressed: {
    backgroundColor: colors.surfaceAlt,
  },
  segmentText: {
    ...typography.body,
    color: colors.textMuted,
  },
  segmentTextActive: {
    color: colors.onPrimary,
    fontWeight: '800',
  },
  description: {
    ...typography.caption,
    color: colors.textFaint,
    marginTop: spacing.sm,
    marginLeft: 2,
  },
});
