// File: TwoToneTitle.styles.js
// Purpose: Styles of the two-tone title (weight 600, IBM Plex Sans Arabic).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights } from '../theme';

export default StyleSheet.create({
  base: {
    color: colors.text,
    fontFamily: fonts.heading.semiBold,
  },
  h1: {
    fontSize: fontSizes.h1,
    lineHeight: lineHeights.h1,
  },
  title: {
    fontSize: fontSizes.title,
    lineHeight: lineHeights.title,
  },
  center: {
    textAlign: 'center',
  },
  headline: {
    color: colors.textHeadline,
  },
});
