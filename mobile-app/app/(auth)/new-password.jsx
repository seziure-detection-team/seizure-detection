// File: new-password.jsx
// Purpose: New Password screen (A6, UC-03 steps 5–6), opened from the reset email link.
// Two states:
//   - "form":    new password + confirmation (as in the design)
//   - "expired": invalid, expired or used link → ask for a new link (UC-03 5a; approved
//                Phase 2 decision 4, no design)
// Phase 2: UI only. In Phase 3 the state is set from the deep-link recovery flow, and the
// submit action (validation, password update, sign-out, return to A1) is wired.

import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import Button from '../../src/components/Button';
import EmptyState from '../../src/components/EmptyState';
import PasswordField from '../../src/components/PasswordField';
import Screen from '../../src/components/Screen';
import ar from '../../src/i18n/ar';
import styles from '../../src/styles/newPassword.styles';
import { colors, sizes } from '../../src/theme';

export default function NewPasswordScreen() {
  const router = useRouter();
  // Phase 3 sets this to 'expired' when the recovery link cannot be used
  const [linkState] = useState('form');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');

  if (linkState === 'expired') {
    return (
      <Screen
        centered
        footer={
          <Button
            title={ar.newPassword.requestNewLink}
            onPress={() => router.replace('/forgot-password')}
          />
        }
      >
        <View style={styles.message}>
          <EmptyState
            icon="alert-triangle"
            tone="error"
            title={ar.newPassword.expiredTitle}
            body={ar.newPassword.expiredBody}
          />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={styles.lockTile}>
        <Feather name="lock" size={sizes.iconMd} color={colors.primary} />
      </View>
      <Text style={styles.title} accessibilityRole="header">
        {ar.newPassword.title}
      </Text>
      <Text style={styles.subtitle}>{ar.newPassword.subtitle}</Text>

      <PasswordField
        label={ar.newPassword.newLabel}
        value={password}
        onChangeText={setPassword}
        placeholder={ar.common.passwordPlaceholder}
        hint={ar.common.passwordHint}
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <PasswordField
        label={ar.newPassword.confirmLabel}
        value={confirmation}
        onChangeText={setConfirmation}
        placeholder={ar.common.passwordPlaceholder}
        autoComplete="new-password"
        textContentType="newPassword"
      />

      {/* Phase 3: onPress → validate, update the password, sign out, return to A1 (UC-03) */}
      <Button title={ar.newPassword.submit} style={styles.submit} />
    </Screen>
  );
}
