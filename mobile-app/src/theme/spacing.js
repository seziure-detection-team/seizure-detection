// File: spacing.js
// Purpose: Spacing scale, corner radii and fixed component sizes shared by all screens.
// Values are estimated from the Google Stitch designs (exported at different scales,
// so they are proportional approximations, not pixel-exact measurements).

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

// Fixed sizes of recurring elements (heights, icon tiles, icons)
export const sizes = {
  borderWidth: 1,
  borderWidthSelected: 1.5,
  inputHeight: 52,
  buttonHeight: 52,
  touchTarget: 44, // minimum touch area (back button, eye toggle)
  iconTile: 48, // A1 logo tile, A6 lock tile
  roleIconTile: 44, // icon tile inside a role card (A2)
  checkCircle: 22, // selection circle on a role card (A2)
  emptyCircle: 88, // round icon background of empty / message states (A3, A5, C3)
  iconXs: 12,
  iconSm: 16,
  iconMd: 20,
  iconLg: 24,
  iconXl: 32,
};
