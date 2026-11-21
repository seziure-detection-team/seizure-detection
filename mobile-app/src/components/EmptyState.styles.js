// File: EmptyState.styles.js
// Purpose: Styles of the centred message state (round icon, title, body).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  circle: {
    width: sizes.emptyCircle,
    height: sizes.emptyCircle,
    borderRadius: radii.pill,
    backgroundColor: colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  circleError: {
    backgroundColor: colors.errorBg,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.title,
    lineHeight: lineHeights.title,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    textAlign: 'center',
  },
});
