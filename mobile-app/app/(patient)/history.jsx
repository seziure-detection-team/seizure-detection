// File: history.jsx
// Purpose: Patient History (UC-09) with two tabs:
//   - السجل (B5, FR-14): events newest first with date, time, duration and label;
//     tapping an event opens its detail (B7)
//   - الأنماط (B6, FR-15): number of events per week for the last 6 weeks
// SAMPLE DATA in Sprint 1 (src/mocks/events.js), labelled "بيانات تجريبية". Labels changed
// on B7 show here through the in-memory label store (UC-10 step 4).
// No logout button here (approved: B5/B6 follow the design; logout is one tap away on Home).

import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import Card from '../../src/components/Card';
import EmptyState from '../../src/components/EmptyState';
import EventStatusBadge from '../../src/components/EventStatusBadge';
import PatientNavBar from '../../src/components/PatientNavBar';
import SampleDataBadge from '../../src/components/SampleDataBadge';
import Screen from '../../src/components/Screen';
import SegmentedTabs from '../../src/components/SegmentedTabs';
import TwoToneTitle from '../../src/components/TwoToneTitle';
import WeeklyBarChart from '../../src/components/WeeklyBarChart';
import ar from '../../src/i18n/ar';
import { formatDate, formatDuration, formatTime, formatWeekLabel } from '../../src/lib/format';
import { weeklyCounts } from '../../src/lib/patterns';
import { labelFor, useLabelOverrides } from '../../src/mocks/eventLabels';
import { getSampleEvents } from '../../src/mocks/events';
import styles from '../../src/styles/history.styles';
import { colors, sizes } from '../../src/theme';

const TABS = [
  { key: 'log', label: ar.history.tabLog },
  { key: 'patterns', label: ar.history.tabPatterns },
];

// One event card of the B5 list
function EventItem({ event, label, onPress }) {
  const date = formatDate(event.startTime);
  const time = formatTime(event.startTime);
  const duration = formatDuration(event.durationSec);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={ar.history.itemLabel
        .replace('{date}', date)
        .replace('{time}', time)
        .replace('{duration}', duration)
        .replace('{status}', ar.eventLabels[label])}
    >
      <Card style={styles.item}>
        <View style={styles.itemChip}>
          <Feather name="activity" size={sizes.iconLg} color={colors.text} />
        </View>
        <View style={styles.itemBody}>
          <Text style={styles.itemDate}>{date}</Text>
          <View style={styles.itemMeta}>
            <Text style={styles.itemMetaText}>{time}</Text>
            <View style={styles.itemDuration}>
              <Feather name="watch" size={sizes.iconSm} color={colors.muted} />
              <Text style={styles.itemMetaText}>{duration}</Text>
            </View>
          </View>
          <EventStatusBadge label={label} style={styles.itemBadge} />
        </View>
        {/* Forward arrow: points left in RTL */}
        <Feather name="chevron-left" size={sizes.iconMd} color={colors.muted} />
      </Card>
    </Pressable>
  );
}

export default function HistoryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('log');
  const overrides = useLabelOverrides();
  const events = getSampleEvents();

  const weeks = weeklyCounts(events);
  const chartData = weeks.map((week, index) => ({
    key: String(week.weekStart.getTime()),
    label: formatWeekLabel(week.weekStart),
    count: week.count,
    highlight: index === weeks.length - 1, // newest week
  }));

  const openEvent = (id) => router.push({ pathname: '/event/[id]', params: { id } });

  let content;
  if (events.length === 0) {
    // UC-09 1a: no events recorded
    content = (
      <View style={styles.empty}>
        <EmptyState icon="activity" title={ar.history.emptyTitle} body={ar.history.emptyBody} />
      </View>
    );
  } else if (tab === 'log') {
    content = (
      <View style={styles.list}>
        {events.map((event) => (
          <EventItem
            key={event.id}
            event={event}
            label={labelFor(overrides, event)}
            onPress={() => openEvent(event.id)}
          />
        ))}
      </View>
    );
  } else {
    content = (
      <Card style={styles.chartCard}>
        <Text style={styles.chartTitle}>{ar.history.chartTitle}</Text>
        <Text style={styles.chartSubtitle}>{ar.history.chartSubtitle}</Text>
        <WeeklyBarChart data={chartData} />
      </Card>
    );
  }

  return (
    <Screen bottomBar={<PatientNavBar active="history" />}>
      <TwoToneTitle text={ar.history.title} style={styles.title} />
      <SampleDataBadge style={styles.sampleBadge} />
      <SegmentedTabs items={TABS} activeKey={tab} onSelect={setTab} style={styles.tabs} />
      {content}
    </Screen>
  );
}
