// File: WristbandHero.jsx
// Purpose: Centre illustration of the patient home (B1/B2/B4): the wristband PNG in a white
// circle with rings that show the connection state (FR-05).
//   - "disconnected" (B1): grey dashed wristband, two thin static rings
//   - "connected"    (B2): gradient wristband, two soft rings growing outwards
//                          ("monitoring active": 2800 ms, 1400 ms apart; static with reduce motion)
//   - "lost"         (B4): dashed wristband with an amber dot, one warm static ring
// Decorative only: the state is announced by the wristband card's badge, so this view is
// hidden from screen readers.

import { useEffect, useState } from 'react';
import { Animated, Easing, Image, View } from 'react-native';

import useReduceMotion from '../hooks/useReduceMotion';
import { durations, motion } from '../theme';
import styles from './WristbandHero.styles';

const IMAGES = {
  disconnected: require('../../assets/images/wristband-disconnected.png'),
  connected: require('../../assets/images/wristband-connected.png'),
  lost: require('../../assets/images/wristband-lost.png'),
};

// One growing, fading ring; `delay` offsets the second ring
function PulseRing({ delay, reduceMotion }) {
  const [progress] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (reduceMotion) {
      progress.setValue(0);
      return undefined;
    }
    const loop = Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: durations.rings,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    );
    const timer = setTimeout(() => loop.start(), delay);
    return () => {
      clearTimeout(timer);
      loop.stop();
    };
  }, [progress, delay, reduceMotion]);

  // With reduce motion: one still ring at the middle of the animation
  const animatedStyle = reduceMotion
    ? styles.pulseStill
    : {
        opacity: progress.interpolate({
          inputRange: [0, 1],
          outputRange: [motion.ringOpacityFrom, 0],
        }),
        transform: [
          {
            scale: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [motion.ringScaleFrom, motion.ringScaleTo],
            }),
          },
        ],
      };

  return <Animated.View style={[styles.pulseRing, animatedStyle]} />;
}

export default function WristbandHero({ state = 'disconnected' }) {
  const reduceMotion = useReduceMotion();

  return (
    <View
      style={styles.container}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {state === 'disconnected' ? (
        <>
          <View style={[styles.ring, styles.ringOuter]} />
          <View style={[styles.ring, styles.ringInner]} />
        </>
      ) : null}
      {state === 'connected' ? (
        <>
          <PulseRing delay={0} reduceMotion={reduceMotion} />
          {reduceMotion ? null : (
            <PulseRing delay={durations.ringsOffset} reduceMotion={reduceMotion} />
          )}
        </>
      ) : null}
      {state === 'lost' ? <View style={[styles.ring, styles.ringLost]} /> : null}

      <View style={styles.circle}>
        <Image source={IMAGES[state] ?? IMAGES.disconnected} style={styles.image} />
      </View>
    </View>
  );
}
