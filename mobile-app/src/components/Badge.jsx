// File: Badge.jsx
// Purpose: Status badge (Yaqz v2): height 28, dot 7, text 13/600. Always colour + dot + text,
// so the status never depends on colour alone. Tones:
//   neutral  "غير متصل", "إنذار خاطئ"           success  "متصل", "المراقبة نشطة"
//   warning  "انقطع الاتصال", "بانتظار المراجعة"  primary  "نوبة مؤكدة"
//   sample   "بيانات تجريبية", "محاكاة" (via SampleDataBadge)

import { Text, View } from 'react-native';

import styles from './Badge.styles';

export default function Badge({ label, tone = 'neutral', style }) {
  const toneKey = styles[`${tone}Bg`] ? tone : 'neutral';

  return (
    <View
      style={[styles.badge, styles[`${toneKey}Bg`], style]}
      accessible
      accessibilityLabel={label}
    >
      <View style={[styles.dot, styles[`${toneKey}Dot`]]} />
      <Text style={[styles.label, styles[`${toneKey}Text`]]}>{label}</Text>
    </View>
  );
}
