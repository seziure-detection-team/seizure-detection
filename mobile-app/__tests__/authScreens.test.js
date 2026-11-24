// File: authScreens.test.js
// Purpose: Screen tests of A1–A6 with mocked router, auth state and auth functions:
// rendering, navigation, inline validation errors, neutral results, error banners with the
// entered data kept, and the A6 recovery states.

import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import ForgotPasswordScreen from '../app/(auth)/forgot-password';
import LoginScreen from '../app/(auth)/login';
import NewPasswordScreen from '../app/(auth)/new-password';
import RegisterScreen from '../app/(auth)/register';
import ResetSentScreen from '../app/(auth)/reset-sent';
import VerifyEmailScreen from '../app/(auth)/verify-email';
import { useAuth } from '../src/context/AuthContext';
import ar from '../src/i18n/ar';
import { requestReset, signUp } from '../src/lib/auth';

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

jest.mock('../src/context/AuthContext', () => ({ useAuth: jest.fn() }));
jest.mock('../src/lib/auth', () => ({ signUp: jest.fn(), requestReset: jest.fn() }));

const authState = (overrides = {}) => ({
  target: 'auth',
  recovery: null,
  login: jest.fn().mockResolvedValue({ ok: true }),
  completeRecovery: jest.fn().mockResolvedValue({ ok: true }),
  exitRecovery: jest.fn().mockResolvedValue(undefined),
  retryRecovery: jest.fn(),
  peekNotice: jest.fn(() => null),
  clearNotice: jest.fn(),
  ...overrides,
});

beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue(authState());
});

const press = (name) => fireEvent.press(screen.getByRole('button', { name }));
const type = (label, text) => fireEvent.changeText(screen.getByLabelText(label), text);

describe('A1 Login', () => {
  test('shows the title, fields and links', async () => {
    await render(<LoginScreen />);
    expect(screen.getByRole('header', { name: ar.login.title })).toBeTruthy();
    expect(screen.getByLabelText(ar.common.emailLabel)).toBeTruthy();
    expect(screen.getByLabelText(ar.common.passwordLabel)).toBeTruthy();
  });

  test('opens Create Account (A2) and Forgot Password (A4)', async () => {
    await render(<LoginScreen />);
    await fireEvent.press(screen.getByText(ar.login.createAccount));
    expect(mockRouter.push).toHaveBeenCalledWith('/register');
    await fireEvent.press(screen.getByText(ar.login.forgotPassword));
    expect(mockRouter.push).toHaveBeenCalledWith('/forgot-password');
  });

  test('empty fields show inline errors and do not call login', async () => {
    const state = authState();
    useAuth.mockReturnValue(state);
    await render(<LoginScreen />);
    await press(ar.login.submit);
    expect(screen.getAllByText(ar.errors.required)).toHaveLength(2);
    expect(state.login).not.toHaveBeenCalled();
  });

  test('wrong credentials show one generic message and keep the input (UC-02 3a)', async () => {
    const state = authState({
      login: jest.fn().mockResolvedValue({ ok: false, kind: 'invalidCredentials' }),
    });
    useAuth.mockReturnValue(state);
    await render(<LoginScreen />);
    await type(ar.common.emailLabel, 'sara@example.com');
    await type(ar.common.passwordLabel, 'wrongpass1');
    await press(ar.login.submit);

    expect(state.login).toHaveBeenCalledWith({ email: 'sara@example.com', password: 'wrongpass1' });
    expect(await screen.findByText(ar.messages.invalidCredentials)).toBeTruthy();
    expect(screen.getByLabelText(ar.common.emailLabel).props.value).toBe('sara@example.com');
  });

  test('shows a notice left by a previous flow once', async () => {
    const state = authState({
      peekNotice: jest.fn(() => ({ variant: 'success', kind: 'passwordUpdated' })),
    });
    useAuth.mockReturnValue(state);
    await render(<LoginScreen />);
    expect(screen.getByText(ar.messages.passwordUpdated)).toBeTruthy();
    expect(state.clearNotice).toHaveBeenCalled();
  });
});

