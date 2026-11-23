// File: ChoiceChip.styles.js
// Purpose: Styles of the choice chip (A2 role: مريض / مرافق; B7 event label).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  chip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    minHeight: sizes.chipHeight,
    paddingHorizontal: spacing.lg,
    borderWidth: sizes.borderWidth,
    borderColor: colors.line,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  // Selected look, faded in over the chip (covers the 1 px line border)
  selectedLayer: {
    position: 'absolute',
    top: -sizes.borderWidth,
    bottom: -sizes.borderWidth,
    left: -sizes.borderWidth,
    right: -sizes.borderWidth,
    borderRadius: radii.pill,
    borderWidth: sizes.borderWidthSelected,
    borderColor: colors.primary,
    backgroundColor: colors.sage, // spec "primarySoft"
  },
  image: {
    width: sizes.iconLg,
    height: sizes.iconLg,
  },
  label: {
    color: colors.text,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.button,
    lineHeight: lineHeights.button,
  },
  labelSelected: {
    color: colors.primary,
  },
});
