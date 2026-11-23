// File: Logo.styles.js
// Purpose: Styles of the logo (ring + app name).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, spacing } from '../theme';

export default StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.sm,
  },
  name: {
    color: colors.primary,
    fontFamily: fonts.body.bold,
    fontSize: fontSizes.subtitle,
    lineHeight: lineHeights.subtitle,
  },
});
