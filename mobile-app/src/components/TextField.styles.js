// File: TextField.styles.js
// Purpose: Styles of the labelled text field (label, input box, icon chip, focus halo,
// state borders, hint and error message).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

// Width of the focus halo around the field (design: 4 px primarySoft)
const HALO = spacing.xs;

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
  // Icon chip 8 from the start edge
  inputRowWithIcon: {
    paddingStart: spacing.sm,
  },
  // The accessory (eye toggle) has its own 44 touch area
  inputRowWithAccessory: {
    paddingEnd: spacing.xs,
  },
  halo: {
    position: 'absolute',
    top: -HALO,
    bottom: -HALO,
    left: -HALO,
    right: -HALO,
    borderRadius: radii.lg + HALO,
    borderWidth: HALO,
    borderColor: colors.sage, // spec "primarySoft"
  },
  stateBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.lg,
    borderWidth: sizes.borderWidthSelected,
  },
  focusBorder: {
    borderColor: colors.primary,
  },
  errorBorder: {
    borderColor: colors.error,
  },
  chip: {
    width: sizes.iconChip,
    height: sizes.iconChip,
    borderRadius: radii.md,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Focused chip, cross-faded over the normal one
  chipFocused: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    paddingVertical: spacing.sm,
    textAlign: 'right',
  },
  inputWithIcon: {
    marginStart: spacing.md,
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
  errorBox: {
    marginTop: spacing.sm,
    borderRadius: radii.md,
    backgroundColor: colors.errorBg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  error: {
    color: colors.error,
    fontFamily: fonts.body.medium,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.caption,
  },
});
