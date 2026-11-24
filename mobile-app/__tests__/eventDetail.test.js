// File: eventDetail.test.js
// Purpose: Screen tests of Event detail (B7; FR-17, UC-10) with a mocked router and a mocked
// src/lib/events.js: loading, details and "pending review", saving a label and changing it
// (2b), presses ignored while saving, a failed save keeping the previous label, the back
// button, an unknown event and a load error with retry.

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import EventDetailScreen from '../app/(patient)/event/[id]';
import ar from '../src/i18n/ar';
import { getEvent, updateEventLabel } from '../src/lib/events';

const ID = '6f1c2a4e-0000-4000-8000-000000000001';
let mockParams = { id: ID };
const mockRouter = { back: jest.fn(), push: jest.fn() };
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
}));

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

// The real module imports the Supabase client; PATIENT_LABELS has the real values
jest.mock('../src/lib/events', () => ({
  PATIENT_LABELS: ['confirmed_seizure', 'false_alarm'],
  getEvent: jest.fn(),
  updateEventLabel: jest.fn(),
}));

// Test event e1 (database/test-data), local time
const EVENT = {
  id: ID,
  startTime: new Date(2026, 10, 22, 2, 14),
  durationSec: 72,
  label: 'pending_review',
  confidence: 0.82,
};
const found = (label = EVENT.label) => ({ ok: true, data: { ...EVENT, label } });
const saved = (label) => ({ ok: true, data: { id: ID, label } });

beforeEach(() => {
  jest.clearAllMocks();
  mockParams = { id: ID };
});

const confirmed = () => screen.getByRole('radio', { name: ar.eventLabels.confirmed_seizure });
const falseAlarm = () => screen.getByRole('radio', { name: ar.eventLabels.false_alarm });
const backButton = () => screen.getByRole('button', { name: ar.common.back });

test('while loading: a loading indicator and the back button', async () => {
  getEvent.mockReturnValue(new Promise(() => {})); // never resolves
  await render(<EventDetailScreen />);
  expect(screen.getByLabelText(ar.common.loading)).toBeTruthy();
  expect(backButton()).toBeTruthy();
  expect(screen.queryByRole('radio')).toBeNull();
});

test('B7: loads the event by its id; details, "pending review", badge, no chip selected', async () => {
  getEvent.mockResolvedValue(found());
  await render(<EventDetailScreen />);

  expect(await screen.findByRole('header', { name: ar.event.title })).toBeTruthy();
  expect(getEvent).toHaveBeenCalledWith(ID);
  expect(screen.getByText('22 نوفمبر 2026')).toBeTruthy();
  expect(screen.getByText('2:14 ص')).toBeTruthy();
  expect(screen.getByText('1:12 د')).toBeTruthy();
  expect(screen.getByText(ar.eventLabels.pending_review)).toBeTruthy();
  expect(screen.getByText(ar.sampleData.sample)).toBeTruthy();
  expect(confirmed()).not.toBeChecked();
  expect(falseAlarm()).not.toBeChecked();
});

test('choosing a label saves it and shows it; it can be changed (FR-17, UC-10 3, 2b)', async () => {
  getEvent.mockResolvedValue(found());
  updateEventLabel
    .mockResolvedValueOnce(saved('confirmed_seizure'))
    .mockResolvedValueOnce(saved('false_alarm'));
  await render(<EventDetailScreen />);
  await screen.findByText('2:14 ص');

  await fireEvent.press(confirmed());
  expect(updateEventLabel).toHaveBeenLastCalledWith(ID, 'confirmed_seizure');
  expect(confirmed()).toBeChecked();
  expect(screen.queryByText(ar.eventLabels.pending_review)).toBeNull();

  await fireEvent.press(falseAlarm());
  expect(updateEventLabel).toHaveBeenLastCalledWith(ID, 'false_alarm');
  expect(falseAlarm()).toBeChecked();
  expect(confirmed()).not.toBeChecked();
  expect(updateEventLabel).toHaveBeenCalledTimes(2);
});

test('presses while a save is in progress are ignored; the label shows once saved', async () => {
  let finishSave;
  getEvent.mockResolvedValue(found());
  updateEventLabel.mockReturnValueOnce(new Promise((resolve) => (finishSave = resolve)));
  await render(<EventDetailScreen />);
  await screen.findByText('2:14 ص');

  await fireEvent.press(confirmed());
  await fireEvent.press(confirmed());
  await fireEvent.press(falseAlarm());
  expect(updateEventLabel).toHaveBeenCalledTimes(1);
  expect(confirmed()).not.toBeChecked(); // shown only after the save succeeds

  await act(async () => finishSave(saved('confirmed_seizure')));
  expect(confirmed()).toBeChecked();
  expect(falseAlarm()).not.toBeChecked();
});

test('pressing the label the event already has sends nothing', async () => {
  getEvent.mockResolvedValue(found('confirmed_seizure'));
  await render(<EventDetailScreen />);
  await screen.findByText('2:14 ص');

  expect(confirmed()).toBeChecked();
  await fireEvent.press(confirmed());
  expect(updateEventLabel).not.toHaveBeenCalled();
});

test.each([
  ['network', ar.messages.network],
  ['server', ar.messages.server],
  ['notFound', ar.messages.server],
])(
  'a failed save (%s) shows the error and keeps the previous label; a new press can succeed',
  async (kind, message) => {
    getEvent.mockResolvedValue(found());
    updateEventLabel
      .mockResolvedValueOnce({ ok: false, kind })
      .mockResolvedValueOnce(saved('confirmed_seizure'));
    await render(<EventDetailScreen />);
    await screen.findByText('2:14 ص');

    await fireEvent.press(confirmed());
    expect(screen.getByText(message)).toBeTruthy();
    expect(confirmed()).not.toBeChecked();
    expect(screen.getByText(ar.eventLabels.pending_review)).toBeTruthy();

    await fireEvent.press(confirmed());
    expect(confirmed()).toBeChecked();
    expect(screen.queryByText(message)).toBeNull();
  },
);

test('the back button returns to History', async () => {
  getEvent.mockResolvedValue(found());
  await render(<EventDetailScreen />);
  await screen.findByText('2:14 ص');
  await fireEvent.press(backButton());
  expect(mockRouter.back).toHaveBeenCalledTimes(1);
});

test('an unknown event shows "الحدث غير موجود" with a back button', async () => {
  mockParams = { id: 'unknown' };
  getEvent.mockResolvedValue({ ok: false, kind: 'notFound' });
  await render(<EventDetailScreen />);
  expect(await screen.findByText(ar.event.notFoundTitle)).toBeTruthy();
  expect(screen.getByText(ar.event.notFoundBody)).toBeTruthy();
  expect(getEvent).toHaveBeenCalledWith('unknown');
  expect(backButton()).toBeTruthy();
  expect(screen.queryByRole('radio')).toBeNull();
});

test('a load error shows the message with retry; retry loads the event', async () => {
  getEvent.mockResolvedValueOnce({ ok: false, kind: 'network' }).mockResolvedValueOnce(found());
  await render(<EventDetailScreen />);

  expect(await screen.findByText(ar.messages.network)).toBeTruthy();
  expect(backButton()).toBeTruthy();
  await fireEvent.press(screen.getByRole('button', { name: ar.common.retry }));
  expect(await screen.findByText('2:14 ص')).toBeTruthy();
  expect(getEvent).toHaveBeenCalledTimes(2);
});
