// File: colors.js
// Purpose: Shared color tokens of the mobile app (Yaqz v2, design/DESIGN_SYSTEM.md).
// Single source of truth: screens and style files must use these tokens, never raw hex values.
// Existing token names are kept so all screens update without edits; the comment after each
// one names the matching token in DESIGN_SYSTEM.md. Contrast ratios are against bg/surface.

const colors = {
  primary: '#6347A3', // spec "primary": app name, links, focus (6.2:1)
  bg: '#F4EFE7', // spec "bg": screen background
  surface: '#FFFDF9', // spec "surface": cards, fields
  text: '#17141C', // spec "ink": text, primary button (16.8:1)
  muted: '#6E6672', // spec "textMuted": secondary text (4.8:1)
  placeholder: '#78707C', // not in spec: placeholder text (4.69:1), lighter than typed text
  line: '#E3DACB', // spec "line": borders, dividers
  sage: '#EEE6FA', // spec "primarySoft": icon chips, soft fills
  sage2: '#CDB8F0', // spec "lavender": decorative
  error: '#B3261E', // spec "error": field errors (5.7:1)
  errorBg: '#F8E0DD', // spec "errorSoft": error background
  amber: '#8F5400', // spec "warning": "connection lost" (5.4:1)
  amberBg: '#F8E9D2', // spec "warningSoft": warning background

  // New tokens (Yaqz v2), named as in DESIGN_SYSTEM.md
  inkPressed: '#2A2531', // pressed primary button
  textHeadline: '#A39BA6', // first word of a two-tone title only (decorative)
  track: '#E9E1D4', // segmented-tab background
  peach: '#F2AE88', // decorative
  peachDeep: '#A4532A', // (4.8:1)
  peachSoft: '#FBE7DA', // background
  success: '#2B7350', // "connected" (5.0:1)
  successSoft: '#E1EFE6', // background
  onWarningSoft: '#6B3F00', // text on amberBg / warningSoft (7.5:1)
};

export default colors;
