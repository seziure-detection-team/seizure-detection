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

// Font sizes in points, estimated from the designs (proportional approximations)
export const fontSizes = {
  caption: 13, // hints and helper text under fields
  small: 14, // links, badges, secondary lines
  body: 15, // field labels, inputs, body text
  button: 16,
  title: 20, // titles of message states (A3, A5)
  h1: 28, // screen headings (Noto Naskh Arabic)
};

// Line heights paired with the sizes above (Arabic script needs extra height)
export const lineHeights = {
  caption: 20,
  small: 22,
  body: 24,
  button: 24,
  title: 30,
  h1: 42,
};
