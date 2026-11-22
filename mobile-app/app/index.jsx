// File: index.jsx
// Purpose: Start route. Redirects to the screen of the current auth state (role-based
// routing, UC-02 step 5). After leaving password recovery it can open a specific auth
// screen once (e.g. A4 from the expired-link state). While the initial state is still
// loading after the splash timeout, a loading indicator is shown.

import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';

import Screen from '../src/components/Screen';
import { useAuth } from '../src/context/AuthContext';
import ar from '../src/i18n/ar';
import { ROUTE_PATHS, ROUTES } from '../src/lib/routing';
import { colors } from '../src/theme';

export default function Index() {
  const { target, peekNextAuthPath, clearNextAuthPath } = useAuth();
  const nextAuthPath = target === ROUTES.auth ? peekNextAuthPath() : null;

  // The one-time path is used by the redirect below, then cleared (without re-rendering)
  useEffect(() => {
    if (nextAuthPath) clearNextAuthPath();
  }, [nextAuthPath, clearNextAuthPath]);

  if (target === ROUTES.loading) {
    return (
      <Screen centered>
        <ActivityIndicator color={colors.primary} accessibilityLabel={ar.common.loading} />
      </Screen>
    );
  }

  return <Redirect href={nextAuthPath ?? ROUTE_PATHS[target]} />;
}
