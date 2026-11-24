# Sprint 1 – Test Report

Test report of Sprint 1 (task T1-11 in Table 32 of the project report). It contains the manual
tests with real accounts (Runs 1 and 2 on the first app design, Run 3 on the Yaqz v2 screens),
the automated test results, and the Sprint Review checklist.

## Manual tests with real accounts (Phase 3)

Results are recorded as reported; no result is assumed. Two test runs:

- **Run 1** (tests 1–4, 8, 8b, 9): Android emulator (AVD `Medium_Phone_API_37.0`, local dev
  build) against the team's Supabase project.
- **Run 2** (tests 5–7, 10; 2026-11-23): Android emulator with the local dev build (app code as
  in `dev` at `a3770cd`, Metro running) against a second team member's own Supabase project,
  set up from `database/supabase/` with no accounts before the run. Setup check, not a test
  case: a patient account was registered (A3 shown), verified, and logged in once (B1
  placeholder opened). Only 2 emails were used (patient and caregiver verification).

| #   | Test                                                                         | Use case     | Result           | Notes                                                                                                                              |
| --- | ---------------------------------------------------------------------------- | ------------ | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Patient login with a registered, verified account                            | UC-02        | PASS             | B1 placeholder opened ("الرئيسية" + logout button)                                                                                 |
| 2   | Session persists after the app is fully closed and reopened                  | UC-02        | PASS             | B1 opened directly, no login asked                                                                                                 |
| 3   | Logout                                                                       | UC-02        | PASS             | Returned to A1; after closing and reopening, A1 opened (not B1)                                                                    |
| 4   | Wrong password                                                               | UC-02 3a     | PASS             | Generic banner "البريد الإلكتروني أو كلمة المرور غير صحيحة."; no field singled out; email kept                                     |
| 5   | Caregiver registration (role "مرافق")                                        | UC-01        | PASS             | Run 2. Logout from B1 → A1; registered with one tap → A3 opened; verification email arrived; no banner or error                    |
| 6   | Caregiver login before email verification                                    | UC-02        | PASS             | Run 2. A3 → A1; correct password → banner "لم يتم تفعيل حسابك بعد. افتح رابط التفعيل..." (exact text); stayed on A1; email kept    |
| 7   | Caregiver login after email verification                                     | UC-01, UC-02 | PASS             | Run 2. Link opened on the computer; login → C2 placeholder ("التنبيهات" + logout), B1 did not open; logout → A1                    |
| 8   | Password reset from the email link                                           | UC-03        | PASS (defect D1) | A4 → email link opened on the emulator → A6 → new password (no capital letters) → A1 with "تم تغيير كلمة المرور بنجاح..."          |
| 8b  | Login with the new password                                                  | UC-03        | PASS             | B1 opened                                                                                                                          |
| 9   | Reset link already used (opened first in a PC browser, then on the emulator) | UC-03 5a     | PASS             | "انتهت صلاحية الرابط" shown; "طلب رابط جديد" opened A4                                                                             |
| 10  | Open another role's route directly (`rasd://alerts` as a patient)            | UC-02        | PASS             | Run 2. `adb shell am start -a android.intent.action.VIEW -d "rasd://alerts" sa.edu.uj.rasd`, twice: C2 never shown, B1 stayed (O1) |

### Defects

| ID  | Found in | Description                                                                                                                                                                      | Status                                                                  |
| --- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| D1  | Test 8   | After a successful reset, A1 opened with the password field already filled (masked) while the email field was empty. Expected: both fields empty after a reset and after logout. | Closed – not a defect: the dots are the field's placeholder (see below) |

**D1 diagnosis.** Reproduced on a fresh install at a cold start, with nothing typed: the
password field shows `••••••••`, which is its placeholder (`ar.common.passwordPlaceholder`,
as in the A1 design). Evidence: pressing "دخول" shows "هذا الحقل مطلوب." under both fields, so
the app holds no password; the Android view tree reports the field's text equal to its hint;
`dumpsys autofill` shows no autofill session or fill event. The "Save password?" prompt after
A6 came from Google Autofill offering to save the new password; it did not fill A1.

