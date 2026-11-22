// File: auth.js
// Purpose: All Supabase calls of the authentication flows. Screens and the AuthContext call
// these functions; they never call Supabase directly.
// Every function returns a plain result: { ok: true, ... } or { ok: false, kind }, where
// `kind` selects the Arabic message (ar.messages / ar.errors). Errors, emails, passwords,
// codes and tokens are never logged.

import { isAuthRetryableFetchError } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

import { supabase } from './supabase';

// Deep links registered in the Supabase Dashboard (Authentication → URL Configuration)
export const SIGNUP_REDIRECT = 'rasd://login';
export const RECOVERY_REDIRECT = 'rasd://new-password';

// Upper bound for one network call; supabase-js has no timeout of its own
const REQUEST_TIMEOUT_MS = 15000;
const TIMEOUT_ERROR = { name: 'RequestTimeout' };

// Secure-storage key of the "password recovery in progress" flag (Phase 3 decision 3)
const RECOVERY_FLAG_KEY = 'rasd.recoveryPending';

const OK = { ok: true };
const fail = (kind) => ({ ok: false, kind });

// Resolves to the call's result, or to { error: TIMEOUT_ERROR } if it takes too long
function withTimeout(promise) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ data: null, error: TIMEOUT_ERROR }), REQUEST_TIMEOUT_MS);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Maps a Supabase/network error to a generic kind (network, rate limit, server)
function classifyError(error) {
  if (!error || error === TIMEOUT_ERROR) return 'network';
  if (isAuthRetryableFetchError(error)) return 'network';
  if (/network request failed|failed to fetch|network error/i.test(error.message ?? '')) {
    return 'network';
  }
  if (
    error.status === 429 ||
    error.code === 'over_email_send_rate_limit' ||
    error.code === 'over_request_rate_limit'
  ) {
    return 'rateLimited';
  }
  return 'server';
}

// Runs a call and converts a thrown exception (e.g. offline fetch) into an error result
async function call(run) {
  try {
    return await withTimeout(run());
  } catch (error) {
    return { data: null, error };
  }
}

// ---- UC-01 Register ----------------------------------------------------------------

export async function signUp({ fullName, email, password, role }) {
  const { data, error } = await call(() =>
    supabase.auth.signUp({
      email: email.trim(),
      password,
      // Read by the database trigger that creates the profile (and patient) row
      options: { data: { full_name: fullName.trim(), role }, emailRedirectTo: SIGNUP_REDIRECT },
    }),
  );

  if (error) {
    // UC-01 4a: an existing email gets the same neutral result as a new one
    if (error.code === 'user_already_exists') return OK;
    return fail(classifyError(error));
  }

  // With email confirmation ON no session is returned. If the project ever returns one,
  // end it so that registration never signs the user in before verification.
  if (data?.session) await signOutLocal();
  return OK;
}

// ---- UC-02 Login / role / logout -----------------------------------------------------

export async function signIn({ email, password }) {
  const { data, error } = await call(() =>
    supabase.auth.signInWithPassword({ email: email.trim(), password }),
  );

  if (error) {
    // UC-02 3a: one generic message, never which field is wrong
    if (error.code === 'invalid_credentials') return fail('invalidCredentials');
    if (error.code === 'email_not_confirmed') return fail('emailNotConfirmed');
    return fail(classifyError(error));
  }
  return { ok: true, session: data.session };
}

// Session stored on the device (restored on app start). Never throws.
export async function getSession() {
  const { data, error } = await call(() => supabase.auth.getSession());
  if (error) return { ok: false, kind: classifyError(error), session: null };
  return { ok: true, session: data?.session ?? null };
}

/**
 * Reads the current user's role from `profile` (RLS: own row only).
 * Returns { status: 'ok', role } | { status: 'missing' } | { status: 'error' }.
 * A failed query is reported as 'error', never as a missing profile.
 */
export async function getRole(userId) {
  const { data, error } = await call(() =>
    supabase.from('profile').select('role').eq('user_id', userId).maybeSingle(),
  );
  if (error) return { status: 'error' };
  if (!data) return { status: 'missing' };
  return { status: 'ok', role: data.role };
}

async function signOutLocal() {
  try {
    await supabase.auth.signOut({ scope: 'local' });
  } catch {
    // Nothing else can be done locally; the session is no longer used by the app
  }
}

// Logout (Phase 3 decision 4): revoke the session on the server; if that fails (e.g.
// offline), still remove it from this device.
export async function signOut() {
  const { error } = await call(() => supabase.auth.signOut());
  if (error) await signOutLocal();
}

// ---- UC-03 Reset password ------------------------------------------------------------

// The response is the same whether or not the email is registered (UC-03 3a)
export async function requestReset({ email }) {
  const { error } = await call(() =>
    supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: RECOVERY_REDIRECT }),
  );
  if (error) return fail(classifyError(error));
  return OK;
}

// Exchanges the one-time PKCE code from the recovery link for a recovery session.
// Expired, used or foreign codes → 'expired' (UC-03 5a); connection problems → 'network'.
export async function exchangeRecoveryCode(code) {
  const { error } = await call(() => supabase.auth.exchangeCodeForSession(code));
  if (!error) return OK;
  const kind = classifyError(error);
  return fail(kind === 'network' ? 'network' : 'expired');
}

export async function updatePassword(password) {
  const { error } = await call(() => supabase.auth.updateUser({ password }));
  if (!error) return OK;
  if (error.code === 'weak_password') return fail('weakPassword');
  if (error.code === 'same_password') return fail('samePassword');
  if (error.code === 'session_not_found' || error.name === 'AuthSessionMissingError') {
    return fail('expired');
  }
  return fail(classifyError(error));
}

// ---- Recovery-in-progress flag (Phase 3 decision 3) ------------------------------------
// Survives an app restart. If the app is closed during recovery, the next start signs
// out instead of opening a home screen with the recovery session.

export async function setRecoveryPending(pending) {
  try {
    if (pending) await SecureStore.setItemAsync(RECOVERY_FLAG_KEY, '1');
    else await SecureStore.deleteItemAsync(RECOVERY_FLAG_KEY);
  } catch {
    // Flag storage failed: isRecoveryPending() treats unreadable storage as pending
  }
}

// Unreadable storage counts as pending (fail safe: sign out rather than risk access)
export async function isRecoveryPending() {
  try {
    return (await SecureStore.getItemAsync(RECOVERY_FLAG_KEY)) === '1';
  } catch {
    return true;
  }
}

// Notifies when Supabase ends the session by itself (e.g. refresh token revoked)
export function onSignedOut(listener) {
  const { data } = supabase.auth.onAuthStateChange((event) => {
    // Supabase advises not to call its API inside this callback: defer the work
    if (event === 'SIGNED_OUT') setTimeout(listener, 0);
  });
  return () => data.subscription.unsubscribe();
}
