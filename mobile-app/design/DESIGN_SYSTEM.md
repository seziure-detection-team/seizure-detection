# Design System: يقظ (Yaqz) v2

Approved by the team on 2026-11-22. The screen images in this folder are the visual
reference; this file is the exact specification to implement. When an image and this file
disagree, this file wins.

Notes on the images:

- The status bar ("9:41") at the top of each image is part of the mock-up only. It is not
  built in the app.
- Names, dates and durations (for example "سارة أحمد") are sample data.

## Screens (Sprint 1)

| ID  | File                            | Screen                                   |
| --- | ------------------------------- | ---------------------------------------- |
| A1  | `A1-login.png`                  | Login                                    |
| A2  | `A2-create-account.png`         | Create account (patient / caregiver)     |
| A3  | `A3-verify-email.png`           | Check your email (verification)          |
| A4  | `A4-forgot-password.png`        | Forgot password                          |
| A5  | `A5-reset-link-sent.png`        | Reset link sent                          |
| A6  | `A6-new-password.png`           | New password                             |
| B1  | `B1-patient-home.png`           | Patient home: wristband not connected    |
| B2  | `B2-monitoring-active.png`      | Patient home: monitoring active          |
| B4  | `B4-connection-lost.png`        | Patient home: connection lost (warning)  |
| B5  | `B5-seizure-history.png`        | Event history                            |
| B6  | `B6-patterns.png`               | Patterns (events per week)               |
| B7  | `B7-event-detail.png`           | Event detail (confirm / false alarm)     |
| C1  | `C1-caregiver-notification.png` | Caregiver push notification (lock screen)|
| C2  | `C2-caregiver-alerts.png`       | Caregiver alerts                         |
| C3  | `C3-alerts-empty.png`           | No alerts                                |
| C4  | `C4-no-linked-patient.png`      | No linked patient                        |

In Sprint 1 only login, registration, password reset and role-based routing are functional.
The B and C screens show sample data; real data arrives in later sprints (FR-05, FR-13,
FR-14, FR-15, FR-17).

## Identity

