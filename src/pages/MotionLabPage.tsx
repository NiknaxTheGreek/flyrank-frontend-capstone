import { useState } from 'react';
import { Link } from 'react-router-dom';
import AsyncActionButton, { type ActionState, type AsyncActionButtonProps } from '../components/AsyncActionButton';
import { simulateAction, type DemoOutcome } from '../services/simulate-action';
import './motion-lab.css';

const sendLabels: AsyncActionButtonProps['labels'] = {
  idle: 'Send message', loading: 'Sending…', success: 'Message sent', error: 'Try again', disabled: 'Send unavailable',
};
const sendFeedback: AsyncActionButtonProps['feedback'] = {
  idle: 'Ready when you are.', loading: 'Your message is on its way.', success: 'Delivered. Ready for the next scene.',
  error: 'Couldn’t send. Your message is safe to retry.', disabled: 'Add a message and enable the buttons to send.',
};
const saveLabels: AsyncActionButtonProps['labels'] = {
  idle: 'Save movie', loading: 'Saving…', success: 'Movie saved', error: 'Retry save', disabled: 'Save unavailable',
};
const saveFeedback: AsyncActionButtonProps['feedback'] = {
  idle: 'Keep a good film for another night.', loading: 'Adding it to your list.', success: 'A good choice, saved.',
  error: 'Couldn’t save. Try once more.', disabled: 'Enable the buttons to save this movie.',
};
const scenarios: { value: DemoOutcome; title: string; description: string }[] = [
  { value: 'success', title: 'Success', description: 'A smooth delivery, every time.' },
  { value: 'failure', title: 'Failure', description: 'Keep the error visible. Give retry a try.' },
  { value: 'random', title: 'Surprise me', description: 'A 20% chance of failure.' },
];

