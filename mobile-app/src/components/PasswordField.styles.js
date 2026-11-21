// File: PasswordField.styles.js
// Purpose: Styles of the show/hide toggle inside the password field.

import { StyleSheet } from 'react-native';

import { sizes } from '../theme';

export default StyleSheet.create({
  toggle: {
    width: sizes.touchTarget,
    height: sizes.touchTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
