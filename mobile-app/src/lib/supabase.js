// File: supabase.js
// Purpose: The single Supabase client used by the app (auth + database).
//
// - URL and anon key come from .env (EXPO_PUBLIC_*). The service-role key is never used here.
// - Only HTTPS URLs are accepted (NFR-04).
// - PKCE flow (approved): email links return "?code=..." instead of tokens in the URL.
// - detectSessionInUrl is off: deep links are handled explicitly by the app (Phase 3),
//   so a confirmation link can never silently create a session and open a home screen.
// - The session is persisted with the encrypted storage adapter (secureSessionStorage).

import { AppState } from 'react-native';
import { createClient } from '@supabase/supabase-js';

import secureSessionStorage from './secureSessionStorage';

// Dot notation is required: Expo inlines EXPO_PUBLIC_ variables only in this form
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Supabase is not configured: set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY in mobile-app/.env',
  );
}

if (!supabaseUrl.startsWith('https://')) {
  throw new Error('EXPO_PUBLIC_SUPABASE_URL must use HTTPS');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: secureSessionStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
});

// Refresh tokens only while the app is in the foreground, as recommended by Supabase
// for React Native (timers are unreliable in the background).
AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});
