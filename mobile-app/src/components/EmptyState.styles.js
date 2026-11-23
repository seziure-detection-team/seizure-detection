// File: EmptyState.styles.js
// Purpose: Styles of the centred message state (ring, circle, title, body).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, shadows, sizes, spacing } from '../theme';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  ring: {
    width: sizes.emptyRing,
    height: sizes.emptyRing,
    borderRadius: radii.pill,
    borderWidth: sizes.borderWidth,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  ring_default: {
    borderColor: colors.sage2, // spec "lavender"
  },
  ring_peach: {
    borderColor: colors.peach,
  },
  ring_error: {
    borderColor: colors.error,
  },
  circle: {
    width: sizes.emptyCircle,
    height: sizes.emptyCircle,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  title: {
    color: colors.text,
    fontFamily: fonts.heading.semiBold,
    fontSize: fontSizes.subtitle,
    lineHeight: lineHeights.subtitle,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  titleSpacing: {
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
