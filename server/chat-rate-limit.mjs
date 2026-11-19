// Per warm server instance: a bounded abuse brake, not a distributed quota.
// Vercel overwrites x-vercel-forwarded-for. Never trust arbitrary x-forwarded-for.
export function createChatRateLimit({ now = Date.now, limit = 10, windowMs = 60_000, maxClients = 2000 } = {}) {
  const clients = new Map();
  let total = 0, globalReset = 0;
  return request => {
    const time = now();
    if (time >= globalReset) { total = 0; globalReset = time + 3_600_000; }
    if (total >= 1000) return { allowed: false, retryAfter: Math.max(1, Math.ceil((globalReset - time) / 1000)) };
    const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0].trim() || 'local';
    let entry = clients.get(ip);
    if (!entry || time >= entry.reset) {
      for (const [key, value] of clients) if (time >= value.reset) clients.delete(key);
      // Fall back to one shared bucket rather than allocate unbounded IP state.
      const key = clients.size >= maxClients && !clients.has(ip) ? 'overflow' : ip;
      entry = clients.get(key);
      if (!entry || time >= entry.reset) { entry = { count: 0, reset: time + windowMs }; clients.set(key, entry); }
    }
    if (entry.count >= limit) return { allowed: false, retryAfter: Math.max(1, Math.ceil((entry.reset - time) / 1000)) };
    entry.count++; total++;
    return { allowed: true };
  };
}
