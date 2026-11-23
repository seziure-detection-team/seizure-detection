// File: SegmentedTabs.styles.js
// Purpose: Styles of the segmented tabs (track, tab, active pill, label).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, shadows, sizes, spacing } from '../theme';

export default StyleSheet.create({
  track: {
    flexDirection: 'row',
    padding: spacing.xs,
    borderRadius: radii.pill,
    backgroundColor: colors.track,
  },
  tab: {
    flex: 1,
    height: sizes.tabHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    ...StyleSheet.absoluteFill,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  label: {
    color: colors.muted,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  labelActive: {
    color: colors.text,
  },
});
