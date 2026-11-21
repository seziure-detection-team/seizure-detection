// File: RoleCard.jsx
// Purpose: Selectable card for the account role on Create Account (A2, UC-01 step 2).
// Behaves as a radio button for screen readers.

import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, sizes } from '../theme';
import styles from './RoleCard.styles';

export default function RoleCard({ label, icon, selected, onPress }) {
  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
    >
      <View style={styles.topRow}>
        <View style={styles.iconTile}>
          <Feather name={icon} size={sizes.iconMd} color={colors.primary} />
        </View>
        <View style={[styles.check, selected && styles.checkSelected]}>
          {selected ? <Feather name="check" size={sizes.iconXs} color={colors.surface} /> : null}
        </View>
      </View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}
