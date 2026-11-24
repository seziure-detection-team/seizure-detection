// File: Banner.styles.js
// Purpose: Styles of the message box (error, warning and success variants), as the
// "connection lost" alert of design B4.

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderRadius: radii.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  error: {
    backgroundColor: colors.errorBg,
  },
  warning: {
    backgroundColor: colors.amberBg, // spec "warningSoft"
  },
  success: {
    backgroundColor: colors.sage, // spec "primarySoft"
  },
  iconChip: {
    width: sizes.iconChip,
    height: sizes.iconChip,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  texts: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
  },
  message: {
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  errorText: {
    color: colors.error,
  },
  warningText: {
    color: colors.onWarningSoft,
  },
  successText: {
    color: colors.primary,
  },
});
