// File: deepLinks.test.js
// Purpose: Unit tests of the auth deep links (src/lib/deepLinks.js, app/+native-intent.js):
// parsing, PKCE codes, Supabase error parameters, confirmation codes not being used, and
// processing a recovery code only once.

import { redirectSystemPath } from '../app/+native-intent';
import { parseAuthLink, queueRecovery, takePendingRecovery } from '../src/lib/deepLinks';

describe('parseAuthLink', () => {
  test('recovery link with a PKCE code', () => {
    expect(parseAuthLink('rasd://new-password?code=abc-123')).toEqual({
      target: 'recovery',
      code: 'abc-123',
      errorCode: null,
    });
  });

  test('email confirmation link', () => {
    expect(parseAuthLink('rasd://login?code=xyz')).toEqual({
      target: 'login',
      code: 'xyz',
      errorCode: null,
    });
  });

  test('reads Supabase errors from the query or the fragment', () => {
    expect(
      parseAuthLink('rasd://new-password?error=access_denied&error_code=otp_expired').errorCode,
    ).toBe('otp_expired');
    expect(
      parseAuthLink('rasd://new-password#error=access_denied&error_code=otp_expired').errorCode,
    ).toBe('otp_expired');
  });

  test('accepts a trailing slash and ignores malformed parameters', () => {
    expect(parseAuthLink('rasd://new-password/?code=a%ZZ&code=ok').code).toBe('ok');
  });

  test.each([
    'https://example.com/new-password?code=1',
    'rasd://home',
    'exp+rasd-mobile://expo-development-client/?url=x',
    null,
  ])('ignores %p', (url) => {
    expect(parseAuthLink(url)).toBeNull();
  });
});

describe('recovery hand-over', () => {
  test('a code is processed only once', () => {
    queueRecovery({ code: 'once-1', errorCode: null });
    expect(takePendingRecovery()).toEqual({ code: 'once-1', errorCode: null });

    queueRecovery({ code: 'once-1', errorCode: null }); // same link delivered again
    expect(takePendingRecovery()).toBeNull();
  });
});

describe('redirectSystemPath (+native-intent)', () => {
  test('recovery link → /new-password, code kept out of the route', () => {
    expect(redirectSystemPath({ path: 'rasd://new-password?code=nav-1', initial: true })).toBe(
      '/new-password',
    );
    expect(takePendingRecovery()).toEqual({ code: 'nav-1', errorCode: null });
  });

  test('confirmation link → /login, code dropped (no session is created)', () => {
    expect(redirectSystemPath({ path: 'rasd://login?code=confirm-1', initial: false })).toBe(
      '/login',
    );
    expect(takePendingRecovery()).toBeNull();
  });

  test('other URLs are left unchanged', () => {
    const devClientUrl = 'exp+rasd-mobile://expo-development-client/?url=http%3A%2F%2Flocalhost';
    expect(redirectSystemPath({ path: devClientUrl, initial: true })).toBe(devClientUrl);
  });
});
