// File: typography.js
// Purpose: Font families, sizes and line heights shared by all screens (Yaqz v2,
// design/DESIGN_SYSTEM.md). Each weight of a Google Font is loaded as its own family name
// (the font files are loaded once in app/_layout.jsx), so styles select a weight by choosing
// the family, not by fontWeight.

// heading = Arabic headings, body = Arabic body text (default); both use IBM Plex Sans
// Arabic in Yaqz v2. latin = English/Latin text such as the email input (IBM Plex Sans).
export const fonts = {
  heading: {
    medium: 'IBMPlexSansArabic_500Medium',
    semiBold: 'IBMPlexSansArabic_600SemiBold',
    bold: 'IBMPlexSansArabic_700Bold',
  },
  body: {
    regular: 'IBMPlexSansArabic_400Regular',
    medium: 'IBMPlexSansArabic_500Medium',
    semiBold: 'IBMPlexSansArabic_600SemiBold',
    bold: 'IBMPlexSansArabic_700Bold', // app name "يقظ"
  },
  latin: {
    regular: 'IBMPlexSans_400Regular',
    medium: 'IBMPlexSans_500Medium',
    semiBold: 'IBMPlexSans_600SemiBold',
  },
};

// Font sizes in points. Existing names are kept; the comment names the spec role.
export const fontSizes = {
  caption: 12, // spec "caption": hints and helper text under fields
  small: 13, // spec "label": badges, secondary lines
  body: 15, // spec "body": field labels, inputs, links, body text
  button: 17, // spec button label (17/600)
  heading: 17, // spec "heading": card titles
  subtitle: 22, // spec "subtitle": titles of empty states (C3, C4)
  title: 28, // spec "titleSm": titles of message states (A3, A5)
  h1: 34, // spec "title": screen headings
};

// Line heights paired with the sizes above (Arabic script needs extra height)
export const lineHeights = {
  caption: 18,
  small: 20,
  body: 26,
  button: 24,
  heading: 24,
  subtitle: 30,
  title: 36,
  h1: 42,
};
