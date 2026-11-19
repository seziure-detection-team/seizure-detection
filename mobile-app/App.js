// File: App.js
// Purpose: Root component of the mobile app (patients and caregivers)

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import colors from './src/theme/colors';

// Shows a temporary start screen until the authentication screens of Sprint 1 are added
export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>جاهز للبدء</Text>
      <StatusBar style="dark" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 22,
  },
});
