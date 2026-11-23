// File: spacing.js
// Purpose: Spacing scale, corner radii and fixed component sizes shared by all screens
// (Yaqz v2, design/DESIGN_SYSTEM.md "Spacing, radii, sizes").

// Spec scale: 4, 8, 12, 16, 20, 24, 32, 40, 48 (xxs is kept for existing fine adjustments)
export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  lgPlus: 20,
  xl: 24, // screen margin
  xxl: 32,
  xxlPlus: 40,
  xxxl: 48,
};

export const radii = {
  sm: 8,
  md: 12, // message, small icon
  lg: 16, // field, icon chip
  xl: 20, // list item, alert
  xxl: 24, // card
  pill: 999, // buttons, badges
};

// Fixed sizes of recurring elements (heights, icon tiles, icons)
export const sizes = {
  borderWidth: 1,
  borderWidthSelected: 2, // focus and error border
  inputHeight: 52,
  buttonHeight: 56,
  chipHeight: 52, // choice chip (A2 role)
  tabHeight: 44, // segmented tabs (B5/B6)
  navHeight: 72, // bottom nav (patient)
  touchTarget: 44, // minimum touch area; round icon button (back, logout)
  iconChip: 36, // icon chip inside a text field
  badgeHeight: 28,
  badgeDot: 7,
  iconTile: 48, // A1 logo tile, A6 lock tile
  emptyCircle: 104, // round icon circle of empty / message states (A3, A5, C3, C4)
  emptyRing: 160, // thin ring around the empty-state circle
  logo: 28, // default logo size (minimum 24)
  iconXs: 12,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 32,
};
