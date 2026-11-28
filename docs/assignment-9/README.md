# Assignment 9 — Button lifecycle

Branch: `fe09-button-lifecycle` (based on the completed A8 checkpoint).
Demo route: `/motion-lab`. A reviewer can use it without credentials or API keys.

## Try the complete flow

1. Leave **Success** selected. Hover or Tab to **Send message**; activate with Space, Enter, or a pointer. It moves through loading and success, then returns to idle.
2. Select **Failure** and send. The error stays visible. Select **Success**, then **Try again**, to demonstrate recovery.
3. Select **Surprise me** for a random 900–1800 ms delay and a 20% failure probability.
4. Click repeatedly while loading. **Send requests started** should increase only once. Hovering or focusing during a transition must remain smooth.
5. Clear the message or enable **Disable buttons**. **Preview reduced motion** demonstrates the alternative choreography. The actual OS preference works independently and cannot be turned off by that checkbox.
6. **Save movie** demonstrates the same component, timings and recovery in a second visual variant. Both actions are simulated; no message is sent and no favorite is persisted.

## Motion choices

A 90 ms press responds directly; 150 ms hover and focus feedback stays quick. Labels, icons, feedback and state surfaces dissolve over 200 ms using `cubic-bezier(0.2, 0.8, 0.2, 1)`, which starts promptly and decelerates gently. Success holds for 900 ms so the confirmation can be read. The loading spinner rotates linearly every 800 ms; the error icon shakes once over 320 ms. Under reduced motion, translation, scale, rotation and shaking are removed, while a 100 ms opacity fade, meaningful labels, icons and colors retain feedback.

Only `transform` and `opacity` are animated. The button reserves its width and height; its five visual faces stay mounted. Feedback shares one grid cell, so wrapping is reserved before any state changes. There are no frame-by-frame React updates or layout measurements.

## Component and contract

- [`AsyncActionButton.tsx`](../../src/components/AsyncActionButton.tsx) accepts `action(signal): Promise<void>`, typed labels and feedback for idle/loading/success/error/disabled, a visual variant, an optional disabled flag, and an optional state callback.
- [`async-action-button.css`](../../src/components/async-action-button.css) owns hover, focus, press, state transitions and reduced-motion behavior.
- [`MotionLabPage.tsx`](../../src/pages/MotionLabPage.tsx) supplies the two actions and reviewer controls.
- [`simulate-action.ts`](../../src/services/simulate-action.ts) captures the requested result on activation and cleans up its timer when aborted.

A synchronous ref blocks duplicate requests before React renders. Loading and success use `aria-disabled` to retain keyboard focus, with an activation guard; externally disabled buttons also use native `disabled`. Failed actions remain retryable. Unmounting aborts pending work and clears the success-reset timer, and late results from an aborted action are ignored. Native buttons support Enter/Space, a persistent ring marks keyboard focus, and a polite live region announces feedback separately from the decorative animation layers.

## Verification

- `npm test`: **64 tests passed**, including 11 new checks covering button lifecycle, repeat activation, keyboard activation/focus retention, persistent failure and recovery, disabled controls, cancellation, timer cleanup, demo controls, and the 20% threshold.
- Production build: passed; TypeScript strict checking is part of `npm run build`.
- Live Chrome verification at 1363 × 936: send success and automatic reset, persistent forced error, successful retry, double-click protection, retained keyboard focus, disabled controls, empty-input feedback, and the independent Save success state were observed.
- Computed styles: send button content width remained **222 px** in idle, loading and error (224 px including borders). With the reduced-motion preview enabled, loading had no transform, spinner animation was `none`, the fade was **0.1 s**, and the error icon's animation was `none`.
- Screenshots: [idle](evidence/desktop-idle.jpg), [persistent error](evidence/desktop-error.jpg), and [reduced-motion error](evidence/reduced-motion-error.jpg).
- The CSS also respects the OS `prefers-reduced-motion` media query. OS-level emulation, a 375 px viewport and physical mobile browsers were not exercised in this cloud session.
- Demo: https://flyrank-frontend-capstone-git-fe09-button-d06295-niknaxthegreek.vercel.app/motion-lab — Vercel account access or an unexpired Share link is required by the existing project policy.

The local headless browser could not start because this execution environment blocks its socket creation, so the live checks above were completed in the cloud browser. Browser-extension metadata errors were excluded from application checks; no application errors were observed during the demo flow.

## AI assistance and review

ChatGPT was used to assist with component design, controls and tests. Review caught a missing visually-hidden utility, an inherited reduced-motion rule that would override the documented fade, and a mobile visual ordering choice that would disagree with keyboard order; all were corrected. Live visual review also replaced unsupported decorative arrow glyphs with SVGs and removed an unnecessary outline from the programmatically focused page heading. CSS handles hover/focus/press directly, while React owns only the asynchronous action state. This avoids unnecessary React updates during animation and keeps pointer interruptions independent of request state.
