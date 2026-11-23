// File: [id].jsx
// Purpose: Event detail (B7; FR-17, UC-10). Shows the date, start time and duration of a
// "probable seizure event" (never a diagnosis, NFR-07) and lets the patient label it as a
// confirmed seizure or a false alarm. SAMPLE DATA in Sprint 1, labelled "بيانات تجريبية":
// the label is kept in the in-memory label store only (NOT SAVED to Supabase); it shows on
// History at once (UC-10 step 4). Leaving it unselected keeps "pending review" (2a); choosing
// the other chip changes it (2b). Back button only (approved: no logout on B7).

import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import Card from '../../../src/components/Card';
import ChoiceChip from '../../../src/components/ChoiceChip';
import EmptyState from '../../../src/components/EmptyState';
import EventStatusBadge from '../../../src/components/EventStatusBadge';
import SampleDataBadge from '../../../src/components/SampleDataBadge';
import Screen from '../../../src/components/Screen';
import ScreenHeader from '../../../src/components/ScreenHeader';
import TwoToneTitle from '../../../src/components/TwoToneTitle';
import ar from '../../../src/i18n/ar';
import { formatDate, formatDuration, formatTime } from '../../../src/lib/format';
import { labelFor, setLabel, useLabelOverrides } from '../../../src/mocks/eventLabels';
import { getSampleEvent } from '../../../src/mocks/events';
import styles from '../../../src/styles/eventDetail.styles';
import { colors, sizes } from '../../../src/theme';

// One row of the details card: icon + name at the start, value at the end
function DetailRow({ icon, name, value }) {
  return (
    <View style={styles.row}>
      <Feather name={icon} size={sizes.iconMd} color={colors.primary} />
      <Text style={styles.rowName}>{name}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const overrides = useLabelOverrides();
  const event = getSampleEvent(String(id));
  const goBack = () => router.back();

  if (!event) {
    return (
      <Screen>
        <ScreenHeader onBack={goBack} />
        <View style={styles.notFound}>
          <EmptyState
            icon="alert-circle"
            tone="error"
            title={ar.event.notFoundTitle}
            body={ar.event.notFoundBody}
          />
        </View>
      </Screen>
    );
  }

  const label = labelFor(overrides, event);

  const classify = (
    <>
      <Text style={styles.classifyTitle}>{ar.event.classify}</Text>
      <View style={styles.chips} accessibilityRole="radiogroup">
        <ChoiceChip
          label={ar.eventLabels.confirmed_seizure}
          icon="check"
          selected={label === 'confirmed_seizure'}
          onPress={() => setLabel(event.id, 'confirmed_seizure')}
        />
        <ChoiceChip
          label={ar.eventLabels.false_alarm}
          icon="x"
          selected={label === 'false_alarm'}
          onPress={() => setLabel(event.id, 'false_alarm')}
        />
      </View>
    </>
  );

  return (
    <Screen footer={classify}>
      <ScreenHeader onBack={goBack} />
      <View style={styles.badges}>
        <EventStatusBadge label={label} />
        <SampleDataBadge />
      </View>
      <TwoToneTitle text={ar.event.title} mutedWords={2} style={styles.title} />

      <Card style={styles.details}>
        <DetailRow icon="calendar" name={ar.event.date} value={formatDate(event.startTime)} />
        <View style={styles.divider} />
        <DetailRow icon="clock" name={ar.event.startTime} value={formatTime(event.startTime)} />
        <View style={styles.divider} />
        <DetailRow
          icon="watch"
          name={ar.event.duration}
          value={formatDuration(event.durationSec)}
        />
      </Card>
    </Screen>
  );
}
