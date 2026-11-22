// File: TextField.jsx
// Purpose: Labelled text input used by all forms. Shows a hint, or an inline error message
// with a red border when `error` is set (UC-01 3a: invalid fields are highlighted).
// `latin` switches to the Latin font and left-to-right typing (e.g. the email field).
// `accessory` renders an element at the end of the field (left side in RTL), e.g. the eye icon.

import { Text, TextInput, View } from 'react-native';

import { colors } from '../theme';
import styles from './TextField.styles';

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  error,
  latin = false,
  accessory,
  ...inputProps
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputRowError]}>
        <TextInput
          style={[styles.input, latin && styles.inputLatin]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          accessibilityLabel={label}
          accessibilityHint={error || hint}
          {...inputProps}
        />
        {accessory}
      </View>
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}
