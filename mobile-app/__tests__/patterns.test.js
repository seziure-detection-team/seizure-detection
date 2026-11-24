// File: patterns.test.js
// Purpose: Unit tests of src/lib/patterns.js (B6, FR-15): Monday weeks, oldest first, window
// anchored at the newest event, and the sample data giving the B6 weeks (decision D2-a).

import { startOfWeek, weeklyCounts } from '../src/lib/patterns';
import { SAMPLE_EVENTS } from '../src/mocks/events';

test('startOfWeek returns the local Monday at midnight', () => {
  expect(startOfWeek(new Date(2026, 10, 22, 2, 14))).toEqual(new Date(2026, 10, 16)); // Sunday
  expect(startOfWeek(new Date(2026, 10, 16, 9, 0))).toEqual(new Date(2026, 10, 16)); // Monday
});

test('sample data: weeks 12 Oct … 16 Nov with 1, 0, 2, 1, 2, 2 events', () => {
  const weeks = weeklyCounts(SAMPLE_EVENTS);
  expect(weeks.map((week) => week.weekStart)).toEqual([
    new Date(2026, 9, 12),
    new Date(2026, 9, 19),
    new Date(2026, 9, 26),
    new Date(2026, 10, 2),
    new Date(2026, 10, 9),
    new Date(2026, 10, 16),
  ]);
  expect(weeks.map((week) => week.count)).toEqual([1, 0, 2, 1, 2, 2]);
});

test('events before the window are ignored; no events gives an empty chart', () => {
  const recent = { startTime: new Date(2026, 10, 18) };
  const old = { startTime: new Date(2026, 0, 5) };
  expect(weeklyCounts([recent, old], 2).map((week) => week.count)).toEqual([0, 1]);
  expect(weeklyCounts([])).toEqual([]);
});
