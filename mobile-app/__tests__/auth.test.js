// File: auth.test.js
// Purpose: Unit tests of src/lib/auth.js with a mocked Supabase client (no network calls):
// request parameters, neutral results (UC-01 4a, UC-03 3a), generic login errors (UC-02 3a),
// error mapping (network / rate limit / server), role reading and logout fallback.

import * as SecureStore from 'expo-secure-store';

import * as auth from '../src/lib/auth';
import { supabase } from '../src/lib/supabase';

jest.mock('../src/lib/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      getSession: jest.fn(),
      signOut: jest.fn(),
      resetPasswordForEmail: jest.fn(),
      exchangeCodeForSession: jest.fn(),
      updateUser: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
    from: jest.fn(),
  },
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

const apiError = (code, status = 400) => ({ name: 'AuthApiError', code, status, message: code });
const networkError = {
  name: 'AuthRetryableFetchError',
  status: 0,
  message: 'Network request failed',
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('signUp (UC-01)', () => {
  const input = {
    fullName: ' سارة ',
    email: ' Sara@example.com ',
    password: 'abcdefg1',
    role: 'patient',
  };

  test('sends name and role as metadata and the rasd://login redirect', async () => {
    supabase.auth.signUp.mockResolvedValue({ data: { user: {}, session: null }, error: null });
    await expect(auth.signUp(input)).resolves.toEqual({ ok: true });
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'Sara@example.com',
      password: 'abcdefg1',
      options: { data: { full_name: 'سارة', role: 'patient' }, emailRedirectTo: 'rasd://login' },
    });
  });

  test('an already registered email gets the same neutral result (4a)', async () => {
    supabase.auth.signUp.mockResolvedValue({
      data: null,
      error: apiError('user_already_exists', 422),
    });
    await expect(auth.signUp(input)).resolves.toEqual({ ok: true });
  });

  test('a returned session is ended immediately (never signed in before verification)', async () => {
    supabase.auth.signUp.mockResolvedValue({ data: { session: { user: {} } }, error: null });
    supabase.auth.signOut.mockResolvedValue({ error: null });
    await auth.signUp(input);
    expect(supabase.auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
  });

  test.each([
    [networkError, 'network'],
    [apiError('over_email_send_rate_limit', 429), 'rateLimited'],
    [apiError('unexpected_failure', 500), 'server'],
  ])('maps errors (5a)', async (error, kind) => {
    supabase.auth.signUp.mockResolvedValue({ data: null, error });
    await expect(auth.signUp(input)).resolves.toEqual({ ok: false, kind });
  });

  test('a thrown fetch error is reported as a network problem', async () => {
    supabase.auth.signUp.mockRejectedValue(new TypeError('Network request failed'));
    await expect(auth.signUp(input)).resolves.toEqual({ ok: false, kind: 'network' });
  });
});

describe('signIn (UC-02)', () => {
  test('returns the session on success', async () => {
    const session = { user: { id: 'u1' } };
    supabase.auth.signInWithPassword.mockResolvedValue({ data: { session }, error: null });
    await expect(auth.signIn({ email: 'a@b.co', password: 'x' })).resolves.toEqual({
      ok: true,
      session,
    });
  });

  test('wrong credentials → one generic error (3a)', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: apiError('invalid_credentials'),
    });
    await expect(auth.signIn({ email: 'a@b.co', password: 'x' })).resolves.toEqual({
      ok: false,
      kind: 'invalidCredentials',
    });
  });

  test('unverified email stays blocked with its own message', async () => {
    supabase.auth.signInWithPassword.mockResolvedValue({
      data: null,
      error: apiError('email_not_confirmed'),
    });
    await expect(auth.signIn({ email: 'a@b.co', password: 'x' })).resolves.toEqual({
      ok: false,
      kind: 'emailNotConfirmed',
    });
  });
});

describe('getRole', () => {
  const mockProfileQuery = (result) => {
    const maybeSingle = jest.fn().mockResolvedValue(result);
    const eq = jest.fn(() => ({ maybeSingle }));
    const select = jest.fn(() => ({ eq }));
    supabase.from.mockReturnValue({ select });
    return { select, eq };
  };

  test('reads only the current user role from profile', async () => {
    const { select, eq } = mockProfileQuery({ data: { role: 'caregiver' }, error: null });
    await expect(auth.getRole('u1')).resolves.toEqual({ status: 'ok', role: 'caregiver' });
    expect(supabase.from).toHaveBeenCalledWith('profile');
    expect(select).toHaveBeenCalledWith('role');
    expect(eq).toHaveBeenCalledWith('user_id', 'u1');
  });

  test('no row → missing', async () => {
    mockProfileQuery({ data: null, error: null });
    await expect(auth.getRole('u1')).resolves.toEqual({ status: 'missing' });
  });

  test('a failed query is an error, not a missing profile', async () => {
    mockProfileQuery({ data: null, error: { message: 'Network request failed' } });
    await expect(auth.getRole('u1')).resolves.toEqual({ status: 'error' });
  });
});

describe('signOut (decision 4)', () => {
  test('revokes globally; falls back to local sign-out when that fails', async () => {
    supabase.auth.signOut.mockResolvedValueOnce({ error: networkError }).mockResolvedValueOnce({
      error: null,
    });
    await auth.signOut();
    expect(supabase.auth.signOut).toHaveBeenNthCalledWith(1);
    expect(supabase.auth.signOut).toHaveBeenNthCalledWith(2, { scope: 'local' });
  });
});

describe('requestReset (UC-03)', () => {
  test('uses the rasd://new-password redirect', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });
    await expect(auth.requestReset({ email: ' sara@example.com ' })).resolves.toEqual({ ok: true });
    expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith('sara@example.com', {
      redirectTo: 'rasd://new-password',
    });
  });

  test('rate limits are reported for a retry', async () => {
    supabase.auth.resetPasswordForEmail.mockResolvedValue({
      data: null,
      error: apiError('over_email_send_rate_limit', 429),
    });
    await expect(auth.requestReset({ email: 'sara@example.com' })).resolves.toEqual({
      ok: false,
      kind: 'rateLimited',
    });
  });
});

describe('recovery code and password update', () => {
  test.each([
    [apiError('flow_state_expired'), 'expired'],
    [apiError('flow_state_not_found', 404), 'expired'],
    [apiError('bad_code_verifier'), 'expired'],
    [networkError, 'network'],
  ])('exchange errors are mapped', async (error, kind) => {
    supabase.auth.exchangeCodeForSession.mockResolvedValue({ data: null, error });
    await expect(auth.exchangeRecoveryCode('c')).resolves.toEqual({ ok: false, kind });
  });

  test.each([
    [apiError('weak_password', 422), 'weakPassword'],
    [apiError('same_password', 422), 'samePassword'],
    [networkError, 'network'],
  ])('update errors are mapped', async (error, kind) => {
    supabase.auth.updateUser.mockResolvedValue({ data: null, error });
    await expect(auth.updatePassword('abcdefg1')).resolves.toEqual({ ok: false, kind });
  });
});

describe('recovery-pending flag (decision 3)', () => {
  test('is stored in secure storage', async () => {
    await auth.setRecoveryPending(true);
    expect(SecureStore.setItemAsync).toHaveBeenCalledWith('rasd.recoveryPending', '1');
    await auth.setRecoveryPending(false);
    expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith('rasd.recoveryPending');
  });

  test('unreadable storage counts as pending (fail safe)', async () => {
    SecureStore.getItemAsync.mockRejectedValue(new Error('keystore unavailable'));
    await expect(auth.isRecoveryPending()).resolves.toBe(true);
  });
});
