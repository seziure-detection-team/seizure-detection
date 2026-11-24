// File: Banner.jsx
// Purpose: Message box (Yaqz v2 "Alert": radius 20, padding 16, white icon chip). Variants:
//   - "error":   network/server failure, wrong credentials, unverified email, physician
//                sign-out, rate limit (errorBg background, error text)
//   - "warning": connection lost on B4 (warningSoft background, onWarningSoft text). Amber,
//                never red: red is only for errors (DESIGN_SYSTEM.md "Colors").
//   - "success": confirmation such as "password updated" (primarySoft background, primary text)
// Optional `title` above the message (B4) and `icon` (Feather name) to override the default.
// Appears with a fade + slide down (−16 → 0, 320 ms); no motion with reduce motion.
// Field-level errors stay inline under each field (TextField `error`).

import { useEffect, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import useReduceMotion from '../hooks/useReduceMotion';
import { colors, durations, motion, sizes } from '../theme';
import styles from './Banner.styles';

const VARIANTS = {
  error: { icon: 'alert-circle', iconColor: colors.error },
  warning: { icon: 'alert-triangle', iconColor: colors.amber },
  success: { icon: 'check-circle', iconColor: colors.primary },
};

export default function Banner({ message, title, icon, variant = 'error' }) {
  const config = VARIANTS[variant] ?? VARIANTS.error;
  const reduceMotion = useReduceMotion();
  const [appear] = useState(() => new Animated.Value(reduceMotion ? 1 : 0));

  useEffect(() => {
    if (reduceMotion) {
      appear.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(appear, {
      toValue: 1,
      duration: durations.alertIn,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [appear, reduceMotion]);

  const appearStyle = {
    opacity: appear,
    transform: [
      {
        translateY: appear.interpolate({
          inputRange: [0, 1],
          outputRange: [motion.alertOffset, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[styles.banner, styles[variant] ?? styles.error, appearStyle]}
      accessible
      accessibilityRole="alert"
      accessibilityLabel={title ? `${title}. ${message}` : message}
      accessibilityLiveRegion="polite"
    >
      <View style={styles.iconChip}>
        <Feather name={icon ?? config.icon} size={sizes.iconMd} color={config.iconColor} />
      </View>
      <View style={styles.texts}>
        {title ? <Text style={[styles.title, styles[`${variant}Text`]]}>{title}</Text> : null}
        <Text style={[styles.message, styles[`${variant}Text`]]}>{message}</Text>
      </View>
    </Animated.View>
  );
}
