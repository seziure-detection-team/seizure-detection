// File: login.jsx
// Purpose: Login screen (A1, UC-02). Validates the input, signs in through the AuthContext
// (which routes by role), and shows a generic error for wrong credentials (UC-02 3a), the
// verify-email message, the physician message (3b) or a network/server error. Entered data
// is kept on errors. Also shows one-time notices (e.g. "password updated", UC-03 step 6).

import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import Banner from '../../src/components/Banner';
import Button from '../../src/components/Button';
import Logo from '../../src/components/Logo';
import PasswordField from '../../src/components/PasswordField';
import Screen from '../../src/components/Screen';
import TextField from '../../src/components/TextField';
import TwoToneTitle from '../../src/components/TwoToneTitle';
import { useAuth } from '../../src/context/AuthContext';
import ar from '../../src/i18n/ar';
import { hasErrors, validateLogin } from '../../src/lib/validation';
import styles from '../../src/styles/login.styles';

export default function LoginScreen() {
  const router = useRouter();
  const { login, peekNotice, clearNotice } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  // { variant, kind } — the notice left by a previous flow is shown once
  const [banner, setBanner] = useState(() => peekNotice());

  useEffect(() => {
    clearNotice();
  }, [clearNotice]);

  const updateField = (setter, field) => (value) => {
    setter(value);
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async () => {
    const fieldErrors = validateLogin({ email, password });
    setErrors(fieldErrors);
    setBanner(null);
    if (hasErrors(fieldErrors)) return;

    setLoading(true);
    const result = await login({ email, password });
    setLoading(false);
    // On success the route guard opens the home screen of the user's role
    if (!result.ok) setBanner({ variant: 'error', kind: result.kind });
  };

  // Bottom of the screen (A1 design): the main button, then the sign-up link
  const footer = (
    <>
      <Button title={ar.login.submit} onPress={handleSubmit} loading={loading} />
      <View style={styles.footerRow}>
        <Text style={styles.footerText}>{ar.login.noAccount}</Text>
        <Pressable
          onPress={() => router.push('/register')}
          accessibilityRole="link"
          disabled={loading}
        >
          <Text style={styles.footerLink}>{ar.login.createAccount}</Text>
        </Pressable>
      </View>
    </>
  );

  return (
    <Screen footer={footer}>
      <View style={styles.logo}>
        <Logo />
      </View>
      <TwoToneTitle text={ar.login.title} />
      <Text style={styles.subtitle}>{ar.login.subtitle}</Text>

      {banner ? <Banner variant={banner.variant} message={ar.messages[banner.kind]} /> : null}

      <TextField
        label={ar.common.emailLabel}
        value={email}
        onChangeText={updateField(setEmail, 'email')}
        placeholder={ar.common.emailPlaceholder}
        error={errors.email && ar.errors[errors.email]}
        editable={!loading}
        latin
        icon="mail"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
      />
      <PasswordField
        label={ar.common.passwordLabel}
        value={password}
        onChangeText={updateField(setPassword, 'password')}
        placeholder={ar.common.passwordPlaceholder}
        error={errors.password && ar.errors[errors.password]}
        editable={!loading}
        autoComplete="current-password"
        textContentType="password"
      />

      <Pressable
        style={styles.forgotLink}
        onPress={() => router.push('/forgot-password')}
        accessibilityRole="link"
        disabled={loading}
      >
        <Text style={styles.linkText}>{ar.login.forgotPassword}</Text>
      </Pressable>
    </Screen>
  );
}
