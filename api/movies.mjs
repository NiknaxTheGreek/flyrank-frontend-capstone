// Shared by the Vite development/preview middleware and a Node serverless host.
export function createMovieHandler({ getKey = () => process.env.OMDB_API_KEY, fetcher = (...args) => fetch(...args), now = Date.now } = {}) {
  const cache = new Map();
  const detailRequests = new Map();
  const detailQueue = [];
  let activeDetailRequests = 0;
  let windowStart = 0;
  let calls = 0;
  const maxConcurrentDetails = 3;
  const store = (cacheKey, body) => {
    if (cache.size >= 200) cache.delete(cache.keys().next().value);
    cache.set(cacheKey, { expires: now() + 300_000, body });
  };
  const withDetailLimit = (task) => new Promise((resolve, reject) => {
    const run = () => {
      activeDetailRequests++;
      Promise.resolve().then(task).then(resolve, reject).finally(() => {
        activeDetailRequests--;
        detailQueue.shift()?.();
      });
    };
    if (activeDetailRequests < maxConcurrentDetails) run();
    else detailQueue.push(run);
  });
  return async (req, res) => {
    const send = (status, body) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'no-store');
      res.end(JSON.stringify(body));
    };
    if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return send(405, { error: 'Method not allowed.' }); }
    const input = new URL(req.url, 'http://localhost').searchParams;
    const q = (input.get('q') ?? '').trim();
    const id = input.get('id');
    const page = input.get('page') ?? '1';
    if ((id && q) || (id ? !/^tt\d{7,10}$/.test(id) : q.length < 2 || q.length > 100) || !/^\d{1,3}$/.test(page) || +page < 1 || +page > 100) {
      return send(400, { error: 'Enter a title of 2–100 characters or a valid movie ID, and a page from 1 to 100.' });
    }
    const key = getKey();
    if (!key) return send(503, { error: 'Live movie search has not been configured yet.' });
    const params = new URLSearchParams(id ? { i: id, plot: 'full' } : { s: q, type: 'movie', page });
    const cacheKey = params.toString();
    const cached = cache.get(cacheKey);
    if (cached && cached.expires > now()) return send(200, cached.body);
    if (now() - windowStart >= 60_000) { windowStart = now(); calls = 0; }
    if (calls >= 30) { res.setHeader('Retry-After', '60'); return send(429, { error: 'Too many movie requests. Please retry in a minute.' }); }
    calls++;
    params.set('apikey', key);
    try {
      const response = await fetcher(`https://www.omdbapi.com/?${params}`, { signal: AbortSignal.timeout(15000), redirect: 'error' });
      if (!response.ok) return send(502, { error: 'The movie service is unavailable. Please retry.' });
      const body = await response.json();
      if (body.Response === 'False') {
        if (/not found/i.test(body.Error ?? '')) return send(200, id ? { movie: null } : { movies: [], total: 0 });
        return send(502, { error: /limit/i.test(body.Error ?? '') ? 'The movie service request limit was reached. Try later.' : 'The movie service could not complete this request. Check configuration or try a more specific title.' });
      }
      const clean = (v) => typeof v === 'string' && v !== 'N/A' ? v : '';
      const mapMovie = (item) => {
        if (!item || !/^tt\d{7,10}$/.test(item.imdbID) || !clean(item.Title)) throw new Error('Invalid movie');
        const rating = Number(item.imdbRating);
        return { id: item.imdbID, title: item.Title, year: clean(item.Year), genre: clean(item.Genre), rating: Number.isFinite(rating) && rating >= 0 && rating <= 10 ? rating : null, posterUrl: /^https:\/\//.test(item.Poster ?? '') ? item.Poster : '', plot: clean(item.Plot), director: clean(item.Director), runtime: clean(item.Runtime) };
      };
      const getMovieDetails = (movieId) => {
        const detailsKey = new URLSearchParams({ i: movieId, plot: 'full' }).toString();
        const detailsCached = cache.get(detailsKey);
        if (detailsCached && detailsCached.expires > now()) return Promise.resolve(detailsCached.body.movie);
        const existingRequest = detailRequests.get(detailsKey);
        if (existingRequest) return existingRequest;
        const request = withDetailLimit(async () => {
          if (now() - windowStart >= 60_000) { windowStart = now(); calls = 0; }
          if (calls >= 30) {
            const error = new Error('Movie request limit reached.');
            error.statusCode = 429;
            throw error;
          }
          calls++;
          const detailParams = new URLSearchParams({ i: movieId, plot: 'full', apikey: key });
          const detailResponse = await fetcher(`https://www.omdbapi.com/?${detailParams}`, { signal: AbortSignal.timeout(15000), redirect: 'error' });
          if (!detailResponse.ok) throw new Error('The movie service is unavailable.');
          const detailBody = await detailResponse.json();
          if (detailBody.Response !== 'True') throw new Error('The movie service could not provide movie details.');
          return mapMovie(detailBody);
        }).then((movie) => {
          store(detailsKey, { movie });
          return movie;
        }).finally(() => detailRequests.delete(detailsKey));
        detailRequests.set(detailsKey, request);
        return request;
      };
      if (body.Response !== 'True') throw new Error('Invalid response');
      const result = id
        ? { movie: await getMovieDetails(id) }
        : {
            movies: await Promise.all(body.Search.map(async (item) => {
              const searchResult = mapMovie(item);
              const details = await getMovieDetails(searchResult.id);
              return { ...searchResult, ...details };
            })),
            total: Number(body.totalResults) || 0,
          };
      store(cacheKey, result);
      return send(200, result);
    } catch (error) {
      if (error?.statusCode === 429) {
        res.setHeader('Retry-After', '60');
        return send(429, { error: 'Too many movie requests. Please retry in a minute.' });
      }
      return send(502, { error: 'The movie service could not be reached. Please retry.' });
    }
  };
}
export default createMovieHandler();
