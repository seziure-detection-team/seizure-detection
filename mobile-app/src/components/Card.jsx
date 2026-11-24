// File: Card.jsx
// Purpose: Surface card (Yaqz v2): radius 24, padding 16, medium shadow. Used for the
// wristband card (B1/B2/B4), event and alert items (B5, C2), the chart (B6) and details (B7).

import { View } from 'react-native';

import styles from './Card.styles';

export default function Card({ children, style, ...viewProps }) {
  return (
    <View style={[styles.card, style]} {...viewProps}>
      {children}
    </View>
  );
}
