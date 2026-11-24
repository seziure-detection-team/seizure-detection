// File: NavBar.styles.js
// Purpose: Styles of the bottom navigation (height 72, inset 16, radius 36).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, shadows, sizes, spacing } from '../theme';

export default StyleSheet.create({
  bar: {
    flexDirection: 'row',
    height: sizes.navHeight,
    marginHorizontal: spacing.lg,
    padding: spacing.sm,
    gap: spacing.sm,
    borderRadius: sizes.navHeight / 2,
    // Opaque, so content scrolling under the floating bar never shows through its labels
    backgroundColor: colors.surface,
    ...shadows.md,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radii.pill,
  },
  itemActive: {
    backgroundColor: colors.sage, // spec "primarySoft"
  },
  label: {
    color: colors.muted,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  labelActive: {
    color: colors.primary,
  },
});
