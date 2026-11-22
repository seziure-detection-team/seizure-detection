// File: routing.js
// Purpose: Pure role-based routing decision (UC-02 step 5, route guard). Kept free of React
// and Supabase so it can be unit tested. The root layout turns the result into
// Stack.Protected guards; database RLS remains the real authorization layer.

export const ROUTES = {
  loading: 'loading', // initial auth state not resolved yet (splash screen stays)
  auth: 'auth', // A1–A5 (signed out)
  newPassword: 'newPassword', // A6 only (password recovery in progress)
  patient: 'patient', // B1
  caregiver: 'caregiver', // C2/C3
  accountError: 'accountError', // signed in, but profile missing/unreadable/unsupported
};

/**
 * @param {object} state
 * @param {boolean} state.loading      initial session/role check still running
 * @param {boolean} state.recovery     password recovery in progress (has priority)
 * @param {boolean} state.signedIn     a valid session exists
 * @param {{status: string, role?: string}} state.profile
 *        status: 'ok' | 'missing' | 'error' | 'unknown'
 */
export function resolveRoute({ loading, recovery, signedIn, profile }) {
  // UC-03: recovery always wins, so a recovery session can never open a home screen
  if (recovery) return ROUTES.newPassword;
  if (loading) return ROUTES.loading;
  if (!signedIn) return ROUTES.auth;

  if (profile?.status === 'unknown') return ROUTES.loading;
  if (profile?.status !== 'ok') return ROUTES.accountError;
  if (profile.role === 'patient') return ROUTES.patient;
  if (profile.role === 'caregiver') return ROUTES.caregiver;

  // Physician (normally signed out before reaching this point) or an unsupported role:
  // never a home screen
  return ROUTES.accountError;
}

// Path to open for each route (used by app/index.jsx)
export const ROUTE_PATHS = {
  [ROUTES.auth]: '/login',
  [ROUTES.newPassword]: '/new-password',
  [ROUTES.patient]: '/home',
  [ROUTES.caregiver]: '/alerts',
  [ROUTES.accountError]: '/account-error',
};
