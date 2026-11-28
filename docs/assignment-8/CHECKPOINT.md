# A8 — Resilience / Checkpoint 1

Status: implementation and available-device verification complete; awaiting Portal submission. Mobile Safari is explicitly untested because no Apple device was available.

Public checkpoint preview: https://flyrank-frontend-capstone-git-fe08-resili-0333c8-niknaxthegreek.vercel.app/pick-a-movie
Branch: fe08-resilience-checkpoint
Verification date: 19 November 2026

Signed-out preview access and a live Inception lookup were verified on 21 November 2026. The branch alias above was independently read without sign-in on 27 November 2026; the Git-triggered Vercel deployment of `bed9ba3c` reached READY with TypeScript/Vite compilation. The original seven-day share-link instructions are superseded. This audit did not execute a fresh live generation or rerun automated tests. All nine original screenshots were hash-matched against the supplied ZIP.

## Verification results

| Case | Handling | Evidence |
|---|---|---|
| Happy path and multiple turns | Streaming text, retained history | Desktop screenshots; successful live interaction |
| Happy-path console | No new console errors in the cleared Console during a completed request | [06-clean-console.png](screenshots/06-clean-console.png) |
| Offline before send | Error panel, retained conversation and retry | [02-offline-error.png](screenshots/02-offline-error.png) |
| Recovery after network restored | Failed turn can be retried | [03-offline-recovery.png](screenshots/03-offline-recovery.png) |
| Interruption after partial output | Partial answer marked interrupted with error and retry | [04-interrupted-stream.png](screenshots/04-interrupted-stream.png) |
| Recovery after interrupted output | Reply completes after retry | [05-stream-recovery.png](screenshots/05-stream-recovery.png); automated retry tests |
| 429 rate limit | Error then successful retry, single user message | Injected HTTP 429 component test; provider-error server test |
| Malformed tool output | Friendly validation error then successful retry | Injected invalid SSE tool result component test |
| Abrupt stream closure | Partial answer retained and retry offered when done is missing | Truncated stream component test |
| No matching movie | Designed error says check title and try again | [07-no-matching-movie.png](screenshots/07-no-matching-movie.png); assistant live check |
| Valid movie lookup | Arrival card with rating, genre, runtime and IMDb link | [08-arrival-card.png](screenshots/08-arrival-card.png); assistant live check |
| Whitespace input | Send remains disabled | User confirmed manual check |
| First run | Instructions and click-to-fill example enable Send | User confirmed manual check; assistant live check |
| Slow response | Skeleton; wait/stop guidance after 8 seconds; Stop clears pending state | Controlled-timer component test |
| Route rendering failure | Page retry and catalogue link; successful recovery | Injected rendering exception component test |
| Android mobile | Keyboard/input/Send reachable; reply readable; vertical scroll works without horizontal scrolling | [09-android-mobile.jpg](screenshots/09-android-mobile.jpg) and user confirmation |
| Safari / mobile Safari | Not tested | No Apple device available; Android is not a substitute |

429, malformed output, slow-timer and route-boundary sabotage were automated in the real React components using mocked network responses. They were not injected into the deployed browser. No public sabotage endpoint was added. The mid-stream screenshot shows an interrupted response while offline; its provider error message alone does not establish which upstream event caused the interruption. Transport-closure detection is separately verified by the automated test.

## Original automated checks — 19 November 2026

- npm test: 53 tests passed across 11 files.
- npm run build: passed, including TypeScript compilation.
- Existing bundle-size and dependency annotation warnings remain; neither fails the build.
- Automated tests make no real AI calls.
- Browser layout-shift/CLS measurement was not performed.


## Retry contract

Retry failed message resends the failed user turn with earlier conversation context. It replaces the failed assistant attempt without regenerating earlier turns or appending another user message. A synchronous in-flight guard blocks duplicate clicks. Stop works during retry. A new send clears the previous retry target. Tool execution errors also expose retry.

## Stack adaptation

The app uses React/Vite, React Router, Gemini REST streaming and a typed SSE consumer. RouteErrorBoundary supplies the route error-boundary behavior requested as Next.js error.tsx. Chat recovery uses local error state rather than useChat.error. The movie catalogue, lookup tool, favorites and authentication remain part of the application; favorites/auth were covered by the automated suite, not manually re-verified on this preview.

## Evidence and submission

All nine original screenshots are packaged in [screenshots/](screenshots/) and were independently hash-verified against the supplied ZIP on 27 November. The original phone capture shows the transcript and beginning of the composer; the full keyboard/scroll interaction was confirmed separately during manual testing. See [EVIDENCE.md](EVIDENCE.md) for direct links and [SUBMISSION.md](SUBMISSION.md) for the Portal text. Portal submission has not been performed.

## AI assistance

ChatGPT was used for recovery design, route error handling, failure tests and configuration diagnosis. Manual deployment checks confirmed keyboard and scrolling behavior, with desktop and mobile evidence captured.
