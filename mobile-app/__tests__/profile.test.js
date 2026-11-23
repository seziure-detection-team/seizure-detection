// File: profile.test.js
// Purpose: Unit tests of src/lib/profile.js with a mocked Supabase client: the name comes
// from the session metadata first, the profile row only as a fallback; the caregiver's
// linked patient (UC-08); error mapping.

import { firstName, getLinkedPatient, getOwnFullName } from '../src/lib/profile';
import { supabase } from '../src/lib/supabase';

jest.mock('../src/lib/supabase', () => ({
  supabase: { auth: { getSession: jest.fn() }, from: jest.fn() },
}));

const sessionWith = (user) => ({ data: { session: user ? { user } : null }, error: null });

// profile query chain: from('profile').select(...).eq(...).maybeSingle()
const mockProfileQuery = (result) => {
  const maybeSingle = jest.fn().mockResolvedValue(result);
  const eq = jest.fn(() => ({ maybeSingle }));
  const select = jest.fn(() => ({ eq }));
  supabase.from.mockReturnValue({ select });
  return { select, eq };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('getOwnFullName', () => {
  test('reads the name from the session metadata without a database query', async () => {
    supabase.auth.getSession.mockResolvedValue(
      sessionWith({ id: 'u1', user_metadata: { full_name: '  سارة أحمد ' } }),
    );
    await expect(getOwnFullName()).resolves.toEqual({ ok: true, name: 'سارة أحمد' });
    expect(supabase.from).not.toHaveBeenCalled();
  });

  test('falls back to the own profile row when the metadata has no name', async () => {
    supabase.auth.getSession.mockResolvedValue(sessionWith({ id: 'u1', user_metadata: {} }));
    const query = mockProfileQuery({ data: { full_name: 'سارة أحمد' }, error: null });
    await expect(getOwnFullName()).resolves.toEqual({ ok: true, name: 'سارة أحمد' });
    expect(supabase.from).toHaveBeenCalledWith('profile');
    expect(query.select).toHaveBeenCalledWith('full_name');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'u1');
  });

  test('returns no name (and no query) when there is no session', async () => {
    supabase.auth.getSession.mockResolvedValue(sessionWith(null));
    await expect(getOwnFullName()).resolves.toEqual({ ok: true, name: null });
    expect(supabase.from).not.toHaveBeenCalled();
  });

  test.each([
    ['network', { message: 'Network request failed' }],
    ['server', { code: '42501', message: 'permission denied' }],
  ])('maps a failed profile query to "%s"', async (kind, error) => {
    supabase.auth.getSession.mockResolvedValue(sessionWith({ id: 'u1', user_metadata: {} }));
    mockProfileQuery({ data: null, error });
    await expect(getOwnFullName()).resolves.toEqual({ ok: false, kind });
  });

  test('a thrown error while offline is reported as "network"', async () => {
    supabase.auth.getSession.mockRejectedValue(new Error('Network request failed'));
    await expect(getOwnFullName()).resolves.toEqual({ ok: false, kind: 'network' });
  });
});

describe('firstName', () => {
  test('returns the first word, or null without a name', () => {
    expect(firstName('سارة أحمد')).toBe('سارة');
    expect(firstName('   ')).toBeNull();
    expect(firstName(null)).toBeNull();
  });
});

describe('getLinkedPatient (UC-08)', () => {
  // from(table).select(...).eq(...).maybeSingle() → results[table]; records calls per table
  const mockTables = (results) => {
    const calls = {};
    supabase.from.mockImplementation((table) => {
      const eq = jest.fn(() => ({ maybeSingle: jest.fn().mockResolvedValue(results[table]) }));
      const select = jest.fn(() => ({ eq }));
      calls[table] = { select, eq };
      return { select };
    });
    return calls;
  };

  beforeEach(() => {
    supabase.auth.getSession.mockResolvedValue(sessionWith({ id: 'c1', user_metadata: {} }));
  });

  test('linked: reads the patient row, then the patient name (policy 03)', async () => {
    const calls = mockTables({
      patient: { data: { patient_id: 'p1' }, error: null },
      profile: { data: { full_name: 'سارة أحمد' }, error: null },
    });
    await expect(getLinkedPatient()).resolves.toEqual({
      ok: true,
      patient: { name: 'سارة أحمد' },
    });
    expect(calls.patient.select).toHaveBeenCalledWith('patient_id');
    expect(calls.patient.eq).toHaveBeenCalledWith('caregiver_id', 'c1');
    expect(calls.profile.select).toHaveBeenCalledWith('full_name');
    expect(calls.profile.eq).toHaveBeenCalledWith('user_id', 'p1');
  });

  test('no linked patient: patient is null and the profile is not queried (C4, 1a)', async () => {
    mockTables({ patient: { data: null, error: null } });
    await expect(getLinkedPatient()).resolves.toEqual({ ok: true, patient: null });
    expect(supabase.from).toHaveBeenCalledTimes(1);
  });

  test('linked but the name is unreadable (e.g. policy 03 missing) is an error (D3-a)', async () => {
    mockTables({
      patient: { data: { patient_id: 'p1' }, error: null },
      profile: { data: null, error: null },
    });
    await expect(getLinkedPatient()).resolves.toEqual({ ok: false, kind: 'server' });
  });

  test.each([
    ['network', { message: 'Network request failed' }],
    ['server', { code: '42501', message: 'permission denied' }],
  ])('maps a failed patient query to "%s" (1c)', async (kind, error) => {
    mockTables({ patient: { data: null, error } });
    await expect(getLinkedPatient()).resolves.toEqual({ ok: false, kind });
  });

  test('no session is an error, without any query', async () => {
    supabase.auth.getSession.mockResolvedValue(sessionWith(null));
    await expect(getLinkedPatient()).resolves.toEqual({ ok: false, kind: 'server' });
    expect(supabase.from).not.toHaveBeenCalled();
  });
});
