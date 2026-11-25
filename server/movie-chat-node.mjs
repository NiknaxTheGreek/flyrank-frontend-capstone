import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

export const asNodeMiddleware = handler => async (req, res) => {
  const abort = new AbortController();
  res.on('close', () => abort.abort());
  try {
    const request = new Request(`${req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'}://${req.headers.host || 'localhost'}/api/movie-chat`, {
      method: req.method, headers: req.headers, signal: abort.signal,
      ...(req.method === 'GET' || req.method === 'HEAD' ? {} : { body: Readable.toWeb(req), duplex: 'half' }),
    });
    const response = await handler(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) await pipeline(Readable.fromWeb(response.body), res);
    else res.end();
  } catch {
    if (!res.headersSent && !res.destroyed) res.writeHead(500).end();
    else if (!res.destroyed) res.destroy();
  }
};

