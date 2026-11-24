// File: ChoiceChip.jsx
// Purpose: Selectable pill chip (Yaqz v2), behaves as a radio button for screen readers.
// Used for the account role on Create Account (A2, UC-01 step 2) and, in Phase D, for the
// event label on B7 (UC-10). Shows a Feather `icon`, or an `image` (PNG) tinted in the
// label colour, e.g. the wristband logo for "مريض".
// Selection (200 ms): the selected look (primarySoft fill + 2 px primary border) fades in
// as an overlay, so only opacity is animated.

import { useEffect, useState } from 'react';
import { Animated, Image, Pressable, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';

import useReduceMotion from '../hooks/useReduceMotion';
import { colors, durations, sizes } from '../theme';
import styles from './ChoiceChip.styles';

export default function ChoiceChip({ label, icon, image, selected, onPress }) {
  const reduceMotion = useReduceMotion();
  const [selection] = useState(() => new Animated.Value(selected ? 1 : 0));

  useEffect(() => {
    const toValue = selected ? 1 : 0;
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
  }, [selected, reduceMotion, selection]);

  const color = selected ? colors.primary : colors.text;

  return (
    <Pressable
      style={styles.chip}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={label}
      accessibilityState={{ checked: selected }}
    >
      <Animated.View pointerEvents="none" style={[styles.selectedLayer, { opacity: selection }]} />
      {image ? (
        <Image source={image} style={[styles.image, { tintColor: color }]} />
      ) : icon ? (
        <Feather name={icon} size={sizes.iconMd} color={color} />
      ) : null}
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}
