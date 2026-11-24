// File: TwoToneTitle.jsx
// Purpose: Screen title in two tones (DESIGN_SYSTEM.md "Typography"): the first word in
// textHeadline, the rest in ink. The text is split at a space (approved Phase B decision
// B5), so ar.js keeps whole titles; a one-word title is all ink. `mutedWords` greys more
// than one word where the design does (A3 "تحقق من", approved in Phase C).
// Read as one header by screen readers.

import { Text } from 'react-native';

import styles from './TwoToneTitle.styles';

// Returns [mutedPart, rest]; rest keeps its leading space. At least one word always stays
// in ink: if the text has no more than `mutedWords` words, nothing is muted → ['', text].
export function splitTitle(text = '', mutedWords = 1) {
  let index = -1;
  for (let word = 0; word < mutedWords; word += 1) {
    index = text.indexOf(' ', index + 1);
    if (index === -1) return ['', text];
  }
  return [text.slice(0, index), text.slice(index)];
}

// size: "h1" (34/42, screen titles) or "title" (28/36, message states)
// align: "start" (right in RTL) or "center"
// mutedWords: number of leading words in textHeadline (default 1)
export default function TwoToneTitle({
  text,
  size = 'h1',
  align = 'start',
  mutedWords = 1,
  style,
}) {
  const [first, rest] = splitTitle(text, mutedWords);

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
