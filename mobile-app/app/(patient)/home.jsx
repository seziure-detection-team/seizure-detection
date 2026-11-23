// File: home.jsx
// Purpose: Patient Home (B1 / B2 / B4; FR-05, UC-04).
//   - B1 "not connected": the real state in Sprint 1 (no BLE yet)
//   - "ربط السوار" → B2 "monitoring active": SIMULATION (no device), labelled "محاكاة"
//   - tapping the wristband card on B2 → B4 "connection lost": SIMULATION, warning + reconnect
//   - "إعادة الاتصال" on B4 → B2
// The greeting uses the patient's real name (session metadata, src/lib/profile.js).
// The logout button (UC-02) is in the header. The wristband state is local: this screen
// stays at the bottom of the patient stack, so it survives a visit to History and is
// cleared on logout, when the route guard removes the screen. On that unmount the sample
// event labels set on B7 are cleared too (approved decision D-g).

import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import Badge from '../../src/components/Badge';
import Banner from '../../src/components/Banner';
import Button from '../../src/components/Button';
import Card from '../../src/components/Card';
import LogoutButton from '../../src/components/LogoutButton';
import PatientNavBar from '../../src/components/PatientNavBar';
import SampleDataBadge from '../../src/components/SampleDataBadge';
import Screen from '../../src/components/Screen';
import ScreenHeader from '../../src/components/ScreenHeader';
import WristbandHero from '../../src/components/WristbandHero';
import ar from '../../src/i18n/ar';
import { firstName, getOwnFullName } from '../../src/lib/profile';
import { resetEventLabels } from '../../src/mocks/eventLabels';
import styles from '../../src/styles/patientHome.styles';
import { colors } from '../../src/theme';

const wristbandIcon = require('../../assets/images/logo.png');

// Simulated connection time for "ربط السوار" (no real device in Sprint 1)
const SIMULATED_CONNECT_MS = 1000;

// Badge and icon of the wristband card for each state
const CARD = {
  disconnected: { label: ar.patientHome.statusDisconnected, tone: 'neutral', tint: colors.neutral },
  connected: { label: ar.patientHome.statusConnected, tone: 'success', tint: colors.primary },
  lost: { label: ar.patientHome.statusLost, tone: 'warning', tint: colors.neutral },
};

export default function PatientHomeScreen() {
  const [name, setName] = useState(null);
  const [wristband, setWristband] = useState('disconnected');
  const [connecting, setConnecting] = useState(false);
  const connectTimer = useRef(null);

  // Greeting name; on failure the greeting is shown without a name (not critical)
  useEffect(() => {
    let active = true;
    getOwnFullName().then((result) => {
      if (active && result.ok) setName(firstName(result.name));
    });
    return () => {
      active = false;
    };
  }, []);

  // On unmount (logout): stop a pending simulated connect, clear the sample labels (D-g)
  useEffect(
    () => () => {
      clearTimeout(connectTimer.current);
      resetEventLabels();
    },
    [],
  );

  const simulateConnect = () => {
    setConnecting(true);
    connectTimer.current = setTimeout(() => {
      setConnecting(false);
      setWristband('connected');
    }, SIMULATED_CONNECT_MS);
  };

  const greeting = name
    ? ar.patientHome.greeting.replace('{name}', name)
    : ar.patientHome.greetingNoName;
  const simulated = wristband !== 'disconnected';
  const card = CARD[wristband];

  const wristbandCard = (
    <Card style={styles.card}>
      <View style={styles.cardRow}>
        <View style={[styles.cardChip, wristband === 'connected' && styles.cardChipActive]}>
          <Image source={wristbandIcon} style={[styles.cardIcon, { tintColor: card.tint }]} />
        </View>
        <Text style={styles.cardTitle}>{ar.patientHome.wristband}</Text>
        <Badge label={card.label} tone={card.tone} style={styles.cardBadge} />
      </View>
    </Card>
  );

  const footer = (
    <>
      {wristband === 'connected' ? (
        // Simulation of a lost connection (B4) for the demo
        <Pressable
          onPress={() => setWristband('lost')}
          accessibilityRole="button"
          accessibilityLabel={ar.patientHome.wristbandStatus.replace('{status}', card.label)}
          accessibilityHint={ar.patientHome.simulateLossHint}
        >
          {wristbandCard}
        </Pressable>
      ) : (
        wristbandCard
      )}
      {wristband === 'disconnected' ? (
        <Button
          title={ar.patientHome.connect}
          icon="bluetooth"
          onPress={simulateConnect}
          loading={connecting}
          style={styles.action}
        />
      ) : null}
      {wristband === 'lost' ? (
        <Button
          title={ar.patientHome.reconnect}
          icon="refresh-cw"
          onPress={() => setWristband('connected')}
          style={styles.action}
        />
      ) : null}
    </>
  );

  return (
    <Screen footer={footer} bottomBar={<PatientNavBar active="home" />}>
      <ScreenHeader eyebrow={ar.patientHome.eyebrow} title={greeting} action={<LogoutButton />} />
      {simulated ? <SampleDataBadge kind="simulation" style={styles.sampleBadge} /> : null}
      {wristband === 'lost' ? (
        <Banner
          variant="warning"
          icon="link-2"
          title={ar.patientHome.lostTitle}
          message={ar.patientHome.lostBody}
        />
      ) : null}

      <View style={styles.hero}>
        <WristbandHero state={wristband} />
        {wristband === 'connected' ? (
          <Badge
            label={ar.patientHome.monitoringActive}
            tone="success"
            style={styles.monitoringBadge}
          />
        ) : null}
      </View>
    </Screen>
  );
}
