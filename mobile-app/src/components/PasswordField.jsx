// File: PasswordField.jsx
// Purpose: Password input based on TextField, with an eye icon that shows or hides the
// password (A1, A2, A6). The value is never logged.

import { useState } from 'react';
import { Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import ar from '../i18n/ar';
import { colors, sizes, spacing } from '../theme';
import TextField from './TextField';
import styles from './PasswordField.styles';

export default function PasswordField(props) {
  const [visible, setVisible] = useState(false);

  const toggle = (
    <Pressable
      style={styles.toggle}
      onPress={() => setVisible((current) => !current)}
      accessibilityRole="button"
      accessibilityLabel={visible ? ar.common.hidePassword : ar.common.showPassword}
      hitSlop={spacing.sm}
    >
      <Feather name={visible ? 'eye-off' : 'eye'} size={sizes.iconMd} color={colors.muted} />
    </Pressable>
  );

  return (
    <TextField
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      latin
      accessory={toggle}
      {...props}
    />
  );
}
