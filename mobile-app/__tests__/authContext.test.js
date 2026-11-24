// File: authContext.test.js
// Purpose: Tests of the AuthContext state rules with mocked auth functions (no network):
// session restore by role, physician sign-out with message (UC-02 3b), role-query failure,
// logout, password-recovery priority (UC-03), and the interrupted-recovery sign-out.

import { act, render, screen, waitFor } from '@testing-library/react-native';
import { useEffect } from 'react';
import { Text } from 'react-native';
import * as Linking from 'expo-linking';

import { AuthProvider, useAuth } from '../src/context/AuthContext';
import * as auth from '../src/lib/auth';
import { queueRecovery } from '../src/lib/deepLinks';
import { ROUTES } from '../src/lib/routing';

jest.mock('../src/lib/auth', () => ({
  signIn: jest.fn(),
  getSession: jest.fn(),
  getRole: jest.fn(),
  signOut: jest.fn(),
  exchangeRecoveryCode: jest.fn(),
  updatePassword: jest.fn(),
  setRecoveryPending: jest.fn(),
  isRecoveryPending: jest.fn(),
  onSignedOut: jest.fn(),
}));

jest.mock('expo-linking', () => ({ getInitialURL: jest.fn() }));

const session = { user: { id: 'u1' } };
// Latest context value seen by the probe component (updated after each render)
const probe = { current: null };

function Probe() {
  const value = useAuth();
  useEffect(() => {
    probe.current = value;
  });
  return <Text testID="target">{value.target}</Text>;
}

async function renderProvider() {
  await render(
    <AuthProvider>
      <Probe />
    </AuthProvider>,
  );
}

// Generous timeout: the provider resolves several mocked async steps (slow CI machines)
const WAIT = { timeout: 5000 };
const expectTarget = (target) =>
  waitFor(() => expect(screen.getByTestId('target')).toHaveTextContent(target), WAIT);

beforeEach(() => {
  jest.clearAllMocks();
  auth.isRecoveryPending.mockResolvedValue(false);
  auth.getSession.mockResolvedValue({ ok: true, session: null });
  auth.signOut.mockResolvedValue(undefined);
  auth.setRecoveryPending.mockResolvedValue(undefined);
  auth.onSignedOut.mockReturnValue(() => {});
  Linking.getInitialURL.mockResolvedValue(null);
});

describe('startup', () => {
  test('no stored session → auth screens', async () => {
    await renderProvider();
    await expectTarget(ROUTES.auth);
  });

  test.each([
    ['patient', ROUTES.patient],
    ['caregiver', ROUTES.caregiver],
  ])('stored %s session restores the role screen', async (role, target) => {
    auth.getSession.mockResolvedValue({ ok: true, session });
    auth.getRole.mockResolvedValue({ status: 'ok', role });
    await renderProvider();
    await expectTarget(target);
  });

  test('stored physician session is signed out with a message (UC-02 3b)', async () => {
    auth.getSession.mockResolvedValue({ ok: true, session });
    auth.getRole.mockResolvedValue({ status: 'ok', role: 'physician' });
    await renderProvider();
    await expectTarget(ROUTES.auth);
    expect(auth.signOut).toHaveBeenCalled();
    expect(probe.current.peekNotice()).toEqual({ variant: 'error', kind: 'physicianNotAllowed' });
  });

  test('a recovery interrupted in a previous run is signed out (decision 3)', async () => {
    auth.isRecoveryPending.mockResolvedValue(true);
    auth.getSession.mockResolvedValue({ ok: true, session: null });
    await renderProvider();
    await expectTarget(ROUTES.auth);
    expect(auth.signOut).toHaveBeenCalled();
    expect(auth.setRecoveryPending).toHaveBeenCalledWith(false);
  });
});