### Observations (Run 2, not defects)

- **O1 (test 10):** adb printed "Activity not started, intent has been delivered to currently
  running top-most instance" (expected: the link went to the running app). The screen
  flickered very briefly, with no other screen or content visible, then B1 stayed. Pressing
  back once gave the same brief flicker and B1 stayed. No crash.
- **O2 (test 6):** a wrong password on the same unverified account showed the generic
  wrong-credentials banner, not the "not verified" banner. The verification status is
  therefore shown only to someone who knows the password.
- **O3 (before test 5):** the app was closed by accident and reopened from Metro; it opened
  on B1 with the session kept (consistent with test 2).

### Test conditions

- Test accounts use email addresses that are members of the team's Supabase organization:
  the built-in Supabase email service only sends to organization members (limit 2 emails/hour).
- Reset links must be opened on the emulator itself: the PKCE code verifier is stored in the
  app, so a link opened in a PC browser cannot complete the reset (it shows a blank page and
  uses up the link).
- In Run 2 both sign-up verification links were opened on the computer. This confirms the
  email on the server; opening the `rasd://login` link in the app after sign-up was not
  exercised in Run 2.

## Manual tests of the Yaqz v2 screens (Run 3)

Results are recorded as reported; no result is assumed. Run 3 used the Android emulator with
the local dev build, against a team member's own Supabase project, in two parts:

- **Part A** (tests 11–22 and 23a; 2026-11-23): run during Phases C and D of the Yaqz v2 redesign
  (commits `cb436c3` to `4c83108`), after each phase.
- **Part B** (tests 23b and 24–27; 2026-11-23): run after the Phase E clean rebuild (new app
  name, icon and splash), on commit `9b7a3b6`.

| #   | Test                                                                                                                                                 | Requirement / use case | Result | Notes                                                       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ------ | ----------------------------------------------------------- |
| 11  | Login with a registered, verified account                                                                                                            | UC-02                  | PASS   | Part A                                                      |
| 12  | Wrong password                                                                                                                                       | UC-02 3a               | PASS   | Part A                                                      |
| 13  | Empty fields                                                                                                                                         | UC-02                  | PASS   | Part A                                                      |
| 14  | Invalid email format                                                                                                                                 | UC-02                  | PASS   | Part A                                                      |
| 15  | Create account with the role chips; role error when no role is chosen                                                                                | UC-01                  | PASS   | Part A                                                      |
| 16  | Caregiver sign-up and email verification                                                                                                             | UC-01                  | PASS   | Part A                                                      |
| 17  | Patient home B1 → B2 → B4 → B2 (wristband simulation)                                                                                                | FR-05, UC-04           | PASS   | Part A. Simulation                                          |
| 18  | History (B5) and event detail (B7)                                                                                                                   | FR-14                  | PASS   | Part A. Sample data                                         |
| 19  | Labelling an event in B7, and the label reset on logout                                                                                              | FR-17, UC-10           | PASS   | Part A. Sample data                                         |
| 20  | Patterns (B6)                                                                                                                                        | FR-15                  | PASS   | Part A. Sample data                                         |
| 21  | Caregiver with no linked patient: C4                                                                                                                 | FR-13, UC-08 1a        | PASS   | Part A                                                      |
| 22  | Caregiver alerts C2 after linking the two accounts manually in SQL: real patient name shown                                                          | FR-13, UC-08, NFR-05   | PASS   | Part A. Alerts are sample data; the patient name is real    |
| 23a | Logout from the patient home                                                                                                                         | UC-02                  | PASS   | Part A (Phase D1)                                           |
| 23b | Logout from the caregiver alerts screen                                                                                                              | UC-02                  | PASS   | Part B                                                      |
| 24  | App name يقظ and the new icon on the device                                                                                                          | –                      | PASS   | Part B                                                      |
| 25  | Session kept after the app is fully closed and reopened                                                                                              | UC-02                  | PASS   | Part B. The last signed-in role's home opened without login |
| 26  | Password reset: A4 → link copied from Gmail on the PC and pasted into Chrome on the emulator → A6 → new password saved → A1 with the success message | UC-03                  | PASS   | Part B                                                      |
| 27  | Login with the new password                                                                                                                          | UC-03                  | PASS   | Part B. The patient home opened                             |

