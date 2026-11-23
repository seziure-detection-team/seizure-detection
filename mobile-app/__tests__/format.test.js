// File: format.test.js
// Purpose: Unit tests of src/lib/format.js: Arabic date, 12-hour time with ص/م (midnight and
// noon), duration as minutes:seconds, week label. Western digits as in the designs.

import { formatDate, formatDuration, formatTime, formatWeekLabel } from '../src/lib/format';

test('formatDate: "22 نوفمبر 2026"', () => {
  expect(formatDate(new Date(2026, 10, 22, 2, 14))).toBe('22 نوفمبر 2026');
});

test('formatTime: 12-hour clock with ص / م, including midnight and noon', () => {
  expect(formatTime(new Date(2026, 10, 22, 2, 14))).toBe('2:14 ص');
  expect(formatTime(new Date(2026, 10, 19, 23, 40))).toBe('11:40 م');
  expect(formatTime(new Date(2026, 10, 19, 0, 5))).toBe('12:05 ص');
  expect(formatTime(new Date(2026, 10, 19, 12, 0))).toBe('12:00 م');
});

test('formatDuration: minutes:seconds with د; never negative', () => {
  expect(formatDuration(72)).toBe('1:12 د');
  expect(formatDuration(35)).toBe('0:35 د');
  expect(formatDuration(123)).toBe('2:03 د');
  expect(formatDuration(-5)).toBe('0:00 د');
});

test('formatWeekLabel: "12 أكت"', () => {
  expect(formatWeekLabel(new Date(2026, 9, 12))).toBe('12 أكت');
});
