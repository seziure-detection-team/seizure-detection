// File: EventStatusBadge.jsx
// Purpose: Status badge of a seizure event (B5, B7): the label text with its tone.
//   pending_review → warning ("بانتظار المراجعة"), confirmed_seizure → primary ("نوبة مؤكدة"),
//   false_alarm → neutral ("إنذار خاطئ")

import ar from '../i18n/ar';
import Badge from './Badge';

const TONES = {
  pending_review: 'warning',
  confirmed_seizure: 'primary',
  false_alarm: 'neutral',
};

export default function EventStatusBadge({ label, style }) {
  return (
    <Badge
      label={ar.eventLabels[label] ?? ar.eventLabels.pending_review}
      tone={TONES[label] ?? TONES.pending_review}
      style={style}
    />
  );
}
