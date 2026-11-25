// File: alerts.js
// Purpose: The caregiver's alerts from the alert table, with the start time, duration and
// label (FR-17, set by the patient; shown read-only) of each alert's event, for the caregiver
// Alerts screen C2/C3 (FR-13, UC-08). Screens call this function; they never call Supabase
// directly.
// RLS (NFR-05): a caregiver reads only the alerts of their linked patient, and only the events
// that have one of their alerts; the query therefore needs no filter of its own.
// Alerts are returned in the shape the screen already uses with the sample data:
//   { id, eventId, startTime: Date, durationSec, label }, newest event first.
// Returns { ok: true, data } or { ok: false, kind } where kind is 'network' or 'server'. An
// alert whose event cannot be read is 'server', so the problem is visible instead of a
// silently shorter list (as approved decision D3-a). Personal data are never logged.

import { supabase } from './supabase';

// Upper bound for one call; supabase-js has no timeout of its own (same value as auth.js)
const REQUEST_TIMEOUT_MS = 15000;
const TIMEOUT_ERROR = { name: 'RequestTimeout' };

const fail = (kind) => ({ ok: false, kind });

// Resolves to the call's result, or to { error: TIMEOUT_ERROR } if it takes too long
function withTimeout(promise) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ data: null, error: TIMEOUT_ERROR }), REQUEST_TIMEOUT_MS);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Runs a call and converts a thrown exception (e.g. offline fetch) into an error result
async function call(run) {
  try {
    return await withTimeout(run());
  } catch (error) {
    return { data: null, error };
  }
}

// Network problems and timeouts → 'network'; anything else → 'server'
function classifyError(error) {
  if (!error || error === TIMEOUT_ERROR) return 'network';
  if (/network request failed|failed to fetch|network error/i.test(error.message ?? '')) {
    return 'network';
  }
  return 'server';
}

/**
 * The signed-in caregiver's alerts, newest event first: { ok: true, data: [alert] } (may be
 * empty) or { ok: false, kind }.
 */
export async function listMyAlerts() {
  const { data, error } = await call(() =>
    supabase
      .from('alert')
      .select('alert_id, event_id, seizure_event(start_time, duration_sec, label)'),
  );
  if (error) return fail(classifyError(error));

  const rows = data ?? [];
  if (rows.some((row) => !row.seizure_event)) return fail('server');

  const alerts = rows.map((row) => ({
    id: row.alert_id,
    eventId: row.event_id,
    startTime: new Date(row.seizure_event.start_time),
    durationSec: row.seizure_event.duration_sec,
    label: row.seizure_event.label,
  }));
  alerts.sort((a, b) => b.startTime - a.startTime);
  return { ok: true, data: alerts };
}
