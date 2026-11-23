// File: Button.jsx
// Purpose: Primary action button (Yaqz v2): ink pill with shadow. Pressed: scale 0.98 and
// inkPressed (150 ms). While `loading` is true it shows a spinner and is disabled, so an
// action cannot be submitted twice. Optional `icon` (Feather name) before the label
// (B1 "ربط السوار", B4 "إعادة الاتصال").

import { useState } from 'react';
import { ActivityIndicator, Animated, Pressable, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import useReduceMotion from '../hooks/useReduceMotion';
import ar from '../i18n/ar';
import { colors, durations, motion, sizes } from '../theme';
import styles from './Button.styles';

export default function Button({ title, onPress, loading = false, disabled = false, icon, style }) {
  const isDisabled = disabled || loading;
  const reduceMotion = useReduceMotion();
  const [scale] = useState(() => new Animated.Value(1));

  const animateTo = (toValue) => {
    if (reduceMotion) return;
    Animated.timing(scale, { toValue, duration: durations.press, useNativeDriver: true }).start();
  };

  return (
    <Animated.View
      style={[styles.wrapper, isDisabled && styles.disabled, { transform: [{ scale }] }, style]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        disabled={isDisabled}
        onPress={onPress}
        onPressIn={() => animateTo(motion.pressScale)}
        onPressOut={() => animateTo(1)}
        style={({ pressed }) => [styles.button, pressed && !isDisabled && styles.pressed]}
      >
        {loading ? (
          <ActivityIndicator
            size={sizes.iconMd}
            color={colors.surface}
            accessibilityLabel={ar.common.loading}
          />
        ) : icon ? (
          <View style={styles.row}>
            <Feather name={icon} size={sizes.iconMd} color={colors.surface} />
            <Text style={styles.labelWithIcon}>{title}</Text>
          </View>
        ) : (
          <Text style={styles.label}>{title}</Text>
        )}
      </Pressable>
    </Animated.View>
  );
}
