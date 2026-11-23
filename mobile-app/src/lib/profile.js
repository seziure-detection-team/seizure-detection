// File: profile.js
// Purpose: Read-only profile data for the patient and caregiver screens. Screens call these
// functions; they never call Supabase directly.
//   - getOwnFullName: the signed-in user's name for the greeting (B1/B2/B4). Read from the
//     session's user_metadata.full_name, which signUp stores (auth.js); only if it is missing
//     the own `profile` row is queried (RLS: own row only, NFR-05).
//   - getLinkedPatient: the caregiver's linked patient for C2/C3/C4 (UC-08): the `patient`
//     row where caregiver_id = me, then that patient's profile name (RLS policy
//     03_caregiver_patient_name_policy.sql). Links are configured by the team (no linking UI).
// Every function returns { ok: true, ... } or { ok: false, kind } where kind is 'network' or
// 'server' (ar.messages). Names and other personal data are never logged.

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

// A usable name, or null for empty / non-string values
function cleanName(value) {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

/**
 * The signed-in user's full name: { ok: true, name } (name may be null) or { ok: false, kind }.
 */
export async function getOwnFullName() {
  const { data, error } = await call(() => supabase.auth.getSession());
  if (error) return fail(classifyError(error));

  const user = data?.session?.user;
  if (!user) return { ok: true, name: null };

  const fromMetadata = cleanName(user.user_metadata?.full_name);
  if (fromMetadata) return { ok: true, name: fromMetadata };

  // Fallback: own profile row (e.g. an account created before full_name was in the metadata)
  const result = await call(() =>
    supabase.from('profile').select('full_name').eq('user_id', user.id).maybeSingle(),
  );
  if (result.error) return fail(classifyError(result.error));
  return { ok: true, name: cleanName(result.data?.full_name) };
}

/**
 * First word of a full name, for the greeting ("مرحبًا، سارة"); null if there is no name.
 */
export function firstName(fullName) {
  const name = cleanName(fullName);
  return name ? name.split(/\s+/)[0] : null;
}

/**
 * The caregiver's linked patient (UC-08):
 *   { ok: true, patient: null }        no linked patient (C4, UC-08 1a)
 *   { ok: true, patient: { name } }    linked (C2 / C3)
 *   { ok: false, kind }                query failed (UC-08 1c). A linked patient whose name
 *                                      cannot be read (e.g. RLS policy 03 missing) is also an
 *                                      error, so the problem is visible (approved decision D3-a).
 */
export async function getLinkedPatient() {
  const { data, error } = await call(() => supabase.auth.getSession());
  if (error) return fail(classifyError(error));

  const user = data?.session?.user;
  if (!user) return fail('server'); // this screen is only reachable when signed in

  // caregiver_id is unique: at most one linked patient
  const link = await call(() =>
    supabase.from('patient').select('patient_id').eq('caregiver_id', user.id).maybeSingle(),
  );
  if (link.error) return fail(classifyError(link.error));
  if (!link.data) return { ok: true, patient: null };

  const profile = await call(() =>
    supabase.from('profile').select('full_name').eq('user_id', link.data.patient_id).maybeSingle(),
  );
  if (profile.error) return fail(classifyError(profile.error));

  const name = cleanName(profile.data?.full_name);
  if (!name) return fail('server');
  return { ok: true, patient: { name } };
}
