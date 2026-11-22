// File: +native-intent.js
// Purpose: Expo Router hook for every URL that opens the app (cold and warm starts), called
// before routing. Auth links are rewritten so that codes never reach navigation state:
//   rasd://new-password?code=…  → recovery queued for the AuthContext → /new-password
//   rasd://login?code=…         → /login (the confirmation code is dropped, not exchanged)
// Any other URL is returned unchanged. URLs and codes are never logged.

import { parseAuthLink, queueRecovery } from '../src/lib/deepLinks';

export function redirectSystemPath({ path }) {
  try {
    const link = parseAuthLink(path);
    if (!link) return path;
    if (link.target === 'recovery') {
      queueRecovery(link);
      return '/new-password';
    }
    return '/login';
  } catch {
    // Throwing here can crash the app (Expo Router docs): fall back to the login screen
    return '/login';
  }
}
