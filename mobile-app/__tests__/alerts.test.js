// File: alerts.test.js
// Purpose: Unit tests of src/lib/alerts.js with a mocked Supabase client: mapping of alert
// rows (with their embedded event and its label) to the app shape, newest event first, the
// unreadable-event case (D3-a), and error mapping (network, timeout, server).

import { listMyAlerts } from '../src/lib/alerts';
import { supabase } from '../src/lib/supabase';

jest.mock('../src/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}));

const NEVER = new Promise(() => {});

// from('alert').select(...) is awaited directly; it resolves to `result` (or never)
const mockQuery = (result) => {
  const pending = result === NEVER ? NEVER : Promise.resolve(result);
  const select = jest.fn(() => ({ then: (resolve, reject) => pending.then(resolve, reject) }));
  supabase.from.mockReturnValue({ select });
  return { select };
};

const alertRow = (alertId, eventId, startTime, durationSec, label) => ({
  alert_id: alertId,
  event_id: eventId,
  seizure_event: { start_time: startTime, duration_sec: durationSec, label },
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.useRealTimers();
});

test('maps alerts with their event to the app shape, newest event first (FR-13)', async () => {
  const query = mockQuery({
    data: [
      alertRow('a2', 'ev2', '2026-11-19T23:40:00+03:00', 48, 'confirmed_seizure'),
      alertRow('a1', 'ev1', '2026-11-22T02:14:00+03:00', 72, 'pending_review'),
    ],
    error: null,
  });

  const result = await listMyAlerts();

  expect(supabase.from).toHaveBeenCalledWith('alert');
  expect(query.select).toHaveBeenCalledWith(
    'alert_id, event_id, seizure_event(start_time, duration_sec, label)',
  );
  expect(result).toEqual({
    ok: true,
    data: [
      {
        id: 'a1',
        eventId: 'ev1',
        startTime: new Date('2026-11-21T23:14:00Z'),
        durationSec: 72,
        label: 'pending_review',
      },
      {
        id: 'a2',
        eventId: 'ev2',
        startTime: new Date('2026-11-19T20:40:00Z'),
        durationSec: 48,
        label: 'confirmed_seizure',
      },
    ],
  });
  expect(result.data[0].startTime).toBeInstanceOf(Date);
});

test('no alerts is an empty list (C3, UC-08 1b)', async () => {
  mockQuery({ data: [], error: null });
  await expect(listMyAlerts()).resolves.toEqual({ ok: true, data: [] });
});

test('an alert whose event cannot be read is "server" (D3-a)', async () => {
  mockQuery({
    data: [
      alertRow('a1', 'ev1', '2026-11-22T02:14:00+03:00', 72, 'pending_review'),
      { alert_id: 'a2', event_id: 'ev2', seizure_event: null },
    ],
    error: null,
  });
  await expect(listMyAlerts()).resolves.toEqual({ ok: false, kind: 'server' });
});

test.each([
  ['network', { message: 'Network request failed' }],
  ['server', { code: '42501', message: 'permission denied' }],
])('maps a failed query to "%s" (UC-08 1c)', async (kind, error) => {
  mockQuery({ data: null, error });
  await expect(listMyAlerts()).resolves.toEqual({ ok: false, kind });
});

test('a thrown error while offline is "network"', async () => {
  supabase.from.mockImplementation(() => {
    throw new Error('Network request failed');
  });
  await expect(listMyAlerts()).resolves.toEqual({ ok: false, kind: 'network' });
});

test('a query that does not answer within 15 s is "network"', async () => {
  jest.useFakeTimers();
  mockQuery(NEVER);
  const pending = listMyAlerts();
  await jest.advanceTimersByTimeAsync(15000);
  await expect(pending).resolves.toEqual({ ok: false, kind: 'network' });
});
