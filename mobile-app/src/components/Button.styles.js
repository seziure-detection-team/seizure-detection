// File: Button.styles.js
// Purpose: Styles of the primary Button (filled purple, rounded, as in the designs).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  button: {
    minHeight: sizes.buttonHeight,
    borderRadius: radii.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  pressed: {
    opacity: 0.85,
  },
  disabled: {
    opacity: 0.6,
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
});
