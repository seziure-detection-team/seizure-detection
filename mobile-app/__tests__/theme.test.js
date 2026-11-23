// File: theme.test.js
// Purpose: Sample test proving the Jest environment works. It also checks that the
// color tokens and fonts match the approved design specification (design/DESIGN_SYSTEM.md).

import { colors, fonts } from '../src/theme';

test('color tokens match the design specification', () => {
  expect(colors).toEqual({
    primary: '#6347A3',
    bg: '#F4EFE7',
    surface: '#FFFDF9',
    text: '#17141C',
    muted: '#6E6672',
    placeholder: '#78707C',
    line: '#E3DACB',
    sage: '#EEE6FA',
    sage2: '#CDB8F0',
    error: '#B3261E',
    errorBg: '#F8E0DD',
    amber: '#8F5400',
    amberBg: '#F8E9D2',
    inkPressed: '#2A2531',
    textHeadline: '#A39BA6',
    track: '#E9E1D4',
    peach: '#F2AE88',
    peachDeep: '#A4532A',
    peachSoft: '#FBE7DA',
    success: '#2B7350',
    successSoft: '#E1EFE6',
    onWarningSoft: '#6B3F00',
  });
});

test('headings and Arabic body text use IBM Plex Sans Arabic; Latin uses IBM Plex Sans', () => {
  expect(fonts.heading.bold).toBe('IBMPlexSansArabic_700Bold');
  expect(fonts.body.bold).toBe('IBMPlexSansArabic_700Bold');
  expect(fonts.body.regular).toBe('IBMPlexSansArabic_400Regular');
  expect(fonts.latin.regular).toBe('IBMPlexSans_400Regular');
});
