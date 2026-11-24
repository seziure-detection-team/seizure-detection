// File: TextField.jsx
// Purpose: Labelled text input used by all forms (Yaqz v2). Shows a hint, or an inline error
// message with a red border when `error` is set (UC-01 3a: invalid fields are highlighted).
// `icon` (Feather name) shows an icon chip at the start of the field (right side in RTL).
// `latin` switches to the Latin font and left-to-right typing (e.g. the email field).
// `accessory` renders an element at the end of the field (left side in RTL), e.g. the eye icon.
//
// Focus (200 ms): 2 px primary border + 4 px primarySoft halo; the chip turns primary with a
// white icon and rotates −8°. Implemented with overlays whose opacity is animated, so only
// opacity and transform change and the layout never shifts (native driver).

import { useEffect, useState } from 'react';
import { Animated, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import useReduceMotion from '../hooks/useReduceMotion';
import { colors, durations, motion, sizes } from '../theme';
import styles from './TextField.styles';

export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  error,
  latin = false,
  icon,
  accessory,
  onFocus,
  onBlur,
  ...inputProps
}) {
  const [focused, setFocused] = useState(false);
  const reduceMotion = useReduceMotion();
  const [focus] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const toValue = focused ? 1 : 0;
    if (reduceMotion) {
      focus.setValue(toValue);
      return undefined;
    }
    const animation = Animated.timing(focus, {
      toValue,
      duration: durations.focus,
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [focused, reduceMotion, focus]);

  const handleFocus = (event) => {
    setFocused(true);
    onFocus?.(event);
  };
  const handleBlur = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  const rotate = focus.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', motion.focusRotate],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View>
        {/* Focus halo, drawn just outside the field */}
        <Animated.View pointerEvents="none" style={[styles.halo, { opacity: focus }]} />
        <View
          style={[
            styles.inputRow,
            icon && styles.inputRowWithIcon,
            accessory && styles.inputRowWithAccessory,
          ]}
        >
          {icon ? (
            <Animated.View
              style={[styles.chip, { transform: [{ rotate }] }]}
              importantForAccessibility="no-hide-descendants"
            >
              <Feather name={icon} size={sizes.iconMd} color={colors.primary} />
              <Animated.View style={[styles.chipFocused, { opacity: focus }]}>
                <Feather name={icon} size={sizes.iconMd} color={colors.surface} />
              </Animated.View>
            </Animated.View>
          ) : null}
          <TextInput
            style={[styles.input, icon && styles.inputWithIcon, latin && styles.inputLatin]}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={colors.placeholder}
            accessibilityLabel={label}
            accessibilityHint={error || hint}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...inputProps}
          />
          {accessory}
        </View>
        {/* State borders drawn over the 1 px line border: error wins over focus */}
        {error ? (
          <View pointerEvents="none" style={[styles.stateBorder, styles.errorBorder]} />
        ) : (
          <Animated.View
            pointerEvents="none"
            style={[styles.stateBorder, styles.focusBorder, { opacity: focus }]}
          />
        )}
      </View>
      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.error} accessibilityLiveRegion="polite">
            {error}
          </Text>
        </View>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}
