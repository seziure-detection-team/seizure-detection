// File: Banner.jsx
// Purpose: Form-level message (approved Phase 2 decision 3; no design). Variants:
//   - "error":   network/server failure, wrong credentials, unverified email, physician
//                sign-out, rate limit (errorBg background, error text)
//   - "success": confirmation such as "password updated" (sage background, primary text)
// Field-level errors stay inline under each field (TextField `error`).

import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, sizes } from '../theme';
import styles from './Banner.styles';

export default function Banner({ message, variant = 'error' }) {
  const isError = variant === 'error';

  return (
    <View
      style={[styles.banner, isError ? styles.error : styles.success]}
      accessible
      accessibilityRole="alert"
      accessibilityLabel={message}
      accessibilityLiveRegion="polite"
    >
      <Feather
        name={isError ? 'alert-circle' : 'check-circle'}
        size={sizes.iconMd}
        color={isError ? colors.error : colors.primary}
        style={styles.icon}
      />
      <Text style={[styles.message, isError ? styles.messageError : styles.messageSuccess]}>
        {message}
      </Text>
    </View>
  );
}
