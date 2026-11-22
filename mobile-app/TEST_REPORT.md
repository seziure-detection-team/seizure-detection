# Sprint 1 – Test Report (draft)

Draft of the Sprint 1 test report. It is completed in Phase 5 (automated test results,
the Sprint Review checklist and the T1-11 cross-check are added then).

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