**Scope note.** Sprint 1 covers PB-01 to PB-04 (Table 31). The wristband status (test 17), the
event history, labelling and patterns (18–20) and the caregiver alerts (22) are user interfaces
built ahead of their sprints: they run on a simulation or on sample data from `src/mocks/`,
labelled on screen "محاكاة" or "بيانات تجريبية". The real BLE connection, events and alerts
come in later sprints. In test 22, only the linked patient's name is read from Supabase.

## Automated tests

Unit and screen tests with Jest 30.5.2 (`jest-expo` preset) and React Native Testing Library 14.
Supabase is mocked, so the tests make no network calls. Final runs on 2026-11-23 (Node.js
26.13.1), on the code of this branch:

| Command                | Result                                 |
| ---------------------- | -------------------------------------- |
| `npm test` (run 1)     | 16 of 16 suites, 175 of 175 tests pass |
| `npm test` (run 2)     | 16 of 16 suites, 175 of 175 tests pass |
| `npm run lint`         | No errors or warnings                  |
| `npm run format:check` | All files formatted                    |

| Suite                     | Tests   | What it covers                                                                           |
| ------------------------- | ------- | ---------------------------------------------------------------------------------------- |
| `validation.test.js`      | 29      | Field rules of the register, login, reset and new-password forms (email, password, role) |
| `auth.test.js`            | 25      | Sign-up, login, role query, logout and password-reset calls, and their error mapping     |
| `components.test.js`      | 22      | Shared components: buttons, fields, role chips, banners, titles, badges, logout, nav bar |
| `authScreens.test.js`     | 20      | Screens A1–A6: inline errors, banners, navigation between screens                        |
| `authContext.test.js`     | 13      | Session restore, login and logout, physician sign-out, password-recovery state           |
| `profile.test.js`         | 13      | Own name (session first, profile row as fallback), the caregiver's linked patient        |
| `deepLinks.test.js`       | 12      | Parsing of the `rasd://login` and `rasd://new-password` links, one-time code, redirects  |
| `routing.test.js`         | 12      | Screen group per sign-in state and role; a physician never reaches a mobile home screen  |
| `caregiverAlerts.test.js` | 5       | C2, C3, C4, error with retry, loading; logout in every state                             |
| `history.test.js`         | 5       | B5 list, opening B7, label changed on B7, B6 chart tab, empty state                      |
| `patientHome.test.js`     | 4       | B1 greeting and status, B1 → B2 → B4 → B2 simulation, History tab, logout                |
| `eventDetail.test.js`     | 4       | B7 details and labelling, back button, unknown event                                     |
| `format.test.js`          | 4       | Arabic dates, times, durations and week labels with Western digits                       |
| `patterns.test.js`        | 3       | Start of week (Monday) and weekly counts                                                 |
| `eventLabels.test.js`     | 2       | Shared label store and its reset                                                         |
| `theme.test.js`           | 2       | Color tokens and fonts match `design/DESIGN_SYSTEM.md`                                   |
| **Total (16 suites)**     | **175** |                                                                                          |

## Sprint Review checklist

### Sprint 1 tasks (Table 32)

