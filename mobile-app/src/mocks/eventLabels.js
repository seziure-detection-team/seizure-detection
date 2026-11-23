// File: eventLabels.js
// Purpose: SAMPLE DATA (Sprint 1) — in-memory event labels set on B7 (FR-17, UC-10), so a
// label chosen on the event detail also shows on History (UC-10 step 4). NOT SAVED: nothing
// is sent to Supabase. Cleared on logout (Patient Home calls resetEventLabels on unmount,
// approved decision D-g) and on app restart.
// Only changed labels are stored; an event without a change keeps its sample label.

import { useSyncExternalStore } from 'react';

let overrides = {}; // { [eventId]: label }
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const getSnapshot = () => overrides;

// Current label of an event, given the overrides snapshot
export function labelFor(currentOverrides, event) {
  return currentOverrides[event.id] ?? event.label;
}

export function getLabel(event) {
  return labelFor(overrides, event);
}

export function setLabel(eventId, label) {
  overrides = { ...overrides, [eventId]: label }; // new object, so React sees the change
  emit();
}

export function resetEventLabels() {
  if (Object.keys(overrides).length === 0) return;
  overrides = {};
  emit();
}

// Hook: the overrides snapshot; components re-render when a label changes
export function useLabelOverrides() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
