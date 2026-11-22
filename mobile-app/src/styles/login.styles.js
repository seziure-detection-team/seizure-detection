// File: login.styles.js
// Purpose: Styles of the Login screen (A1).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  // Purple logo tile with the pulse icon, at the start of the screen (right in RTL)
  logoTile: {
    alignSelf: 'flex-start',
    width: sizes.iconTile,
    height: sizes.iconTile,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxxl,
    marginBottom: spacing.xl,
  },
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
  forgotLink: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
  linkText: {
    color: colors.primary,
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.small,
    lineHeight: lineHeights.small,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.small,
    lineHeight: lineHeights.small,
    marginEnd: spacing.xs,
  },
});