export default function MotionLabPage() {
  const [outcome, setOutcome] = useState<DemoOutcome>('success');
  const [disabled, setDisabled] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [message, setMessage] = useState('A thoughtful sci-fi film for tonight. Something like Arrival.');
  const [sendState, setSendState] = useState<ActionState>('idle');
  const [attempts, setAttempts] = useState(0);

  async function send(signal: AbortSignal) {
    setAttempts(count => count + 1);
    await simulateAction(outcome, signal);
  }

  return <div className="motion-lab" data-reduced-motion={reducedMotion}>
    <section className="motion-intro" aria-labelledby="motion-title">
      <p className="eyebrow">Assignment 09 / Interaction study</p>
      <h1 id="motion-title" tabIndex={-1}>A small action.{' '}<br /><span>A clear response.</span></h1>
      <p>Every click has a story. The button should tell you where you are in it.</p>
      <span className="motion-intro__tag"><span aria-hidden="true" /> A motion study for Reel Good</span>
    </section>

    <div className="motion-grid">
      <section className="motion-stage" aria-labelledby="send-title" data-action-state={sendState}>
        <div className="motion-card-heading"><span className="motion-index">01</span><span>The conversation starter</span><span className="motion-card-heading__mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 18 18 6M6 6h12v12" /></svg></span></div>
        <div className="motion-stage__body">
          <div className="motion-chat-mark" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M7 5h18a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H14l-8 5v-5a3 3 0 0 1-3-3V9a4 4 0 0 1 4-4Z" /><path d="M10 12h12M10 17h8" /></svg></div>
          <h2 id="send-title">Set the mood for movie night.</h2>
          <p className="motion-subtitle">One message. A little anticipation. A clear outcome.</p>
          <label className="motion-message-label" htmlFor="motion-message">Your message</label>
          <textarea id="motion-message" value={message} onChange={event => setMessage(event.target.value)} maxLength={280} rows={3} />
          <div className="motion-message-meta"><span>Demo message · nothing is sent</span><span>{message.length}/280</span></div>
          <AsyncActionButton
            action={send} labels={sendLabels} feedback={sendFeedback}
            disabled={disabled || !message.trim()} onStateChange={setSendState}
          />
        </div>
        <div className="motion-state-strip" aria-label="Button lifecycle">
          <span data-step="idle" data-current={sendState === 'idle'}>Idle</span><i aria-hidden="true">/</i>
          <span data-step="hover">Hover / focus</span><i aria-hidden="true">/</i>
          <span data-current={sendState === 'loading'}>Loading</span><i aria-hidden="true">/</i>
          <span data-current={sendState === 'success'}>Success</span><i aria-hidden="true">/</i>
          <span data-current={sendState === 'error'}>Error</span>
        </div>
      </section>

      <aside className="motion-controls" aria-labelledby="controls-title">
        <div className="motion-card-heading"><span className="motion-index">02</span><span>You're the director</span></div>
        <div className="motion-controls__body">
          <h2 id="controls-title">Set the scene.</h2>
          <p className="motion-subtitle">Choose the outcome, then press either button.</p>
          <fieldset className="motion-scenarios">
            <legend>Next result</legend>
            {scenarios.map(scenario => <label key={scenario.value} className="motion-scenario">
              <input type="radio" name="motion-outcome" value={scenario.value} checked={outcome === scenario.value} onChange={() => setOutcome(scenario.value)} />
              <span><strong>{scenario.title}</strong><small>{scenario.description}</small></span>
              <span className="motion-scenario__dot" data-kind={scenario.value} aria-hidden="true" />
            </label>)}
          </fieldset>
          <p className="motion-retry-hint">To test recovery: choose <strong>Failure</strong> and send, then choose <strong>Success</strong> and <strong>Try again</strong>.</p>
          <div className="motion-toggles">
            <label><input type="checkbox" checked={disabled} onChange={event => setDisabled(event.target.checked)} /><span>Disable buttons</span></label>
            <label><input type="checkbox" checked={reducedMotion} onChange={event => setReducedMotion(event.target.checked)} /><span>Preview reduced motion</span></label>
          </div>
          <p className="motion-system-note">Your device’s reduced-motion preference is always respected.</p>
          <div className="motion-attempts"><span>Send requests started</span><output aria-label="Send requests started">{String(attempts).padStart(2, '0')}</output></div>
        </div>
      </aside>
    </div>

    <section className="motion-save" aria-labelledby="save-title">
      <div className="motion-save__copy"><span className="motion-index">03 / Same rhythm, another action</span><h2 id="save-title">A future favorite.</h2><p>Arrival <span>2016 · Science fiction</span></p></div>
      <div className="motion-save__action"><AsyncActionButton action={signal => simulateAction(outcome, signal)} labels={saveLabels} feedback={saveFeedback} disabled={disabled} variant="secondary" /></div>
    </section>

    <section className="motion-notes" aria-labelledby="motion-notes-title">
      <p className="eyebrow">Behind the motion</p><h2 id="motion-notes-title">Quick feedback. Room to read.</h2>
      <div className="motion-note-grid">
        <article><span>01 / Timing</span><h3>90 · 150 · 200 ms</h3><p>A 90 ms press feels direct; 150 ms hover and focus feedback feels responsive; 200 ms label transitions leave time to read the change. Success rests for 900 ms.</p></article>
        <article><span>02 / Easing</span><h3>A soft landing.</h3><p>cubic-bezier(0.2, 0.8, 0.2, 1) starts promptly and settles gently. The 800 ms spinner uses linear easing to keep a steady pace.</p></article>
        <article><span>03 / Restraint</span><h3>Only transform + opacity.</h3><p>The button holds its size. Labels, icons and surfaces stay mounted and dissolve between states. Reduced motion uses a 100 ms fade, with no spin, slide or shake.</p></article>
      </div>
      <p className="motion-demo-note">Simulated requests take 0.9–1.8 seconds. No sign-in or API key needed. <Link to="/pick-a-movie">Visit the movie picker <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 18 18 6M6 6h12v12" /></svg></Link></p>
    </section>
  </div>;
}
