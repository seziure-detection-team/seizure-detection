// File: events.test.js
// Purpose: Unit tests of src/lib/events.js with a mocked Supabase client: mapping of database
// rows to the app shape, the patient_id filter, label-only updates limited to the UC-10
// labels, not-found results, and error mapping (network, timeout, server).

import { getEvent, listMyEvents, updateEventLabel } from '../src/lib/events';
import { supabase } from '../src/lib/supabase';

jest.mock('../src/lib/supabase', () => ({
  supabase: { auth: { getSession: jest.fn() }, from: jest.fn() },
}));

const USER_ID = 'u1';
const EVENT_ID = '0f8fad5b-d9cb-469f-a165-70867728950e';
const ROW = {
  event_id: EVENT_ID,
  start_time: '2026-11-22T02:14:00+03:00',
  duration_sec: 72,
  label: 'pending_review',
  confidence: 0.82,
};
const EVENT = {
  id: EVENT_ID,
  startTime: new Date('2026-11-21T23:14:00Z'),
  durationSec: 72,
  label: 'pending_review',
  confidence: 0.82,
};

const NETWORK_ERROR = { message: 'Network request failed' };
const SERVER_ERROR = { code: '42501', message: 'permission denied' };
const NEVER = new Promise(() => {});

// Chainable query builder: select/eq/order/update return the builder; awaiting the builder
// or calling maybeSingle() resolves to `result` (or never, for the timeout test)
const mockQuery = (result) => {
  const pending = result === NEVER ? NEVER : Promise.resolve(result);
  const builder = {};
  ['select', 'eq', 'order', 'update'].forEach((method) => {
    builder[method] = jest.fn(() => builder);
  });
  builder.maybeSingle = jest.fn(() => pending);
  builder.then = (resolve, reject) => pending.then(resolve, reject);
  supabase.from.mockReturnValue(builder);
  return builder;
};

beforeEach(() => {
  jest.clearAllMocks();
  supabase.auth.getSession.mockResolvedValue({
    data: { session: { user: { id: USER_ID } } },
    error: null,
  });
});

afterEach(() => {
  jest.useRealTimers();
});

describe('listMyEvents (FR-14, UC-09)', () => {
  test('reads only the patient own events, newest first, in the app shape', async () => {
    const query = mockQuery({ data: [ROW], error: null });
    const result = await listMyEvents();

    expect(result).toEqual({ ok: true, data: [EVENT] });
    expect(result.data[0].startTime).toBeInstanceOf(Date);
    expect(supabase.from).toHaveBeenCalledWith('seizure_event');
    expect(query.select).toHaveBeenCalledWith(
      'event_id, start_time, duration_sec, label, confidence',
    );
    expect(query.eq).toHaveBeenCalledWith('patient_id', USER_ID);
    expect(query.order).toHaveBeenCalledWith('start_time', { ascending: false });
  });

  test('no events is an empty list', async () => {
    mockQuery({ data: [], error: null });
    await expect(listMyEvents()).resolves.toEqual({ ok: true, data: [] });
  });

  test.each([
    ['network', NETWORK_ERROR],
    ['server', SERVER_ERROR],
  ])('maps a failed query to "%s"', async (kind, error) => {
    mockQuery({ data: null, error });
    await expect(listMyEvents()).resolves.toEqual({ ok: false, kind });
  });

  test('a thrown error while offline is "network"', async () => {
    supabase.auth.getSession.mockRejectedValue(new Error('Network request failed'));
    await expect(listMyEvents()).resolves.toEqual({ ok: false, kind: 'network' });
    expect(supabase.from).not.toHaveBeenCalled();
  });

  test('a query that does not answer within 15 s is "network"', async () => {
    jest.useFakeTimers();
    mockQuery(NEVER);
    const pending = listMyEvents();
    await jest.advanceTimersByTimeAsync(15000);
    await expect(pending).resolves.toEqual({ ok: false, kind: 'network' });
  });

  test('no session is an error, without a query', async () => {
    supabase.auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
    await expect(listMyEvents()).resolves.toEqual({ ok: false, kind: 'server' });
    expect(supabase.from).not.toHaveBeenCalled();
  });
});

describe('getEvent (B7)', () => {
  test('returns one of the patient own events in the app shape', async () => {
    const query = mockQuery({ data: ROW, error: null });
    await expect(getEvent(EVENT_ID)).resolves.toEqual({ ok: true, data: EVENT });
    expect(query.eq).toHaveBeenCalledWith('event_id', EVENT_ID);
    expect(query.eq).toHaveBeenCalledWith('patient_id', USER_ID);
  });

  test('an unknown or foreign event is "notFound"', async () => {
    mockQuery({ data: null, error: null });
    await expect(getEvent(EVENT_ID)).resolves.toEqual({ ok: false, kind: 'notFound' });
  });

  test.each(['e1', '', undefined])(
    'an id that is not a UUID (%p) is "notFound" without a call',
    async (id) => {
      await expect(getEvent(id)).resolves.toEqual({ ok: false, kind: 'notFound' });
      expect(supabase.auth.getSession).not.toHaveBeenCalled();
      expect(supabase.from).not.toHaveBeenCalled();
    },
  );

  test('maps a failed query to "server"', async () => {
    mockQuery({ data: null, error: SERVER_ERROR });
    await expect(getEvent(EVENT_ID)).resolves.toEqual({ ok: false, kind: 'server' });
  });
});

describe('updateEventLabel (FR-17, UC-10)', () => {
  test.each(['confirmed_seizure', 'false_alarm'])(
    'sends only the label "%s" for the patient own event',
    async (label) => {
      const query = mockQuery({ data: { event_id: EVENT_ID, label }, error: null });
      await expect(updateEventLabel(EVENT_ID, label)).resolves.toEqual({
        ok: true,
        data: { id: EVENT_ID, label },
      });
      expect(supabase.from).toHaveBeenCalledWith('seizure_event');
      expect(query.update).toHaveBeenCalledWith({ label });
      expect(query.eq).toHaveBeenCalledWith('event_id', EVENT_ID);
      expect(query.eq).toHaveBeenCalledWith('patient_id', USER_ID);
    },
  );

  test.each(['pending_review', 'confirmed', '', null, undefined])(
    'rejects the label %p as "invalidLabel" without calling Supabase',
    async (label) => {
      await expect(updateEventLabel(EVENT_ID, label)).resolves.toEqual({
        ok: false,
        kind: 'invalidLabel',
      });
      expect(supabase.auth.getSession).not.toHaveBeenCalled();
      expect(supabase.from).not.toHaveBeenCalled();
    },
  );

  test('an id that is not a UUID is "notFound" without a call', async () => {
    await expect(updateEventLabel('e1', 'false_alarm')).resolves.toEqual({
      ok: false,
      kind: 'notFound',
    });
    expect(supabase.from).not.toHaveBeenCalled();
  });

  test('no row updated (unknown or foreign event) is "notFound"', async () => {
    mockQuery({ data: null, error: null });
    await expect(updateEventLabel(EVENT_ID, 'false_alarm')).resolves.toEqual({
      ok: false,
      kind: 'notFound',
    });
  });

  test.each([
    ['network', NETWORK_ERROR],
    ['server', SERVER_ERROR],
  ])('maps a failed update to "%s"', async (kind, error) => {
    mockQuery({ data: null, error });
    await expect(updateEventLabel(EVENT_ID, 'false_alarm')).resolves.toEqual({ ok: false, kind });
  });
});
