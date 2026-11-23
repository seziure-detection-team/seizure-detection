// File: WristbandHero.styles.js
// Purpose: Styles of the wristband illustration (circle, static rings, pulse rings).

import { StyleSheet } from 'react-native';

import { colors, radii, shadows, sizes } from '../theme';

// Local layout constants of this illustration (measured from B1/B2/B4)
const CIRCLE = 120; // white circle
const IMAGE = 64; // wristband PNG (64 × 64 @1x)
const RING_INNER = 164;
const RING_OUTER = 208;
const RING_LOST = 156;
const PULSE = 180; // pulse ring at scale 1 (animated 0.7 → 1.35)

export default StyleSheet.create({
  container: {
    width: RING_OUTER,
    height: RING_OUTER,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.md,
  },
  image: {
    width: IMAGE,
    height: IMAGE,
  },
  ring: {
    position: 'absolute',
    borderRadius: radii.pill,
    borderWidth: sizes.borderWidth,
  },
  ringInner: {
    width: RING_INNER,
    height: RING_INNER,
    borderColor: colors.line,
  },
  ringOuter: {
    width: RING_OUTER,
    height: RING_OUTER,
    borderColor: colors.line,
  },
  ringLost: {
    width: RING_LOST,
    height: RING_LOST,
    borderColor: colors.peach,
  },
  pulseRing: {
    position: 'absolute',
    width: PULSE,
    height: PULSE,
    borderRadius: radii.pill,
    backgroundColor: colors.sage2, // spec "lavender"
  },
  // Reduce motion: one faint still ring instead of the animation
  pulseStill: {
    opacity: 0.35,
  },
});
