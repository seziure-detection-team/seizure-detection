// File: shadows.js
// Purpose: Shadow presets (Yaqz v2, design/DESIGN_SYSTEM.md "Shadows"). iOS uses the
// shadow* properties; Android uses elevation, so the two only approximate each other.

const shadows = {
  sm: {
    shadowColor: '#3C285A',
    shadowOpacity: 0.05,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 6 },
    elevation: 1,
  },
  md: {
    shadowColor: '#3C285A',
    shadowOpacity: 0.06,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  button: {
    shadowColor: '#17141C',
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
};

export default shadows;
