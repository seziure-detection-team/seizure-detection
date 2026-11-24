// File: patterns.js
// Purpose: Seizure patterns for the Patterns tab (B6, FR-15): number of events per week.
// Pure functions, so the same code works for the sample data now and real events later.
// Weeks run Monday–Sunday (the B6 week labels are Mondays). The last week is the week of the
// newest event, so the chart does not depend on today's date.

// Local midnight of the Monday of the date's week
export function startOfWeek(date) {
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const daysSinceMonday = (day.getDay() + 6) % 7; // getDay(): 0 = Sunday
  day.setDate(day.getDate() - daysSinceMonday);
  return day;
}

/**
 * Events per week for the last `weeks` weeks, oldest first: [{ weekStart, count }].
 * `events` items need a `startTime` Date. No events → [].
 */
export function weeklyCounts(events, weeks = 6) {
  if (!events.length) return [];

  const newest = events.reduce(
    (latest, event) => (event.startTime > latest ? event.startTime : latest),
    events[0].startTime,
  );
  const lastWeek = startOfWeek(newest);

  const result = [];
  for (let back = weeks - 1; back >= 0; back -= 1) {
    const weekStart = new Date(lastWeek);
    weekStart.setDate(weekStart.getDate() - 7 * back); // setDate keeps local midnight (DST-safe)
    result.push({ weekStart, count: 0 });
  }

  events.forEach((event) => {
    const week = startOfWeek(event.startTime).getTime();
    const bucket = result.find((item) => item.weekStart.getTime() === week);
    if (bucket) bucket.count += 1;
  });

  return result;
}
