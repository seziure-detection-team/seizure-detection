// File: authScreens.test.js
// Purpose: Render tests of the auth screens A1–A6 (Phase 2): each screen shows its title
// and its navigation links/buttons call the router. Expo Router is mocked.

import { fireEvent, render, screen } from '@testing-library/react-native';

import ForgotPasswordScreen from '../app/(auth)/forgot-password';
import LoginScreen from '../app/(auth)/login';
import NewPasswordScreen from '../app/(auth)/new-password';
import RegisterScreen from '../app/(auth)/register';
import ResetSentScreen from '../app/(auth)/reset-sent';
import VerifyEmailScreen from '../app/(auth)/verify-email';
import ar from '../src/i18n/ar';

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };

jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
}));

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('A1 Login', () => {
  test('shows the title, fields and links', async () => {
    await render(<LoginScreen />);
    expect(screen.getByRole('header', { name: ar.login.title })).toBeTruthy();
    expect(screen.getByLabelText(ar.common.emailLabel)).toBeTruthy();
    expect(screen.getByLabelText(ar.common.passwordLabel)).toBeTruthy();
    expect(screen.getByRole('button', { name: ar.login.submit })).toBeTruthy();
  });

  test('opens Create Account (A2) and Forgot Password (A4)', async () => {
    await render(<LoginScreen />);
    await fireEvent.press(screen.getByText(ar.login.createAccount));
    expect(mockRouter.push).toHaveBeenCalledWith('/register');
    await fireEvent.press(screen.getByText(ar.login.forgotPassword));
    expect(mockRouter.push).toHaveBeenCalledWith('/forgot-password');
  });
});

describe('A2 Create Account', () => {
  test('shows the fields and lets the user pick one role', async () => {
    await render(<RegisterScreen />);
    expect(screen.getByRole('header', { name: ar.register.title })).toBeTruthy();
    expect(screen.getByText(ar.common.passwordHint)).toBeTruthy();

    const patient = screen.getByRole('radio', { name: ar.register.rolePatient });
    const caregiver = screen.getByRole('radio', { name: ar.register.roleCaregiver });
    expect(patient).not.toBeChecked();
    expect(caregiver).not.toBeChecked();

    await fireEvent.press(caregiver);
    expect(screen.getByRole('radio', { name: ar.register.roleCaregiver })).toBeChecked();
    expect(screen.getByRole('radio', { name: ar.register.rolePatient })).not.toBeChecked();
  });

  test('back button goes back', async () => {
    await render(<RegisterScreen />);
    await fireEvent.press(screen.getByRole('button', { name: ar.common.back }));
    expect(mockRouter.back).toHaveBeenCalled();
  });
});

describe('A3 Verify Email', () => {
  test('shows the message and returns to login', async () => {
    await render(<VerifyEmailScreen />);
    expect(screen.getByText(ar.verifyEmail.title)).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: ar.verifyEmail.goToLogin }));
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });
});

describe('A4 Forgot Password', () => {
  test('shows the email field and goes back', async () => {
    await render(<ForgotPasswordScreen />);
    expect(screen.getByRole('header', { name: ar.forgotPassword.title })).toBeTruthy();
    expect(screen.getByLabelText(ar.common.emailLabel)).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: ar.common.back }));
    expect(mockRouter.back).toHaveBeenCalled();
  });
});

describe('A5 Reset Link Sent', () => {
  test('shows the neutral confirmation and returns to login', async () => {
    await render(<ResetSentScreen />);
    expect(screen.getByText(ar.resetSent.body)).toBeTruthy();
    await fireEvent.press(screen.getByRole('button', { name: ar.resetSent.backToLogin }));
    expect(mockRouter.replace).toHaveBeenCalledWith('/login');
  });
});

describe('A6 New Password', () => {
  test('shows the new password form', async () => {
    await render(<NewPasswordScreen />);
    expect(screen.getByRole('header', { name: ar.newPassword.title })).toBeTruthy();
    expect(screen.getByLabelText(ar.newPassword.newLabel)).toBeTruthy();
    expect(screen.getByLabelText(ar.newPassword.confirmLabel)).toBeTruthy();
    expect(screen.getByRole('button', { name: ar.newPassword.submit })).toBeTruthy();
  });
});
