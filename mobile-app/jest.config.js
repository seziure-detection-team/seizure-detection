// File: jest.config.js
// Purpose: Jest configuration for the mobile app (jest-expo preset for React Native).
// Automated tests never call the real Supabase project; Supabase is mocked in tests.

module.exports = {
  preset: 'jest-expo',
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
};
