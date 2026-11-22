// File: AuthContext.jsx
// Purpose: App-wide authentication state (approved Phase 3 decision 1): the session, the
// user's profile role, password-recovery mode, and a one-time notice for the Login screen.
// The root layout turns this state into route guards (see src/lib/routing.js).
//
// Rules implemented here:
//   - Session restore on start: stored session → role from `profile` (UC-02 step 4).
//   - Physicians are signed out immediately with a message (UC-02 3b).
//   - A failed role query is an error state (retry/logout), never "no profile".
//   - Password recovery (UC-03) has priority over every other route: while it is active
//     only A6 is reachable, even if a session exists.
//   - Interrupted recovery (app closed during reset) → sign out on the next start
//     (Phase 3 decision 3).

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as Linking from 'expo-linking';

import * as auth from '../lib/auth';
import {
  onRecoveryQueued,
  parseAuthLink,
  queueRecovery,
  takePendingRecovery,
} from '../lib/deepLinks';
import { resolveRoute } from '../lib/routing';

const AuthContext = createContext(null);

const UNKNOWN_PROFILE = { status: 'unknown' };

export function AuthProvider({ children }) {
  const [initializing, setInitializing] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(UNKNOWN_PROFILE);
  // null, or { state: 'verifying' | 'ready' | 'invalid' | 'network', code? }
  const [recovery, setRecovery] = useState(null);

  // Latest recovery state for event listeners (avoids stale closures)
  const recoveryRef = useRef(null);
  useEffect(() => {
    recoveryRef.current = recovery;
  }, [recovery]);

  // One-time message for A1 (e.g. "password updated", "physicians use the web dashboard").
  // Kept in a ref: the Login screen reads and clears it when it mounts.
  const noticeRef = useRef(null);

  // Auth screen to open once after leaving recovery mode (e.g. A4 from the expired-link
  // state). A6 is removed by the guard at that moment, so the start route performs it.
  // A ref: reading/clearing it must not re-render (a changed redirect would navigate again).
  const nextAuthPathRef = useRef(null);

  const clearSignedInState = useCallback(() => {
    setSession(null);
    setProfile(UNKNOWN_PROFILE);
  }, []);

  // Reads the role for a session; physicians are signed out (UC-02 3b)
  const loadProfile = useCallback(
    async (currentSession) => {
      setProfile(UNKNOWN_PROFILE);
      const result = await auth.getRole(currentSession.user.id);
      if (result.status === 'ok' && result.role === 'physician') {
        await auth.signOut();
        clearSignedInState();
        noticeRef.current = { variant: 'error', kind: 'physicianNotAllowed' };
        return;
      }
      setProfile(result);
    },
    [clearSignedInState],
  );

  // UC-03: start recovery from a deep link ({ code, errorCode }). The state switches to
  // recovery synchronously — before any await — so A6 is unlocked in the same update in
  // which the link navigates to /new-password, and no other screen can open in between.
  const startRecovery = useCallback(async (link) => {
    if (!link) return;
    const usable = Boolean(link.code) && !link.errorCode;
    setRecovery(usable ? { state: 'verifying', code: link.code } : { state: 'invalid' });
    await auth.setRecoveryPending(true);
    if (!usable) return;

    const result = await auth.exchangeRecoveryCode(link.code);
    if (result.ok) setRecovery({ state: 'ready' });
    else if (result.kind === 'network') setRecovery({ state: 'network', code: link.code });
    else setRecovery({ state: 'invalid' });
  }, []);

  // True once the startup sequence below has finished. Until then, queued recovery links
  // are left for the startup sequence, so a link is never handled twice or too late.
  const startupDoneRef = useRef(false);

  // ---- Initial state (cold start) and listeners -------------------------------------
  useEffect(() => {
    let active = true;

    // Warm start: a recovery link arrives while the app is running
    const stopLinkListener = onRecoveryQueued(() => {
      if (startupDoneRef.current) startRecovery(takePendingRecovery());
    });

    // Supabase ended the session by itself (e.g. refresh token revoked)
    const stopSignOutListener = auth.onSignedOut(() => {
      if (!recoveryRef.current) clearSignedInState();
    });

    (async () => {
      // A previous run was closed during recovery: never reuse that session
      if (await auth.isRecoveryPending()) {
        await auth.signOut();
        await auth.setRecoveryPending(false);
      }

      // Cold start from a recovery link. +native-intent normally queues it; reading the
      // initial URL here as well guarantees it is seen before any session is restored.
      // A code that was already taken is ignored, so the link is processed only once.
      const initialLink = parseAuthLink(await Linking.getInitialURL());
      if (initialLink?.target === 'recovery') queueRecovery(initialLink);

      const pending = takePendingRecovery();
      if (pending) {
        startRecovery(pending); // shows A6 at once; the code exchange continues there
      } else {
        const stored = await auth.getSession();
        if (stored.session) {
          setSession(stored.session);
          await loadProfile(stored.session);
        }
      }

      // From now on the warm-start listener handles links; pick up one that was queued
      // while the stored session was being restored
      startupDoneRef.current = true;
      const late = takePendingRecovery();
      if (late) startRecovery(late);

      if (active) setInitializing(false);
    })();

    return () => {
      active = false;
      stopLinkListener();
      stopSignOutListener();
    };
  }, [clearSignedInState, loadProfile, startRecovery]);

  // ---- Actions used by screens ---------------------------------------------------------

  // UC-02: sign in, then route by role
  const login = useCallback(async (credentials) => {
    const result = await auth.signIn(credentials);
    if (!result.ok) return result;

    const role = await auth.getRole(result.session.user.id);
    if (role.status === 'ok' && role.role === 'physician') {
      await auth.signOut();
      return { ok: false, kind: 'physicianNotAllowed' };
    }
    setSession(result.session);
    setProfile(role);
    return { ok: true };
  }, []);

  const logout = useCallback(async () => {
    await auth.signOut();
    clearSignedInState();
  }, [clearSignedInState]);

  const retryProfile = useCallback(async () => {
    if (session) await loadProfile(session);
  }, [session, loadProfile]);

  // Leaves recovery mode without changing the password. `nextPath` (optional) is the auth
  // screen to open afterwards, e.g. '/forgot-password' from the expired-link state.
  const exitRecovery = useCallback(
    async (nextPath = null) => {
      await auth.signOut();
      await auth.setRecoveryPending(false);
      clearSignedInState();
      nextAuthPathRef.current = nextPath;
      setRecovery(null);
    },
    [clearSignedInState],
  );

  // Read during render (pure), cleared after the redirect
  const peekNextAuthPath = useCallback(() => nextAuthPathRef.current, []);
  const clearNextAuthPath = useCallback(() => {
    nextAuthPathRef.current = null;
  }, []);

  const retryRecovery = useCallback(() => {
    if (recoveryRef.current?.code) startRecovery({ code: recoveryRef.current.code });
  }, [startRecovery]);

  // UC-03 step 6: update the password, then sign out and return to A1 with a message
  const completeRecovery = useCallback(
    async (password) => {
      const result = await auth.updatePassword(password);
      if (result.ok) {
        noticeRef.current = { variant: 'success', kind: 'passwordUpdated' };
        await exitRecovery();
      } else if (result.kind === 'expired') {
        setRecovery({ state: 'invalid' });
      }
      return result;
    },
    [exitRecovery],
  );

  // Read during render (pure), cleared after mount: safe if React renders twice
  const peekNotice = useCallback(() => noticeRef.current, []);
  const clearNotice = useCallback(() => {
    noticeRef.current = null;
  }, []);

  const target = resolveRoute({
    loading: initializing,
    recovery: recovery !== null,
    signedIn: session !== null,
    profile,
  });

  const value = {
    target,
    recovery,
    peekNextAuthPath,
    clearNextAuthPath,
    login,
    logout,
    retryProfile,
    exitRecovery,
    retryRecovery,
    completeRecovery,
    peekNotice,
    clearNotice,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
