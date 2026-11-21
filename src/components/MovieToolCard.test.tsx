import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MovieToolCard } from './MovieToolCard';
import { failedPart, lookingUpPart, preparingPart, resultPart } from '../test/movieChatFixtures';

afterEach(cleanup);

describe('MovieToolCard', () => {
  it('shows input streaming as a labelled status', () => {
    render(<MovieToolCard part={preparingPart} interrupted={false} />);
    expect(screen.getByRole('region', { name: 'Movie lookup' })).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Preparing movie lookup…');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('names the title being fetched once input is available', () => {
    render(<MovieToolCard part={lookingUpPart} interrupted={false} />);
    expect(screen.getByRole('status')).toHaveTextContent('Checking OMDb');
    expect(screen.getByRole('status')).toHaveTextContent('Looking up Inception');
  });

  it('renders movie facts and a verified IMDb link as semantic content', () => {
    render(<MovieToolCard part={resultPart} interrupted={false} />);
    const card = screen.getByRole('region', { name: 'Movie lookup' });
    expect(within(card).getByRole('heading', { level: 2, name: 'Inception (2010)' })).toBeVisible();
    expect(within(card).getAllByRole('term').map(term => term.textContent)).toEqual(['IMDb rating', 'Genre', 'Runtime']);
    expect(within(card).getAllByRole('definition').map(value => value.textContent)).toEqual(['8.8/10', 'Action, Sci-Fi', '148 min']);
    expect(within(card).getByText('A team enters dreams to plant an idea.')).toBeVisible();
    expect(within(card).getByRole('link', { name: 'View Inception on IMDb' })).toHaveAttribute('href', 'https://www.imdb.com/title/tt1375666/');
  });

  it('labels absent facts without inventing a rating or other metadata', () => {
    const part = { ...resultPart, output: { ...resultPart.output, rating: null, genre: '', runtime: '', plot: '', year: '' } };
    render(<MovieToolCard part={part} interrupted={false} />);
    expect(screen.getByRole('heading', { name: 'Inception' })).toBeVisible();
    expect(screen.getAllByRole('definition').map(value => value.textContent)).toEqual(['Unrated', 'Unavailable', 'Unavailable']);
  });

  it('shows a zero rating as 0/10 rather than treating it as missing', () => {
    render(<MovieToolCard part={{ ...resultPart, output: { ...resultPart.output, rating: 0 } }} interrupted={false} />);
    expect(screen.getByText('0/10')).toBeVisible();
  });

  it('announces a failed lookup with its title and recovery explanation', () => {
    render(<MovieToolCard part={failedPart} interrupted={false} />);
    expect(screen.getByRole('alert')).toHaveTextContent('Movie lookup couldn’t finish');
    expect(screen.getByRole('alert')).toHaveTextContent('Title: Inception');
    expect(screen.getByRole('alert')).toHaveTextContent('OMDb is temporarily unavailable.');
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('handles an error that occurred before the tool input was complete', () => {
    render(<MovieToolCard part={{ ...failedPart, input: undefined }} interrupted={false} />);
    expect(screen.getByRole('alert')).toHaveTextContent('OMDb is temporarily unavailable.');
    expect(screen.getByRole('alert')).not.toHaveTextContent('Title:');
  });

  it.each([preparingPart, lookingUpPart])('ends an interrupted $state lookup without leaving a loading indicator', part => {
    render(<MovieToolCard part={part} interrupted />);
    expect(screen.getByRole('region', { name: 'Movie lookup' })).toHaveTextContent('Lookup ended before a result arrived.');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
