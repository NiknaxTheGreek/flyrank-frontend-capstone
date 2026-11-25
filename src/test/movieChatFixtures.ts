import type { MovieToolPart } from '../services/movie-tool-part';

export const movieOutput = {
  title: 'Inception', year: '2010', genre: 'Action, Sci-Fi', runtime: '148 min',
  rating: 8.8, plot: 'A team enters dreams to plant an idea.', imdbId: 'tt1375666',
};

const tool = { type: 'tool' as const, toolName: 'lookupMovie' as const, toolCallId: 'lookup-1' };
export const preparingPart = { ...tool, state: 'input-streaming' } satisfies MovieToolPart;
export const lookingUpPart = { ...tool, state: 'input-available', input: { title: 'Inception' } } satisfies MovieToolPart;
export const resultPart = {
  ...tool, state: 'output-available', input: { title: 'Inception' }, output: movieOutput,
} satisfies MovieToolPart;
export const failedPart = {
  ...tool, state: 'output-error', input: { title: 'Inception' }, errorText: 'OMDb is temporarily unavailable.',
} satisfies MovieToolPart;

export function sseResponse(events: object[]) {
  return new Response(events.map(event => `data: ${JSON.stringify(event)}\n\n`).join(''), {
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
