// File: Badge.styles.js
// Purpose: Styles of the status badge and its tones. Text contrast on its own background:
// neutral 5.61:1, success 4.8:1, warning 5.1:1, primary 5.9:1, sample 4.55:1 (all ≥ 4.5:1).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
    minHeight: sizes.badgeHeight,
    paddingHorizontal: spacing.md,
    borderRadius: radii.pill,
  },
  dot: {
    width: sizes.badgeDot,
    height: sizes.badgeDot,
    borderRadius: radii.pill,
  },
  label: {
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.small,
    lineHeight: lineHeights.small,
  },

  neutralBg: { backgroundColor: colors.neutralSoft },
  neutralDot: { backgroundColor: colors.neutral },
  neutralText: { color: colors.neutral },

  successBg: { backgroundColor: colors.successSoft },
  successDot: { backgroundColor: colors.success },
  successText: { color: colors.success },

  warningBg: { backgroundColor: colors.amberBg },
  warningDot: { backgroundColor: colors.amber },
  warningText: { color: colors.amber },

  primaryBg: { backgroundColor: colors.sage },
  primaryDot: { backgroundColor: colors.primary },
  primaryText: { color: colors.primary },

  sampleBg: { backgroundColor: colors.peachSoft },
  sampleDot: { backgroundColor: colors.peachDeep },
  sampleText: { color: colors.peachDeep },
});
