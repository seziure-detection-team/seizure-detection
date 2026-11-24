// File: ScreenHeader.jsx
// Purpose: Header row of a screen (Yaqz v2). Every part is optional:
//   - onBack:  round back button at the start (right in RTL), e.g. A2, A4, B7
//   - eyebrow: small line above the title, e.g. "حساب مريض" (B1) / "حساب مرافق" (C2)
//   - title:   two-tone screen title (TwoToneTitle)
//   - action:  element at the end (left in RTL), e.g. the logout button (B1, C2)

import { Text, View } from 'react-native';

import ar from '../i18n/ar';
import IconButton from './IconButton';
import TwoToneTitle from './TwoToneTitle';
import styles from './ScreenHeader.styles';

export default function ScreenHeader({ onBack, eyebrow, title, action }) {
  const hasTitle = Boolean(eyebrow || title);

  return (
    <View style={styles.container}>
      {onBack ? (
        // Icons do not flip automatically: in RTL "back" points right, as in the designs
        <IconButton icon="chevron-right" onPress={onBack} accessibilityLabel={ar.common.back} />
      ) : null}
      {hasTitle ? (
        <View style={styles.titleBlock}>
          {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
          {title ? <TwoToneTitle text={title} /> : null}
        </View>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}
