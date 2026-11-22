// File: routing.test.js
// Purpose: Unit tests of the role-based routing decision (src/lib/routing.js):
// patient → B1, caregiver → C2, missing/unreadable/unsupported profile → account error,
// recovery → A6 only, no session → auth screens.

import { ROUTES, resolveRoute } from '../src/lib/routing';

const signedIn = (profile) => ({ loading: false, recovery: false, signedIn: true, profile });

describe('resolveRoute', () => {
  test('waits while the initial state is loading', () => {
    expect(
      resolveRoute({
        loading: true,
        recovery: false,
        signedIn: false,
        profile: { status: 'unknown' },
      }),
    ).toBe(ROUTES.loading);
  });

  test('signed-out users only reach the auth screens', () => {
    expect(
      resolveRoute({
        loading: false,
        recovery: false,
        signedIn: false,
        profile: { status: 'unknown' },
      }),
    ).toBe(ROUTES.auth);
  });

  test('patient → B1', () => {
    expect(resolveRoute(signedIn({ status: 'ok', role: 'patient' }))).toBe(ROUTES.patient);
  });

  test('caregiver → C2/C3', () => {
    expect(resolveRoute(signedIn({ status: 'ok', role: 'caregiver' }))).toBe(ROUTES.caregiver);
  });

  test('a physician session never opens a mobile home screen', () => {
    expect(resolveRoute(signedIn({ status: 'ok', role: 'physician' }))).toBe(ROUTES.accountError);
  });

  test.each([
    ['missing profile', { status: 'missing' }],
    ['unreadable profile (query failed)', { status: 'error' }],
    ['unsupported role', { status: 'ok', role: 'admin' }],
  ])('%s → account error', (_label, profile) => {
    expect(resolveRoute(signedIn(profile))).toBe(ROUTES.accountError);
  });

  test('waits for the role after sign-in', () => {
    expect(resolveRoute(signedIn({ status: 'unknown' }))).toBe(ROUTES.loading);
  });

  test.each([
    ['with a patient session', signedIn({ status: 'ok', role: 'patient' })],
    ['while loading', { loading: true, signedIn: false, profile: { status: 'unknown' } }],
    ['signed out', { loading: false, signedIn: false, profile: { status: 'unknown' } }],
  ])('password recovery has priority (%s)', (_label, state) => {
    expect(resolveRoute({ ...state, recovery: true })).toBe(ROUTES.newPassword);
  });
});
