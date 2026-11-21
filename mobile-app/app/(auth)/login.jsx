// File: login.jsx
// Purpose: Login screen (A1, UC-02). Phase 2: UI and navigation only.
// The submit action (sign-in, role routing, error banners) is wired in Phase 3.

import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import Button from '../../src/components/Button';
import PasswordField from '../../src/components/PasswordField';
import Screen from '../../src/components/Screen';
import TextField from '../../src/components/TextField';
import ar from '../../src/i18n/ar';
import styles from '../../src/styles/login.styles';
import { colors, sizes } from '../../src/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const footer = (
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>{ar.login.noAccount}</Text>
      <Pressable onPress={() => router.push('/register')} accessibilityRole="link">
        <Text style={styles.linkText}>{ar.login.createAccount}</Text>
      </Pressable>
    </View>
  );

  return (
    <Screen footer={footer}>
      <View style={styles.logoTile}>
        <Feather name="activity" size={sizes.iconLg} color={colors.surface} />
      </View>
      <Text style={styles.title} accessibilityRole="header">
        {ar.login.title}
      </Text>
      <Text style={styles.subtitle}>{ar.login.subtitle}</Text>

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
      <PasswordField
        label={ar.common.passwordLabel}
        value={password}
        onChangeText={setPassword}
        placeholder={ar.common.passwordPlaceholder}
        autoComplete="current-password"
        textContentType="password"
      />

      <Pressable
        style={styles.forgotLink}
        onPress={() => router.push('/forgot-password')}
        accessibilityRole="link"
      >
        <Text style={styles.linkText}>{ar.login.forgotPassword}</Text>
      </Pressable>

      {/* Phase 3: onPress → validate and sign in (UC-02) */}
      <Button title={ar.login.submit} />
    </Screen>
  );
}
