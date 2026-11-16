import { z } from 'zod';

const base = {
  type: z.literal('tool'),
  toolName: z.literal('lookupMovie'),
  toolCallId: z.string(),
};
const input = z.object({ title: z.string() });
const output = z.object({
  title: z.string(), year: z.string(), genre: z.string(),
  runtime: z.string(), rating: z.number().min(0).max(10).nullable(),
  plot: z.string(), imdbId: z.string().regex(/^tt\d{7,10}$/),
});

export const movieToolPart = z.discriminatedUnion('state', [
  z.object({ ...base, state: z.literal('input-streaming') }),
  z.object({ ...base, state: z.literal('input-available'), input }),
  z.object({ ...base, state: z.literal('output-available'), input, output }),
  z.object({ ...base, state: z.literal('output-error'), input: input.optional(), errorText: z.string() }),
]);

export type MovieToolPart = z.infer<typeof movieToolPart>;
