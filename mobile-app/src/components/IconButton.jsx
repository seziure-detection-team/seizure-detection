// File: IconButton.jsx
// Purpose: Round 44 icon button (Yaqz v2): surface, small shadow, pressed scale 0.94 (150 ms).
// Used for the back button (ScreenHeader) and the logout button (LogoutButton).
// `mirrored` flips the icon horizontally (icons do not flip automatically in RTL).

import { useState } from 'react';
import { ActivityIndicator, Animated, Pressable } from 'react-native';
import { Feather } from '@expo/vector-icons';

import useReduceMotion from '../hooks/useReduceMotion';
import ar from '../i18n/ar';
import { colors, durations, motion, sizes } from '../theme';
import styles from './IconButton.styles';

export default function IconButton({
  icon,
  onPress,
  accessibilityLabel,
  loading = false,
  disabled = false,
  mirrored = false,
}) {
  const isDisabled = disabled || loading;
  const reduceMotion = useReduceMotion();
  const [scale] = useState(() => new Animated.Value(1));

  const animateTo = (toValue) => {
    if (reduceMotion) return;
    Animated.timing(scale, { toValue, duration: durations.press, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, { transform: [{ scale }] }]}>
      <Pressable
        style={styles.button}
        onPress={onPress}
        onPressIn={() => animateTo(motion.pressScaleRound)}
        onPressOut={() => animateTo(1)}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
      >
        {loading ? (
          <ActivityIndicator color={colors.text} accessibilityLabel={ar.common.loading} />
        ) : (
          <Feather
            name={icon}
            size={sizes.iconMd}
            color={colors.text}
            style={mirrored ? styles.mirrored : null}
          />
        )}
      </Pressable>
    </Animated.View>
  );
}
