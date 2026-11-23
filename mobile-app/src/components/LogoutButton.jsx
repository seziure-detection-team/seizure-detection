// File: LogoutButton.jsx
// Purpose: Round logout button for the main patient and caregiver screens (B1, B2, B4, C2,
// C3, C4; UC-02). Signs out through the AuthContext; the route guard then returns to A1.
// AuthContext.logout() never fails (it falls back to a local sign-out), so there is no
// error state. The log-out icon is mirrored so the arrow points left, as in the designs.

import { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import ar from '../i18n/ar';
import IconButton from './IconButton';

export default function LogoutButton() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await logout(); // the screen unmounts when the route guard switches to A1
  };

  return (
    <IconButton
      icon="log-out"
      mirrored
      onPress={handleLogout}
      loading={loading}
      accessibilityLabel={ar.common.logout}
    />
  );
}
