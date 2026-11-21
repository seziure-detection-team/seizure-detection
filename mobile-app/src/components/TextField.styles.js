// File: TextField.styles.js
// Purpose: Styles of the labelled text field (label, input box, hint and error text).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  label: {
    color: colors.text,
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    marginBottom: spacing.sm,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: sizes.inputHeight,
    borderWidth: sizes.borderWidth,
    borderColor: colors.line,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
  },
  inputRowError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    paddingVertical: spacing.sm,
    textAlign: 'right',
  },
  // Email and other Latin input (IBM Plex Sans), typed left-to-right
  inputLatin: {
    fontFamily: fonts.latin.regular,
    writingDirection: 'ltr',
  },
  hint: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    marginTop: spacing.xs,
  },
  error: {
    color: colors.error,
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
    marginTop: spacing.xs,
  },
});
