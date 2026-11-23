// File: Screen.styles.js
// Purpose: Styles of the shared Screen wrapper (background, glow, padding, footer area).

import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  // Covers the whole screen, including the safe-area padding
  glowLayer: {
    ...StyleSheet.absoluteFill,
  },
  glow: {
    width: '100%',
    height: '100%',
  },
  keyboard: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  body: {
    flexGrow: 1,
  },
  bodyCentered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  footer: {
    paddingTop: spacing.xl,
  },
});
