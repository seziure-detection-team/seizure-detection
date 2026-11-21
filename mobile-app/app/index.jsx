// File: index.jsx
// Purpose: TEMPORARY start route for Phase 2: opens the Login screen (A1).
// Replaced in Phase 3 by the route guard / role-based redirect in the root layout.

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/login" />;
}
