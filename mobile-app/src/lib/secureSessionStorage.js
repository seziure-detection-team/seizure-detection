// File: secureSessionStorage.js
// Purpose: Storage adapter for the Supabase session (approved option "a").
//
// Why not SecureStore alone: a Supabase session (access token, refresh token, user
// object) can exceed the ~2048-byte value limit documented for expo-secure-store.
// So, following Supabase's Expo guide ("LargeSecureStore"):
//   - each value is encrypted with a fresh random 256-bit AES key (AES-CTR),
//   - the key is kept in SecureStore (Android Keystore-backed),
//   - the encrypted value is kept in AsyncStorage.
// The AsyncStorage copy is unreadable without the key from SecureStore.
//
// There is deliberately NO fallback to plain storage: if SecureStore fails, the error
// propagates so the session is not persisted insecurely. Values are never logged.

import 'react-native-get-random-values'; // provides crypto.getRandomValues on React Native
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import aesjs from 'aes-js';

const KEY_BYTES = 32; // 256-bit AES key

// Encrypts a value with a new random key, stores the key in SecureStore,
// and returns the encrypted value as hex.
async function encrypt(storageKey, value) {
  const encryptionKey = crypto.getRandomValues(new Uint8Array(KEY_BYTES));
  const cipher = new aesjs.ModeOfOperation.ctr(encryptionKey, new aesjs.Counter(1));
  const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

  await SecureStore.setItemAsync(storageKey, aesjs.utils.hex.fromBytes(encryptionKey));
  return aesjs.utils.hex.fromBytes(encryptedBytes);
}

// Decrypts a hex value using the key stored in SecureStore.
// Returns null when the key is missing (e.g. app data partially cleared).
async function decrypt(storageKey, encryptedHex) {
  const keyHex = await SecureStore.getItemAsync(storageKey);
  if (!keyHex) {
    return null;
  }
  const cipher = new aesjs.ModeOfOperation.ctr(
    aesjs.utils.hex.toBytes(keyHex),
    new aesjs.Counter(1),
  );
  const decryptedBytes = cipher.decrypt(aesjs.utils.hex.toBytes(encryptedHex));
  return aesjs.utils.utf8.fromBytes(decryptedBytes);
}

// Interface expected by supabase-js: getItem / setItem / removeItem (async)
const secureSessionStorage = {
  async getItem(storageKey) {
    const encryptedHex = await AsyncStorage.getItem(storageKey);
    if (!encryptedHex) {
      return null;
    }
    return decrypt(storageKey, encryptedHex);
  },

  async setItem(storageKey, value) {
    const encryptedHex = await encrypt(storageKey, value);
    await AsyncStorage.setItem(storageKey, encryptedHex);
  },

  async removeItem(storageKey) {
    await AsyncStorage.removeItem(storageKey);
    await SecureStore.deleteItemAsync(storageKey);
  },
};

export default secureSessionStorage;
