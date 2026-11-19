// File: typography.js
// Purpose: Font families, sizes and weights shared by all screens.
// Each weight of a Google Font is loaded as its own family name (the font files are
// loaded once in app/_layout.jsx), so styles select a weight by choosing the family,
// not by fontWeight.

// heading = Arabic headings (h1), body = Arabic body text (default),
// latin = English/Latin text such as the email input
export const fonts = {
  heading: {
    medium: 'NotoNaskhArabic_500Medium',
    semiBold: 'NotoNaskhArabic_600SemiBold',
    bold: 'NotoNaskhArabic_700Bold',
  },
  body: {
    regular: 'IBMPlexSansArabic_400Regular',
    medium: 'IBMPlexSansArabic_500Medium',
    semiBold: 'IBMPlexSansArabic_600SemiBold',
  },
  latin: {
    regular: 'IBMPlexSans_400Regular',
    medium: 'IBMPlexSans_500Medium',
    semiBold: 'IBMPlexSans_600SemiBold',
  },
};

// Font sizes in points; final values will be matched to the designs in Phase 2
export const fontSizes = {
  caption: 12,
  small: 14,
  body: 16,
  title: 20,
  h1: 26,
};

// Line heights paired with the sizes above (Arabic script needs extra height)
export const lineHeights = {
  caption: 18,
  small: 22,
  body: 24,
  title: 30,
  h1: 38,
};
