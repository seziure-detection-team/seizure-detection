// File: patterns.test.js
// Purpose: Unit tests of src/lib/patterns.js (B6, FR-15): Monday weeks, oldest first, window
// anchored at the newest event, and the test events giving the B6 weeks (decision D2-a).

import { startOfWeek, weeklyCounts } from '../src/lib/patterns';

// The start times of the 8 test events (database/test-data), local time
const EVENTS = [
  [2026, 10, 22, 2, 14],
  [2026, 10, 19, 23, 40],
  [2026, 10, 15, 4, 5],
  [2026, 10, 9, 19, 22],
  [2026, 10, 2, 3, 51],
  [2026, 9, 30, 22, 15],
  [2026, 9, 27, 1, 30],
  [2026, 9, 13, 21, 48],
].map(([year, monthIndex, day, hours, minutes]) => ({
  startTime: new Date(year, monthIndex, day, hours, minutes),
}));

test('startOfWeek returns the local Monday at midnight', () => {
  expect(startOfWeek(new Date(2026, 10, 22, 2, 14))).toEqual(new Date(2026, 10, 16)); // Sunday
  expect(startOfWeek(new Date(2026, 10, 16, 9, 0))).toEqual(new Date(2026, 10, 16)); // Monday
});

test('test data: weeks 12 Oct … 16 Nov with 1, 0, 2, 1, 2, 2 events', () => {
  const weeks = weeklyCounts(EVENTS);
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
