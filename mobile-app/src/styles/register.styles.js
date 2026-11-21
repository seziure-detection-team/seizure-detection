// File: register.styles.js
// Purpose: Styles of the Create Account screen (A2).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, spacing } from '../theme';

export default StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: fonts.heading.bold,
    fontSize: fontSizes.h1,
    lineHeight: lineHeights.h1,
    marginBottom: spacing.xl,
  },
  roleLabel: {
    color: colors.text,
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    marginBottom: spacing.sm,
  },
  // First card (مريض) is placed at the start = right side in RTL, as in the design
  roleRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
});
