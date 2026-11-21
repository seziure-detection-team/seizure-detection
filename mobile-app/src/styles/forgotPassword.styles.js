// File: forgotPassword.styles.js
// Purpose: Styles of the Forgot Password screen (A4).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, spacing } from '../theme';

export default StyleSheet.create({
  title: {
    color: colors.text,
    fontFamily: fonts.heading.bold,
    fontSize: fontSizes.h1,
    lineHeight: lineHeights.h1,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
