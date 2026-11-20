# Assignment 12 — Performance and accessibility audit

**Status: fixes and local verification complete; deployed after-audit pending.**

The current public Home page scored **81 performance / 96 accessibility** on Lighthouse mobile. The A12 implementation is available on `fe12-performance-accessibility`, but its Vercel preview requires authentication. Publishing that build or creating a new access link was declined by automatic approval review under the original audit request. Production has not been changed by this assignment.

The local before/after evidence below demonstrates the implementation changes. **Local Home and Account were audited in their handled unconfigured states, without OMDb/Firebase credentials. Their scores do not establish the performance or accessibility of the deployed, populated app.** A12 should remain pending until the authenticated/public A12 deployment has been re-audited.

## Sources and method

- Baseline source: `d03e1ec9d7f755e474ef5e084a3da10765666728` — the A14 release containing the A10 tests and server rate limiting.
- Audit build: `cda985704a496fccab3bbec3a724768cdec09078` — A12 fixes and evidence capture.
- Evidence workflow: [GitHub Actions run 44721157406](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44721157406), completed successfully on 20 November 2026.
- Public baseline: <https://flyrank-frontend-capstone-snowy.vercel.app/> and `/pick-a-movie`.
- Original A12 preview deployment: <https://flyrank-frontend-capstone-3dketxb1h-niknaxthegreek.vercel.app/pick-a-movie> — requires Vercel access.
- Lighthouse 13.6.0, default **mobile** form factor, simulated mobile throttling, cold browser cache per navigation. Exact browser, viewport, throttling and timestamps are retained in each JSON file.
- One recorded Lighthouse run per route/build; scores can vary between runs. Before/after local builds ran on the same GitHub runner and Chromium version.
- The official WAVE Chrome extension evaluated rendered pages. Its engine was not changed or redistributed.
- Screenshots are captures of the original Lighthouse report and WAVE interface. Embedded screenshot bytes were removed from the accompanying JSON to limit repository size; numeric audits were preserved.
- A later route-focus regression fix is covered by the routing test suite: the focus manager now remains mounted across route error-boundary resets.

## Deployed baseline

| Page | Mobile performance | Accessibility | LCP | CLS | A12 deployed after |
| --- | ---: | ---: | ---: | ---: | --- |
| Home | 81 | 96 | 5.01 s | 0 | Pending access/publication |
| Movie picker | 97 | 100 | 1.01 s | 0 | Pending access/publication |

Evidence: [Home screenshot](docs/assignment-12/evidence/live-before/home-mobile.jpg), [Home data](docs/assignment-12/evidence/live-before/home-mobile.json), [chat screenshot](docs/assignment-12/evidence/live-before/chat-mobile.jpg), [chat data](docs/assignment-12/evidence/live-before/chat-mobile.json).

The populated Home audit identified a lazy-loaded LCP poster without a priority hint, oversized image delivery, and undersized IMDb link targets adjacent to the save action. These are distinct from the unconfigured local page measured below. Image sizing, first-row loading priority and touch targets were improved; the live result still needs measurement.

## Comparable local before/after runs

| Page | Performance before → after | Accessibility before → after | Total transferred before → after | Reduction |
| --- | ---: | ---: | ---: | ---: |
| Home, unconfigured state | 100 → 100 | 100 → 100 | 175,270 B → 65,538 B | 62.6% |
| Movie picker, initial state | 100 → 100 | 100 → 100 | 174,505 B → 95,735 B | 45.1% |

The local scores were already at the ceiling. The measurable improvements are smaller initial transfers, removal of WAVE findings, and usable streamed announcements. Chat LCP increased from 0.76 s to 1.56 s after route splitting, and CLS rose from 0 to 0.028 while the lazy route resolved. This remains within the 0.1 CLS target, but the loading transition should be reviewed again on the live build.

| Local evidence | Before | After |
| --- | --- | --- |
| Home Lighthouse | [Screenshot](docs/assignment-12/evidence/local-before/home-mobile.jpg) · [data](docs/assignment-12/evidence/local-before/home-mobile.json) | [Screenshot](docs/assignment-12/evidence/local-after/home-mobile.jpg) · [data](docs/assignment-12/evidence/local-after/home-mobile.json) |
| Chat Lighthouse | [Screenshot](docs/assignment-12/evidence/local-before/chat-mobile.jpg) · [data](docs/assignment-12/evidence/local-before/chat-mobile.json) | [Screenshot](docs/assignment-12/evidence/local-after/chat-mobile.jpg) · [data](docs/assignment-12/evidence/local-after/chat-mobile.json) |

## Findings and fixes

