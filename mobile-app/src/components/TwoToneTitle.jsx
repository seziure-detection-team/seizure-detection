// File: TwoToneTitle.jsx
// Purpose: Screen title in two tones (DESIGN_SYSTEM.md "Typography"): the first word in
// textHeadline, the rest in ink. The text is split at the first space (approved Phase B
// decision B5), so ar.js keeps whole titles; a one-word title is all ink.
// Read as one header by screen readers.

import { Text } from 'react-native';

import styles from './TwoToneTitle.styles';

// Returns [firstWord, rest]; rest keeps its leading space. One word → ['', text].
export function splitTitle(text = '') {
  const index = text.indexOf(' ');
  return index === -1 ? ['', text] : [text.slice(0, index), text.slice(index)];
}

// size: "h1" (34/42, screen titles) or "title" (28/36, message states)
// align: "start" (right in RTL) or "center"
export default function TwoToneTitle({ text, size = 'h1', align = 'start', style }) {
  const [first, rest] = splitTitle(text);

  return (
    <Text
      style={[styles.base, styles[size], align === 'center' && styles.center, style]}
      accessibilityRole="header"
    >
      {first ? <Text style={styles.headline}>{first}</Text> : null}
      {rest}
    </Text>
  );
}
