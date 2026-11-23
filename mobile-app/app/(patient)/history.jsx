// File: history.jsx
// Purpose: Patient History (B5 / B6; UC-09). PHASE D1 PLACEHOLDER: title and bottom
// navigation only, so that Home ↔ History navigation can be tested. The event list (B5),
// patterns (B6) and event detail (B7) are built in Phase D2.
// No logout button here (approved: B5/B6 follow the design; logout is one tap away on Home).

import PatientNavBar from '../../src/components/PatientNavBar';
import Screen from '../../src/components/Screen';
import TwoToneTitle from '../../src/components/TwoToneTitle';
import ar from '../../src/i18n/ar';
import styles from '../../src/styles/history.styles';

export default function HistoryScreen() {
  return (
    <Screen bottomBar={<PatientNavBar active="history" />}>
      <TwoToneTitle text={ar.history.title} style={styles.title} />
    </Screen>
  );
}
