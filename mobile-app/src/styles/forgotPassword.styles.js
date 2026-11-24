// File: forgotPassword.styles.js
// Purpose: Styles of the Forgot Password screen (A4, Yaqz v2).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, spacing } from '../theme';

export default StyleSheet.create({
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    marginTop: spacing.sm,
    marginBottom: spacing.xxl,
  },
});
