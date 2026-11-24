// File: Card.styles.js
// Purpose: Styles of the surface card.

import { StyleSheet } from 'react-native';

import { colors, radii, shadows, spacing } from '../theme';

export default StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.xxl,
    padding: spacing.lg,
    ...shadows.md,
  },
});
