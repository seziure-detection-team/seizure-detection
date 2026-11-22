// File: register.jsx
// Purpose: Create Account screen (A2, UC-01). Validates all fields (3a), signs up with the
// selected role, and opens A3 on success — also when the email is already registered
// (4a: same neutral result). On network/server errors the entered data is kept (5a).

import { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import Banner from '../../src/components/Banner';
import Button from '../../src/components/Button';
import PasswordField from '../../src/components/PasswordField';
import RoleCard from '../../src/components/RoleCard';
import Screen from '../../src/components/Screen';
import ScreenHeader from '../../src/components/ScreenHeader';
import TextField from '../../src/components/TextField';
import ar from '../../src/i18n/ar';
import { signUp } from '../../src/lib/auth';
import { hasErrors, validateRegister } from '../../src/lib/validation';
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
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorKind, setErrorKind] = useState(null);

  const clearError = (field) => setErrors((current) => ({ ...current, [field]: undefined }));
  const updateField = (setter, field) => (value) => {
    setter(value);
    clearError(field);
  };
  const selectRole = (value) => {
    setRole(value);
    clearError('role');
  };

  const handleSubmit = async () => {
    const fieldErrors = validateRegister({ fullName, email, password, role });
    setErrors(fieldErrors);
    setErrorKind(null);
    if (hasErrors(fieldErrors)) return;

    setLoading(true);
    const result = await signUp({ fullName, email, password, role });
    setLoading(false);
    if (result.ok) router.replace('/verify-email');
    else setErrorKind(result.kind);
  };

  return (
    <Screen>
      <ScreenHeader onBack={() => router.back()} />
      <Text style={styles.title} accessibilityRole="header">
        {ar.register.title}
      </Text>

      {errorKind ? <Banner variant="error" message={ar.messages[errorKind]} /> : null}

      <TextField
        label={ar.register.nameLabel}
        value={fullName}
        onChangeText={updateField(setFullName, 'fullName')}
        placeholder={ar.register.namePlaceholder}
        error={errors.fullName && ar.errors[errors.fullName]}
        editable={!loading}
        autoComplete="name"
        textContentType="name"
      />
      <TextField
        label={ar.common.emailLabel}
        value={email}
        onChangeText={updateField(setEmail, 'email')}
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
      <PasswordField
        label={ar.common.passwordLabel}
        value={password}
        onChangeText={updateField(setPassword, 'password')}
        placeholder={ar.common.passwordPlaceholder}
        hint={ar.common.passwordHint}
        error={errors.password && ar.errors[errors.password]}
        editable={!loading}
        autoComplete="new-password"
        textContentType="newPassword"
      />

      <Text style={styles.roleLabel}>{ar.register.roleLabel}</Text>
      <View style={styles.roleRow} accessibilityRole="radiogroup">
        <RoleCard
          label={ar.register.rolePatient}
          icon="user"
          selected={role === ROLE_PATIENT}
          onPress={() => selectRole(ROLE_PATIENT)}
        />
        <RoleCard
          label={ar.register.roleCaregiver}
          icon="users"
          selected={role === ROLE_CAREGIVER}
          onPress={() => selectRole(ROLE_CAREGIVER)}
        />
      </View>
      {errors.role ? (
        <Text style={styles.roleError} accessibilityLiveRegion="polite">
          {ar.errors[errors.role]}
        </Text>
      ) : null}

      <Button title={ar.register.submit} onPress={handleSubmit} loading={loading} />
    </Screen>
  );
}
