import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test, vi } from 'vitest';
import AsyncActionButton, { SUCCESS_HOLD_MS, type AsyncActionButtonProps } from './AsyncActionButton';

const labels: AsyncActionButtonProps['labels'] = {
  idle: 'Send', loading: 'Sending', success: 'Sent', error: 'Retry', disabled: 'Unavailable',
};
const feedback: AsyncActionButtonProps['feedback'] = {
  idle: 'Ready.', loading: 'Sending your message.', success: 'Delivered.', error: 'Could not send. Retry.', disabled: 'Enable sending first.',
};

afterEach(() => { cleanup(); vi.useRealTimers(); });

test('blocks repeated activations during work and success, then resets after the reading pause', async () => {
  vi.useFakeTimers();
  let finish!: () => void;
  const action = vi.fn(() => new Promise<void>(resolve => { finish = resolve; }));
  render(<AsyncActionButton action={action} labels={labels} feedback={feedback} />);
  const button = screen.getByRole('button', { name: 'Send', exact: true });
  act(() => { button.click(); button.click(); button.click(); });
  expect(action).toHaveBeenCalledTimes(1);
  expect(button.getAttribute('aria-disabled')).toBe('true');
  // aria-disabled preserves the active element while loading; native disabled would drop it.
  expect(button.hasAttribute('disabled')).toBe(false);
  expect(screen.getByRole('status').textContent).toBe('Sending your message.');
  await act(async () => { finish(); });
  expect(screen.getByRole('button', { name: 'Sent', exact: true })).toBeTruthy();
  fireEvent.click(button);
  expect(action).toHaveBeenCalledTimes(1);
  await act(async () => { await vi.advanceTimersByTimeAsync(SUCCESS_HOLD_MS - 1); });
  expect(button.getAttribute('data-state')).toBe('success');
  await act(async () => { await vi.advanceTimersByTimeAsync(1); });
  expect(screen.getByRole('button', { name: 'Send', exact: true }).getAttribute('aria-disabled')).toBe('false');
  fireEvent.click(button);
  expect(action).toHaveBeenCalledTimes(2);
});

test('keeps the error until retry and uses the latest action to recover', async () => {
  vi.useFakeTimers();
  const fail = vi.fn(async () => { throw new Error('offline'); });
  const succeed = vi.fn(async () => {});
  const view = render(<AsyncActionButton action={fail} labels={labels} feedback={feedback} />);
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Send', exact: true })); });
  expect(screen.getByRole('status').textContent).toBe('Could not send. Retry.');
  await act(async () => { await vi.advanceTimersByTimeAsync(6000); });
  expect(screen.getByRole('button', { name: 'Retry' })).toBeTruthy();
  view.rerender(<AsyncActionButton action={succeed} labels={labels} feedback={feedback} />);
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Retry' })); });
  expect(succeed).toHaveBeenCalledTimes(1);
  expect(fail).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', { name: 'Sent' })).toBeTruthy();
});

test('uses native keyboard activation and retains focus while pending', async () => {
  const user = userEvent.setup();
  const action = vi.fn(() => new Promise<void>(() => {}));
  render(<AsyncActionButton action={action} labels={labels} feedback={feedback} />);
  const button = screen.getByRole('button', { name: 'Send', exact: true });
  await user.tab();
  expect(document.activeElement).toBe(button);
  await user.keyboard(' ');
  expect(action).toHaveBeenCalledTimes(1);
  expect(document.activeElement).toBe(button);
  await user.keyboard('{Enter}');
  expect(action).toHaveBeenCalledTimes(1);
});

test('disabled buttons explain why and never start work', async () => {
  const action = vi.fn(async () => {});
  render(<AsyncActionButton action={action} labels={labels} feedback={feedback} disabled />);
  const button = screen.getByRole('button', { name: 'Unavailable' });
  fireEvent.click(button);
  expect(button.hasAttribute('disabled')).toBe(true);
  expect(screen.getByRole('status').textContent).toBe('Enable sending first.');
  expect(action).not.toHaveBeenCalled();
});

test('aborts pending work when navigating away, even if an action ignores cancellation', async () => {
  let signal!: AbortSignal;
  let finish!: () => void;
  const onStateChange = vi.fn();
  const view = render(<AsyncActionButton labels={labels} feedback={feedback} onStateChange={onStateChange}
    action={requestSignal => { signal = requestSignal; return new Promise<void>(resolve => { finish = resolve; }); }} />);
  fireEvent.click(screen.getByRole('button', { name: 'Send', exact: true }));
  view.unmount();
  expect(signal.aborted).toBe(true);
  const stateChanges = onStateChange.mock.calls.length;
  await act(async () => { finish(); });
  expect(onStateChange).toHaveBeenCalledTimes(stateChanges);
});

test('cleans up the success reset timer on unmount', async () => {
  vi.useFakeTimers();
  const view = render(<AsyncActionButton labels={labels} feedback={feedback} action={async () => {}} />);
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Send', exact: true })); });
  expect(vi.getTimerCount()).toBe(1);
  view.unmount();
  expect(vi.getTimerCount()).toBe(0);
});
