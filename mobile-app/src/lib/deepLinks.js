// File: deepLinks.js
// Purpose: Parse and hand over the auth links that open the app (UC-01 email confirmation,
// UC-03 password recovery). Used by app/+native-intent.js (cold and warm starts) and by
// the AuthContext. URLs, codes and tokens are never logged or put into navigation state.
//
//   rasd://login?code=…          email confirmation (PKCE). The code is intentionally NOT
//                                exchanged: no session is created; the user lands on A1.
//   rasd://new-password?code=…   password recovery (PKCE). The code is queued here and
//                                exchanged once by the AuthContext.
//   …?error_code=otp_expired…    expired / invalid / used link (query or fragment).

const SCHEME = 'rasd://';

// Parses "a=1&b=2" into an object. Malformed encodings are skipped instead of throwing.
function parseParams(text) {
  const params = {};
  if (!text) return params;
  for (const part of text.split('&')) {
    if (!part) continue;
    const separator = part.indexOf('=');
    const rawKey = separator < 0 ? part : part.slice(0, separator);
    const rawValue = separator < 0 ? '' : part.slice(separator + 1);
    try {
      params[decodeURIComponent(rawKey)] = decodeURIComponent(rawValue.replace(/\+/g, ' '));
    } catch {
      // Ignore a malformed parameter
    }
  }
  return params;
}

// Returns { target: 'login' | 'recovery', code, errorCode } for a rasd:// auth link,
// or null for any other URL (which is then left to Expo Router unchanged).
export function parseAuthLink(url) {
  if (typeof url !== 'string' || !url.toLowerCase().startsWith(SCHEME)) return null;

  const rest = url.slice(SCHEME.length);
  const hashIndex = rest.indexOf('#');
  const beforeHash = hashIndex < 0 ? rest : rest.slice(0, hashIndex);
  const fragment = hashIndex < 0 ? '' : rest.slice(hashIndex + 1);
  const queryIndex = beforeHash.indexOf('?');
  const path = (queryIndex < 0 ? beforeHash : beforeHash.slice(0, queryIndex))
    .replace(/\/+$/, '')
    .toLowerCase();
  const query = queryIndex < 0 ? '' : beforeHash.slice(queryIndex + 1);

  let target = null;
  if (path === 'new-password') target = 'recovery';
  else if (path === 'login') target = 'login';
  if (!target) return null;

  // Supabase may report errors in the query (PKCE) or in the fragment
  const params = { ...parseParams(fragment), ...parseParams(query) };
  return {
    target,
    code: params.code || null,
    errorCode: params.error_code || params.error || null,
  };
}

// ---- Pending recovery hand-over (module state shared with the AuthContext) ----
// The recovery code is processed only once: a code that was already taken is ignored
// if the same link is delivered again (e.g. cold start + warm event).

let pendingRecovery = null;
const takenCodes = new Set();
const listeners = new Set();

export function queueRecovery({ code, errorCode }) {
  if (code && takenCodes.has(code)) return;
  pendingRecovery = { code, errorCode };
  listeners.forEach((listener) => listener());
}

export function takePendingRecovery() {
  const recovery = pendingRecovery;
  pendingRecovery = null;
  if (recovery?.code) takenCodes.add(recovery.code);
  return recovery;
}

export function onRecoveryQueued(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
