export type DemoOutcome = 'success' | 'failure' | 'random';

/** Demo only: no API, account, or persistent write. Capture the outcome at activation. */
export function simulateAction(outcome: DemoOutcome, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Cancelled', 'AbortError'));
      return;
    }
    const shouldFail = outcome === 'failure' || (outcome === 'random' && Math.random() < 0.2);
    const delay = 900 + Math.floor(Math.random() * 901);
    const cancel = () => {
      clearTimeout(timer);
      reject(new DOMException('Cancelled', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', cancel);
      if (shouldFail) reject(new Error('Simulated request failure'));
      else resolve();
    }, delay);
    signal.addEventListener('abort', cancel, { once: true });
  });
}
