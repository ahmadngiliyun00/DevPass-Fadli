import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import AppHeader from '../components/AppHeader';
import Button from '../components/Button';
import HistoryPanel from '../components/HistoryPanel';
import LengthControl from '../components/LengthControl';
import Notice from '../components/Notice';
import OptionToggles from '../components/OptionToggles';
import ResultCard from '../components/ResultCard';
import SectionLabel from '../components/SectionLabel';
import StrengthPanel from '../components/StrengthPanel';
import TypeSelector from '../components/TypeSelector';
import { useGenerator } from '../hooks/useGenerator';
import { colors, spacing, typography } from '../theme';

/** Versi aplikasi; selaraskan dengan `version` pada app.json dan package.json. */
const APP_VERSION = '1.0.0';

/** Layar tunggal aplikasi. */
export default function GeneratorScreen() {
  const insets = useSafeAreaInsets();
  const {
    type,
    length,
    sliderLength,
    range,
    options,
    value,
    strength,
    history,
    notice,
    changeType,
    slide,
    commitLength,
    stepLength,
    toggleOption,
    generateNew,
    copy,
    clearHistory,
  } = useGenerator();

  const optionsLocked = type !== 'password';

  return (
    <View style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.sm, paddingBottom: insets.bottom + spacing.xxl * 2 },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AppHeader version={APP_VERSION} />

        <View style={styles.resultWrapper}>
          <ResultCard
            value={value}
            strength={strength}
            onCopy={() => copy()}
            onRegenerate={generateNew}
          />
        </View>

        <SectionLabel title="Tipe keluaran" />
        <TypeSelector value={type} onChange={changeType} />

        <SectionLabel title="Panjang" />
        <LengthControl
          length={length}
          sliderLength={sliderLength}
          range={range}
          onSlide={slide}
          onSlideComplete={commitLength}
          onStep={stepLength}
        />

        <SectionLabel title="Jenis karakter" />
        <OptionToggles
          options={options}
          onToggle={toggleOption}
          disabled={optionsLocked}
          disabledHint={
            type === 'pin'
              ? 'PIN selalu memakai angka 0-9 saja.'
              : 'Token selalu memakai huruf kapital dan angka.'
          }
        />

        <SectionLabel title="Analisis kekuatan" />
        <StrengthPanel strength={strength} />

        <SectionLabel
          title="Riwayat"
          right={
            history.length > 0 ? (
              <Button
                label="Bersihkan"
                variant="ghost"
                onPress={clearHistory}
                accessibilityLabel="Kosongkan riwayat"
              />
            ) : null
          }
        />
        <HistoryPanel items={history} onCopy={copy} />

        <Text style={styles.footer}>
          Hak Cipta © 2026 Universitas Insan Mahardika{'\n'}
          Sandi dibangkitkan di perangkat dan tidak pernah dikirim ke mana pun.
        </Text>
      </ScrollView>

      <Notice notice={notice} bottomOffset={insets.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: spacing.lg,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  resultWrapper: {
    marginTop: spacing.sm,
  },
  footer: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textFaint,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: spacing.xl,
  },
});