- Name: **يقظ**, always in `primary` (#6347A3), weight 700.
- Logo: "wrist ring", a wristband in light perspective with a sensor dot. Gradient
  #6347A3 → #B79BEA → #F2AE88. Minimum size 24.
- A seizure is always described as **"حدث صرع محتمل"** (probable seizure event), never as a
  diagnosis (NFR-07).

## Colors

| Token           | Hex       | Use / contrast            |
| --------------- | --------- | ------------------------- |
| `bg`            | `#F4EFE7` | screen background         |
| `surface`       | `#FFFDF9` | cards, fields             |
| `line`          | `#E3DACB` | borders, dividers         |
| `track`         | `#E9E1D4` | segmented-tab background  |
| `ink`           | `#17141C` | text, primary button (16.8:1) |
| `inkPressed`    | `#2A2531` | pressed primary button    |
| `textMuted`     | `#6E6672` | secondary text (4.8:1)    |
| `textHeadline`  | `#A39BA6` | first word of a title only|
| `primary`       | `#6347A3` | name, links, focus (6.2:1)|
| `primarySoft`   | `#EEE6FA` | icon chips, soft fills    |
| `lavender`      | `#CDB8F0` | decorative                |
| `peach`         | `#F2AE88` | decorative                |
| `success`       | `#2B7350` | "connected" (5.0:1)       |
| `successSoft`   | `#E1EFE6` | background                |
| `warning`       | `#8F5400` | "connection lost" (5.4:1) |
| `warningSoft`   | `#F8E9D2` | background                |
| `onWarningSoft` | `#6B3F00` | text on warningSoft (7.5:1) |
| `error`         | `#B3261E` | field errors (5.7:1)      |
| `errorSoft`     | `#F8E0DD` | background                |
| `peachDeep`     | `#A4532A` | (4.8:1)                   |
| `peachSoft`     | `#FBE7DA` | background                |

Connection lost (B4) uses **warning** (amber), not error (red). Red is only for field errors.

## Typography

Font: **IBM Plex Sans Arabic** (already loaded in the app). Weights 400, 500, 600, 700.
Two-tone titles: the first word in `textHeadline`, the rest in `ink`.

| Role       | Size / line height | Weight |
| ---------- | ------------------ | ------ |
| `title`    | 34 / 42            | 600    |
| `titleSm`  | 28 / 36            | 600    |
| `subtitle` | 22 / 30            | 600    |
| `heading`  | 17 / 24            | 600    |
| `body`     | 15 / 26            | 400    |
| `label`    | 13 / 20            | 500    |
| `caption`  | 12 / 18            | 400    |

Latin text such as email input keeps IBM Plex Sans.

## Spacing, radii, sizes

- Spacing: 4, 8, 12, 16, 20, 24, 32, 40, 48. Screen margin 24, between sections 24–32,
  between fields 16, title to description 8.
- Radii: 12 (message, small icon), 16 (field, icon chip), 20 (list item, alert),
  24 (card), 999 (buttons, badges), 50% (round button).
- Sizes: button 56, field 52, choice chip 52, tab 44, icon button 44, nav 72, icon 20.

## Shadows (React Native)

```js
sm:     { shadowColor: '#3C285A', shadowOpacity: 0.05, shadowRadius: 18, shadowOffset: { width: 0, height: 6 }, elevation: 1 },
md:     { shadowColor: '#3C285A', shadowOpacity: 0.06, shadowRadius: 24, shadowOffset: { width: 0, height: 8 }, elevation: 2 },
button: { shadowColor: '#17141C', shadowOpacity: 0.18, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 4 },
```

## Components

- **Button:** height 56, pill, `ink` background, label 17/600, `shadow.button`.
  Pressed: scale 0.98, `inkPressed`, 150 ms. Disabled: opacity 0.45. Loading:
  ActivityIndicator 20.
- **Round icon button** (back, logout): 44, `surface`, `shadow.sm`, pressed scale 0.94.
- **Text field:** height 52, radius 16, `surface`, border 1 `line`, text 15.
  Icon chip 36 × 36 (radius 12, `primarySoft`, icon 20 in `primary`) at the start, 8 from
  the edge.
  - Focus: border 2 `primary` + 4 px `primarySoft` halo; chip turns `primary` with a white
    icon and rotates −8°; 200 ms.
  - Error: border 2 `error` + message below (radius 12).
- **Choice chip** (patient / caregiver on A2): height 52, selected / unselected.
- **Segmented tabs** (History / Patterns): height 44.
- **Card:** radius 24, padding 16, `shadow.md`.
- **Badge:** height 28, padding 12, dot 7, text 13/600. Always color + dot + text.
- **Alert** (connection lost): radius 20, padding 16, `warningSoft` with `onWarningSoft` text.
- **Bottom nav** (patient: Home / History): height 72, inset 16, radius 36,
  `surface` at 78% opacity (no blur, see decisions).
- **Logout button** on every patient and caregiver screen (UC-02).

## Motion

| Interaction              | Duration   | Detail                                         |
| ------------------------ | ---------- | ---------------------------------------------- |
| Screen enter             | 280 ms     | opacity 0→1, translateY 8→0, ease-out          |
| Staggered items          | 320 ms     | same, +80 ms delay per group                   |
| Button press             | 150 ms     | scale 1→0.98 (round 0.94)                       |
| Field focus              | 200 ms     | border + halo, chip color + rotate             |
| Error / alert appear     | 200–320 ms | fade + translateY −16→0                        |
| Chip / tab select        | 200 ms     | background + border                            |
| Bar growth (B6)          | 400 ms     | height 0→value, ease-out                       |
| Spinner                  | 800 ms     | rotate 360, linear, loop                       |
| Logo pulse               | 3200 ms    | scale 1→1.05→1, loop                           |
| "Monitoring active" rings| 2800 ms    | scale 0.7→1.35, opacity 0.7→0, two rings 1400 ms apart |

All motion stops when the system "reduce motion" setting is on.

## Implementation decisions (Sprint 1)

No new native libraries are added in Sprint 1, so no extra rebuilds and no risk to the
working auth code.

| Topic            | Design says     | We use                                   |
| ---------------- | --------------- | ---------------------------------------- |
| Icons            | Lucide          | Feather from `@expo/vector-icons` (same style, already installed) |
| Animation        | Reanimated      | React Native `Animated` (built in)       |
| Nav bar          | expo-blur       | `surface` at 78% opacity, no blur        |
| Logo             | SVG             | PNG image, pulse with `Animated`         |
| Background glow  | radial gradient | PNG background image                     |

## Rules for implementation

- Change **values** in `src/theme/`, keep the existing token names so all screens update
  without edits. Add new tokens only where needed.
- Do not change auth logic: `src/lib/`, `src/context/`, and the logic inside the screens.
- New patient / caregiver screens must be added inside the matching `Stack.Protected` guard
  in `app/_layout.jsx`.
- Keep `rasd://` and `sa.edu.uj.rasd` unchanged (email links in Supabase depend on them).
  Only the display name changes to يقظ.
