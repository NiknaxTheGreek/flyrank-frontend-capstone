import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { RouteErrorBoundary } from './RouteErrorBoundary';

afterEach(() => { cleanup(); vi.restoreAllMocks(); });

test('a route rendering exception shows recovery and retries the page', () => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
  let sabotage = true;
  function Page() {
    if (sabotage) throw new Error('Injected route failure');
    return <h1>Recovered page</h1>;
  }
  render(<RouteErrorBoundary><Page /></RouteErrorBoundary>);
  expect(screen.getByRole('alert')).toBeTruthy();
  expect(screen.getByRole('link', { name: 'Browse movies' }).getAttribute('href')).toBe('/movies');
  sabotage = false;
  fireEvent.click(screen.getByRole('button', { name: 'Try this page again' }));
  expect(screen.getByRole('heading', { name: 'Recovered page' })).toBeTruthy();
  expect(screen.queryByRole('alert')).toBeNull();
});

