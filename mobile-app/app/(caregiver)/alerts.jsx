// File: alerts.jsx
// Purpose: Caregiver Alerts (C2/C3). PHASE 3 PLACEHOLDER: title and logout only, so that
// role-based routing and logout (UC-02) can be tested. The C2/C3 design is built in Phase 4.

import { useState } from 'react';
import { Text } from 'react-native';

import Button from '../../src/components/Button';
import Screen from '../../src/components/Screen';
import { useAuth } from '../../src/context/AuthContext';
import ar from '../../src/i18n/ar';
import styles from '../../src/styles/caregiverAlerts.styles';

export default function CaregiverAlertsScreen() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout(); // the route guard then returns to A1
  };

  return (
    <Screen>
      <Text style={styles.title} accessibilityRole="header">
        {ar.caregiverAlerts.title}
      </Text>
      <Button title={ar.common.logout} onPress={handleLogout} loading={loading} />
    </Screen>
  );
}
