// File: caregiverAlerts.styles.js
// Purpose: Styles of the Caregiver Alerts screen (C2 / C3 / C4).

import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes, lineHeights, radii, sizes, spacing } from '../theme';

// Patient avatar in the chip (measured from C2)
const AVATAR = 32;

export default StyleSheet.create({
  // Fills the space under the header, content centred (loading, C3, C4)
  center: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },

  patientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingStart: spacing.sm,
    paddingEnd: spacing.lg,
    borderWidth: sizes.borderWidth,
    borderColor: colors.line,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: radii.pill,
    backgroundColor: colors.sage, // spec "primarySoft"
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.primary,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  patientText: {
    color: colors.text,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  sampleBadge: {
    marginTop: spacing.lg,
  },

  // C2 — alert list
  list: {
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  // Chip (start, right in RTL) – texts
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingVertical: spacing.lgPlus,
  },
  itemNewest: {
    borderWidth: sizes.borderWidth,
    borderColor: colors.peach,
  },
  itemChip: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    borderRadius: radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemChipNewest: {
    backgroundColor: colors.peachSoft,
  },
  itemChipNormal: {
    backgroundColor: colors.bg,
  },
  itemBody: {
    flex: 1,
  },
  itemTitle: {
    color: colors.text,
    fontFamily: fonts.body.semiBold,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  itemMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: spacing.lg,
    marginTop: spacing.xs,
  },
  itemDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  itemMetaText: {
    color: colors.muted,
    fontFamily: fonts.body.regular,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
  },
  // Read-only status badge under the date/time/duration line (same spacing as B5)
  itemBadge: {
    marginTop: spacing.sm,
  },
});
