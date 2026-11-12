import { createServer } from 'node:http';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { createAuditHandler } from './audit-handler.mjs';

const audit = createAuditHandler();
createServer(async (req, res) => {
  if (req.url !== '/api/audit') { res.writeHead(404).end(); return; }
  const abort = new AbortController();
  res.on('close', () => abort.abort());
  try {
    const request = new Request('http://127.0.0.1/api/audit', {
      method: req.method, headers: req.headers, signal: abort.signal,
      ...(req.method === 'GET' || req.method === 'HEAD' ? {} : {
        body: Readable.toWeb(req), duplex: 'half',
      }),
    });
    const response = await audit(request);
    res.writeHead(response.status, Object.fromEntries(response.headers));
    if (response.body) await pipeline(Readable.fromWeb(response.body), res);
    else res.end();
  } catch {
    if (!res.headersSent && !res.destroyed) res.writeHead(500).end();
    else if (!res.destroyed) res.destroy();
  }
}).listen(8787, '127.0.0.1');
