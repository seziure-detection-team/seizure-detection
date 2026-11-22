// File: verify-email.jsx
// Purpose: Verify Email screen (A3), shown after a sign-up request (UC-01 step 6).
// The same screen is shown whether or not the email was already registered (UC-01 4a).

import { View } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '../../src/components/Button';
import EmptyState from '../../src/components/EmptyState';
import Screen from '../../src/components/Screen';
import ar from '../../src/i18n/ar';
import styles from '../../src/styles/verifyEmail.styles';

export default function VerifyEmailScreen() {
  const router = useRouter();

  return (
    <Screen
      centered
      footer={<Button title={ar.verifyEmail.goToLogin} onPress={() => router.replace('/login')} />}
    >
      <View style={styles.message}>
        <EmptyState icon="mail" title={ar.verifyEmail.title} body={ar.verifyEmail.body} />
      </View>
    </Screen>
  );
}
