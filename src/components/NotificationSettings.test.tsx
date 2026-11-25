import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import NotificationSettings from './NotificationSettings';

const STORAGE_KEY = 'flyrank-notification-preferences';

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('NotificationSettings', () => {
  it('shows default preferences when there is no saved data', () => {
    render(<NotificationSettings />);

    expect((screen.getByRole('textbox', { name: 'Email address' }) as HTMLInputElement).value).toBe('');
    expect((screen.getByRole('checkbox', { name: 'Enable email notifications' }) as HTMLInputElement).checked).toBe(false);
    expect(screen.getByRole('button', { name: 'Save preferences' })).toBeTruthy();
  });

  it.each(['', 'invalid'])('does not save enabled notifications with email "%s"', async (email) => {
    const user = userEvent.setup();
    render(<NotificationSettings />);

    await user.click(screen.getByRole('checkbox', { name: 'Enable email notifications' }));
    if (email) {
      await user.type(screen.getByRole('textbox', { name: 'Email address' }), email);
    }
    await user.click(screen.getByRole('button', { name: 'Save preferences' }));

    const input = screen.getByRole('textbox', { name: 'Email address' });
    expect(screen.getByText('Enter a valid email address to enable email notifications.')).toBeTruthy();
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBe('notification-email-error');
    expect(document.activeElement).toBe(input);
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('trims a valid email before saving preferences', async () => {
    const user = userEvent.setup();
    render(<NotificationSettings />);

    await user.type(screen.getByRole('textbox', { name: 'Email address' }), ' nick@example.com ');
    await user.click(screen.getByRole('checkbox', { name: 'Enable email notifications' }));
    await user.click(screen.getByRole('button', { name: 'Save preferences' }));

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '')).toEqual({
      email: 'nick@example.com',
      emailNotifications: true,
    });
    expect((screen.getByRole('textbox', { name: 'Email address' }) as HTMLInputElement).value).toBe('nick@example.com');
    expect(screen.getByText('Notification preferences saved in this browser.')).toBeTruthy();
  });

  it('allows saving with notifications disabled and an empty email', async () => {
    const user = userEvent.setup();
    render(<NotificationSettings />);

    await user.click(screen.getByRole('button', { name: 'Save preferences' }));

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '')).toEqual({
      email: '',
      emailNotifications: false,
    });
    expect(screen.getByText('Notification preferences saved in this browser.')).toBeTruthy();
  });

  it('restores valid saved preferences on remount', async () => {
    const user = userEvent.setup();
    const firstRender = render(<NotificationSettings />);
    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'nick@example.com');
    await user.click(screen.getByRole('checkbox', { name: 'Enable email notifications' }));
    await user.click(screen.getByRole('button', { name: 'Save preferences' }));
    firstRender.unmount();

    render(<NotificationSettings />);

    expect((screen.getByRole('textbox', { name: 'Email address' }) as HTMLInputElement).value).toBe('nick@example.com');
    expect((screen.getByRole('checkbox', { name: 'Enable email notifications' }) as HTMLInputElement).checked).toBe(true);
  });

  it.each(['{broken json', '{"email":"invalid","emailNotifications":true}'])(
    'uses safe defaults for invalid stored value %s',
    (stored) => {
      window.localStorage.setItem(STORAGE_KEY, stored);

      render(<NotificationSettings />);

      expect((screen.getByRole('textbox', { name: 'Email address' }) as HTMLInputElement).value).toBe('');
      expect((screen.getByRole('checkbox', { name: 'Enable email notifications' }) as HTMLInputElement).checked).toBe(false);
    },
  );

  it('shows a storage error and no success when saving fails', async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });
    render(<NotificationSettings />);

    await user.click(screen.getByRole('button', { name: 'Save preferences' }));

    expect(screen.getByText('Could not save preferences in this browser. Please try again.')).toBeTruthy();
    expect(screen.queryByText('Notification preferences saved in this browser.')).toBeNull();
  });

  it('clears saved feedback when a field is edited', async () => {
    const user = userEvent.setup();
    render(<NotificationSettings />);
    await user.click(screen.getByRole('button', { name: 'Save preferences' }));

    await user.type(screen.getByRole('textbox', { name: 'Email address' }), 'nick@example.com');

    expect(screen.queryByText('Notification preferences saved in this browser.')).toBeNull();
  });
});

it('continues to render the existing dashboard', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Reel Good Movie Dashboard' })).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'Watchlist activity' })).toBeTruthy();
  expect(screen.getByRole('heading', { name: 'Notification settings' })).toBeTruthy();
});
