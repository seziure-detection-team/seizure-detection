// File: RoleCard.styles.js
// Purpose: Styles of the role selection card (A2: مريض / مرافق).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  card: {
    flex: 1,
    borderWidth: sizes.borderWidth,
    borderColor: colors.line,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
  },
  cardSelected: {
    borderWidth: sizes.borderWidthSelected,
    borderColor: colors.primary,
  },
  // Icon tile at the start (right in RTL); selection circle at the end (left in RTL)
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconTile: {
    width: sizes.roleIconTile,
    height: sizes.roleIconTile,
    borderRadius: radii.md,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: sizes.checkCircle,
    height: sizes.checkCircle,
    borderRadius: radii.pill,
    borderWidth: sizes.borderWidthSelected,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  label: {
    marginTop: spacing.md,
    color: colors.text,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.button,
    lineHeight: lineHeights.button,
  },
});
