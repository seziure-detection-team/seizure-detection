// File: login.styles.js
// Purpose: Styles of the Login screen (A1, Yaqz v2).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, spacing } from '../theme';

export default StyleSheet.create({
  // Logo at the start of the screen (right in RTL)
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
  forgotLink: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
    paddingVertical: spacing.xs,
  },
  linkText: {
    color: colors.primary,
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    marginEnd: spacing.xs,
  },
  footerLink: {
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
});
