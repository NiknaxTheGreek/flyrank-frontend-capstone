import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach, expect, vi } from 'vitest';

let unexpectedFetch = vi.fn();

// An accidental unmocked request fails locally and in CI instead of spending API quota.
beforeEach(() => {
  unexpectedFetch = vi.fn(async () => {
    throw new Error('Unmocked network request. Supply a fixture; automated tests must stay offline.');
  });
  vi.stubGlobal('fetch', unexpectedFetch);
});

afterEach(() => {
  vi.unstubAllGlobals();
  expect(unexpectedFetch).not.toHaveBeenCalled();
});

