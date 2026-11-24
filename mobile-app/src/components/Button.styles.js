// File: Button.styles.js
// Purpose: Styles of the primary Button (ink pill, 56 high, button shadow).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, shadows, sizes, spacing } from '../theme';

export default StyleSheet.create({
  // Outer layer: shadow, press scale, disabled opacity and the caller's margins
  wrapper: {
    borderRadius: radii.pill,
    ...shadows.button,
  },
  button: {
    minHeight: sizes.buttonHeight,
    borderRadius: radii.pill,
    backgroundColor: colors.text, // spec "ink"
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  pressed: {
    backgroundColor: colors.inkPressed,
  },
  disabled: {
    opacity: 0.45,
  },
  // Full-width, centred label: avoids Android clipping the end of Arabic text when the
  // label is measured narrower than its rendered width (seen on A6 "حفظ كلمة المرور")
  label: {
    alignSelf: 'stretch',
    textAlign: 'center',
    color: colors.surface,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.button,
    lineHeight: lineHeights.button,
  },
  // Icon + label, centred together
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  labelWithIcon: {
    flexShrink: 1,
    color: colors.surface,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.button,
    lineHeight: lineHeights.button,
  },
});
