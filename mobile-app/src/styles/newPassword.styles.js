// File: newPassword.styles.js
// Purpose: Styles of the New Password screen (A6, Yaqz v2) and its expired-link state.

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, spacing } from '../theme';

export default StyleSheet.create({
  // Logo at the start of the screen (right in RTL), as in the A6 design
  logo: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxxl,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
  message: {
    paddingBottom: spacing.xxxl,
  },
});
