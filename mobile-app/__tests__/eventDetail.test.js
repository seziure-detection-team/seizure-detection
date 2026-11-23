// File: eventDetail.test.js
// Purpose: Screen tests of Event detail (B7; FR-17, UC-10) with a mocked router: details and
// "pending review", labelling and changing the label (2b), back button, unknown event id.

import { fireEvent, render, screen } from '@testing-library/react-native';

import EventDetailScreen from '../app/(patient)/event/[id]';
import ar from '../src/i18n/ar';
import { getLabel, resetEventLabels } from '../src/mocks/eventLabels';
import { getSampleEvent } from '../src/mocks/events';

let mockParams = { id: 'e1' };
const mockRouter = { back: jest.fn(), push: jest.fn() };
jest.mock('expo-router', () => ({
  useRouter: () => mockRouter,
  useLocalSearchParams: () => mockParams,
}));

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

afterEach(() => {
  mockParams = { id: 'e1' };
  resetEventLabels();
  jest.clearAllMocks();
});

const confirmed = () => screen.getByRole('radio', { name: ar.eventLabels.confirmed_seizure });
const falseAlarm = () => screen.getByRole('radio', { name: ar.eventLabels.false_alarm });

test('B7: shows the probable seizure event, its details and "pending review"', async () => {
  await render(<EventDetailScreen />);
  expect(screen.getByRole('header', { name: ar.event.title })).toBeTruthy();
  expect(screen.getByText('22 نوفمبر 2026')).toBeTruthy();
  expect(screen.getByText('2:14 ص')).toBeTruthy();
  expect(screen.getByText('1:12 د')).toBeTruthy();
  expect(screen.getByText(ar.eventLabels.pending_review)).toBeTruthy();
  expect(screen.getByText(ar.sampleData.sample)).toBeTruthy();
  expect(confirmed()).not.toBeChecked();
  expect(falseAlarm()).not.toBeChecked();
});

test('choosing a label updates the badge and the store, and it can be changed (FR-17, 2b)', async () => {
  await render(<EventDetailScreen />);

  await fireEvent.press(confirmed());
  expect(confirmed()).toBeChecked();
  expect(screen.queryByText(ar.eventLabels.pending_review)).toBeNull();
  expect(getLabel(getSampleEvent('e1'))).toBe('confirmed_seizure');

  await fireEvent.press(falseAlarm());
  expect(falseAlarm()).toBeChecked();
  expect(confirmed()).not.toBeChecked();
  expect(getLabel(getSampleEvent('e1'))).toBe('false_alarm');
});

test('the back button returns to History', async () => {
  await render(<EventDetailScreen />);
  await fireEvent.press(screen.getByRole('button', { name: ar.common.back }));
  expect(mockRouter.back).toHaveBeenCalledTimes(1);
});

test('an unknown event id shows "الحدث غير موجود" with a back button', async () => {
  mockParams = { id: 'unknown' };
  await render(<EventDetailScreen />);
  expect(screen.getByText(ar.event.notFoundTitle)).toBeTruthy();
  expect(screen.getByRole('button', { name: ar.common.back })).toBeTruthy();
});