describe('A2 Create Account', () => {
  const fillValidForm = async () => {
    await type(ar.register.nameLabel, 'سارة أحمد');
    await type(ar.common.emailLabel, 'sara@example.com');
    await type(ar.common.passwordLabel, 'abcdefg1');
    await fireEvent.press(screen.getByRole('radio', { name: ar.register.rolePatient }));
  };

  test('lets the user pick exactly one role', async () => {
    await render(<RegisterScreen />);
    await fireEvent.press(screen.getByRole('radio', { name: ar.register.roleCaregiver }));
    expect(screen.getByRole('radio', { name: ar.register.roleCaregiver })).toBeChecked();
    expect(screen.getByRole('radio', { name: ar.register.rolePatient })).not.toBeChecked();
  });

  test('invalid input is highlighted inline and not sent (UC-01 3a)', async () => {
    await render(<RegisterScreen />);
    await type(ar.common.emailLabel, 'sara@');
    await type(ar.common.passwordLabel, 'short');
    await press(ar.register.submit);

    expect(screen.getByText(ar.errors.required)).toBeTruthy(); // full name
    expect(screen.getByText(ar.errors.invalidEmail)).toBeTruthy();
    expect(screen.getByText(ar.errors.weakPassword)).toBeTruthy();
    expect(screen.getByText(ar.errors.roleRequired)).toBeTruthy();
    expect(signUp).not.toHaveBeenCalled();
  });

  test('a valid sign-up (new or existing email) opens A3', async () => {
    signUp.mockResolvedValue({ ok: true });
    await render(<RegisterScreen />);
    await fillValidForm();
    await press(ar.register.submit);
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/verify-email'));
    expect(signUp).toHaveBeenCalledWith({
      fullName: 'سارة أحمد',
      email: 'sara@example.com',
      password: 'abcdefg1',
      role: 'patient',
    });
  });

  test('a network error shows a message and keeps the data (UC-01 5a)', async () => {
    signUp.mockResolvedValue({ ok: false, kind: 'network' });
    await render(<RegisterScreen />);
    await fillValidForm();
    await press(ar.register.submit);

    expect(await screen.findByText(ar.messages.network)).toBeTruthy();
    expect(mockRouter.replace).not.toHaveBeenCalled();
    expect(screen.getByLabelText(ar.register.nameLabel).props.value).toBe('سارة أحمد');
    expect(screen.getByRole('radio', { name: ar.register.rolePatient })).toBeChecked();
  });

  test('back button goes back', async () => {
    await render(<RegisterScreen />);
    await press(ar.common.back);
    expect(mockRouter.back).toHaveBeenCalled();
  });
});

describe('A3 Verify Email / A5 Reset Link Sent', () => {
  test('A3 returns to login', async () => {
    await render(<VerifyEmailScreen />);
    await press(ar.verifyEmail.goToLogin);
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });

  test('A5 shows the neutral confirmation and returns to login', async () => {
    await render(<ResetSentScreen />);
    expect(screen.getByText(ar.resetSent.body)).toBeTruthy();
    await press(ar.resetSent.backToLogin);
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });
});

describe('A4 Forgot Password', () => {
  test('validates the email format', async () => {
    await render(<ForgotPasswordScreen />);
    await type(ar.common.emailLabel, 'not-an-email');
    await press(ar.forgotPassword.submit);
    expect(screen.getByText(ar.errors.invalidEmail)).toBeTruthy();
    expect(requestReset).not.toHaveBeenCalled();
  });

  test('an accepted request opens A5', async () => {
    requestReset.mockResolvedValue({ ok: true });
    await render(<ForgotPasswordScreen />);
    await type(ar.common.emailLabel, 'sara@example.com');
    await press(ar.forgotPassword.submit);
    await waitFor(() => expect(mockRouter.replace).toHaveBeenCalledWith('/reset-sent'));
  });

  test('a rate limit shows a message and keeps the email for a retry', async () => {
    requestReset.mockResolvedValue({ ok: false, kind: 'rateLimited' });
    await render(<ForgotPasswordScreen />);
    await type(ar.common.emailLabel, 'sara@example.com');
    await press(ar.forgotPassword.submit);
    expect(await screen.findByText(ar.messages.rateLimited)).toBeTruthy();
    expect(screen.getByLabelText(ar.common.emailLabel).props.value).toBe('sara@example.com');
  });
});

describe('A6 New Password', () => {
  test('shows a loading indicator while the link is checked', async () => {
    useAuth.mockReturnValue(authState({ target: 'newPassword', recovery: { state: 'verifying' } }));
    await render(<NewPasswordScreen />);
    expect(screen.getByLabelText(ar.common.loading)).toBeTruthy();
  });

  test('an invalid link asks for a new link and leaves recovery (UC-03 5a)', async () => {
    const state = authState({ target: 'newPassword', recovery: { state: 'invalid' } });
    useAuth.mockReturnValue(state);
    await render(<NewPasswordScreen />);
    expect(screen.getByText(ar.newPassword.expiredTitle)).toBeTruthy();
    await press(ar.newPassword.requestNewLink);
    expect(state.exitRecovery).toHaveBeenCalledWith('/forgot-password');
  });

  test('mismatching passwords are shown inline and not sent (UC-03 6a)', async () => {
    const state = authState({ target: 'newPassword', recovery: { state: 'ready' } });
    useAuth.mockReturnValue(state);
    await render(<NewPasswordScreen />);
    await type(ar.newPassword.newLabel, 'abcdefg1');
    await type(ar.newPassword.confirmLabel, 'abcdefg2');
    await press(ar.newPassword.submit);
    expect(screen.getByText(ar.errors.passwordsMismatch)).toBeTruthy();
    expect(state.completeRecovery).not.toHaveBeenCalled();
  });

  test('a valid new password is submitted', async () => {
    const state = authState({ target: 'newPassword', recovery: { state: 'ready' } });
    useAuth.mockReturnValue(state);
    await render(<NewPasswordScreen />);
    await type(ar.newPassword.newLabel, 'abcdefg1');
    await type(ar.newPassword.confirmLabel, 'abcdefg1');
    await press(ar.newPassword.submit);
    expect(state.completeRecovery).toHaveBeenCalledWith('abcdefg1');
  });

  test('a connection problem offers a retry', async () => {
    const state = authState({ target: 'newPassword', recovery: { state: 'network', code: 'c' } });
    useAuth.mockReturnValue(state);
    await render(<NewPasswordScreen />);
    expect(screen.getByText(ar.messages.network)).toBeTruthy();
    await press(ar.common.retry);
    expect(state.retryRecovery).toHaveBeenCalled();
  });
});
