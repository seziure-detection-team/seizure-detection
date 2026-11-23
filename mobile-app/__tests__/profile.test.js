// File: profile.test.js
// Purpose: Unit tests of src/lib/profile.js with a mocked Supabase client: the name comes
// from the session metadata first, the profile row only as a fallback; error mapping.

import { firstName, getOwnFullName } from '../src/lib/profile';
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
