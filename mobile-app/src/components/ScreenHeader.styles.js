// File: ScreenHeader.styles.js
// Purpose: Styles of the screen header (back button, eyebrow + title, end action).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, spacing } from '../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  // Takes the free space, so the action is pushed to the end (left in RTL)
  titleBlock: {
    flex: 1,
  },
  eyebrow: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  action: {
    marginStart: 'auto',
    marginTop: spacing.sm,
  },
});
