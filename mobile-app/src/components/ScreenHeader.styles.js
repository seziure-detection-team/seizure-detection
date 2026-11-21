// File: ScreenHeader.styles.js
// Purpose: Styles of the screen header (back button on A2 and A4).

import { StyleSheet } from 'react-native';

import { colors, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  // Square surface button; at the start of the row = right side in RTL
  backButton: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radii.md,
    borderWidth: sizes.borderWidth,
    borderColor: colors.line,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
