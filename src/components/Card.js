import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

/** Permukaan dasar semua panel: latar gelap, garis tepi tipis, sudut membulat. */
export default function Card({ style, children, ...rest }) {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
});
