// File: Banner.styles.js
// Purpose: Styles of the message banner (error and success variants), modelled on the
// warning banner of design B4.

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, spacing } from '../theme';

export default StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: radii.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  error: {
    backgroundColor: colors.errorBg,
  },
  success: {
    backgroundColor: colors.sage,
  },
  icon: {
    marginTop: spacing.xxs,
    marginEnd: spacing.sm,
  },
  message: {
    flex: 1,
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.small,
    lineHeight: lineHeights.small,
  },
  messageError: {
    color: colors.error,
  },
  messageSuccess: {
    color: colors.primary,
  },
});
