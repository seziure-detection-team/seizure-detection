// File: Screen.styles.js
// Purpose: Styles of the shared Screen wrapper (background, padding, footer area).

import { StyleSheet } from 'react-native';

import { colors, spacing } from '../theme';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.bg,
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
