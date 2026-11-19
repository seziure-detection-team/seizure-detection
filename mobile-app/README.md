# Mobile App (رصد)

Patient and caregiver application (React Native with Expo SDK 58, Android only, Arabic RTL).
Navigation uses Expo Router; authentication and data use Supabase.

## Prerequisites

- Node.js 22.13 or newer (LTS).
- Android Studio with the Android SDK, Platform-Tools, Emulator, and an emulator (AVD),
  or an Android phone with USB debugging.
- A JDK supported by React Native (the React Native docs recommend JDK 17), set as `JAVA_HOME`.
- `ANDROID_HOME` set to the Android SDK folder, with `platform-tools` and `emulator` on `PATH`.

Expo Go is **not** supported: the app uses native modules and the `rasd://` deep links,
so it runs as a **development build**.

## Setup

```
cd mobile-app
npm install
```

Copy `.env.example` to `.env` (same folder) and fill in the values from the Supabase project
(Project Settings → API). `.env` is ignored by Git and must never be committed.

```
EXPO_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon public key>
```

Never put the Supabase `service_role` key in this app.

## Run the app (local development build)

1. Start the Android emulator (Android Studio → Device Manager → ▶), or connect a phone.
2. Build and install the development build, then start Metro:
   ```
   npm run android
   ```
   The first build takes several minutes. It generates the `android/` folder, which is
   ignored by Git and must not be edited by hand (configure native settings in `app.json`).
3. Later, if only JavaScript changed, start Metro without rebuilding:
   ```
   npm start
   ```
   Rebuild with `npm run android` after adding a package with native code or changing `app.json`.

### Windows: long paths in the native build

On Windows the C++ build of some libraries (for example `react-native-reanimated`, installed by
Expo Router) creates paths longer than 260 characters. The `ninja` shipped with the default
CMake 3.22.1 cannot handle them and the build fails with
`ninja: error: mkdir(...): No such file or directory`. One-time fix per computer:

1. Make sure Windows long paths are enabled (`LongPathsEnabled = 1`, Windows 10/11 setting).
2. Install CMake 3.31.6 (its `ninja` 1.12 supports long paths): Android Studio → SDK Manager →
   SDK Tools → Show Package Details → CMake 3.31.6.
3. Point the build at it in `android/local.properties` (create the file if missing; it is
   machine-specific and ignored by Git), using your own SDK path:
   ```
   sdk.dir=C\:\\Users\\<you>\\AppData\\Local\\Android\\Sdk
   cmake.dir=C\:\\Users\\<you>\\AppData\\Local\\Android\\Sdk\\cmake\\3.31.6
   ```
4. Delete `android/app/.cxx` and `node_modules/*/android/.cxx` if a build already failed, then
   run `npm run android` again.

Note: `npx expo prebuild --clean` deletes the `android/` folder, including `local.properties`;
recreate it afterwards.

The app forces a right-to-left layout. On the very first launch of a new build, close and
reopen the app once so Android applies RTL fully.

## Tests and code style

```
npm test             # Jest unit tests (Supabase is mocked; no network calls)
npm run lint         # ESLint (Expo rules)
npm run format:check # Prettier check (npm run format to fix)
```

## Notes

- Add packages with `npx expo install <package>` so their versions match the Expo SDK.
- Colors, fonts and spacing come from `src/theme` (taken from the Google Stitch designs);
  all Arabic text lives in `src/i18n/ar.js`.
- The Supabase session is stored encrypted: an AES key in Android secure storage
  (`expo-secure-store`) and the encrypted session in AsyncStorage (`src/lib/secureSessionStorage.js`).
