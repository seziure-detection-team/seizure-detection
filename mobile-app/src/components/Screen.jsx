// File: Screen.jsx
// Purpose: Shared screen wrapper (approved Phase 2 decision 2): safe area, beige background,
// scrolling for long forms (A2), keyboard avoidance, and an optional footer pinned to the
// bottom of the screen (A1 sign-up link, A3/A5 buttons).

import { KeyboardAvoidingView, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './Screen.styles';

// centered: vertically centers the body (message screens such as A3 and A5)
export default function Screen({ children, footer, centered = false }) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* "padding" keeps focused inputs above the keyboard with Android edge-to-edge */}
      <KeyboardAvoidingView style={styles.keyboard} behavior="padding">
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={centered ? styles.bodyCentered : styles.body}>{children}</View>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
