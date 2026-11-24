// File: history.test.js
// Purpose: Screen tests of History (B5 / B6; FR-14, FR-15, UC-09) with a mocked router and a
// mocked src/lib/events.js: loading, the list, opening an event, the reload when the screen
// comes back into view (UC-10 step 4), the weekly chart, the empty state (UC-09 1a) and an
// error with retry (UC-09 1b).

import { act, fireEvent, render, screen } from '@testing-library/react-native';

import HistoryScreen from '../app/(patient)/history';
import ar from '../src/i18n/ar';
import { listMyEvents } from '../src/lib/events';

// useFocusEffect runs its callback after mount; refocus() runs it again (back from B7)
let mockFocusCallback = null;
const mockRouter = { push: jest.fn(), back: jest.fn(), replace: jest.fn(), canGoBack: jest.fn() };
jest.mock('expo-router', () => {
  const { useEffect } = jest.requireActual('react');
  return {
    useRouter: () => mockRouter,
    useFocusEffect: (callback) => {
      mockFocusCallback = callback;
      useEffect(callback, [callback]);
    },
  };
});
const refocus = () => act(async () => mockFocusCallback());

jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);

// The real module imports the Supabase client; only listMyEvents is needed here
jest.mock('../src/lib/events', () => ({ listMyEvents: jest.fn() }));

// The 8 test events (database/test-data), newest first, as listMyEvents returns them.
// Local times, so the expected texts do not depend on the machine's time zone.
const at = (year, month, day, hours, minutes) => new Date(year, month - 1, day, hours, minutes);
const ID1 = '6f1c2a4e-0000-4000-8000-000000000001';
const event = (n, startTime, durationSec, label) => ({
  id: `6f1c2a4e-0000-4000-8000-00000000000${n}`,
  startTime,
  durationSec,
  label,
  confidence: 0.8,
});
const EVENTS = [
  event(1, at(2026, 11, 22, 2, 14), 72, 'pending_review'),
  event(2, at(2026, 11, 19, 23, 40), 48, 'confirmed_seizure'),
  event(3, at(2026, 11, 15, 4, 5), 123, 'false_alarm'),
  event(4, at(2026, 11, 9, 19, 22), 35, 'confirmed_seizure'),
  event(5, at(2026, 11, 2, 3, 51), 86, 'false_alarm'),
  event(6, at(2026, 10, 30, 22, 15), 52, 'confirmed_seizure'),
  event(7, at(2026, 10, 27, 1, 30), 65, 'false_alarm'),
  event(8, at(2026, 10, 13, 21, 48), 41, 'confirmed_seizure'),
];
const loaded = (data = EVENTS) => ({ ok: true, data });

beforeEach(() => {
  jest.clearAllMocks();
  mockFocusCallback = null;
});

const itemName = (date, time, duration, label) =>
  ar.history.itemLabel
    .replace('{date}', date)
    .replace('{time}', time)
    .replace('{duration}', duration)
    .replace('{status}', ar.eventLabels[label]);
const firstItem = (label) => itemName('22 نوفمبر 2026', '2:14 ص', '1:12 د', label);
const eventDates = () => screen.queryAllByText(/^\d+ (نوفمبر|أكتوبر) 2026$/);

test('while loading: a loading indicator under the title, tabs and badge', async () => {
  listMyEvents.mockReturnValue(new Promise(() => {})); // never resolves
  await render(<HistoryScreen />);
  expect(screen.getByLabelText(ar.common.loading)).toBeTruthy();
  expect(screen.getByRole('header', { name: ar.history.title })).toBeTruthy();
  expect(screen.getByRole('tab', { name: ar.history.tabPatterns })).toBeTruthy();
  expect(screen.getByText(ar.sampleData.sample)).toBeTruthy();
  expect(eventDates()).toHaveLength(0);
});

test('B5: lists the loaded events newest first with time, duration, label and the badge', async () => {
  listMyEvents.mockResolvedValue(loaded());
  await render(<HistoryScreen />);

  expect(await screen.findByText('2:14 ص')).toBeTruthy();
  const dates = eventDates();
  expect(dates).toHaveLength(8);
  expect(dates[0]).toHaveTextContent('22 نوفمبر 2026');
  expect(dates[7]).toHaveTextContent('13 أكتوبر 2026');
  expect(screen.getByText('1:12 د')).toBeTruthy();
  expect(screen.getByText(ar.eventLabels.pending_review)).toBeTruthy();
  expect(screen.getByText(ar.sampleData.sample)).toBeTruthy();
  expect(screen.queryByLabelText(ar.common.loading)).toBeNull();
  expect(listMyEvents).toHaveBeenCalledTimes(1);
});

