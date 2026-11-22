// File: forgot-password.jsx
// Purpose: Forgot Password screen (A4, UC-03 steps 1–4). Validates the email and requests a
// reset link (PKCE, redirect rasd://new-password). Any accepted request opens A5 with the
// same neutral text, registered or not (3a). Network, server and rate-limit errors show a
// message and keep the email for a retry.

import { useState } from 'react';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';

import Banner from '../../src/components/Banner';
import Button from '../../src/components/Button';
import Screen from '../../src/components/Screen';
import ScreenHeader from '../../src/components/ScreenHeader';
import TextField from '../../src/components/TextField';
import ar from '../../src/i18n/ar';
import { requestReset } from '../../src/lib/auth';
import { hasErrors, validateResetRequest } from '../../src/lib/validation';
import styles from '../../src/styles/forgotPassword.styles';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorKind, setErrorKind] = useState(null);

  const handleSubmit = async () => {
    const fieldErrors = validateResetRequest({ email });
    setErrors(fieldErrors);
    setErrorKind(null);
    if (hasErrors(fieldErrors)) return;

    setLoading(true);
    const result = await requestReset({ email });
    setLoading(false);
    if (result.ok) router.replace('/reset-sent');
    else setErrorKind(result.kind);
  };

  return (
    <Screen>
      <ScreenHeader onBack={() => router.back()} />
      <Text style={styles.title} accessibilityRole="header">
        {ar.forgotPassword.title}
      </Text>
      <Text style={styles.subtitle}>{ar.forgotPassword.subtitle}</Text>

      {errorKind ? <Banner variant="error" message={ar.messages[errorKind]} /> : null}

      <TextField
        label={ar.common.emailLabel}
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setErrors({});
        }}
        placeholder={ar.common.emailPlaceholder}
        error={errors.email && ar.errors[errors.email]}
        editable={!loading}
        latin
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />

      <Button
        title={ar.forgotPassword.submit}
        onPress={handleSubmit}
        loading={loading}
        style={styles.submit}
      />
    </Screen>
  );
}
