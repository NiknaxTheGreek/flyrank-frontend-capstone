import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import PlanetStudioPage from './PlanetStudioPage';

const scene = vi.hoisted(() => ({ starts: 0, stops: 0, fail: false }));
vi.mock('../features/planet-studio/PlanetCanvas', async () => {
  const { useEffect } = await import('react');
  return { default: ({ onReady, onFailure }: { onReady: () => void; onFailure: (reason: string) => void }) => {
    useEffect(() => {
      scene.starts++;
      if (scene.fail) onFailure('3D was interrupted. The static view still works.'); else onReady();
      return () => { scene.stops++; };
    }, []);
    return <div aria-label="Live planet scene" />;
  } };
});

function motionPreference(reduced: boolean) {
  vi.stubGlobal('matchMedia', vi.fn(() => ({ matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
}
beforeEach(() => { scene.starts = 0; scene.stops = 0; scene.fail = false; motionPreference(false); });
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

test('starts with a useful static world and never mounts the 3D scene before opt-in', () => {
  render(<PlanetStudioPage />);
  expect(screen.getByRole('img', { name: 'Dune world, static illustration with rings' })).toBeTruthy();
  expect(scene.starts).toBe(0);
  expect((screen.getByRole('checkbox', { name: 'Auto-rotate' }) as HTMLInputElement).disabled).toBe(true);
});

test('surface and ring controls update the accessible static fallback', () => {
  render(<PlanetStudioPage />);
  fireEvent.click(screen.getByRole('radio', { name: 'Ocean' }));
  expect(screen.getByRole('heading', { name: 'Ocean' })).toBeTruthy();
  fireEvent.click(screen.getByRole('checkbox', { name: 'Add planetary rings' }));
  expect(screen.getByRole('img', { name: 'Ocean world, static illustration' })).toBeTruthy();
});

test('zoom is bounded and reset restores the complete default world', () => {
  render(<PlanetStudioPage />);
  for (let i = 0; i < 12; i++) fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
  expect(screen.getByLabelText('Zoom level').textContent).toBe('130%');
  expect((screen.getByRole('button', { name: 'Zoom in' }) as HTMLButtonElement).disabled).toBe(true);
  fireEvent.click(screen.getByRole('radio', { name: 'Glacier' }));
  fireEvent.click(screen.getByRole('checkbox', { name: 'Add planetary rings' }));
  fireEvent.click(screen.getByRole('button', { name: 'Reset world' }));
  expect(screen.getByLabelText('Zoom level').textContent).toBe('100%');
  expect(screen.getByRole('img', { name: 'Dune world, static illustration with rings' })).toBeTruthy();
});

test('launch makes 3D controls available and static view releases the scene', async () => {
  render(<PlanetStudioPage />);
  fireEvent.click(screen.getByRole('button', { name: 'Launch 3D' }));
  await screen.findByText('LIVE 3D');
  expect((screen.getByRole('slider', { name: 'Light direction' }) as HTMLInputElement).disabled).toBe(false);
  fireEvent.click(screen.getByRole('checkbox', { name: 'Auto-rotate' }));
  fireEvent.click(screen.getByRole('button', { name: /Use static view/ }));
  expect(scene.stops).toBe(1);
  expect((screen.getByRole('checkbox', { name: 'Auto-rotate' }) as HTMLInputElement).checked).toBe(false);
});

test('a failed renderer preserves the chosen world and supports retry', async () => {
  scene.fail = true;
  render(<PlanetStudioPage />);
  fireEvent.click(screen.getByRole('radio', { name: 'Ocean' }));
  fireEvent.click(screen.getByRole('button', { name: 'Launch 3D' }));
  await screen.findByRole('alert');
  expect(screen.getByRole('img', { name: 'Ocean world, static illustration with rings' })).toBeTruthy();
  scene.fail = false;
  await act(async () => { fireEvent.click(screen.getByRole('button', { name: 'Try 3D again' })); });
  await screen.findByText('LIVE 3D');
  expect((screen.getByRole('radio', { name: 'Ocean' }) as HTMLInputElement).checked).toBe(true);
});

test('reduced motion stays static until an explicit choice to launch', async () => {
  motionPreference(true);
  render(<PlanetStudioPage />);
  await waitFor(() => expect(screen.getByRole('status', { name: 'Scene status' }).textContent).toContain('motion or device preferences'));
  expect(scene.starts).toBe(0);
  fireEvent.click(screen.getByRole('button', { name: 'Launch 3D' }));
  await screen.findByText('LIVE 3D');
  expect((screen.getByRole('checkbox', { name: 'Auto-rotate' }) as HTMLInputElement).checked).toBe(false);
});
