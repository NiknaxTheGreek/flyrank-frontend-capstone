import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, expect, test, vi } from 'vitest';
import MotionLabPage from './MotionLabPage';
import { simulateAction } from '../services/simulate-action';

afterEach(() => { cleanup(); vi.useRealTimers(); vi.restoreAllMocks(); });

test('demo controls drive failure, retry recovery and the independent second button', async () => {
  vi.useFakeTimers();
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><MotionLabPage /></MemoryRouter>);
  fireEvent.click(screen.getByRole('radio', { name: /^Failure/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Send message' }));
  await act(async () => { await vi.advanceTimersByTimeAsync(1800); });
  expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Save movie' })).toBeTruthy();
  fireEvent.click(screen.getByRole('radio', { name: /^Success/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  await act(async () => { await vi.advanceTimersByTimeAsync(1800); });
  expect(screen.getByRole('button', { name: 'Message sent' })).toBeTruthy();
  expect(screen.getByLabelText('Send requests started').textContent).toBe('02');
  await act(async () => { await vi.advanceTimersByTimeAsync(900); });
  fireEvent.click(screen.getByRole('button', { name: 'Save movie' }));
  await act(async () => { await vi.advanceTimersByTimeAsync(1800); });
  expect(screen.getByRole('button', { name: 'Movie saved' })).toBeTruthy();
});

test('an empty message disables send and the explicit disable switch also disables save', () => {
  render(<MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><MotionLabPage /></MemoryRouter>);
  fireEvent.change(screen.getByRole('textbox', { name: 'Your message' }), { target: { value: '   ' } });
  expect(screen.getByRole('button', { name: 'Send unavailable' }).hasAttribute('disabled')).toBe(true);
  expect(screen.getByRole('button', { name: 'Save movie' }).hasAttribute('disabled')).toBe(false);
  fireEvent.click(screen.getByRole('checkbox', { name: 'Disable buttons' }));
  expect(screen.getByRole('button', { name: 'Save unavailable' }).hasAttribute('disabled')).toBe(true);
});

test('fake requests cancel their timer immediately when aborted', async () => {
  vi.useFakeTimers();
  const controller = new AbortController();
  const request = simulateAction('success', controller.signal);
  const assertion = expect(request).rejects.toMatchObject({ name: 'AbortError' });
  controller.abort();
  await assertion;
  expect(vi.getTimerCount()).toBe(0);
});

test.each([[0.199, true], [0.2, false]])('random outcome at %s respects the 20 percent failure threshold', async (random, shouldFail) => {
  vi.useFakeTimers();
  vi.spyOn(Math, 'random').mockReturnValue(random);
  const request = simulateAction('random', new AbortController().signal);
  const assertion = shouldFail ? expect(request).rejects.toThrow('Simulated') : expect(request).resolves.toBeUndefined();
  await vi.advanceTimersByTimeAsync(1800);
  await assertion;
});
