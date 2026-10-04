// @vitest-environment node
import { expect, it, vi } from 'vitest';
import { createMovieHandler } from './movies.mjs';
async function run(handler, query, method = 'GET') {
  let body; const headers = {};
  const res = { statusCode: 0, setHeader: (k,v) => { headers[k] = v; }, end: value => { body = JSON.parse(value); } };
  await handler({ url: `/api/movies?${query}`, method }, res);
  return { status: res.statusCode, body, headers };
}
const raw = { imdbID: 'tt1375666', Title: 'Inception', Year: '2010', Poster: 'N/A' };
const details = { ...raw, Genre: 'Sci-Fi, Thriller', Plot: 'A skilled thief enters dreams to steal secrets.', Poster: 'N/A' };
it('validates input before contacting OMDb', async () => {
  const fetcher = vi.fn(); const h = createMovieHandler({ getKey: () => 'test-key', fetcher });
  expect((await run(h, 'q=a')).status).toBe(400);
  expect((await run(h, 'q=Batman&page=101')).status).toBe(400);
  expect((await run(h, 'id=https://example.com')).status).toBe(400);
  expect((await run(h, 'q=Batman', 'POST')).status).toBe(405);
  expect(fetcher).not.toHaveBeenCalled();
});
it('enriches search results with cached details and hides the key', async () => {
  const fetcher = vi.fn(async (url) => ({
    ok: true,
    json: async () => new URL(url).searchParams.has('i')
      ? { Response: 'True', ...details }
      : { Response: 'True', Search: [raw], totalResults: '1' },
  }));
  const h = createMovieHandler({ getKey: () => 'test-key', fetcher });
  const result = await run(h, 'q=Inception');
  expect(result.body.movies[0].rating).toBe(null);
  expect(result.body.movies[0].posterUrl).toBe('');
  expect(result.body.movies[0].genre).toBe('Sci-Fi, Thriller');
  expect(result.body.movies[0].plot).toBe(details.Plot);
  expect(JSON.stringify(result)).not.toContain('test-key');
  await run(h, 'q=Inception');
  await run(h, 'id=tt1375666');
  expect(fetcher).toHaveBeenCalledTimes(2);
});
it('limits concurrent movie-detail lookups', async () => {
  let active = 0;
  let maximumActive = 0;
  const searchResults = Array.from({ length: 7 }, (_, index) => ({
    imdbID: `tt${String(1000000 + index)}`,
    Title: `Movie ${index}`,
    Year: '2020',
    Poster: 'N/A',
  }));
  const fetcher = vi.fn(async (url) => {
    const params = new URL(url).searchParams;
    if (!params.has('i')) return { ok: true, json: async () => ({ Response: 'True', Search: searchResults, totalResults: '7' }) };
    active++;
    maximumActive = Math.max(maximumActive, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active--;
    return { ok: true, json: async () => ({ Response: 'True', ...searchResults.find((item) => item.imdbID === params.get('i')), Genre: 'Drama', Plot: 'A complete plot description.' }) };
  });
  const result = await run(createMovieHandler({ getKey: () => 'test-key', fetcher }), 'q=Movie');
  expect(result.status).toBe(200);
  expect(result.body.movies).toHaveLength(7);
  expect(maximumActive).toBe(3);
});
it('distinguishes not found, provider errors and unconfigured service', async () => {
  expect((await run(createMovieHandler({ getKey: () => '' }), 'q=Batman')).status).toBe(503);
  const fetcher = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ Response: 'False', Error: 'Movie not found!' }) });
  const h = createMovieHandler({ getKey: () => 'test-key', fetcher });
  expect((await run(h, 'q=zzzz')).body).toEqual({ movies: [], total: 0 });
  fetcher.mockRejectedValueOnce(new Error('sensitive URL test-key'));
  const failed = await run(h, 'q=Batman');
  expect(failed.status).toBe(502); expect(JSON.stringify(failed)).not.toContain('test-key');
});
it('limits uncached upstream requests', async () => {
  const fetcher = vi.fn().mockResolvedValue({ ok: false });
  const h = createMovieHandler({ getKey: () => 'test-key', fetcher, now: () => 100_000 });
  for (let i = 0; i < 30; i++) await run(h, 'q=Batman');
  expect((await run(h, 'q=Batman')).status).toBe(429);
  expect(fetcher).toHaveBeenCalledTimes(30);
});
