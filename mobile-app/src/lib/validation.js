// File: validation.js
// Purpose: Pure input-validation functions for the auth forms (no UI, no network).
// Each validator returns an object { fieldName: errorKey }; an empty object means valid.
// Error keys map to Arabic messages in ar.errors.

// Simple, permissive email format check: something@something.tld (no spaces).
// The server remains the final authority on deliverability.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Password rule (UC-01 step 3, approved Phase 3 decision 2): at least 8 characters,
// with at least one letter in any script (Arabic or Latin) and at least one digit.
const MIN_PASSWORD_LENGTH = 8;
const LETTER_PATTERN = /\p{L}/u;
const DIGIT_PATTERN = /\p{Nd}/u;

export function isFilled(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

export function isValidEmail(value) {
  return isFilled(value) && EMAIL_PATTERN.test(value.trim());
}

export function isStrongPassword(value) {
  return (
    typeof value === 'string' &&
    Array.from(value).length >= MIN_PASSWORD_LENGTH &&
    LETTER_PATTERN.test(value) &&
    DIGIT_PATTERN.test(value)
  );
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0;
}

function emailError(email) {
  if (!isFilled(email)) return 'required';
  if (!isValidEmail(email)) return 'invalidEmail';
  return null;
}

function newPasswordError(password) {
  if (!isFilled(password)) return 'required';
  if (!isStrongPassword(password)) return 'weakPassword';
  return null;
}

// Collects non-null errors into an object
function collect(entries) {
  return Object.fromEntries(entries.filter(([, error]) => error));
}

// UC-01: Create Account (A2)
export function validateRegister({ fullName, email, password, role }) {
  return collect([
    ['fullName', isFilled(fullName) ? null : 'required'],
    ['email', emailError(email)],
    ['password', newPasswordError(password)],
    ['role', role === 'patient' || role === 'caregiver' ? null : 'roleRequired'],
  ]);
}

// UC-02: Login (A1). No strength check here: existing passwords are checked by the server.
export function validateLogin({ email, password }) {
  return collect([
    ['email', emailError(email)],
    ['password', isFilled(password) ? null : 'required'],
  ]);
}

// UC-03 step 3: Forgot Password (A4)
export function validateResetRequest({ email }) {
  return collect([['email', emailError(email)]]);
}

// UC-03 step 5–6a: New Password (A6)
export function validateNewPassword({ password, confirmation }) {
  let confirmationError = null;
  if (!isFilled(confirmation)) confirmationError = 'required';
  else if (confirmation !== password) confirmationError = 'passwordsMismatch';

  return collect([
    ['password', newPasswordError(password)],
    ['confirmation', confirmationError],
  ]);
}
