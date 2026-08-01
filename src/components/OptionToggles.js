import React from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

import Card from './Card';
import { OPTION_KEYS } from '../lib/generator';
import { colors, mono, radius, spacing, typography } from '../theme';

/** Nama dan contoh karakter tiap kategori. */
const OPTION_META = {
  lowercase: { label: 'Huruf kecil', sample: 'a b c … z' },
  uppercase: { label: 'Huruf besar', sample: 'A B C … Z' },
  numbers: { label: 'Angka', sample: '0 1 2 … 9' },
  symbols: { label: 'Simbol', sample: '! @ # $ %' },
};

/**
 * Daftar saklar kategori karakter. Hanya berlaku untuk tipe `password`; tipe
 * lain memakai kumpulan karakter tetap sehingga daftarnya dinonaktifkan.
 */
export default function OptionToggles({ options, onToggle, disabled, disabledHint }) {
  return (
    <Card style={styles.card}>
      {disabled ? <Text style={styles.hint}>{disabledHint}</Text> : null}

      {OPTION_KEYS.map((key, index) => {
        const meta = OPTION_META[key];
        const enabled = options[key];
        return (
          <View key={key}>
            {index > 0 ? <View style={styles.divider} /> : null}
            <View style={[styles.row, disabled && styles.rowDisabled]}>
              <View style={styles.info}>
                <Text style={[styles.label, enabled && !disabled && styles.labelActive]}>
                  {meta.label}
                </Text>
                <Text style={styles.sample}>{meta.sample}</Text>
              </View>
              <Switch
                value={enabled}
                onValueChange={() => onToggle(key)}
                disabled={disabled}
                accessibilityLabel={`Sertakan ${meta.label.toLowerCase()}`}
                trackColor={{ false: colors.border, true: colors.primaryBorder }}
                thumbColor={enabled ? colors.primary : colors.textFaint}
                ios_backgroundColor={colors.border}
              />
            </View>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: spacing.sm,
  },
  hint: {
    ...typography.caption,
    color: colors.warning,
    backgroundColor: 'rgba(251, 122, 30, 0.1)',
    borderRadius: radius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowDisabled: {
    opacity: 0.45,
  },
  info: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    ...typography.body,
    color: colors.text,
  },
  labelActive: {
    color: colors.primary,
  },
  sample: {
    ...typography.caption,
    fontFamily: mono,
    color: colors.textFaint,
    marginTop: 3,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
  },
});
