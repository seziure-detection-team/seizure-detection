// File: SampleDataBadge.jsx
// Purpose: Label shown on every screen that displays sample data (Sprint 1 data rules):
// kind "sample" → "بيانات تجريبية" (events, alerts, chart), kind "simulation" → "محاكاة"
// (wristband connect / disconnect). Peach tone, kept apart from the status colours.

import ar from '../i18n/ar';
import Badge from './Badge';

export default function SampleDataBadge({ kind = 'sample', style }) {
  const label = kind === 'simulation' ? ar.sampleData.simulation : ar.sampleData.sample;
  return <Badge label={label} tone="sample" style={style} />;
}