| Task  | Task description                                                                      | Backlog item   | Hours | Status                    | Evidence                                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------- | -------------- | ----- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| T1-01 | Design the registration, login, password-reset and home screens in Figma (Arabic RTL) | PB-01 to PB-04 | 12    | Done                      | First designed in Google Stitch, then redesigned as Yaqz v2 in Claude Design: `mobile-app/design/` (16 screens and `DESIGN_SYSTEM.md`)   |
| T1-02 | Design the user-profile table, roles and row-level security policies in Supabase      | PB-01, PB-04   | 10    | Done                      | `database/supabase/01`–`03`; tests 21, 22                                                                                                |
| T1-03 | Set up the GitHub repository, the Expo project and the Jest test environment          | All            | 8     | Done                      | Commits `105c888`, `ba52a77`; `jest.config.js`; 175 automated tests                                                                      |
| T1-04 | Implement registration with role selection and email verification                     | PB-01          | 16    | Done                      | Screens A2, A3; tests 5–7, 15, 16; `auth`, `validation`, `authScreens` suites                                                            |
| T1-05 | Implement login, logout and session handling                                          | PB-02          | 12    | Done                      | Screen A1, encrypted session storage; tests 1–4, 6, 11–14, 23a, 23b, 25; `auth`, `authContext` suites                                    |
| T1-06 | Implement password reset through an emailed link                                      | PB-03          | 10    | Done                      | Screens A4–A6; tests 8, 8b, 9, 26, 27; `deepLinks` suite                                                                                 |
| T1-07 | Implement role-based navigation and the basic patient and caregiver home screens      | PB-04          | 14    | Done                      | Route guards in `app/_layout.jsx`; patient and caregiver screens; tests 7, 10, 17–22; `routing`, `patientHome`, `caregiverAlerts` suites |
| T1-08 | Apply Arabic localization to all Sprint 1 screens                                     | PB-01 to PB-04 | 6     | Done                      | All text in `src/i18n/ar.js`; right-to-left layout forced in `app.json`                                                                  |
| T1-09 | Write the test cases and automated unit tests, and execute them                       | PB-01 to PB-04 | 14    | Done                      | Manual tests 1–27 (Runs 1–3); 175 automated tests                                                                                        |
| T1-10 | Fix the defects found in testing                                                      | PB-01 to PB-04 | 5     | Done                      | D1 investigated and closed (not a defect); no open defects                                                                               |
| T1-11 | Prepare the sprint review demonstration and the test report                           | PB-01 to PB-04 | 3     | Done (demo at the review) | This report; demonstration order below                                                                                                   |
| T1-12 | Implement physician registration, login and logout on the web dashboard (optional)    | PB-05          | 12    | Not done                  | Deferred to Sprint 6 (PB-05: "Sprint 1 (if time permits) or Sprint 6"); not included in the 110 planned hours                            |

Total planned effort: 110 hours (T1-01 to T1-11).

### Definition of Done

- [ ] Code committed through a pull request reviewed by another team member (pull request
      into `dev`, reviewed by the team).
- [x] Automated tests for the new code are written and pass (Jest, NFR-11): 175 tests.
- [x] Acceptance criteria of PB-01 to PB-04 satisfied: manual tests 1–27.
- [ ] Work demonstrated at the sprint review.
- [x] Documentation updated: `mobile-app/README.md` and this report. The project report will
      be updated later with the Yaqz v2 design.

### Demonstration order

Prepare the accounts before the review: a verified patient account and a verified caregiver
account linked to it. The built-in Supabase email service sends only a few emails per hour, so
no account is created during the review and the only email needed is the reset email in step 7.

1. Launcher: the app name يقظ and the icon; the splash screen.
2. A2: show the role chips, then press the create button with no role chosen to show the role
   error. Validation stops the form, so nothing is sent and no account is created.
3. A1: wrong password (generic banner), then login as the patient → B1.
4. B1 → B2 → B4 → B2 (wristband simulation); History B5 → event detail B7 → label an event;
   Patterns B6.
5. Close the app fully and reopen it: the patient home opens without login. Logout → A1.
6. Login as the caregiver → C2 with the real name of the linked patient. Logout → A1.
7. Password reset: A4 → A5 → email link opened on the emulator → A6 → new password → A1 with
   the success message → login with the new password.
