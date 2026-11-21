// File: Button.jsx
// Purpose: Primary action button. While `loading` is true it shows a spinner and is
// disabled, so an action cannot be submitted twice (prompt section 7).

import { ActivityIndicator, Pressable, Text } from 'react-native';

import ar from '../i18n/ar';
import { colors } from '../theme';
import styles from './Button.styles';

export default function Button({ title, onPress, loading = false, disabled = false, style }) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.surface} accessibilityLabel={ar.common.loading} />
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}
    </Pressable>
  );
}
