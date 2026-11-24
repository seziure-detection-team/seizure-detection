// File: history.styles.js
// Purpose: Styles of the patient History screen (B5 list, B6 patterns).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  title: {
    marginTop: spacing.lg,
  },
  sampleBadge: {
    marginTop: spacing.sm,
  },
  tabs: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },

  // B5 — event list
  list: {
    gap: spacing.lg,
  },
  // Chip (start, right in RTL) – texts – arrow (end, left in RTL)
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lgPlus,
  },
  itemChip: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radii.lg,
    backgroundColor: colors.neutralSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBody: {
    flex: 1,
  },
  itemDate: {
    color: colors.text,
    fontFamily: fonts.heading.semiBold,
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  itemDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  itemMetaText: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  itemBadge: {
    marginTop: spacing.sm,
  },

  // B6 — patterns
  chartCard: {
    padding: spacing.xl,
  },
  chartTitle: {
    color: colors.text,
    fontFamily: fonts.heading.semiBold,
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
  },
  chartSubtitle: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    marginTop: spacing.xs,
    marginBottom: spacing.xxl,
  },
});
