// File: Screen.styles.js
// Purpose: Styles of the shared Screen wrapper (background, glow, padding, footer area).

import { StyleSheet } from 'react-native';

import { colors, sizes, spacing } from '../theme';

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
  inner: {
    flex: 1,
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
  // Room for the floating bottom bar (its height + its bottom gap + normal padding)
  contentWithBottomBar: {
    paddingBottom: sizes.navHeight + spacing.sm + spacing.xl,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: spacing.sm,
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
