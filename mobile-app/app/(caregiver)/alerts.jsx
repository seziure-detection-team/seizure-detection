// File: alerts.jsx
// Purpose: Caregiver Alerts (FR-13, UC-08). The linked patient (src/lib/profile.js, RLS
// policy 03) and the alerts (src/lib/alerts.js, alert table) are read from the database; the
// alerts are still test data, labelled "بيانات تجريبية". The alerts are loaded only when a
// patient is linked. States:
//   - loading:     first load and each retry
//   - error:       a query failed or the patient's name is unreadable (1c, decision D3-a)
//                  → retry (loads the patient and the alerts again)
//   - C4:          no linked patient (1a)
//   - C3:          linked, no alerts (1b)
//   - C2:          linked, alerts newest first; the newest is highlighted
// The header with the logout button (UC-02) is shown in every state.
// C1 (push notification) is not part of Sprint 1.

import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import Banner from '../../src/components/Banner';
import Button from '../../src/components/Button';
import Card from '../../src/components/Card';
import EmptyState from '../../src/components/EmptyState';
import LogoutButton from '../../src/components/LogoutButton';
import SampleDataBadge from '../../src/components/SampleDataBadge';
import Screen from '../../src/components/Screen';
import ScreenHeader from '../../src/components/ScreenHeader';
import ar from '../../src/i18n/ar';
import { listMyAlerts } from '../../src/lib/alerts';
import { formatDate, formatDuration, formatTime } from '../../src/lib/format';
import { getLinkedPatient } from '../../src/lib/profile';
import styles from '../../src/styles/caregiverAlerts.styles';
import { colors, sizes } from '../../src/theme';

// The linked patient, then (only if linked) the alerts → screen state
async function loadState() {
  const linked = await getLinkedPatient();
  if (!linked.ok) return { status: 'error', kind: linked.kind };
  if (!linked.patient) return { status: 'ready', patient: null, alerts: [] };

  const alerts = await listMyAlerts();
  if (!alerts.ok) return { status: 'error', kind: alerts.kind };
  return { status: 'ready', patient: linked.patient, alerts: alerts.data };
}

// "المريض: سارة أحمد" with the first letter in a round avatar (C2 / C3)
function PatientChip({ name }) {
  return (
    <View style={styles.patientChip}>
      <View style={styles.avatar} importantForAccessibility="no-hide-descendants">
        <Text style={styles.avatarText}>{name.charAt(0)}</Text>
      </View>
      <Text style={styles.patientText}>{ar.caregiverAlerts.patient.replace('{name}', name)}</Text>
    </View>
  );
}

// One alert card; `newest` highlights the most recent alert (C2)
function AlertItem({ alert, newest }) {
  const date = formatDate(alert.startTime);
  const time = formatTime(alert.startTime);
  const duration = formatDuration(alert.durationSec);

  return (
    <Card
      style={[styles.item, newest && styles.itemNewest]}
      accessible
      accessibilityLabel={ar.caregiverAlerts.itemLabel
        .replace('{date}', date)
        .replace('{time}', time)
        .replace('{duration}', duration)}
    >
      <View style={[styles.itemChip, newest ? styles.itemChipNewest : styles.itemChipNormal]}>
        <Feather
          name="activity"
          size={sizes.iconLg}
          color={newest ? colors.peachDeep : colors.muted}
        />
      </View>
      <View style={styles.itemBody}>
        <Text style={styles.itemTitle}>{ar.caregiverAlerts.itemTitle}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.itemMetaText}>{date}</Text>
          <Text style={styles.itemMetaText}>{time}</Text>
          <View style={styles.itemDuration}>
            <Feather name="watch" size={sizes.iconSm} color={colors.muted} />
            <Text style={styles.itemMetaText}>{duration}</Text>
          </View>
        </View>
      </View>
    </Card>
  );
}

export default function CaregiverAlertsScreen() {
  const [state, setState] = useState({ status: 'loading' });

  useEffect(() => {
    let active = true;
    loadState().then((next) => {
      if (active) setState(next);
    });
    return () => {
      active = false;
    };
  }, []);

  const retry = async () => {
    setState({ status: 'loading' });
    setState(await loadState());
  };

  let content;
  if (state.status === 'loading') {
    content = (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} accessibilityLabel={ar.common.loading} />
      </View>
    );
  } else if (state.status === 'error') {
    content = (
      <>
        <Banner variant="error" message={ar.messages[state.kind] ?? ar.messages.server} />
        <Button title={ar.common.retry} onPress={retry} />
      </>
    );
  } else if (!state.patient) {
    content = (
      <View style={styles.center}>
        <EmptyState
          icon="user-plus"
          tone="peach"
          title={ar.caregiverAlerts.notLinkedTitle}
          body={ar.caregiverAlerts.notLinkedBody}
        />
      </View>
    );
  } else {
    const { alerts } = state;
    content = (
      <>
        <PatientChip name={state.patient.name} />
        {alerts.length === 0 ? (
          <View style={styles.center}>
            <EmptyState
              icon="bell"
              title={ar.caregiverAlerts.emptyTitle}
              body={ar.caregiverAlerts.emptyBody}
            />
          </View>
        ) : (
          <>
            <SampleDataBadge style={styles.sampleBadge} />
            <View style={styles.list}>
              {alerts.map((alert, index) => (
                <AlertItem key={alert.id} alert={alert} newest={index === 0} />
              ))}
            </View>
          </>
        )}
      </>
    );
  }

  return (
    <Screen>
      <ScreenHeader
        eyebrow={ar.caregiverAlerts.eyebrow}
        title={ar.caregiverAlerts.title}
        action={<LogoutButton />}
      />
      {content}
    </Screen>
  );
}
