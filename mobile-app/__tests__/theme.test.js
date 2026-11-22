// File: theme.test.js
// Purpose: Sample test proving the Jest environment works. It also checks that the
// color tokens match the approved design specification (prompt section 5.1).

import { colors, fonts } from '../src/theme';

test('color tokens match the design specification', () => {
  expect(colors).toEqual({
    primary: '#4D3B72',
    bg: '#F4F0E9',
    surface: '#FFFDF9',
    text: '#1C1C1A',
    muted: '#57534B',
    placeholder: '#615D55',
    line: '#E3DDD2',
    sage: '#ECE7F3',
    sage2: '#D5CBE5',
    error: '#A63A2B',
    errorBg: '#F8E9E5',
    amber: '#8A5A12',
    amberBg: '#F6EBD6',
  });
});

test('font families exist for headings, Arabic body text and Latin text', () => {
  expect(fonts.heading.bold).toBe('NotoNaskhArabic_700Bold');
  expect(fonts.body.regular).toBe('IBMPlexSansArabic_400Regular');
  expect(fonts.latin.regular).toBe('IBMPlexSans_400Regular');
});
