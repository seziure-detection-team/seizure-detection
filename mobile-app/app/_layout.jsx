// File: _layout.jsx
// Purpose: Root layout of the app. Loads fonts, enforces RTL, and keeps the splash
// screen visible until the app is ready.
// The session listener and the route guard (UC-02) are added here in Phase 3.

import { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Feather } from '@expo/vector-icons';
import {
  NotoNaskhArabic_500Medium,
  NotoNaskhArabic_600SemiBold,
  NotoNaskhArabic_700Bold,
} from '@expo-google-fonts/noto-naskh-arabic';
import {
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
} from '@expo-google-fonts/ibm-plex-sans-arabic';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
} from '@expo-google-fonts/ibm-plex-sans';

import { colors } from '../src/theme';

// Font files; the keys are the family names used in src/theme/typography.js.
// The Feather icon font is preloaded too, so icons do not appear late on first render.
const fontAssets = {
  ...Feather.font,
  NotoNaskhArabic_500Medium,
  NotoNaskhArabic_600SemiBold,
  NotoNaskhArabic_700Bold,
  IBMPlexSansArabic_400Regular,
  IBMPlexSansArabic_500Medium,
  IBMPlexSansArabic_600SemiBold,
  IBMPlexSans_400Regular,
  IBMPlexSans_500Medium,
  IBMPlexSans_600SemiBold,
};

// Keep the native splash screen until we call hide() (called in global scope, per Expo docs)
SplashScreen.preventAutoHideAsync();

// RTL is forced natively by the expo-localization plugin (app.json); these calls keep
// the JS side consistent. The native setting applies fully after the first app restart.
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Upper bound on splash time: if font loading hangs, continue with the system font
// instead of leaving the user on the splash screen indefinitely.
const READY_TIMEOUT_MS = 8000;

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), READY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  // A font error is not fatal: the app falls back to the system font
  const ready = fontsLoaded || Boolean(fontError) || timedOut;

  useEffect(() => {
    if (ready) {
      SplashScreen.hide();
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }} />
    </>
  );
}
