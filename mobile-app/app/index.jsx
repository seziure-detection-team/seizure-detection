// File: index.jsx
// Purpose: TEMPORARY Phase 1 placeholder so the app has a start route.
// It is replaced by the route guard / role-based redirect in Phase 3.

import { StyleSheet, Text, View } from 'react-native';

import ar from '../src/i18n/ar';
import { colors, fonts, fontSizes, lineHeights } from '../src/theme';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{ar.common.appName}</Text>
      <Text style={styles.subtitle}>{ar.setup.placeholder}</Text>
    </View>
  );
}

// Temporary inline styles (theme tokens only); real screens use src/styles/*.styles.js
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  title: {
    color: colors.primary,
    fontFamily: fonts.heading.bold,
    fontSize: fontSizes.h1,
    lineHeight: lineHeights.h1,
  },
  subtitle: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
});
