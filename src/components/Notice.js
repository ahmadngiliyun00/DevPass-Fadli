import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

import { colors, radius, spacing, typography, withAlpha } from '../theme';

const TONE_COLORS = {
  info: colors.primary,
  success: colors.success,
  warning: colors.warning,
  danger: colors.danger,
};

/**
 * Notifikasi ringkas yang muncul di bawah layar. Isi terakhir dipertahankan
 * selama animasi keluar agar teksnya tidak hilang sebelum sempat memudar.
 */
export default function Notice({ notice, bottomOffset = 0 }) {
  const progress = useRef(new Animated.Value(0)).current;
  const [content, setContent] = useState(notice);

  useEffect(() => {
    if (notice) setContent(notice);
    Animated.timing(progress, {
      toValue: notice ? 1 : 0,
      duration: 180,
      useNativeDriver: true,
    }).start();
  }, [notice, progress]);

  if (!content) return null;

  const accent = TONE_COLORS[content.tone] ?? colors.primary;

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      style={[
        styles.container,
        {
          bottom: bottomOffset + spacing.lg,
          borderColor: withAlpha(accent, 0.45),
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [16, 0],
              }),
            },
          ],
        },
      ]}
    >
      <Text style={[styles.text, { color: accent }]}>{content.message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  text: {
    ...typography.body,
    fontSize: 13,
    textAlign: 'center',
  },
});
