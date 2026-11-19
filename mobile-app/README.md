# Mobile App
Patient and caregiver application (React Native with Expo, Android).

## Setup

1. Install [Node.js](https://nodejs.org) (LTS version).
2. Install the packages (once, and again whenever `package.json` changes):
   ```
   cd mobile-app
   npm install
   ```
3. Install the **Expo Go** app on an Android phone from Google Play.

## Run the app

```
npm start
```

Scan the QR code that appears with the Expo Go app. The phone and the computer must be on the same Wi-Fi network.

## Run the tests

```
npm test
```

## Notes

- The app supports Android only (Table 1 of the report).
- The interface is Arabic and right-to-left (`supportsRTL` and `forcesRTL` in `app.json`).
- Colors come from the Google Stitch designs and are defined in `src/theme/colors.js`.
- Add new packages with `npx expo install <package>`, not `npm install`, so that their versions match the Expo SDK.
