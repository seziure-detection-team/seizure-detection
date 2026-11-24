// File: eventDetail.styles.js
// Purpose: Styles of the Event detail screen (B7).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, sizes, spacing } from '../theme';

export default StyleSheet.create({
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  title: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  details: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  // Icon + name (start, right in RTL) – value (end, left in RTL)
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.lgPlus,
  },
  rowName: {
    flex: 1,
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  rowValue: {
    color: colors.text,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
  },
  divider: {
    height: sizes.borderWidth,
    backgroundColor: colors.line,
  },
  classifyTitle: {
    color: colors.text,
    fontFamily: fonts.heading.semiBold,
    fontSize: fontSizes.subtitle,
    lineHeight: lineHeights.subtitle,
    marginBottom: spacing.lg,
  },
  chips: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    paddingBottom: spacing.xxxl,
  },
});
