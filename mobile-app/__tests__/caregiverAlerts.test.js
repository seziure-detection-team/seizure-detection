// File: caregiverAlerts.test.js
// Purpose: Screen tests of Caregiver Alerts (FR-13, UC-08) with mocked auth state, profile
// and sample alerts: C2 list with the real patient name, C4 not linked (1a), C3 no alerts
// (1b), error + retry (1c), loading; the logout button (UC-02) in every state.

import { fireEvent, render, screen } from '@testing-library/react-native';

import CaregiverAlertsScreen from '../app/(caregiver)/alerts';
import ar from '../src/i18n/ar';
import { getLinkedPatient } from '../src/lib/profile';

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

const mockLogout = jest.fn(() => Promise.resolve());
jest.mock('../src/context/AuthContext', () => ({ useAuth: () => ({ logout: mockLogout }) }));

// The real module imports the Supabase client; only getLinkedPatient is needed here
jest.mock('../src/lib/profile', () => ({ getLinkedPatient: jest.fn() }));

// null → the real sample alerts; an array → used instead (C3 test)
let mockAlerts = null;
jest.mock('../src/mocks/alerts', () => {
  const actual = jest.requireActual('../src/mocks/alerts');
  return { getSampleAlerts: () => mockAlerts ?? actual.getSampleAlerts() };
});

const linked = { ok: true, patient: { name: 'سارة أحمد' } };
const chip = ar.caregiverAlerts.patient.replace('{name}', 'سارة أحمد');
const logoutButton = () => screen.getByRole('button', { name: ar.common.logout });

beforeEach(() => {
  jest.clearAllMocks();
  mockAlerts = null;
});

test('C2: real patient name, sample badge and 5 alerts, newest first', async () => {
  getLinkedPatient.mockResolvedValue(linked);
  await render(<CaregiverAlertsScreen />);

  expect(await screen.findByText(chip)).toBeTruthy();
  expect(screen.getByRole('header', { name: ar.caregiverAlerts.title })).toBeTruthy();
  expect(screen.getByText(ar.sampleData.sample)).toBeTruthy();
  expect(screen.getAllByText(ar.caregiverAlerts.itemTitle)).toHaveLength(5);

  const labels = screen
    .getAllByLabelText(/^حدث صرع محتمل، /)
    .map((node) => node.props.accessibilityLabel);
  expect(labels).toHaveLength(5);
  expect(labels[0]).toBe(
    ar.caregiverAlerts.itemLabel
      .replace('{date}', '22 نوفمبر 2026')
      .replace('{time}', '2:14 ص')
      .replace('{duration}', '1:12 د'),
  );
  expect(logoutButton()).toBeTruthy();
});

test('C4: no linked patient shows the not-linked state, without chip or badge (1a)', async () => {
  getLinkedPatient.mockResolvedValue({ ok: true, patient: null });
  await render(<CaregiverAlertsScreen />);

  expect(await screen.findByText(ar.caregiverAlerts.notLinkedTitle)).toBeTruthy();
  expect(screen.getByText(ar.caregiverAlerts.notLinkedBody)).toBeTruthy();
  expect(screen.queryByText(chip)).toBeNull();
  expect(screen.queryByText(ar.sampleData.sample)).toBeNull();
  expect(logoutButton()).toBeTruthy();
});

test('C3: linked with no alerts shows the empty state and the patient chip (1b)', async () => {
  mockAlerts = [];
  getLinkedPatient.mockResolvedValue(linked);
  await render(<CaregiverAlertsScreen />);

  expect(await screen.findByText(ar.caregiverAlerts.emptyTitle)).toBeTruthy();
  expect(screen.getByText(chip)).toBeTruthy();
  expect(screen.queryByText(ar.sampleData.sample)).toBeNull();
  expect(logoutButton()).toBeTruthy();
});

test('error then retry: shows the network message, retry loads C2 (1c)', async () => {
  getLinkedPatient
    .mockResolvedValueOnce({ ok: false, kind: 'network' })
    .mockResolvedValueOnce(linked);
  await render(<CaregiverAlertsScreen />);

  expect(await screen.findByText(ar.messages.network)).toBeTruthy();
  expect(logoutButton()).toBeTruthy();

  await fireEvent.press(screen.getByRole('button', { name: ar.common.retry }));
  expect(await screen.findByText(chip)).toBeTruthy();
  expect(getLinkedPatient).toHaveBeenCalledTimes(2);
});

test('while loading: a loading indicator and the logout button', async () => {
  getLinkedPatient.mockReturnValue(new Promise(() => {})); // never resolves
  await render(<CaregiverAlertsScreen />);

  expect(screen.getByLabelText(ar.common.loading)).toBeTruthy();
  expect(logoutButton()).toBeTruthy();
});
