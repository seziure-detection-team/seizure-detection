// File: components.test.js
// Purpose: Unit tests of the shared UI components: loading/disabled button, inline field
// errors, password visibility toggle, choice chip selection, banner variants, and the
// Yaqz v2 components (two-tone title, badges, logout button, bottom navigation).

import { fireEvent, render, screen } from '@testing-library/react-native';

import Badge from '../src/components/Badge';
import Banner from '../src/components/Banner';
import Button from '../src/components/Button';
import ChoiceChip from '../src/components/ChoiceChip';
import LogoutButton from '../src/components/LogoutButton';
import NavBar from '../src/components/NavBar';
import PasswordField from '../src/components/PasswordField';
import SampleDataBadge from '../src/components/SampleDataBadge';
import TextField from '../src/components/TextField';
import TwoToneTitle, { splitTitle } from '../src/components/TwoToneTitle';
import ar from '../src/i18n/ar';
import { colors } from '../src/theme';

// LogoutButton signs out through the AuthContext; only `logout` is needed here
const mockLogout = jest.fn(() => Promise.resolve());
jest.mock('../src/context/AuthContext', () => ({ useAuth: () => ({ logout: mockLogout }) }));

describe('Button', () => {
  test('calls onPress when enabled', async () => {
    const onPress = jest.fn();
    await render(<Button title="دخول" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'دخول' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('is disabled and shows a spinner while loading', async () => {
    const onPress = jest.fn();
    await render(<Button title="دخول" onPress={onPress} loading />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.queryByText('دخول')).toBeNull();
    expect(screen.getByLabelText(ar.common.loading)).toBeTruthy();
    await fireEvent.press(button);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('does not call onPress when disabled', async () => {
    const onPress = jest.fn();
    await render(<Button title="دخول" onPress={onPress} disabled />);
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('TextField', () => {
  test('shows the hint when there is no error', async () => {
    await render(<TextField label="الاسم الكامل" hint="تلميح" value="" onChangeText={jest.fn()} />);
    expect(screen.getByText('تلميح')).toBeTruthy();
  });

  test('shows the error message instead of the hint (UC-01 3a)', async () => {
    await render(
      <TextField label="الاسم الكامل" hint="تلميح" error="خطأ" value="" onChangeText={jest.fn()} />,
    );
    expect(screen.getByText('خطأ')).toBeTruthy();
    expect(screen.queryByText('تلميح')).toBeNull();
  });

  test('reports typed text', async () => {
    const onChangeText = jest.fn();
    await render(<TextField label="الاسم الكامل" value="" onChangeText={onChangeText} />);
    await fireEvent.changeText(screen.getByLabelText('الاسم الكامل'), 'سارة');
    expect(onChangeText).toHaveBeenCalledWith('سارة');
  });

  test('with an icon chip it still shows the error after focus (UC-01 3a)', async () => {
    await render(
      <TextField
        label="البريد الإلكتروني"
        icon="mail"
        error="خطأ"
        value=""
        onChangeText={jest.fn()}
      />,
    );
    await fireEvent(screen.getByLabelText('البريد الإلكتروني'), 'focus');
    expect(screen.getByText('خطأ')).toBeTruthy();
  });
});

describe('PasswordField', () => {
  test('hides the password by default and toggles visibility', async () => {
    await render(<PasswordField label="كلمة المرور" value="secret1" onChangeText={jest.fn()} />);
    const input = screen.getByLabelText('كلمة المرور');
    expect(input.props.secureTextEntry).toBe(true);

    await fireEvent.press(screen.getByRole('button', { name: ar.common.showPassword }));
    expect(screen.getByLabelText('كلمة المرور').props.secureTextEntry).toBe(false);
    expect(screen.getByRole('button', { name: ar.common.hidePassword })).toBeTruthy();
  });
});

describe('ChoiceChip', () => {
  test('exposes its selected state as a radio and reports presses', async () => {
    const onPress = jest.fn();
    await render(<ChoiceChip label="مريض" icon="user" selected onPress={onPress} />);
    const radio = screen.getByRole('radio', { name: 'مريض' });
    expect(radio).toBeChecked();
    await fireEvent.press(radio);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('is not checked when not selected', async () => {
    await render(<ChoiceChip label="مرافق" icon="users" selected={false} onPress={jest.fn()} />);
    expect(screen.getByRole('radio', { name: 'مرافق' })).not.toBeChecked();
  });
});

describe('Banner', () => {
  test.each(['error', 'warning', 'success'])(
    'renders the %s message as an alert',
    async (variant) => {
      await render(<Banner variant={variant} message={ar.messages.network} />);
      expect(screen.getByRole('alert')).toBeTruthy();
      expect(screen.getByText(ar.messages.network)).toBeTruthy();
    },
  );

  test('shows an optional title above the message (B4)', async () => {
    await render(<Banner variant="warning" title="عنوان" message={ar.messages.network} />);
    expect(screen.getByText('عنوان')).toBeTruthy();
    expect(screen.getByText(ar.messages.network)).toBeTruthy();
  });
});

describe('TwoToneTitle', () => {
  test('splits at the first space; one word has no muted part (decision B5)', () => {
    expect(splitTitle('تسجيل الدخول')).toEqual(['تسجيل', ' الدخول']);
    expect(splitTitle('التنبيهات')).toEqual(['', 'التنبيهات']);
  });

  test('renders one header with the first word in textHeadline', async () => {
    await render(<TwoToneTitle text={ar.login.title} />);
    expect(screen.getByRole('header', { name: ar.login.title })).toBeTruthy();
    expect(screen.getByText('تسجيل')).toHaveStyle({ color: colors.textHeadline });
  });
});

describe('Badge', () => {
  test('shows its text; neutral uses the accessible neutral colour', async () => {
    await render(<Badge label="غير متصل" tone="neutral" />);
    expect(screen.getByText('غير متصل')).toHaveStyle({ color: colors.neutral });
  });

  test.each([
    ['sample', ar.sampleData.sample],
    ['simulation', ar.sampleData.simulation],
  ])('SampleDataBadge kind "%s" shows its label', async (kind, label) => {
    await render(<SampleDataBadge kind={kind} />);
    expect(screen.getByText(label)).toBeTruthy();
  });
});

describe('LogoutButton', () => {
  test('signs out when pressed (UC-02)', async () => {
    mockLogout.mockClear();
    await render(<LogoutButton />);
    await fireEvent.press(screen.getByRole('button', { name: ar.common.logout }));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});

describe('NavBar', () => {
  const items = [
    { key: 'home', label: ar.nav.home, icon: 'home' },
    { key: 'history', label: ar.nav.history, icon: 'rotate-ccw' },
  ];

  test('marks the active tab and reports the selected key', async () => {
    const onSelect = jest.fn();
    await render(<NavBar items={items} activeKey="home" onSelect={onSelect} />);
    expect(screen.getByRole('tab', { name: ar.nav.home })).toBeSelected();
    expect(screen.getByRole('tab', { name: ar.nav.history })).not.toBeSelected();
    await fireEvent.press(screen.getByRole('tab', { name: ar.nav.history }));
    expect(onSelect).toHaveBeenCalledWith('history');
  });
});
