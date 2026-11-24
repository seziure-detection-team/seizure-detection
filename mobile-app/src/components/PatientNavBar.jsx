// File: PatientNavBar.jsx
// Purpose: Bottom navigation of the patient screens (Home / History) with its navigation
// rules (approved Phase D decision D-a: plain stack). Home stays at the bottom of the
// stack, so its state survives a visit to History:
//   - on Home, "السجل" pushes History
//   - on History, "الرئيسية" goes back to Home (as the Android back button does)

import { useRouter } from 'expo-router';

import ar from '../i18n/ar';
import NavBar from './NavBar';

const ITEMS = [
  { key: 'home', label: ar.nav.home, icon: 'home' },
  { key: 'history', label: ar.nav.history, icon: 'rotate-ccw' },
];

// active: "home" | "history"
export default function PatientNavBar({ active }) {
  const router = useRouter();

  const handleSelect = (key) => {
    if (key === active) return;
    if (key === 'history') {
      router.push('/history');
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/home');
    }
  };

  return <NavBar items={ITEMS} activeKey={active} onSelect={handleSelect} />;
}
