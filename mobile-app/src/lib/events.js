// File: events.js
// Purpose: The patient's seizure events from the seizure_event table, for History (B5),
// Patterns (B6) and Event detail (B7) (FR-14, FR-15, FR-17, UC-09, UC-10). Screens call these
// functions; they never call Supabase directly.
//   - listMyEvents: the signed-in patient's events, newest first.
//   - getEvent: one of the patient's events, or 'notFound'.
//   - updateEventLabel: the patient labels an event (UC-10); only the label column is sent.
// Events are returned in the shape the screens already use with the sample data:
//   { id, startTime: Date, durationSec, label, confidence }
// RLS (NFR-05): a patient reads and labels only their own events. A linked caregiver can also
// read alerted events, so the queries filter on patient_id = the signed-in user explicitly.
// Every function returns { ok: true, data } or { ok: false, kind } where kind is 'network',
// 'server', 'notFound' or 'invalidLabel'. Event data and other personal data are never logged.

import { supabase } from './supabase';

// Upper bound for one call; supabase-js has no timeout of its own (same value as auth.js)
const REQUEST_TIMEOUT_MS = 15000;
const TIMEOUT_ERROR = { name: 'RequestTimeout' };

const EVENT_COLUMNS = 'event_id, start_time, duration_sec, label, confidence';

// UC-10: the patient chooses one of these; pending_review is set by the system only
export const PATIENT_LABELS = ['confirmed_seizure', 'false_alarm'];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

// A seizure_event row → the app shape
function toEvent(row) {
  return {
    id: row.event_id,
    startTime: new Date(row.start_time),
    durationSec: row.duration_sec,
    label: row.label,
    confidence: row.confidence,
  };
}

// The signed-in user's id: { ok: true, userId } or { ok: false, kind }
async function currentUserId() {
  const { data, error } = await call(() => supabase.auth.getSession());
  if (error) return fail(classifyError(error));
  const userId = data?.session?.user?.id;
  if (!userId) return fail('server'); // these screens are only reachable when signed in
  return { ok: true, userId };
}

/**
 * The signed-in patient's events, newest first: { ok: true, data: [event] } (may be empty).
 */
export async function listMyEvents() {
  const user = await currentUserId();
  if (!user.ok) return user;

  const { data, error } = await call(() =>
    supabase
      .from('seizure_event')
      .select(EVENT_COLUMNS)
      .eq('patient_id', user.userId)
      .order('start_time', { ascending: false }),
  );
  if (error) return fail(classifyError(error));
  return { ok: true, data: (data ?? []).map(toEvent) };
}

/**
 * One of the patient's events: { ok: true, data: event } or { ok: false, kind: 'notFound' }.
 * An id that is not a UUID is 'notFound' without a database call.
 */
export async function getEvent(eventId) {
  if (typeof eventId !== 'string' || !UUID_PATTERN.test(eventId)) return fail('notFound');

  const user = await currentUserId();
  if (!user.ok) return user;

  const { data, error } = await call(() =>
    supabase
      .from('seizure_event')
      .select(EVENT_COLUMNS)
      .eq('event_id', eventId)
      .eq('patient_id', user.userId)
      .maybeSingle(),
  );
  if (error) return fail(classifyError(error));
  if (!data) return fail('notFound');
  return { ok: true, data: toEvent(data) };
}

/**
 * Labels one of the patient's events (UC-10): label is 'confirmed_seizure' or 'false_alarm'.
 * Any other value is 'invalidLabel' without a database call. Only the label column is sent
 * (the database grants UPDATE on label only). An event that does not exist or is not the
 * patient's updates no row and returns 'notFound'.
 * Returns { ok: true, data: { id, label } } or { ok: false, kind }.
 */
export async function updateEventLabel(eventId, label) {
  if (!PATIENT_LABELS.includes(label)) return fail('invalidLabel');
  if (typeof eventId !== 'string' || !UUID_PATTERN.test(eventId)) return fail('notFound');

  const user = await currentUserId();
  if (!user.ok) return user;

  const { data, error } = await call(() =>
    supabase
      .from('seizure_event')
      .update({ label })
      .eq('event_id', eventId)
      .eq('patient_id', user.userId)
      .select('event_id, label')
      .maybeSingle(),
  );
  if (error) return fail(classifyError(error));
  if (!data) return fail('notFound');
  return { ok: true, data: { id: data.event_id, label: data.label } };
}
