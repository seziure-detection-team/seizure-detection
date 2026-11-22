// File: new-password.jsx
// Purpose: New Password screen (A6, UC-03 steps 5–6), reachable only during password
// recovery (route guard). Shows one of four states from the AuthContext:
//   - verifying: the link's one-time code is being exchanged for a recovery session
//   - ready:     new password + confirmation form (same strength rule as A2)
//   - network:   connection problem while checking the link → message + retry
//   - invalid:   expired, invalid or used link (5a) → ask for a new link (button to A4)
// On success the AuthContext signs out and A1 shows the success message (step 6).

import { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import Banner from '../../src/components/Banner';
import Button from '../../src/components/Button';
import EmptyState from '../../src/components/EmptyState';
import PasswordField from '../../src/components/PasswordField';
import Screen from '../../src/components/Screen';
import { useAuth } from '../../src/context/AuthContext';
import ar from '../../src/i18n/ar';
import { hasErrors, validateNewPassword } from '../../src/lib/validation';
import styles from '../../src/styles/newPassword.styles';
import { colors, sizes } from '../../src/theme';

export default function NewPasswordScreen() {
  const { recovery, completeRecovery, exitRecovery, retryRecovery } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorKind, setErrorKind] = useState(null);
  const [requestingNewLink, setRequestingNewLink] = useState(false);

  // Leaves recovery; the start route then opens A4 (this screen is removed by the guard)
  const requestNewLink = async () => {
    setRequestingNewLink(true);
    await exitRecovery('/forgot-password');
  };

  const updateField = (setter, field) => (value) => {
    setter(value);
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const fieldErrors = validateNewPassword({ password, confirmation });
    setErrors(fieldErrors);
    setErrorKind(null);
    if (hasErrors(fieldErrors)) return;

    setLoading(true);
    const result = await completeRecovery(password);
    setLoading(false);
    if (result.ok || result.kind === 'expired') return; // guard / invalid state take over
    if (result.kind === 'weakPassword') setErrors({ password: 'weakPassword' });
    else setErrorKind(result.kind);
  };

  const state = recovery?.state ?? 'verifying';

  if (state === 'verifying') {
    return (
      <Screen centered>
        <ActivityIndicator color={colors.primary} accessibilityLabel={ar.common.loading} />
      </Screen>
    );
  }

  if (state === 'invalid') {
    return (
      <Screen
        centered
        footer={
          <Button
            title={ar.newPassword.requestNewLink}
            onPress={requestNewLink}
            loading={requestingNewLink}
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

  if (state === 'network') {
    return (
      <Screen centered footer={<Button title={ar.common.retry} onPress={retryRecovery} />}>
        <Banner variant="error" message={ar.messages.network} />
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

      {errorKind ? <Banner variant="error" message={ar.messages[errorKind]} /> : null}

      <PasswordField
        label={ar.newPassword.newLabel}
        value={password}
        onChangeText={updateField(setPassword, 'password')}
        placeholder={ar.common.passwordPlaceholder}
        hint={ar.common.passwordHint}
        error={errors.password && ar.errors[errors.password]}
        editable={!loading}
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <PasswordField
        label={ar.newPassword.confirmLabel}
        value={confirmation}
        onChangeText={updateField(setConfirmation, 'confirmation')}
        placeholder={ar.common.passwordPlaceholder}
        error={errors.confirmation && ar.errors[errors.confirmation]}
        editable={!loading}
        autoComplete="new-password"
        textContentType="newPassword"
      />

      <Button
        title={ar.newPassword.submit}
        onPress={handleSubmit}
        loading={loading}
        style={styles.submit}
      />
    </Screen>
  );
}
