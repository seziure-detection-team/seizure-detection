// File: register.jsx
// Purpose: Create Account screen (A2, UC-01). Phase 2: UI and navigation only.
// Validation, sign-up and navigation to A3 are wired in Phase 3.

import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '../../src/components/Button';
import PasswordField from '../../src/components/PasswordField';
import RoleCard from '../../src/components/RoleCard';
import Screen from '../../src/components/Screen';
import ScreenHeader from '../../src/components/ScreenHeader';
import TextField from '../../src/components/TextField';
import ar from '../../src/i18n/ar';
import styles from '../../src/styles/register.styles';

// Role values match profile.role in the database ('patient' | 'caregiver')
const ROLE_PATIENT = 'patient';
const ROLE_CAREGIVER = 'caregiver';

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(null);

  return (
    <Screen>
      <ScreenHeader onBack={() => router.back()} />
      <Text style={styles.title} accessibilityRole="header">
        {ar.register.title}
      </Text>

      <TextField
        label={ar.register.nameLabel}
        value={fullName}
        onChangeText={setFullName}
        placeholder={ar.register.namePlaceholder}
        autoComplete="name"
        textContentType="name"
      />
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
        hint={ar.common.passwordHint}
        autoComplete="new-password"
        textContentType="newPassword"
      />

      <Text style={styles.roleLabel}>{ar.register.roleLabel}</Text>
      <View style={styles.roleRow} accessibilityRole="radiogroup">
        <RoleCard
          label={ar.register.rolePatient}
          icon="user"
          selected={role === ROLE_PATIENT}
          onPress={() => setRole(ROLE_PATIENT)}
        />
        <RoleCard
          label={ar.register.roleCaregiver}
          icon="users"
          selected={role === ROLE_CAREGIVER}
          onPress={() => setRole(ROLE_CAREGIVER)}
        />
      </View>

      {/* Phase 3: onPress → validate and sign up (UC-01), then go to A3 */}
      <Button title={ar.register.submit} />
    </Screen>
  );
}
