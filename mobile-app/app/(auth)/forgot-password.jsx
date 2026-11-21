// File: forgot-password.jsx
// Purpose: Forgot Password screen (A4, UC-03 steps 1–3). Phase 2: UI and navigation only.
// Validation and the reset request (then A5) are wired in Phase 3.

import { useState } from 'react';
import { Text } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '../../src/components/Button';
import Screen from '../../src/components/Screen';
import ScreenHeader from '../../src/components/ScreenHeader';
import TextField from '../../src/components/TextField';
import ar from '../../src/i18n/ar';
import styles from '../../src/styles/forgotPassword.styles';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  return (
    <Screen>
      <ScreenHeader onBack={() => router.back()} />
      <Text style={styles.title} accessibilityRole="header">
        {ar.forgotPassword.title}
      </Text>
      <Text style={styles.subtitle}>{ar.forgotPassword.subtitle}</Text>

      <TextField
        label={ar.common.emailLabel}
        value={email}
        onChangeText={setEmail}
        placeholder={ar.common.emailPlaceholder}
        latin
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />

      {/* Phase 3: onPress → validate and request the reset link (UC-03), then go to A5 */}
      <Button title={ar.forgotPassword.submit} style={styles.submit} />
    </Screen>
  );
}
