// File: history.test.js
// Purpose: Screen tests of History (B5 / B6; FR-14, FR-15, UC-09) with a mocked router: the
// sample list, opening an event, a label changed on B7 (UC-10 step 4), the weekly chart and
// the empty state (UC-09 1a).

import { fireEvent, render, screen } from '@testing-library/react-native';

import HistoryScreen from '../app/(patient)/history';
import ar from '../src/i18n/ar';
import { resetEventLabels, setLabel } from '../src/mocks/eventLabels';

const mockRouter = { push: jest.fn(), back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn() };
jest.mock('expo-router', () => ({ useRouter: () => mockRouter }));

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

// null → the real sample events; an array → used instead (empty-state test)
let mockEvents = null;
jest.mock('../src/mocks/events', () => {
  const actual = jest.requireActual('../src/mocks/events');
  return { ...actual, getSampleEvents: () => mockEvents ?? actual.SAMPLE_EVENTS };
});

afterEach(() => {
  mockEvents = null;
  resetEventLabels();
  jest.clearAllMocks();
});

const itemName = (date, time, duration, label) =>
  ar.history.itemLabel
    .replace('{date}', date)
    .replace('{time}', time)
    .replace('{duration}', duration)
    .replace('{status}', ar.eventLabels[label]);

test('B5: lists the 8 sample events newest first with time, duration, label and the badge', async () => {
  await render(<HistoryScreen />);
  expect(screen.getByRole('header', { name: ar.history.title })).toBeTruthy();
  expect(screen.getByText(ar.sampleData.sample)).toBeTruthy();

  const dates = screen.getAllByText(/^\d+ (نوفمبر|أكتوبر) 2026$/);
  expect(dates).toHaveLength(8);
  expect(dates[0]).toHaveTextContent('22 نوفمبر 2026');
  expect(screen.getByText('2:14 ص')).toBeTruthy();
  expect(screen.getByText('1:12 د')).toBeTruthy();
  expect(screen.getByText(ar.eventLabels.pending_review)).toBeTruthy();
});

test('tapping an event opens its detail (B7)', async () => {
  await render(<HistoryScreen />);
  await fireEvent.press(
    screen.getByRole('button', {
      name: itemName('22 نوفمبر 2026', '2:14 ص', '1:12 د', 'pending_review'),
    }),
  );
  expect(mockRouter.push).toHaveBeenCalledWith({ pathname: '/event/[id]', params: { id: 'e1' } });
});

test('shows a label changed on B7 (UC-10 step 4)', async () => {
  setLabel('e1', 'confirmed_seizure');
  await render(<HistoryScreen />);
  expect(screen.queryByText(ar.eventLabels.pending_review)).toBeNull(); // e1 was the only one
  expect(
    screen.getByRole('button', {
      name: itemName('22 نوفمبر 2026', '2:14 ص', '1:12 د', 'confirmed_seizure'),
    }),
  ).toBeTruthy();
});

test('B6: the Patterns tab shows the weekly chart', async () => {
  await render(<HistoryScreen />);
  await fireEvent.press(screen.getByRole('tab', { name: ar.history.tabPatterns }));
  expect(screen.getByRole('tab', { name: ar.history.tabPatterns })).toBeSelected();
  expect(screen.getByText(ar.history.chartTitle)).toBeTruthy();
  const bar = (week, count) =>
    ar.history.chartBar.replace('{week}', week).replace('{count}', String(count));
  expect(screen.getByLabelText(bar('16 نوف', 2))).toBeTruthy();
  expect(screen.getByLabelText(bar('19 أكت', 0))).toBeTruthy();
});

test('shows the empty state when there are no events (UC-09 1a)', async () => {
  mockEvents = [];
  await render(<HistoryScreen />);
  expect(screen.getByText(ar.history.emptyTitle)).toBeTruthy();
  expect(screen.getByText(ar.history.emptyBody)).toBeTruthy();
});
