import { useEffect, useId, useRef, useState } from 'react';
import './async-action-button.css';

export type ActionState = 'idle' | 'loading' | 'success' | 'error';
type DisplayState = ActionState | 'disabled';

export interface AsyncActionButtonProps {
  action: (signal: AbortSignal) => Promise<void>;
  labels: Record<DisplayState, string>;
  feedback: Record<DisplayState, string>;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  onStateChange?: (state: ActionState) => void;
}

const faces: DisplayState[] = ['idle', 'loading', 'success', 'error', 'disabled'];
export const SUCCESS_HOLD_MS = 900;

function ActionIcon({ state }: { state: DisplayState }) {
  if (state === 'loading') return <span className="async-action-button__spinner" />;
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {state === 'success' ? <path d="m5 12 4 4L19 6" />
      : state === 'error' ? <><path d="M4 10a8 8 0 1 1 1 8M4 5v5h5" /><path d="M12 7v5m0 4h.01" /></>
        : state === 'disabled' ? <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>
          : <><path d="m4 4 17 8-17 8 3-8-3-8Z" /><path d="M7 12h14" /></>}
  </svg>;
}

/** Owns one async operation. CSS owns hover, focus and press, so they stay interruptible. */
export default function AsyncActionButton({
  action, labels, feedback, disabled = false, variant = 'primary', onStateChange,
}: AsyncActionButtonProps) {
  const [state, setState] = useState<ActionState>('idle');
  const inFlight = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const feedbackId = useId();
  const visibleState: DisplayState = disabled && state === 'idle' ? 'disabled' : state;
  const blocked = disabled || state === 'loading' || state === 'success';

  useEffect(() => { onStateChange?.(state); }, [state, onStateChange]);
  useEffect(() => () => {
    controller.current?.abort();
    if (resetTimer.current !== null) clearTimeout(resetTimer.current);
  }, []);

  async function run() {
    // A ref locks synchronously, including clicks dispatched before React re-renders.
    if (disabled || inFlight.current) return;
    inFlight.current = true;
    const request = new AbortController();
    controller.current = request;
    setState('loading');
    try {
      await action(request.signal);
      if (request.signal.aborted) return;
      setState('success');
      resetTimer.current = setTimeout(() => {
        inFlight.current = false;
        resetTimer.current = null;
        setState('idle');
      }, SUCCESS_HOLD_MS);
    } catch {
      if (request.signal.aborted) return;
      inFlight.current = false;
      // Errors persist. The next activation calls the latest action, allowing recovery.
      setState('error');
    } finally {
      if (controller.current === request) controller.current = null;
    }
  }

  return <div className="async-action" data-variant={variant}>
    <button
      type="button"
      className="async-action-button"
      data-state={visibleState}
      aria-label={labels[visibleState]}
      aria-describedby={feedbackId}
      aria-disabled={blocked}
      aria-busy={state === 'loading'}
      disabled={disabled}
      onClick={() => { void run(); }}
    >
      <span className="async-action-button__surface" aria-hidden="true" />
      {faces.map(face => <span
        key={face}
        className="async-action-button__face"
        data-visible={face === visibleState}
        data-face={face}
        aria-hidden="true"
      >
        <span className="async-action-button__icon"><ActionIcon state={face} /></span>
        <span>{labels[face]}</span>
      </span>)}
    </button>
    <span className="sr-only" id={feedbackId} role="status" aria-live="polite" aria-atomic="true">
      {feedback[visibleState]}
    </span>
    <div className="async-action__feedback" aria-hidden="true">
      {faces.map(face => <span key={face} data-visible={face === visibleState} data-face={face}>{feedback[face]}</span>)}
    </div>
  </div>;
}
