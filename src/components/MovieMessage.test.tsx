import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MovieMessage, type MovieMessageData } from './MovieMessage';
import { failedPart, lookingUpPart, preparingPart, resultPart } from '../test/movieChatFixtures';

afterEach(cleanup);

const assistant = (parts: MovieMessageData['parts'], outcome?: MovieMessageData['outcome']): MovieMessageData => ({
  id: 'assistant-1', role: 'assistant', parts, outcome,
});

describe('MovieMessage', () => {
  it('labels user messages and preserves their text', () => {
    render(<ol><MovieMessage message={{ id: 'user-1', role: 'user', parts: [{ type: 'text', text: 'A funny sci-fi movie, please.' }] }} /></ol>);
    const item = screen.getByRole('listitem', { name: 'You message' });
    expect(within(item).getByText('A funny sci-fi movie, please.')).toBeVisible();
    expect(within(item).queryByRole('status')).not.toBeInTheDocument();
  });

  it('announces pending work before the first token', () => {
    render(<ol><MovieMessage message={assistant([{ type: 'text', text: '' }])} pending /></ol>);
    expect(screen.getByRole('status')).toHaveTextContent('Thinking…');
  });

  it('replaces the thinking indicator with accumulated streaming text', () => {
    const view = render(<ol><MovieMessage message={assistant([{ type: 'text', text: '' }])} pending /></ol>);
    view.rerender(<ol><MovieMessage message={assistant([{ type: 'text', text: 'Try ' }])} pending /></ol>);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.getByRole('listitem', { name: 'Movie picker message' })).toHaveTextContent('Try');
    view.rerender(<ol><MovieMessage message={assistant([{ type: 'text', text: 'Try Inception.' }])} pending /></ol>);
    expect(screen.getByText('Try Inception.')).toBeVisible();
  });

  it.each([
    { part: preparingPart, role: 'status', text: 'Preparing movie lookup…' },
    { part: lookingUpPart, role: 'status', text: 'Looking up Inception' },
    { part: failedPart, role: 'alert', text: 'OMDb is temporarily unavailable.' },
  ])('renders a $part.state tool part by its accessible state', ({ part, role, text }) => {
    render(<ol><MovieMessage message={assistant([{ type: 'text', text: '' }, part])} pending /></ol>);
    expect(screen.getByRole(role)).toHaveTextContent(text);
    expect(screen.queryByText('Thinking…')).not.toBeInTheDocument();
  });

  it('renders text together with a successful structured result', () => {
    render(<ol><MovieMessage message={assistant([{ type: 'text', text: 'Here are the details.' }, resultPart])} /></ol>);
    const item = screen.getByRole('listitem', { name: 'Movie picker message' });
    expect(within(item).getByText('Here are the details.')).toBeVisible();
    expect(within(item).getByRole('heading', { name: 'Inception (2010)' })).toBeVisible();
    expect(within(item).getByRole('link', { name: 'View Inception on IMDb' })).toHaveAttribute('href', 'https://www.imdb.com/title/tt1375666/');
  });

  it('renders every tool part in a message, including a second result', () => {
    const second: typeof resultPart = {
      ...resultPart, toolCallId: 'lookup-2', input: { title: 'Arrival' },
      output: { ...resultPart.output, title: 'Arrival', year: '2016', imdbId: 'tt2543164' },
    };
    render(<ol><MovieMessage message={assistant([{ type: 'text', text: 'Compare these films.' }, resultPart, second])} /></ol>);
    expect(screen.getByRole('heading', { name: 'Inception (2010)' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Arrival (2016)' })).toBeVisible();
    expect(screen.getAllByRole('region', { name: 'Movie lookup' })).toHaveLength(2);
  });

  it.each(['stopped', 'interrupted'] as const)('retains partial text and explains a %s response', outcome => {
    render(<ol><MovieMessage message={assistant([{ type: 'text', text: 'An unfinished recommendation' }, lookingUpPart], outcome)} /></ol>);
    expect(screen.getByText('An unfinished recommendation')).toBeVisible();
    expect(screen.getByText(outcome === 'stopped' ? 'Stopped · partial response' : 'Interrupted · partial response')).toBeVisible();
    expect(screen.getByRole('region', { name: 'Movie lookup' })).toHaveTextContent('Lookup ended before a result arrived.');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

