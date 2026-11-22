// File: account-error.jsx
// Purpose: Shown to a signed-in user whose profile is missing, cannot be read (e.g. network
// error) or has an unsupported role (UC-02). Protected screens stay blocked; the user can
// retry reading the profile or log out.

import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import Button from '../src/components/Button';
import EmptyState from '../src/components/EmptyState';
import Screen from '../src/components/Screen';
import { useAuth } from '../src/context/AuthContext';
import ar from '../src/i18n/ar';
import styles from '../src/styles/accountError.styles';

export default function AccountErrorScreen() {
  const { retryProfile, logout } = useAuth();
  const [busy, setBusy] = useState(false);

  const run = (action) => async () => {
    setBusy(true);
    await action();
    setBusy(false);
  };

  return (
    <Screen
      centered
      footer={
        <>
          <Button title={ar.common.retry} onPress={run(retryProfile)} loading={busy} />
          <Pressable
            style={styles.logoutLink}
            onPress={run(logout)}
            accessibilityRole="button"
            disabled={busy}
          >
            <Text style={styles.logoutText}>{ar.common.logout}</Text>
          </Pressable>
        </>
      }
    >
      <View style={styles.message}>
        <EmptyState
          icon="alert-circle"
          tone="error"
          title={ar.accountError.title}
          body={ar.accountError.body}
        />
      </View>
    </Screen>
  );
}
