// File: register.styles.js
// Purpose: Styles of the Create Account screen (A2, Yaqz v2).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, spacing } from '../theme';

export default StyleSheet.create({
  title: {
    marginBottom: spacing.xl,
  },
  roleLabel: {
    color: colors.text,
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    marginBottom: spacing.sm,
  },
  // First chip (مريض) is placed at the start = right side in RTL, as in the design
  roleRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  // Inline error under the role chips (same boxed look as TextField errors)
  roleErrorBox: {
    marginTop: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.errorBg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  roleError: {
    color: colors.error,
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
  },
});