test('tapping an event opens its detail (B7) with the real event id', async () => {
  listMyEvents.mockResolvedValue(loaded());
  await render(<HistoryScreen />);
  await fireEvent.press(await screen.findByRole('button', { name: firstItem('pending_review') }));
  expect(mockRouter.push).toHaveBeenCalledWith({ pathname: '/event/[id]', params: { id: ID1 } });
});

test('back from B7: reloads, keeps the list during the reload, then shows the saved label (UC-10 step 4)', async () => {
  let finishReload;
  const relabelled = EVENTS.map((e) => (e.id === ID1 ? { ...e, label: 'confirmed_seizure' } : e));
  listMyEvents
    .mockResolvedValueOnce(loaded())
    .mockReturnValueOnce(new Promise((resolve) => (finishReload = resolve)));
  await render(<HistoryScreen />);
  expect(await screen.findByRole('button', { name: firstItem('pending_review') })).toBeTruthy();

  await refocus();
  expect(listMyEvents).toHaveBeenCalledTimes(2);
  expect(screen.queryByLabelText(ar.common.loading)).toBeNull();
  expect(eventDates()).toHaveLength(8); // list kept while reloading

  await act(async () => finishReload(loaded(relabelled)));
  expect(screen.getByRole('button', { name: firstItem('confirmed_seizure') })).toBeTruthy();
  expect(screen.queryByText(ar.eventLabels.pending_review)).toBeNull(); // e1 was the only one
});

test('B6: the Patterns tab shows the weekly chart of the same events', async () => {
  listMyEvents.mockResolvedValue(loaded());
  await render(<HistoryScreen />);
  await screen.findByText('2:14 ص');

  await fireEvent.press(screen.getByRole('tab', { name: ar.history.tabPatterns }));
  expect(screen.getByRole('tab', { name: ar.history.tabPatterns })).toBeSelected();
  expect(screen.getByText(ar.history.chartTitle)).toBeTruthy();
  const bar = (week, count) =>
    ar.history.chartBar.replace('{week}', week).replace('{count}', String(count));
  expect(screen.getByLabelText(bar('12 أكت', 1))).toBeTruthy();
  expect(screen.getByLabelText(bar('19 أكت', 0))).toBeTruthy();
  expect(screen.getByLabelText(bar('26 أكت', 2))).toBeTruthy();
  expect(screen.getByLabelText(bar('2 نوف', 1))).toBeTruthy();
  expect(screen.getByLabelText(bar('9 نوف', 2))).toBeTruthy();
  expect(screen.getByLabelText(bar('16 نوف', 2))).toBeTruthy();
  expect(listMyEvents).toHaveBeenCalledTimes(1); // the tab does not load again
});

test.each(['log', 'patterns'])(
  'shows the empty state when there are no events, on the %s tab (UC-09 1a)',
  async (tab) => {
    listMyEvents.mockResolvedValue(loaded([]));
    await render(<HistoryScreen />);
    if (tab === 'patterns') {
      await fireEvent.press(screen.getByRole('tab', { name: ar.history.tabPatterns }));
    }
    expect(await screen.findByText(ar.history.emptyTitle)).toBeTruthy();
    expect(screen.getByText(ar.history.emptyBody)).toBeTruthy();
    expect(screen.queryByText(ar.history.chartTitle)).toBeNull();
  },
);

test.each([
  ['network', ar.messages.network],
  ['server', ar.messages.server],
])(
  'a %s error shows its message; retry shows loading, then the list (UC-09 1b)',
  async (kind, message) => {
    let finishRetry;
    listMyEvents
      .mockResolvedValueOnce({ ok: false, kind })
      .mockReturnValueOnce(new Promise((resolve) => (finishRetry = resolve)));
    await render(<HistoryScreen />);

    expect(await screen.findByText(message)).toBeTruthy();
    expect(eventDates()).toHaveLength(0);

    await fireEvent.press(screen.getByRole('button', { name: ar.common.retry }));
    expect(screen.getByLabelText(ar.common.loading)).toBeTruthy();
    expect(screen.queryByText(message)).toBeNull();

    await act(async () => finishRetry(loaded()));
    expect(eventDates()).toHaveLength(8);
    expect(listMyEvents).toHaveBeenCalledTimes(2);
  },
);

test('a failed reload on return shows the error with retry', async () => {
  listMyEvents
    .mockResolvedValueOnce(loaded())
    .mockResolvedValueOnce({ ok: false, kind: 'network' });
  await render(<HistoryScreen />);
  await screen.findByText('2:14 ص');

  await refocus();
  expect(screen.getByText(ar.messages.network)).toBeTruthy();
  expect(screen.getByRole('button', { name: ar.common.retry })).toBeTruthy();
});
