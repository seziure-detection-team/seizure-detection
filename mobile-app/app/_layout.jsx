// File: _layout.jsx
// Purpose: Root layout of the app. Loads fonts, enforces RTL, provides the auth state, and
// guards every route (UC-02): each screen is reachable only in the matching auth state.
// The splash screen stays until fonts are loaded and the initial auth state is resolved.
// UI guards are not a substitute for database authorization: RLS still protects all data.

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

import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { ROUTES } from '../src/lib/routing';
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

// Upper bound on splash time: if fonts or the auth check hang, continue anyway (system font;
// the start route then shows a loading indicator) instead of a never-ending splash screen.
const READY_TIMEOUT_MS = 8000;

function RootNavigator() {
  const { target } = useAuth();
  const [fontsLoaded, fontError] = useFonts(fontAssets);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setTimedOut(true), READY_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, []);

  // A font error is not fatal: the app falls back to the system font
  const fontsReady = fontsLoaded || Boolean(fontError);
  const ready = timedOut || (fontsReady && target !== ROUTES.loading);

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  if (!ready) return null;

  // Every route is listed inside a guard: a screen whose guard is false cannot be opened
  // (also not by typing its path), and an open one is left automatically. The start route
  // (index) then redirects to the screen of the current state.
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.bg } }}>
        <Stack.Screen name="index" />

        {/* A1–A5: only when signed out (and not during password recovery) */}
        <Stack.Protected guard={target === ROUTES.auth}>
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
          <Stack.Screen name="(auth)/verify-email" />
          <Stack.Screen name="(auth)/forgot-password" />
          <Stack.Screen name="(auth)/reset-sent" />
        </Stack.Protected>

        {/* A6: only during password recovery (UC-03), which has priority over everything */}
        <Stack.Protected guard={target === ROUTES.newPassword}>
          <Stack.Screen name="(auth)/new-password" />
        </Stack.Protected>

        {/* Role screens: only for a signed-in user with that role (UC-02 step 5) */}
        <Stack.Protected guard={target === ROUTES.patient}>
          <Stack.Screen name="(patient)/home" />
        </Stack.Protected>
        <Stack.Protected guard={target === ROUTES.caregiver}>
          <Stack.Screen name="(caregiver)/alerts" />
        </Stack.Protected>

        {/* Profile missing, unreadable or unsupported role: retry or log out */}
        <Stack.Protected guard={target === ROUTES.accountError}>
          <Stack.Screen name="account-error" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
