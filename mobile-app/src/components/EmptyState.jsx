// File: EmptyState.jsx
// Purpose: Centred message state (Yaqz v2): a surface circle with the icon inside a thin
// ring, a title and body text. Used by A3, A5, the A6 expired-link state, the account-error
// screen and, in Phase D, C3 and C4.
// tone sets the ring and icon colours: "default" (lavender: A3, C3), "peach" (A5, C4),
// "error" (A6 expired link, account error).
// twoTone shows the title as a two-tone title (28/36, A3/A5); otherwise 22/30 (C3/C4).
// mutedWords (with twoTone) is passed to TwoToneTitle, e.g. 2 on A3.

import { Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { colors, sizes } from '../theme';
import TwoToneTitle from './TwoToneTitle';
import styles from './EmptyState.styles';

const ICON_COLORS = {
  default: colors.primary,
  peach: colors.primary,
  error: colors.error,
};

export default function EmptyState({
  icon,
  title,
  body,
  tone = 'default',
  twoTone = false,
  mutedWords = 1,
}) {
  return (
    <View style={styles.container}>
      <View style={[styles.ring, styles[`ring_${tone}`] ?? styles.ring_default]}>
        <View style={styles.circle}>
          <Feather
            name={icon}
            size={sizes.iconXl}
            color={ICON_COLORS[tone] ?? ICON_COLORS.default}
          />
        </View>
      </View>
      {twoTone ? (
        <TwoToneTitle
          text={title}
          size="title"
          align="center"
          mutedWords={mutedWords}
          style={styles.titleSpacing}
        />
      ) : (
        <Text style={styles.title} accessibilityRole="header">
          {title}
        </Text>
      )}
      {body ? <Text style={styles.body}>{body}</Text> : null}
    </View>
  );
}
