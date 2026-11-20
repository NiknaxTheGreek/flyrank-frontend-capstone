import { useEffect, useState } from 'react';
export default function HealthPage() {
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ ok: boolean; message: string; title?: string } | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    setResult(null);
    fetch('/api/health', { signal: controller.signal }).then(async response => {
      const data = await response.json();
      if (!controller.signal.aborted) setResult({ ok: response.ok && data.ok === true, message: typeof data.message === 'string' ? data.message : 'Unexpected response.', title: typeof data.title === 'string' ? data.title : undefined });
    }).catch(() => { if (!controller.signal.aborted) setResult({ ok: false, message: 'The health service could not be reached. Try again.' }); });
    return () => controller.abort();
  }, [attempt]);
  return <section className="intro"><h1 tabIndex={-1}>Service health</h1><p>This checks a real server-side data fetch from JSONPlaceholder. It does not check OMDb, Firebase or authentication.</p>
    <div role={result?.ok === false ? 'alert' : 'status'} aria-live="polite"><h2>{result ? result.ok ? 'Success' : 'Failure' : 'Checking service…'}</h2><p>{result?.message}</p>{result?.title && <p>Fetched record #1: {result.title}</p>}</div>
    <button type="button" className="primary-button" disabled={!result} onClick={() => setAttempt(n => n + 1)}>Run health check again</button>
  </section>;
}
