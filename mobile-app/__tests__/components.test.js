// File: components.test.js
// Purpose: Unit tests of the shared UI components (Phase 2): loading/disabled button,
// inline field errors, password visibility toggle, role card selection, banner variants.

import { fireEvent, render, screen } from '@testing-library/react-native';

import Banner from '../src/components/Banner';
import Button from '../src/components/Button';
import PasswordField from '../src/components/PasswordField';
import RoleCard from '../src/components/RoleCard';
import TextField from '../src/components/TextField';
import ar from '../src/i18n/ar';

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

describe('RoleCard', () => {
  test('exposes its selected state as a radio and reports presses', async () => {
    const onPress = jest.fn();
    await render(<RoleCard label="مريض" icon="user" selected onPress={onPress} />);
    const radio = screen.getByRole('radio', { name: 'مريض' });
    expect(radio).toBeChecked();
    await fireEvent.press(radio);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('is not checked when not selected', async () => {
    await render(<RoleCard label="مرافق" icon="users" selected={false} onPress={jest.fn()} />);
    expect(screen.getByRole('radio', { name: 'مرافق' })).not.toBeChecked();
  });
});

describe('Banner', () => {
  test.each(['error', 'success'])('renders the %s message as an alert', async (variant) => {
    await render(<Banner variant={variant} message={ar.messages.network} />);
    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText(ar.messages.network)).toBeTruthy();
  });
});
