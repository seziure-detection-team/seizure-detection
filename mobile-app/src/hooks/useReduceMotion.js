// File: useReduceMotion.js
// Purpose: Returns true while the system "reduce motion" / "remove animations" setting is on.
// Every animated component checks it and shows its final state without motion
// (design/DESIGN_SYSTEM.md "Motion": all motion stops when the setting is on).

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

// Last known value, so components mounted later start with the right state immediately
// instead of animating for a moment while the asynchronous query is pending.
let lastKnown = false;

export default function useReduceMotion() {
  const [reduceMotion, setReduceMotion] = useState(lastKnown);

  useEffect(() => {
    let active = true;
    const update = (value) => {
      lastKnown = Boolean(value);
      if (active) setReduceMotion(lastKnown);
    };

    AccessibilityInfo.isReduceMotionEnabled()
      .then(update)
      .catch(() => {}); // unknown: keep the default (motion on)
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', update);

    return () => {
      active = false;
      subscription?.remove();
    };
  }, []);

  return reduceMotion;
}
