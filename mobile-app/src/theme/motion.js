// File: motion.js
// Purpose: Animation durations and offsets (Yaqz v2, design/DESIGN_SYSTEM.md "Motion").
// All motion must stop when the system "reduce motion" setting is on; components check
// AccessibilityInfo before starting an animation.

export const durations = {
  screenEnter: 280, // opacity 0→1, translateY 8→0, ease-out
  stagger: 320, // staggered items, same as screen enter
  staggerDelay: 80, // extra delay per group
  press: 150, // button scale 1→0.98 (round 0.94)
  focus: 200, // field border + halo, chip color + rotate
  select: 200, // chip / tab select
  alertIn: 320, // error / alert appear (200–320), fade + translateY −16→0
  barGrowth: 400, // B6 bar height 0→value, ease-out
  spinner: 800, // rotate 360, linear, loop
  logoPulse: 3200, // scale 1→1.05→1, loop
  rings: 2800, // "monitoring active" rings, scale 0.7→1.35, opacity 0.7→0
  ringsOffset: 1400, // delay between the two rings
};

export const motion = {
  pressScale: 0.98,
  pressScaleRound: 0.94,
  enterOffset: 8, // translateY at the start of a screen enter
  alertOffset: -16, // translateY at the start of an error / alert appear
  focusRotate: '-8deg', // icon chip rotation on field focus
  logoPulseScale: 1.05,
  ringScaleFrom: 0.7,
  ringScaleTo: 1.35,
  ringOpacityFrom: 0.7,
};
