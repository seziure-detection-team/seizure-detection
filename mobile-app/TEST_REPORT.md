# Sprint 1 – Test Report (draft)

Draft of the Sprint 1 test report. It is completed in Phase 5 (automated test results,
the Sprint Review checklist and the T1-11 cross-check are added then).

## Manual tests with real accounts (Phase 3)

Run by the team on the Android emulator (AVD `Medium_Phone_API_37.0`, local dev build)
against the team's Supabase project. Results are recorded as reported; no result is assumed.

| #   | Test                                                                          | Use case     | Result           | Notes                                                                                                                               |
| --- | ----------------------------------------------------------------------------- | ------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Patient login with a registered, verified account                             | UC-02        | PASS             | B1 placeholder opened ("الرئيسية" + logout button)                                                                                  |
| 2   | Session persists after the app is fully closed and reopened                   | UC-02        | PASS             | B1 opened directly, no login asked                                                                                                  |
| 3   | Logout                                                                        | UC-02        | PASS             | Returned to A1; after closing and reopening, A1 opened (not B1)                                                                     |
| 4   | Wrong password                                                                | UC-02 3a     | PASS             | Generic banner "البريد الإلكتروني أو كلمة المرور غير صحيحة."; no field singled out; email kept                                      |
| 8   | Password reset from the email link                                            | UC-03        | PASS (defect D1) | A4 → email link opened on the emulator → A6 → new password (no capital letters) → A1 with "تم تغيير كلمة المرور بنجاح..."           |
| 8b  | Login with the new password                                                   | UC-03        | PASS             | B1 opened                                                                                                                           |
| 9   | Reset link already used (opened first in a PC browser, then on the emulator)  | UC-03 5a     | PASS             | "انتهت صلاحية الرابط" shown; "طلب رابط جديد" opened A4                                                                              |
| –   | Caregiver: register, login before verification, login after verification → C2 | UC-01, UC-02 | NOT RUN          | To be run by the team. Needs a second organization-member email (Supabase limit: 2 emails/hour)                                     |
| –   | Open another role's route directly (`rasd://alerts` as a patient)             | UC-02        | NOT RUN          | To be run by the team (`adb shell am start -a android.intent.action.VIEW -d "rasd://alerts"`; expected: C2 does not open, B1 stays) |

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

### Test conditions

- Test accounts use email addresses that are members of the team's Supabase organization:
  the built-in Supabase email service only sends to organization members (limit 2 emails/hour).
- Reset links must be opened on the emulator itself: the PKCE code verifier is stored in the
  app, so a link opened in a PC browser cannot complete the reset (it shows a blank page and
  uses up the link).