describe('login (UC-02)', () => {
  test('physician is signed out immediately and gets the web-dashboard message', async () => {
    auth.signIn.mockResolvedValue({ ok: true, session });
    auth.getRole.mockResolvedValue({ status: 'ok', role: 'physician' });
    await renderProvider();
    await expectTarget(ROUTES.auth);

    let result;
    await act(async () => {
      result = await probe.current.login({ email: 'dr@example.com', password: 'x' });
    });
    expect(result).toEqual({ ok: false, kind: 'physicianNotAllowed' });
    expect(auth.signOut).toHaveBeenCalled();
    expect(screen.getByTestId('target')).toHaveTextContent(ROUTES.auth);
  });

  test('a failed role query leads to the account error screen, not a home screen', async () => {
    auth.signIn.mockResolvedValue({ ok: true, session });
    auth.getRole.mockResolvedValue({ status: 'error' });
    await renderProvider();
    await expectTarget(ROUTES.auth);

    await act(async () => {
      await probe.current.login({ email: 'a@b.co', password: 'x' });
    });
    await expectTarget(ROUTES.accountError);
  });

  test('wrong credentials keep the user on the auth screens', async () => {
    auth.signIn.mockResolvedValue({ ok: false, kind: 'invalidCredentials' });
    await renderProvider();
    await expectTarget(ROUTES.auth);

    let result;
    await act(async () => {
      result = await probe.current.login({ email: 'a@b.co', password: 'x' });
    });
    expect(result).toEqual({ ok: false, kind: 'invalidCredentials' });
    expect(screen.getByTestId('target')).toHaveTextContent(ROUTES.auth);
  });

  test('logout ends the session and returns to the auth screens', async () => {
    auth.getSession.mockResolvedValue({ ok: true, session });
    auth.getRole.mockResolvedValue({ status: 'ok', role: 'patient' });
    await renderProvider();
    await expectTarget(ROUTES.patient);

    await act(async () => {
      await probe.current.logout();
    });
    expect(auth.signOut).toHaveBeenCalled();
    await expectTarget(ROUTES.auth);
  });
});

describe('password recovery (UC-03)', () => {
  test('a recovery link has priority over a signed-in patient session', async () => {
    auth.getSession.mockResolvedValue({ ok: true, session });
    auth.getRole.mockResolvedValue({ status: 'ok', role: 'patient' });
    auth.exchangeRecoveryCode.mockResolvedValue({ ok: true });
    await renderProvider();
    await expectTarget(ROUTES.patient);

    await act(async () => {
      queueRecovery({ code: 'warm-code-1', errorCode: null }); // warm start
    });
    await expectTarget(ROUTES.newPassword);
    expect(auth.setRecoveryPending).toHaveBeenCalledWith(true);
    expect(auth.exchangeRecoveryCode).toHaveBeenCalledWith('warm-code-1');
    await waitFor(() => expect(probe.current.recovery).toEqual({ state: 'ready' }));
  });

  test('cold start from a recovery link opens A6 without restoring the stored session', async () => {
    Linking.getInitialURL.mockResolvedValue('rasd://new-password?code=cold-code-1');
    auth.exchangeRecoveryCode.mockResolvedValue({ ok: true });
    await renderProvider();
    await expectTarget(ROUTES.newPassword);
    expect(auth.getSession).not.toHaveBeenCalled();
  });

  test('an expired link shows the invalid state (5a)', async () => {
    await renderProvider();
    await expectTarget(ROUTES.auth);
    await act(async () => {
      queueRecovery({ code: null, errorCode: 'otp_expired' });
    });
    await waitFor(() => expect(probe.current.recovery).toEqual({ state: 'invalid' }));
    expect(auth.exchangeRecoveryCode).not.toHaveBeenCalled();

    // "Request a new link": leave recovery and open A4 once
    await act(async () => {
      await probe.current.exitRecovery('/forgot-password');
    });
    await expectTarget(ROUTES.auth);
    expect(auth.setRecoveryPending).toHaveBeenLastCalledWith(false);
    expect(probe.current.peekNextAuthPath()).toBe('/forgot-password');
    probe.current.clearNextAuthPath();
    expect(probe.current.peekNextAuthPath()).toBeNull();
  });

  test('a successful update signs out and leaves a success notice for A1', async () => {
    auth.exchangeRecoveryCode.mockResolvedValue({ ok: true });
    auth.updatePassword.mockResolvedValue({ ok: true });
    await renderProvider();
    await expectTarget(ROUTES.auth);
    await act(async () => {
      queueRecovery({ code: 'update-code-1', errorCode: null });
    });
    await waitFor(() => expect(probe.current.recovery).toEqual({ state: 'ready' }));

    await act(async () => {
      await probe.current.completeRecovery('abcdefg1');
    });
    expect(auth.signOut).toHaveBeenCalled();
    expect(auth.setRecoveryPending).toHaveBeenLastCalledWith(false);
    await expectTarget(ROUTES.auth);
    expect(probe.current.peekNotice()).toEqual({ variant: 'success', kind: 'passwordUpdated' });
  });
});
