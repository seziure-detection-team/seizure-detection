// File: App.test.js
// Purpose: Checks that the Jest test environment works by rendering the root component

import { render, screen } from '@testing-library/react-native';

import App from '../App';

// Renders the app and expects the start screen text to appear
test('renders the start screen', async () => {
  await render(<App />);
  expect(screen.getByText('جاهز للبدء')).toBeTruthy();
});
