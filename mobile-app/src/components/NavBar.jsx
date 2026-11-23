// File: NavBar.jsx
// Purpose: Floating bottom navigation of the patient screens (Yaqz v2: Home / History).
// surface at 78% opacity, no blur (Sprint 1 decision). The active item has a primarySoft
// pill. Exposed to screen readers as a tab list. Vertical placement is set by the screen.
// items: [{ key, label, icon (Feather name) }]

import { Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, sizes } from '../theme';
import styles from './NavBar.styles';

export default function NavBar({ items, activeKey, onSelect, style }) {
  return (
    <View style={[styles.bar, style]} accessibilityRole="tablist">
      {items.map((item) => {
        const active = item.key === activeKey;
        const color = active ? colors.primary : colors.muted;
        return (
          <Pressable
            key={item.key}
            style={[styles.item, active && styles.itemActive]}
            onPress={() => onSelect?.(item.key)}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected: active }}
          >
            <Feather name={item.icon} size={sizes.iconMd} color={color} />
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
