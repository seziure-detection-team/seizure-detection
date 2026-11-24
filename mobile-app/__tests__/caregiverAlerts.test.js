// File: caregiverAlerts.test.js
// Purpose: Screen tests of Caregiver Alerts (FR-13, UC-08) with mocked auth state, profile
// and src/lib/alerts.js: C2 list with the real patient name, C4 not linked (1a) without an
// alerts query, C3 no alerts (1b), errors of either query + retry (1c), loading; the logout
// button (UC-02) in every state.

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import CaregiverAlertsScreen from '../app/(caregiver)/alerts';
import ar from '../src/i18n/ar';
import { listMyAlerts } from '../src/lib/alerts';
import { getLinkedPatient } from '../src/lib/profile';

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

const mockLogout = jest.fn(() => Promise.resolve());
jest.mock('../src/context/AuthContext', () => ({ useAuth: () => ({ logout: mockLogout }) }));

// The real modules import the Supabase client; only these functions are needed here
jest.mock('../src/lib/profile', () => ({ getLinkedPatient: jest.fn() }));
jest.mock('../src/lib/alerts', () => ({ listMyAlerts: jest.fn() }));

// The 5 test alerts (database/test-data: events e1–e5), newest first, as listMyAlerts
// returns them. Local times, so the expected texts do not depend on the time zone.
const at = (year, month, day, hours, minutes) => new Date(year, month - 1, day, hours, minutes);
const alert = (n, startTime, durationSec) => ({
  id: `a0000000-0000-4000-8000-00000000000${n}`,
  eventId: `6f1c2a4e-0000-4000-8000-00000000000${n}`,
  startTime,
  durationSec,
});
const ALERTS = [
  alert(1, at(2026, 11, 22, 2, 14), 72),
  alert(2, at(2026, 11, 19, 23, 40), 48),
  alert(3, at(2026, 11, 15, 4, 5), 123),
  alert(4, at(2026, 11, 9, 19, 22), 35),
  alert(5, at(2026, 11, 2, 3, 51), 86),
];

const linked = { ok: true, patient: { name: 'سارة أحمد' } };
const chip = ar.caregiverAlerts.patient.replace('{name}', 'سارة أحمد');
const logoutButton = () => screen.getByRole('button', { name: ar.common.logout });
const alertItems = () => screen.queryAllByText(ar.caregiverAlerts.itemTitle);

beforeEach(() => {
  jest.clearAllMocks();
});

test('C2: real patient name, sample badge and the 5 loaded alerts, newest first', async () => {
  getLinkedPatient.mockResolvedValue(linked);
  listMyAlerts.mockResolvedValue({ ok: true, data: ALERTS });
  await render(<CaregiverAlertsScreen />);

  expect(await screen.findByText(chip)).toBeTruthy();
  expect(screen.getByRole('header', { name: ar.caregiverAlerts.title })).toBeTruthy();
  expect(screen.getByText(ar.sampleData.sample)).toBeTruthy();
  expect(alertItems()).toHaveLength(5);

  const labels = screen
    .getAllByLabelText(/^حدث صرع محتمل، /)
    .map((node) => node.props.accessibilityLabel);
  expect(labels).toHaveLength(5);
  const label = (date, time, duration) =>
    ar.caregiverAlerts.itemLabel
      .replace('{date}', date)
      .replace('{time}', time)
      .replace('{duration}', duration);
  expect(labels[0]).toBe(label('22 نوفمبر 2026', '2:14 ص', '1:12 د'));
  expect(labels[4]).toBe(label('2 نوفمبر 2026', '3:51 ص', '1:26 د'));
  expect(listMyAlerts).toHaveBeenCalledTimes(1);
  expect(logoutButton()).toBeTruthy();
});

