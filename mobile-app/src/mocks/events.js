// File: events.js
// Purpose: SAMPLE DATA (Sprint 1) — the patient's seizure events for History (B5), Patterns
// (B6) and Event detail (B7), and the caregiver's alert list (C2). Screens that show it
// display the "بيانات تجريبية" badge. Real events (seizure_event table) replace this file in a
// later sprint without changes to the screens.
// Rows 1–5 are the events of the designs; rows 6–8 make the October bars of B6 match.
// Times are local (no time zone), so they display as in the designs on any device.
// `label` uses the seizure_event.label values: pending_review | confirmed_seizure | false_alarm.

// Local date-time; `month` is 1–12
const at = (year, month, day, hours, minutes) => new Date(year, month - 1, day, hours, minutes);

// Newest first
export const SAMPLE_EVENTS = [
  { id: 'e1', startTime: at(2026, 11, 22, 2, 14), durationSec: 72, label: 'pending_review' },
  { id: 'e2', startTime: at(2026, 11, 19, 23, 40), durationSec: 48, label: 'confirmed_seizure' },
  { id: 'e3', startTime: at(2026, 11, 15, 4, 5), durationSec: 123, label: 'false_alarm' },
  { id: 'e4', startTime: at(2026, 11, 9, 19, 22), durationSec: 35, label: 'confirmed_seizure' },
  { id: 'e5', startTime: at(2026, 11, 2, 3, 51), durationSec: 86, label: 'false_alarm' },
  { id: 'e6', startTime: at(2026, 10, 30, 22, 15), durationSec: 52, label: 'confirmed_seizure' },
  { id: 'e7', startTime: at(2026, 10, 27, 1, 30), durationSec: 65, label: 'false_alarm' },
  { id: 'e8', startTime: at(2026, 10, 13, 21, 48), durationSec: 41, label: 'confirmed_seizure' },
];

export function getSampleEvents() {
  return SAMPLE_EVENTS;
}

export function getSampleEvent(id) {
  return SAMPLE_EVENTS.find((event) => event.id === id) ?? null;
}
