// File: patientHome.test.js
// Purpose: Screen tests of the Patient Home (B1 / B2 / B4) with mocked router, auth state and
// profile: greeting, real "not connected" state, the wristband simulation flow
// (B1 → B2 → B4 → B2, FR-05 / UC-04), the logout button (UC-02) and the History tab.

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import PatientHomeScreen from '../app/(patient)/home';
import ar from '../src/i18n/ar';
import { getOwnFullName } from '../src/lib/profile';

const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn(), canGoBack: jest.fn() };
jest.mock('expo-router', () => ({ useRouter: () => mockRouter }));

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

const mockLogout = jest.fn(() => Promise.resolve());
jest.mock('../src/context/AuthContext', () => ({ useAuth: () => ({ logout: mockLogout }) }));

// The real module imports the Supabase client; only its two functions are needed here
jest.mock('../src/lib/profile', () => ({
  getOwnFullName: jest.fn(),
  firstName: (name) => (name ? name.split(' ')[0] : null),
}));

beforeEach(() => {
  jest.clearAllMocks();
  getOwnFullName.mockResolvedValue({ ok: true, name: 'سارة أحمد' });
});

afterEach(() => {
  jest.useRealTimers();
});

test('B1: greets by first name, shows "غير متصل", no simulation badge, and a logout button', async () => {
  await render(<PatientHomeScreen />);
  expect(await screen.findByRole('header', { name: 'مرحبًا، سارة' })).toBeTruthy();
  expect(screen.getByText(ar.patientHome.statusDisconnected)).toBeTruthy();
  expect(screen.queryByText(ar.sampleData.simulation)).toBeNull();
  expect(screen.getByRole('button', { name: ar.common.logout })).toBeTruthy();
});

test('shows the greeting without a name when the name cannot be loaded', async () => {
  getOwnFullName.mockResolvedValue({ ok: false, kind: 'network' });
  await render(<PatientHomeScreen />);
  expect(await screen.findByRole('header', { name: ar.patientHome.greetingNoName })).toBeTruthy();
});

test('simulation: connect → B2, tap the card → B4 warning, reconnect → B2', async () => {
  jest.useFakeTimers();
  await render(<PatientHomeScreen />);

  await fireEvent.press(screen.getByRole('button', { name: ar.patientHome.connect }));
  await act(() => jest.advanceTimersByTime(1000));
  expect(screen.getByText(ar.patientHome.statusConnected)).toBeTruthy();
  expect(screen.getByText(ar.patientHome.monitoringActive)).toBeTruthy();
  expect(screen.getByText(ar.sampleData.simulation)).toBeTruthy();

  const card = ar.patientHome.wristbandStatus.replace('{status}', ar.patientHome.statusConnected);
  await fireEvent.press(screen.getByRole('button', { name: card }));
  expect(screen.getByText(ar.patientHome.lostTitle)).toBeTruthy();
  expect(screen.getByText(ar.patientHome.statusLost)).toBeTruthy();

  await fireEvent.press(screen.getByRole('button', { name: ar.patientHome.reconnect }));
  expect(screen.getByText(ar.patientHome.statusConnected)).toBeTruthy();
  expect(screen.queryByText(ar.patientHome.lostTitle)).toBeNull();
});

test('the History tab opens History', async () => {
  await render(<PatientHomeScreen />);
  await fireEvent.press(screen.getByRole('tab', { name: ar.nav.history }));
  expect(mockRouter.push).toHaveBeenCalledWith('/history');
});
