// File: newPassword.styles.js
// Purpose: Styles of the New Password screen (A6) and its expired-link state.

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  // Light-purple lock tile at the start of the screen (right in RTL)
  lockTile: {
    alignSelf: 'flex-start',
    width: sizes.iconTile,
    height: sizes.iconTile,
    borderRadius: radii.md,
    backgroundColor: colors.sage,
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
  submit: {
    marginTop: spacing.sm,
  },
  message: {
    paddingBottom: spacing.xxxl,
  },
});
