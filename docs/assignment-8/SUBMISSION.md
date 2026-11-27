# Assignment 8 — Resilience / Checkpoint 1

## Assignment overview

In this assignment, the streaming movie assistant becomes a more resilient application. Network failures, interrupted replies, slow requests and unavailable data are handled with clear feedback, preserved conversation history and a way to recover.

**Live preview:** [Reel Good movie picker](https://flyrank-frontend-capstone-git-fe08-resili-0333c8-niknaxthegreek.vercel.app/pick-a-movie)  
**Repository:** [fe08-resilience-checkpoint](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe08-resilience-checkpoint)

## Implementation and evaluation

| Criterion | Implementation and evidence |
|---|---|
| End-to-end primary flow | Original hosted recommendation and lookup captures; public preview and current build verified 27 November. |
| Mid-stream failure and retry | Partial output is retained and a designed error offers Retry failed message. The historical browser captures and mocked component test document failure and recovery. |
| Useful empty states | Instructions and a click-to-fill example guide first-time users; blank input cannot be submitted; missing movie titles receive correction guidance. |
| Clean happy-path console | Original completed-request screenshot shows an empty DevTools Console; this is scoped to the recorded happy path. |
| Responsive interaction | Original Android phone capture and learner-reported keyboard/scroll checks; mobile-safe sizing and wrapping in the source. Safari/mobile Safari remain untested. |

The application also handles offline requests, HTTP 429, malformed structured output, premature stream closure, slow responses and route rendering failures. See the [failure inventory and retry contract](CHECKPOINT.md) and [component sabotage tests](../../src/components/MovieChat.test.tsx). The original development verification recorded 53 passing tests across 11 files. The latest audited Git-triggered deployment of `bed9ba3c` reached READY and compiled TypeScript/Vite successfully. No fresh automated test run, interactive generation or browser-console session was performed in the 27 November audit.

## Reviewer walkthrough

Open the preview and request a recommendation or movie lookup using any suitable prompt. Observe the completed response. Use browser network controls to simulate an offline request or interrupt a longer response, restore connectivity, then choose **Retry failed message**. Check that earlier turns remain and the failed assistant attempt is replaced. Explore the initial empty state and an unmatched movie title for recovery guidance.

## Screenshot evidence

Original captures from 19 November 2026. All nine files were compared with the supplied ZIP on 27 November and match its Git blob hashes exactly.

| Evidence | Original upload | What it demonstrates |
|---|---|---|
| [Happy path](screenshots/01-happy-path.png) | `image(20261119-155441).png` | A completed comedy recommendation appears in the conversation, with the input and action controls available. Two identical user messages are visible; this capture is not evidence of duplicate-click prevention. |
| [Offline before send](screenshots/02-offline-error.png) | `image(20261119-155900).png` | Chrome Network is set to Offline. A failed request displays a designed error, reassurance that earlier messages are safe, and Retry failed message. |
| [Network restored](screenshots/03-offline-recovery.png) | `image(20261119-160035).png` | The earlier failed action-movie request has a completed recommendation after connectivity is restored. The Network panel retains earlier failed requests. |
| [Interrupted response](screenshots/04-interrupted-stream.png) | `image(20261119-160734).png` | Partial recommendations remain visible, with an Interrupted label, an error panel and Retry failed message. Offline is selected; the provider error wording does not identify the precise upstream cause. |
| [Recovery after interruption](screenshots/05-stream-recovery.png) | `image(20261119-161330).png` | A longer recommendation completes after the documented retry; the Network panel shows the successful request alongside prior failures. |
| [Happy-path console](screenshots/06-clean-console.png) | `image(20261119-181933).png` | A completed recommendation alongside the visible, empty DevTools Console. This supports the recorded clean-console check for that request, not all possible requests. |
| [No matching movie](screenshots/07-no-matching-movie.png) | `image(20261119-183216).png` | The corrected deployment returns a designed no-match tool card, with guidance and Retry failed message. |
| [Successful lookup](screenshots/08-arrival-card.png) | `image(20261119-183241).png` | A structured movie card includes rating, genre, runtime, plot and an IMDb link on the corrected deployment. |
| [Android mobile](screenshots/09-android-mobile.jpg) | `01-1000160253.jpg` | Real phone screenshot shows a readable recommendation, wrapped chat content, Jump to latest and the start of the composer. Reachability of the remaining controls and keyboard behavior were learner-confirmed separately. |

See the [evidence inventory](EVIDENCE.md) for the original screenshot links. The original screenshots are the primary submission evidence; no fresh captures were created.

## Verification scope

The React/Vite stack provides a React Router error boundary and local chat recovery rather than Next.js `error.tsx` and `useChat.error`. Rate-limit, malformed-output, slow-timer and route-render sabotage were tested using mocks rather than a public failure endpoint. The original manual network tests and Android checks are documented in the checkpoint. Mobile Safari and CLS measurement remain unverified. Repository-wide historical credential remediation is tracked separately. Portal submission is pending.
