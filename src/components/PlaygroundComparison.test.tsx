import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, test } from 'vitest';
import ShadcnComparison from '../../playground/ShadcnComparison';
afterEach(cleanup);
test('the library dialog returns keyboard focus to its trigger after Escape', async () => {
  const user = userEvent.setup();
  render(<ShadcnComparison />);
  const trigger = screen.getByRole('button', { name: 'Open shadcn modal' });
  await user.click(trigger);
  expect(await screen.findByRole('dialog', { name: 'shadcn modal comparison' })).toBeVisible();
  await user.keyboard('{Escape}');
  await waitFor(() => expect(trigger).toHaveFocus());
});
