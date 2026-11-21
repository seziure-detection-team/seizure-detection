// File: EmptyState.jsx
// Purpose: Centred message state: round icon, title and body text.
// Used by A3 and A5, the A6 expired-link state (tone "error") and, in Phase 4, C3.

import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, sizes } from '../theme';
import styles from './EmptyState.styles';

export default function EmptyState({ icon, title, body, tone = 'default' }) {
  const isError = tone === 'error';

  return (
    <View style={styles.container}>
      <View style={[styles.circle, isError && styles.circleError]}>
        <Feather name={icon} size={sizes.iconXl} color={isError ? colors.error : colors.primary} />
      </View>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}
