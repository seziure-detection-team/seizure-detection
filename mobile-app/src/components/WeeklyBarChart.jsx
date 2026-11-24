// File: WeeklyBarChart.jsx
// Purpose: Bar chart of events per week (B6, FR-15), built from plain Views (no chart
// library in Sprint 1). One column per week: count above the bar, week label below; oldest
// week at the start (right in RTL). The highlighted week (the newest) is primary, the others
// lavender; a week with no events shows a short stub. Bars grow from the bottom in 400 ms
// (scaleY, ease-out); static with reduce motion. Each column has a screen-reader label.
// data: [{ key, label, count, highlight }]

import { useEffect, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import useReduceMotion from '../hooks/useReduceMotion';
import ar from '../i18n/ar';
import { durations } from '../theme';
import styles, { BAR_MAX_HEIGHT, BAR_STUB_HEIGHT } from './WeeklyBarChart.styles';

export default function WeeklyBarChart({ data }) {
  const reduceMotion = useReduceMotion();
  const [grow] = useState(() => new Animated.Value(reduceMotion ? 1 : 0));
  const maxCount = Math.max(1, ...data.map((item) => item.count));

  useEffect(() => {
    if (reduceMotion) {
      grow.setValue(1);
      return undefined;
    }
    const animation = Animated.timing(grow, {
      toValue: 1,
      duration: durations.barGrowth,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [grow, reduceMotion]);

  return (
    <View style={styles.row}>
      {data.map((item) => {
        const height =
          item.count === 0
            ? BAR_STUB_HEIGHT
            : Math.max(BAR_STUB_HEIGHT, Math.round((item.count / maxCount) * BAR_MAX_HEIGHT));
        return (
          <View
            key={item.key}
            style={styles.column}
            accessible
            accessibilityLabel={ar.history.chartBar
              .replace('{week}', item.label)
              .replace('{count}', String(item.count))}
          >
            <View style={styles.barArea}>
              <Text style={styles.value}>{item.count}</Text>
              <Animated.View
                style={[
                  styles.bar,
                  item.highlight ? styles.barHighlight : styles.barNormal,
                  { height, transform: [{ scaleY: grow }] },
                ]}
              />
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        );
      })}
    </View>
  );
}
