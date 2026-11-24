// File: validation.test.js
// Purpose: Unit tests of src/lib/validation.js — email format, password rule (8+ characters,
// a letter in any script and a digit), required fields, role, password confirmation.

import {
  isStrongPassword,
  isValidEmail,
  validateLogin,
  validateNewPassword,
  validateRegister,
  validateResetRequest,
} from '../src/lib/validation';

describe('isValidEmail', () => {
  test.each(['sara@example.com', ' sara@example.com ', 'a.b+c@uj.edu.sa'])(
    'accepts %p',
    (email) => {
      expect(isValidEmail(email)).toBe(true);
    },
  );

  test.each(['', 'sara', 'sara@', 'sara@example', 'sa ra@example.com', '@example.com', null])(
    'rejects %p',
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );
});

describe('isStrongPassword (UC-01 step 3, decision 2)', () => {
  test.each(['abcdefg1', 'Password123', 'كلمةسرية1', 'سرab12cd', 'abcdefg٣'])(
    'accepts %p (any letter + a digit, 8+ characters)',
    (password) => {
      expect(isStrongPassword(password)).toBe(true);
    },
  );

  test.each([
    ['abc1234', 'only 7 characters'],
    ['abcdefgh', 'no digit'],
    ['12345678', 'no letter'],
    ['!!!!@@@@1', 'no letter'],
    ['', 'empty'],
  ])('rejects %p (%s)', (password) => {
    expect(isStrongPassword(password)).toBe(false);
  });
});

describe('validateRegister (UC-01 3a)', () => {
  const valid = {
    fullName: 'سارة أحمد',
    email: 'sara@example.com',
    password: 'abcdefg1',
    role: 'patient',
  };

  test('returns no errors for valid input', () => {
    expect(validateRegister(valid)).toEqual({});
  });

  test('requires every field and a role', () => {
    expect(validateRegister({ fullName: ' ', email: '', password: '', role: null })).toEqual({
      fullName: 'required',
      email: 'required',
      password: 'required',
      role: 'roleRequired',
    });
  });

  test('reports an invalid email and a weak password', () => {
    expect(validateRegister({ ...valid, email: 'sara@', password: 'short1' })).toEqual({
      email: 'invalidEmail',
      password: 'weakPassword',
    });
  });

  test('rejects roles other than patient and caregiver', () => {
    expect(validateRegister({ ...valid, role: 'physician' })).toEqual({ role: 'roleRequired' });
  });
});

describe('validateLogin', () => {
  test('requires email and password but does not check password strength', () => {
    expect(validateLogin({ email: '', password: '' })).toEqual({
      email: 'required',
      password: 'required',
    });
    expect(validateLogin({ email: 'sara@example.com', password: 'x' })).toEqual({});
  });
});

describe('validateResetRequest', () => {
  test('validates the email format', () => {
    expect(validateResetRequest({ email: 'nope' })).toEqual({ email: 'invalidEmail' });
    expect(validateResetRequest({ email: 'sara@example.com' })).toEqual({});
  });
});

describe('validateNewPassword (UC-03 6a)', () => {
  test('accepts a strong matching password', () => {
    expect(validateNewPassword({ password: 'abcdefg1', confirmation: 'abcdefg1' })).toEqual({});
  });

  test('reports mismatch and weak passwords', () => {
    expect(validateNewPassword({ password: 'abcdefg1', confirmation: 'abcdefg2' })).toEqual({
      confirmation: 'passwordsMismatch',
    });
    expect(validateNewPassword({ password: 'weak', confirmation: 'weak' })).toEqual({
      password: 'weakPassword',
    });
  });

  test('requires the confirmation', () => {
    expect(validateNewPassword({ password: 'abcdefg1', confirmation: '' })).toEqual({
      confirmation: 'required',
    });
  });
});
