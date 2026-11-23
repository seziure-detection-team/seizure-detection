// File: format.js
// Purpose: Date, time and duration formatting for the event screens (B5, B6, B7, C2).
// Arabic month names, ص/م and د come from ar.js; digits stay Western as in the designs.
// Intl is not used on purpose: Hermes' Arabic output uses Arabic-Indic digits.
// All functions use the device's local time.

import ar from '../i18n/ar';

const pad2 = (value) => String(value).padStart(2, '0');

// "22 نوفمبر 2026"
export function formatDate(date) {
  return `${date.getDate()} ${ar.format.months[date.getMonth()]} ${date.getFullYear()}`;
}

// "2:14 ص" / "11:40 م" (12-hour clock; midnight is 12:xx ص, noon 12:xx م)
export function formatTime(date) {
  const hours = date.getHours();
  const hours12 = hours % 12 === 0 ? 12 : hours % 12;
  const period = hours < 12 ? ar.format.am : ar.format.pm;
  return `${hours12}:${pad2(date.getMinutes())} ${period}`;
}

// Duration in seconds → "1:12 د" (minutes:seconds)
export function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(seconds / 60)}:${pad2(seconds % 60)} ${ar.format.minutes}`;
}

// Week label on the B6 chart: "16 نوف"
export function formatWeekLabel(date) {
  return `${date.getDate()} ${ar.format.monthsShort[date.getMonth()]}`;
}
