// File: colors.js
// Purpose: Shared color tokens of the mobile app, taken from the approved Google Stitch designs.
// Single source of truth: screens and style files must use these tokens, never raw hex values.

const colors = {
  primary: '#4D3B72', // primary purple (buttons)
  bg: '#F4F0E9', // screen background (beige)
  surface: '#FFFDF9', // cards and input fields
  text: '#1C1C1A', // main text
  muted: '#57534B', // secondary text
  placeholder: '#615D55', // placeholder text in empty fields
  line: '#E3DDD2', // borders and dividers
  sage: '#ECE7F3', // light purple background (badges, icon circles)
  sage2: '#D5CBE5', // slightly darker light purple
  error: '#A63A2B', // errors
  errorBg: '#F8E9E5', // error background
  amber: '#8A5A12', // warnings
  amberBg: '#F6EBD6', // warning background
};

export default colors;
