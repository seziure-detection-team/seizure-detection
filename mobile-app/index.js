// File: index.js
// Purpose: Entry point that registers the root component with Expo

import { registerRootComponent } from 'expo';

import App from './App';

// Registers App as the main component, in Expo Go and in native builds
registerRootComponent(App);
