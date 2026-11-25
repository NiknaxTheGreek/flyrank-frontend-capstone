// A bounded, fixed public data fetch; no provider credentials or database access.
export function createHealthHandler({ fetcher = fetch } = {}) {
  return async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); res.statusCode = 405; return res.end(JSON.stringify({ ok: false, message: 'Method not allowed.' })); }
    let result;
    try {
      const response = await fetcher('https://jsonplaceholder.typicode.com/todos/1', { signal: AbortSignal.timeout(5000), redirect: 'error' });
      const data = response.ok ? await response.json() : null;
      result = data?.id === 1 && typeof data.title === 'string' && data.title.trim()
        ? { ok: true, message: 'Data fetched successfully.', title: data.title.slice(0, 200), id: 1 }
        : { ok: false, message: 'The data service returned an unexpected response.' };
    } catch { result = { ok: false, message: 'The data service could not be reached within the request timeout. Please retry.' }; }
    res.statusCode = result.ok ? 200 : 502;
    res.end(JSON.stringify(result));
  };
}
export default createHealthHandler();
