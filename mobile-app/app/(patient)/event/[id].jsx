// File: [id].jsx
// Purpose: Event detail (B7; FR-17, UC-10). Shows the date, start time and duration of a
// "probable seizure event" (never a diagnosis, NFR-07) and lets the patient label it as a
// confirmed seizure or a false alarm. The event is read from, and the label saved to, the
// seizure_event table (src/lib/events.js); it is still test data, labelled "بيانات تجريبية".
// States:
//   - loading:   first load and each retry
//   - not found: the id is not one of the patient's events
//   - error:     query failed → retry
//   - ready:     details and the two label chips (PATIENT_LABELS)
// Pressing a chip saves the label (UC-10 step 3); presses are ignored while a save is in
// progress. On success the chip and badge show the new label; on failure the previous label
// stays and an error banner is shown. History reloads on return, so the label shows there
// too (step 4). Leaving it unselected keeps "pending review" (2a); choosing the other chip
// changes it (2b). Back button only (approved: no logout on B7).

import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

import Banner from '../../../src/components/Banner';
import Button from '../../../src/components/Button';
import Card from '../../../src/components/Card';
import ChoiceChip from '../../../src/components/ChoiceChip';
import EmptyState from '../../../src/components/EmptyState';
import EventStatusBadge from '../../../src/components/EventStatusBadge';
import SampleDataBadge from '../../../src/components/SampleDataBadge';
import Screen from '../../../src/components/Screen';
import ScreenHeader from '../../../src/components/ScreenHeader';
import TwoToneTitle from '../../../src/components/TwoToneTitle';
import ar from '../../../src/i18n/ar';
import { getEvent, PATIENT_LABELS, updateEventLabel } from '../../../src/lib/events';
import { formatDate, formatDuration, formatTime } from '../../../src/lib/format';
import styles from '../../../src/styles/eventDetail.styles';
import { colors, sizes } from '../../../src/theme';

// Chip icon of each patient label
const LABEL_ICONS = { confirmed_seizure: 'check', false_alarm: 'x' };

// Result of getEvent → screen state
function toState(result) {
  if (result.ok) return { status: 'ready', event: result.data };
  if (result.kind === 'notFound') return { status: 'notFound' };
  return { status: 'error', kind: result.kind };
}

const errorMessage = (kind) => ar.messages[kind] ?? ar.messages.server;

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
  const eventId = String(id);
  const [state, setState] = useState({ status: 'loading' });
  const [saveErrorKind, setSaveErrorKind] = useState(null);
  const saving = useRef(false); // a ref, so two quick presses cannot both start a save
  const goBack = () => router.back();

  useEffect(() => {
    let active = true;
    getEvent(eventId).then((result) => {
      if (active) setState(toState(result));
    });
    return () => {
      active = false;
    };
  }, [eventId]);

  const retry = async () => {
    setState({ status: 'loading' });
    setState(toState(await getEvent(eventId)));
  };

  const chooseLabel = async (label) => {
    if (saving.current || label === state.event.label) return;
    saving.current = true;
    setSaveErrorKind(null);
    const result = await updateEventLabel(state.event.id, label);
    saving.current = false;
    if (result.ok) {
      setState((current) => ({
        ...current,
        event: { ...current.event, label: result.data.label },
      }));
    } else {
      setSaveErrorKind(result.kind); // the previous label stays
    }
  };

  if (state.status !== 'ready') {
    let content;
    if (state.status === 'loading') {
      content = (
        <View style={styles.notFound}>
          <ActivityIndicator color={colors.primary} accessibilityLabel={ar.common.loading} />
        </View>
      );
    } else if (state.status === 'notFound') {
      content = (
        <View style={styles.notFound}>
          <EmptyState
            icon="alert-circle"
            tone="error"
            title={ar.event.notFoundTitle}
            body={ar.event.notFoundBody}
          />
        </View>
      );
    } else {
      content = (
        <>
          <Banner variant="error" message={errorMessage(state.kind)} />
          <Button title={ar.common.retry} onPress={retry} />
        </>
      );
    }
    return (
      <Screen>
        <ScreenHeader onBack={goBack} />
        {content}
      </Screen>
    );
  }

  const { event } = state;

  const classify = (
    <>
      {saveErrorKind ? <Banner variant="error" message={errorMessage(saveErrorKind)} /> : null}
      <Text style={styles.classifyTitle}>{ar.event.classify}</Text>
      <View style={styles.chips} accessibilityRole="radiogroup">
        {PATIENT_LABELS.map((label) => (
          <ChoiceChip
            key={label}
            label={ar.eventLabels[label]}
            icon={LABEL_ICONS[label]}
            selected={event.label === label}
            onPress={() => {
              chooseLabel(label); // not returned: the press handler does not wait for the save
            }}
          />
        ))}
      </View>
    </>
  );

  return (
    <Screen footer={classify}>
      <ScreenHeader onBack={goBack} />
      <View style={styles.badges}>
        <EventStatusBadge label={event.label} />
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
