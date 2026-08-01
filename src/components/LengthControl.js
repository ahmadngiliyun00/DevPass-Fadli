import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';

import Card from './Card';
import { colors, mono, radius, spacing, typography } from '../theme';

/** Tombol bulat untuk menambah / mengurangi panjang satu langkah. */
function StepButton({ symbol, onPress, disabled, label }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      hitSlop={8}
      style={({ pressed }) => [
        styles.stepButton,
        pressed && !disabled && styles.stepButtonPressed,
        disabled && styles.stepButtonDisabled,
      ]}
    >
      <Text style={[styles.stepSymbol, disabled && styles.stepSymbolDisabled]}>{symbol}</Text>
    </Pressable>
  );
}

/**
 * Pengatur panjang: angka besar dengan tombol langkah, ditambah penggeser untuk
 * perubahan cepat. Nilai penggeser dipisah dari nilai final agar geseran mulus.
 */
export default function LengthControl({
  length,
  sliderLength,
  range,
  onSlide,
  onSlideComplete,
  onStep,
}) {
  return (
    <Card style={styles.card}>
      <View style={styles.valueRow}>
        <StepButton
          symbol="−"
          label="Kurangi panjang"
          onPress={() => onStep(-1)}
          disabled={length <= range.min}
        />
        <View style={styles.valueBlock}>
          <Text style={styles.value}>{sliderLength}</Text>
          <Text style={styles.unit}>karakter</Text>
        </View>
        <StepButton
          symbol="+"
          label="Tambah panjang"
          onPress={() => onStep(1)}
          disabled={length >= range.max}
        />
      </View>

      <Slider
        style={styles.slider}
        minimumValue={range.min}
        maximumValue={range.max}
        step={range.step}
        value={sliderLength}
        onValueChange={onSlide}
        onSlidingComplete={onSlideComplete}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.border}
        thumbTintColor={colors.primary}
        accessibilityLabel="Penggeser panjang keluaran"
      />

      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>{range.min}</Text>
        <Text style={styles.rangeText}>{range.max}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingBottom: spacing.md,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueBlock: {
    alignItems: 'center',
  },
  value: {
    fontFamily: mono,
    fontSize: 40,
    fontWeight: '800',
    color: colors.primary,
    lineHeight: 46,
  },
  unit: {
    ...typography.caption,
    color: colors.textFaint,
    marginTop: -2,
  },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepButtonPressed: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.primaryBorder,
  },
  stepButtonDisabled: {
    opacity: 0.4,
  },
  stepSymbol: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    lineHeight: 26,
  },
  stepSymbolDisabled: {
    color: colors.textFaint,
  },
  slider: {
    width: '100%',
    height: 36,
    marginTop: spacing.sm,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  rangeText: {
    ...typography.micro,
    fontFamily: mono,
    color: colors.textFaint,
  },
});
