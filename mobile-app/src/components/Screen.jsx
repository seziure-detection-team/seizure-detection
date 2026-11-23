// File: Screen.jsx
// Purpose: Shared screen wrapper (approved Phase 2 decision 2): safe area, beige background
// with the Yaqz background glow (PNG, Sprint 1 decision), scrolling for long forms (A2),
// keyboard avoidance, an optional footer pinned to the bottom of the screen (A1 sign-up link,
// A3/A5 buttons), and the screen-enter motion (280 ms fade + slide up; none with reduce motion).

import { useEffect, useState } from 'react';
import { Animated, Easing, Image, KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useReduceMotion from '../hooks/useReduceMotion';
import { durations, motion } from '../theme';
import styles from './Screen.styles';

const glow = require('../../assets/images/background-glow.png');

// centered: vertically centers the body (message screens such as A3 and A5)
export default function Screen({ children, footer, centered = false }) {
  const reduceMotion = useReduceMotion();
  const [enter] = useState(() => new Animated.Value(reduceMotion ? 1 : 0));

  useEffect(() => {
    if (reduceMotion) {
      enter.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(enter, {
      toValue: 1,
      duration: durations.screenEnter,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [enter, reduceMotion]);

  const enterStyle = {
    opacity: enter,
    transform: [
      {
        translateY: enter.interpolate({ inputRange: [0, 1], outputRange: [motion.enterOffset, 0] }),
      },
    ],
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Decorative glow behind everything (also behind the status bar); not touchable */}
      <View
        style={styles.glowLayer}
        pointerEvents="none"
        importantForAccessibility="no-hide-descendants"
      >
        <Image source={glow} style={styles.glow} resizeMode="stretch" />
      </View>
      {/* "padding" keeps focused inputs above the keyboard with Android edge-to-edge */}
      <KeyboardAvoidingView style={styles.keyboard} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[centered ? styles.bodyCentered : styles.body, enterStyle]}>
            {children}
          </Animated.View>
          {footer ? (
            <Animated.View style={[styles.footer, enterStyle]}>{footer}</Animated.View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
