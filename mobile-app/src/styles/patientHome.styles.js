// File: patientHome.styles.js
// Purpose: Styles of the Patient Home screen (B1 / B2 / B4).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

export default StyleSheet.create({
  sampleBadge: {
    marginTop: -spacing.md,
    marginBottom: spacing.lg,
  },
  // Takes the free space between the header and the card, illustration centred in it
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  monitoringBadge: {
    alignSelf: 'center',
    marginTop: spacing.xl,
  },
  card: {
    paddingVertical: spacing.lgPlus,
  },
  // Chip (start, right in RTL) – title – badge (end, left in RTL)
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  cardChip: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radii.lg,
    backgroundColor: colors.neutralSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardChipActive: {
    backgroundColor: colors.sage, // spec "primarySoft"
  },
  cardIcon: {
    width: sizes.iconLg,
    height: sizes.iconLg,
  },
  cardTitle: {
    flex: 1,
    color: colors.text,
    fontFamily: fonts.heading.semiBold,
    fontSize: fontSizes.heading,
    lineHeight: lineHeights.heading,
  },
  cardBadge: {
    alignSelf: 'center',
  },
  action: {
    marginTop: spacing.lg,
  },
});
