// File: alerts.js
// Purpose: SAMPLE DATA (Sprint 1) — the caregiver's alerts for C2 (FR-13, UC-08). The screen
// shows the "بيانات تجريبية" badge. Real alerts (alert table, readable by the linked
// caregiver through RLS) replace this file in a later sprint without changes to the screen.
// One alert per sample event of the C2 design (e1–e5, approved decision D3-b), newest first.

import { SAMPLE_EVENTS } from './events';

const ALERT_EVENT_IDS = ['e1', 'e2', 'e3', 'e4', 'e5'];

export function getSampleAlerts() {
  return SAMPLE_EVENTS.filter((event) => ALERT_EVENT_IDS.includes(event.id)).map((event) => ({
    id: `a-${event.id}`,
    eventId: event.id,
    startTime: event.startTime,
    durationSec: event.durationSec,
  }));
}
