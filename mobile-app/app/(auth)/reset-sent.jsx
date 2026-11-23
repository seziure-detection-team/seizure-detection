// File: reset-sent.jsx
// Purpose: Reset Link Sent screen (A5). The confirmation is neutral: the same text is shown
// whether or not the email is registered (UC-03 3a).

import { View } from 'react-native';
import { useRouter } from 'expo-router';

import Button from '../../src/components/Button';
import EmptyState from '../../src/components/EmptyState';
import Screen from '../../src/components/Screen';
import ar from '../../src/i18n/ar';
import styles from '../../src/styles/resetSent.styles';

export default function ResetSentScreen() {
  const router = useRouter();

  return (
    <Screen
      centered
      footer={<Button title={ar.resetSent.backToLogin} onPress={() => router.replace('/login')} />}
    >
      <View style={styles.message}>
        <EmptyState
          icon="mail"
          tone="peach"
          title={ar.resetSent.title}
          body={ar.resetSent.body}
          twoTone
        />
      </View>
    </Screen>
  );
}
