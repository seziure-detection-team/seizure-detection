// File: eventLabels.test.js
// Purpose: Unit tests of the in-memory label store (src/mocks/eventLabels.js; FR-17, UC-10):
// sample label by default, setLabel + subscribers, reset on logout (decision D-g).

import { getLabel, resetEventLabels, setLabel, subscribe } from '../src/mocks/eventLabels';

const event = { id: 'e1', label: 'pending_review' };

afterEach(() => {
  resetEventLabels();
});

test('starts from the sample label; setLabel changes it and notifies subscribers', () => {
  const listener = jest.fn();
  const unsubscribe = subscribe(listener);
  expect(getLabel(event)).toBe('pending_review');

  setLabel('e1', 'confirmed_seizure');
  expect(getLabel(event)).toBe('confirmed_seizure');
  expect(listener).toHaveBeenCalledTimes(1);

  unsubscribe();
  setLabel('e1', 'false_alarm');
  expect(listener).toHaveBeenCalledTimes(1);
});

test('resetEventLabels restores the sample labels', () => {
  setLabel('e1', 'false_alarm');
  resetEventLabels();
  expect(getLabel(event)).toBe('pending_review');
});