test('C4: no linked patient shows the not-linked state and loads no alerts (1a)', async () => {
  getLinkedPatient.mockResolvedValue({ ok: true, patient: null });
  await render(<CaregiverAlertsScreen />);

  expect(await screen.findByText(ar.caregiverAlerts.notLinkedTitle)).toBeTruthy();
  expect(screen.getByText(ar.caregiverAlerts.notLinkedBody)).toBeTruthy();
  expect(screen.queryByText(chip)).toBeNull();
  expect(screen.queryByText(ar.sampleData.sample)).toBeNull();
  expect(listMyAlerts).not.toHaveBeenCalled();
  expect(logoutButton()).toBeTruthy();
});

test('C3: linked with no alerts shows the empty state and the patient chip (1b)', async () => {
  getLinkedPatient.mockResolvedValue(linked);
  listMyAlerts.mockResolvedValue({ ok: true, data: [] });
  await render(<CaregiverAlertsScreen />);

  expect(await screen.findByText(ar.caregiverAlerts.emptyTitle)).toBeTruthy();
  expect(screen.getByText(ar.caregiverAlerts.emptyBody)).toBeTruthy();
  expect(screen.getByText(chip)).toBeTruthy();
  expect(screen.queryByText(ar.sampleData.sample)).toBeNull();
  expect(alertItems()).toHaveLength(0);
  expect(logoutButton()).toBeTruthy();
});

test('patient query error then retry: shows the network message, retry loads C2 (1c)', async () => {
  getLinkedPatient
    .mockResolvedValueOnce({ ok: false, kind: 'network' })
    .mockResolvedValueOnce(linked);
  listMyAlerts.mockResolvedValue({ ok: true, data: ALERTS });
  await render(<CaregiverAlertsScreen />);

  expect(await screen.findByText(ar.messages.network)).toBeTruthy();
  expect(listMyAlerts).not.toHaveBeenCalled();
  expect(logoutButton()).toBeTruthy();

  await fireEvent.press(screen.getByRole('button', { name: ar.common.retry }));
  expect(await screen.findByText(chip)).toBeTruthy();
  expect(alertItems()).toHaveLength(5);
  expect(getLinkedPatient).toHaveBeenCalledTimes(2);
});

test.each([
  ['network', ar.messages.network],
  ['server', ar.messages.server],
])(
  'alerts query %s error: message without chip or list; retry loads both again (1c)',
  async (kind, message) => {
    getLinkedPatient.mockResolvedValue(linked);
    listMyAlerts
      .mockResolvedValueOnce({ ok: false, kind })
      .mockResolvedValueOnce({ ok: true, data: ALERTS });
    await render(<CaregiverAlertsScreen />);

    expect(await screen.findByText(message)).toBeTruthy();
    expect(screen.queryByText(chip)).toBeNull();
    expect(alertItems()).toHaveLength(0);
    expect(logoutButton()).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: ar.common.retry }));
    expect(await screen.findByText(chip)).toBeTruthy();
    expect(alertItems()).toHaveLength(5);
    expect(getLinkedPatient).toHaveBeenCalledTimes(2);
    expect(listMyAlerts).toHaveBeenCalledTimes(2);
  },
);

test('while loading the patient: a loading indicator and the logout button', async () => {
  getLinkedPatient.mockReturnValue(new Promise(() => {})); // never resolves
  await render(<CaregiverAlertsScreen />);

  expect(screen.getByLabelText(ar.common.loading)).toBeTruthy();
  expect(logoutButton()).toBeTruthy();
});

test('while loading the alerts: still the loading indicator, no chip yet', async () => {
  let finishAlerts;
  getLinkedPatient.mockResolvedValue(linked);
  listMyAlerts.mockReturnValue(new Promise((resolve) => (finishAlerts = resolve)));
  await render(<CaregiverAlertsScreen />);

  await act(async () => {}); // let getLinkedPatient resolve
  expect(listMyAlerts).toHaveBeenCalledTimes(1);
  expect(screen.getByLabelText(ar.common.loading)).toBeTruthy();
  expect(screen.queryByText(chip)).toBeNull();

  await act(async () => finishAlerts({ ok: true, data: ALERTS }));
  expect(screen.getByText(chip)).toBeTruthy();
  expect(alertItems()).toHaveLength(5);
});
