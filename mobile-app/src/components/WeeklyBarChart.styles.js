// File: WeeklyBarChart.styles.js
// Purpose: Styles of the weekly bar chart (B6).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, spacing } from '../theme';

// Bar sizes measured from B6 (exported for the height calculation in the component)
export const BAR_MAX_HEIGHT = 88;
export const BAR_STUB_HEIGHT = 8;
const BAR_WIDTH = 28;

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },
  // Fixed height (tallest bar + count above it), so all bars share the same baseline
  barArea: {
    height: BAR_MAX_HEIGHT + lineHeights.body + spacing.xs,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  value: {
    color: colors.text,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    marginBottom: spacing.xs,
  },
  bar: {
    width: BAR_WIDTH,
    borderRadius: radii.pill,
    transformOrigin: 'bottom', // grow from the baseline
  },
  barHighlight: {
    backgroundColor: colors.primary,
  },
  barNormal: {
    backgroundColor: colors.sage2, // spec "lavender"
  },
  label: {
    marginTop: spacing.sm,
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.small,
    lineHeight: lineHeights.small,
  },
});