| Finding | Change | Verification |
| --- | --- | --- |
| Every page downloaded the same application and Firebase code. | Lazy-load account, favorites, detail, chat and motion routes. Load Firebase services through guarded asynchronous provider imports. Preserve subscription cleanup and error states. | Reduced transfer sizes above; authentication/favorites regression tests still pass. |
| First visible posters were lazy-loaded like off-screen images. | Eager-load and prioritize the first two visible posters; retain lazy loading for the rest. Add intrinsic dimensions, async decoding and a connection hint for the poster host. | Production build/type checks passed; live LCP improvement remains pending. |
| IMDb links had 20 px high targets too close to adjacent controls. | Give IMDb and navigation links a 44 px minimum target height. | CSS/source review; populated live accessibility recheck pending. |
| No skip navigation; route focus could be lost on lazy navigation. | Add a visible-on-focus skip link targeting focusable `main`, current-page navigation semantics, and heading focus after client-side navigation. Keep the focus manager outside the keyed route boundary. | Keyboard audit and the lazy-route heading-focus regression test. |
| WAVE inspected opacity-zero button faces/feedback, flagging hidden text; decorative separators also had weak contrast. | Hide inactive faces with delayed `visibility` after their opacity transition, improve separator contrast, and replace the tiny decorative bullet with a CSS dot. | Motion WAVE contrast findings 13 → 0; alerts 1 → 0. State transitions and reduced-motion feedback remain implemented. |
| The live region announced that streaming started, without reading the reply. | Announce completed sentences in polite, atomic batches, with bounded chunks for long sentences and a final flush. Retain the visible transcript independently. | Streaming announcement component test plus a real streamed HTTP fixture in the keyboard audit. |
| Streaming stop/retry must remain reachable. | Preserve the labelled native Stop button, visible keyboard focus, abort behavior and input focus return. | Tab/Space stop mid-stream; Enter retry and subsequent result card verified. |
| Document metadata still described the earlier dashboard. | Set Reel Good title, description and theme metadata. | Built HTML reviewed; no score improvement is claimed for metadata. |

## WAVE results

| Audited local page/state | Errors before → after | Contrast errors before → after | Alerts before → after |
| --- | ---: | ---: | ---: |
| Home, unconfigured data | 0 → 0 | 0 → 0 | 0 → 0 |
| Movie picker, empty conversation | 0 → 0 | 0 → 0 | 0 → 0 |
| Motion lab, idle | 0 → 0 | 13 → 0 | 1 → 0 |
| Account, unconfigured fallback | 0 → 0 | 0 → 0 | 0 → 0 |

No alerts remain in those after states. [Before Motion WAVE screenshot](docs/assignment-12/evidence/local-before/wave/motion.jpg) · [After Motion WAVE screenshot](docs/assignment-12/evidence/local-after/wave/motion.jpg).

Raw results: [before summary](docs/assignment-12/evidence/local-before/wave/summary.json), [after summary](docs/assignment-12/evidence/local-after/wave/summary.json). Active Firebase sign-in, populated live Home, signed-in favorites and live chat response states need the final deployed WAVE pass. Zero automated errors does not replace manual accessibility review.

## Keyboard and AI-specific checks

The fixed production bundle was served with a deterministic HTTP streaming fixture replacing the AI endpoint. All interactions used keyboard input; no AI provider requests were made.

- First Tab reveals the skip link; Enter focuses main content.
- The example action is reachable and focuses the labelled textarea.
- A reply sentence reaches `aria-live="polite"`, `aria-atomic="true"` before the response finishes.
- Tab reaches Stop with a visible focus ring. Space stops mid-stream, preserves the partial reply and returns focus to the textarea.
- A subsequent keyboard-only turn renders the typed movie result card.
- An interrupted reply exposes its alert and a working Enter-activated retry.
- The conversation and controls fit 375 px and 320 px without horizontal overflow.
- No browser console errors or uncaught page errors were observed in this fixture journey.

[Machine-readable keyboard checks](docs/assignment-12/evidence/keyboard/checks.json) · [skip link](docs/assignment-12/evidence/keyboard/skip-link.jpg) · [focused Stop](docs/assignment-12/evidence/keyboard/stop-focused.jpg) · [recovered result](docs/assignment-12/evidence/keyboard/recovered-tool.jpg) · [phone layout](docs/assignment-12/evidence/keyboard/phone-conversation.jpg).

This is Chromium keyboard verification. Physical mobile Safari and an NVDA/VoiceOver listening pass were not performed in this audit.

## Reproduce

```bash
npm ci
npx playwright install --with-deps chromium
npm run build
npm run preview
```

In another terminal, run `npm run audit:lighthouse`. For WAVE, set `WAVE_EXTENSION` to an unpacked copy of the official extension and run `npm run audit:wave`. The scripts accept `AUDIT_URL`, `AUDIT_PHASE`, `AUDIT_OUTPUT` and an optional `AUDIT_CHROME_PATH`.

Run `node scripts/audit-keyboard.mjs` after building; it serves the built files and synthetic stream on localhost:4188. The CI workflow reproduces the baseline build from its pinned commit, audits both builds, and emits the evidence archive without relying on Actions artifact storage. Evidence is then committed to this branch.

## Remaining release check

Obtain access to the A12 preview or authorize publishing its tested build to the public site. Then run mobile Lighthouse on the populated Home and chat routes, run WAVE on the deployed key pages/states, and repeat the keyboard flow with the real deployed endpoint. Record the live-after screenshots and verify **90+ performance and accessibility** before marking A12 complete or submitting it.
