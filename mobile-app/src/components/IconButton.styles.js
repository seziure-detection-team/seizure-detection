// File: IconButton.styles.js
// Purpose: Styles of the round icon button (back, logout).

import { StyleSheet } from 'react-native';

import { colors, radii, shadows, sizes } from '../theme';

export default StyleSheet.create({
  wrapper: {
    borderRadius: radii.pill,
    ...shadows.sm,
  },
  button: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mirrored: {
    transform: [{ scaleX: -1 }],
  },
});
