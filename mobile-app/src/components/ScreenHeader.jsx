// File: ScreenHeader.jsx
// Purpose: Header row of a screen. In Phase 2 it holds the back button (A2, A4);
// the title and logout variant for the home screens is added in Phase 4.

import { Pressable, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import ar from '../i18n/ar';
import { colors, sizes } from '../theme';
import styles from './ScreenHeader.styles';

export default function ScreenHeader({ onBack }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={ar.common.back}
      >
        {/* Icons do not flip automatically: in RTL "back" points right, as in the designs */}
        <Feather name="chevron-right" size={sizes.iconMd} color={colors.text} />
      </Pressable>
    </View>
  );
}
