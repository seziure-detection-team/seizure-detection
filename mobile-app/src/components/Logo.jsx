// File: Logo.jsx
// Purpose: App logo (Yaqz v2): the "wrist ring" PNG (Sprint 1 decision: PNG, not SVG) with
// the name "يقظ" in primary, weight 700. The ring pulses gently (scale 1 → 1.05 → 1,
// 3200 ms loop); no motion with reduce motion. Minimum size 24 (DESIGN_SYSTEM.md "Identity").

import { useEffect, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import useReduceMotion from '../hooks/useReduceMotion';
import ar from '../i18n/ar';
import { durations, motion, sizes } from '../theme';
import styles from './Logo.styles';

const logoImage = require('../../assets/images/logo.png');
const MIN_SIZE = 24;

export default function Logo({ size = sizes.logo, showName = true }) {
  const reduceMotion = useReduceMotion();
  const [pulse] = useState(() => new Animated.Value(1));
  const imageSize = Math.max(size, MIN_SIZE);

  useEffect(() => {
    if (reduceMotion) {
      pulse.setValue(1);
      return undefined;
    }
    const half = durations.logoPulse / 2;
    const easing = Easing.inOut(Easing.sin);
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: motion.logoPulseScale,
          duration: half,
          easing,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, { toValue: 1, duration: half, easing, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [pulse, reduceMotion]);

  return (
    <View
      style={styles.row}
      accessible
      accessibilityRole="image"
      accessibilityLabel={ar.common.appName}
    >
      {/* First child = start of the row = right side in RTL, as in A1 / A6 */}
      <Animated.Image
        source={logoImage}
        style={{ width: imageSize, height: imageSize, transform: [{ scale: pulse }] }}
      />
      {showName ? <Text style={styles.name}>{ar.common.appName}</Text> : null}
    </View>
  );
}
