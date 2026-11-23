// File: SegmentedTabs.jsx
// Purpose: Segmented tabs (Yaqz v2, B5/B6 "السجل / الأنماط"): height 44 on the track colour;
// the active tab is a surface pill with a small shadow. The pill cross-fades in 200 ms
// (opacity only); no motion with reduce motion. Exposed as a tab list to screen readers.
// items: [{ key, label }]; the first item is at the start (right in RTL).

import { useEffect, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import useReduceMotion from '../hooks/useReduceMotion';
import { durations } from '../theme';
import styles from './SegmentedTabs.styles';

function Tab({ label, active, onPress, reduceMotion }) {
  const [selection] = useState(() => new Animated.Value(active ? 1 : 0));

  useEffect(() => {
    const toValue = active ? 1 : 0;
    if (reduceMotion) {
      selection.setValue(toValue);
      return undefined;
    }
    const animation = Animated.timing(selection, {
      toValue,
      duration: durations.select,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [active, reduceMotion, selection]);

  return (
    <Pressable
      style={styles.tab}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      <Animated.View pointerEvents="none" style={[styles.activePill, { opacity: selection }]} />
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}

export default function SegmentedTabs({ items, activeKey, onSelect, style }) {
  const reduceMotion = useReduceMotion();

  return (
    <View style={[styles.track, style]} accessibilityRole="tablist">
      {items.map((item) => (
        <Tab
          key={item.key}
          label={item.label}
          active={item.key === activeKey}
          onPress={() => onSelect?.(item.key)}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}
