// File: accountError.styles.js
// Purpose: Styles of the account error screen (profile missing/unreadable/unsupported role).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, spacing } from '../theme';

export default StyleSheet.create({
  message: {
    paddingBottom: spacing.xxxl,
  },
  logoutLink: {
    alignSelf: 'center',
    marginTop: spacing.lg,
    paddingVertical: spacing.sm,
  },
  logoutText: {
    color: colors.primary,
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.small,
    lineHeight: lineHeights.small,
  },
});
