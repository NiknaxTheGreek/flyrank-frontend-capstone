# A8 — Resilience / Checkpoint 1

Status: implementation and available-device verification complete; awaiting Portal submission. Mobile Safari is explicitly untested because no Apple device was available.

Reviewed deployment: https://flyrank-frontend-capstone-1o85s91sn-niknaxthegreek.vercel.app/pick-a-movie
Branch: fe08-resilience-checkpoint
Verification date: 19 November 2026

The deployment is protected by Vercel Authentication. Use the separately supplied seven-day share link for reviewer access; the bare URL requires authentication. Renew reviewer access before submitting if the link has expired. No permanent anonymous production URL is claimed.

## Verification results

| Case | Handling | Evidence |
|---|---|---|
| Happy path and multiple turns | Streaming text, retained history | Desktop screenshots; successful live interaction |
| Happy-path console | No new console errors in the cleared Console during a completed request | image(20261119-181933).png |
| Offline before send | Error panel, retained conversation and retry | image(20261119-155900).png |
| Recovery after network restored | Failed turn can be retried | image(20261119-160035).png |
| Interruption after partial output | Partial answer marked interrupted with error and retry | image(20261119-160734).png |
| Recovery after interrupted output | Reply completes after retry | image(20261119-161330).png; automated retry tests |
| 429 rate limit | Error then successful retry, single user message | Injected HTTP 429 component test; provider-error server test |
| Malformed tool output | Friendly validation error then successful retry | Injected invalid SSE tool result component test |
| Abrupt stream closure | Partial answer retained and retry offered when done is missing | Truncated stream component test |
| No matching movie | Designed error says check title and try again | image(20261119-183216).png; assistant live check |
| Valid movie lookup | Arrival card with rating, genre, runtime and IMDb link | image(20261119-183241).png; assistant live check |
| Whitespace input | Send remains disabled | User confirmed manual check |
| First run | Instructions and click-to-fill example enable Send | User confirmed manual check; assistant live check |
| Slow response | Skeleton; wait/stop guidance after 8 seconds; Stop clears pending state | Controlled-timer component test |
| Route rendering failure | Page retry and catalogue link; successful recovery | Injected rendering exception component test |
| Android mobile | Keyboard/input/Send reachable; reply readable; vertical scroll works without horizontal scrolling | 1000160253.jpg and user confirmation |
| Safari / mobile Safari | Not tested | No Apple device available; Android is not a substitute |

429, malformed output, slow-timer and route-boundary sabotage were automated in the real React components using mocked network responses. They were not injected into the deployed browser. No public sabotage endpoint was added. The mid-stream screenshot shows an interrupted response while offline; its provider error message alone does not establish which upstream event caused the interruption. Transport-closure detection is separately verified by the automated test.

## Final automated checks

- npm test: 53 tests passed across 11 files.
- npm run build: passed, including TypeScript compilation.
- Existing bundle-size and dependency annotation warnings remain; neither fails the build.
- Automated tests make no real AI calls.
- Browser layout-shift/CLS measurement was not performed.

## Configuration defect found and fixed

The first A8 preview inherited an older default OMDB_API_KEY. A7 had a corrected branch-specific override, so both nonexistent titles and Arrival returned the generic unavailable error on A8. The corrected key was made the active Preview default and A8 was redeployed. The old default remains scoped to the existing backup branch; A7 continues to resolve the corrected default. No key value was read, printed or committed. Live checks on the corrected deployment verified Arrival and the explicit no-match response.

## Retry contract

Retry failed message resends the failed user turn with earlier conversation context. It replaces the failed assistant attempt without regenerating earlier turns or appending another user message. A synchronous in-flight guard blocks duplicate clicks. Stop works during retry. A new send clears the previous retry target. Tool execution errors also expose retry.

## Stack adaptation

The app uses React/Vite, React Router, Gemini REST streaming and a typed SSE consumer. RouteErrorBoundary supplies the route error-boundary behavior requested as Next.js error.tsx. Chat recovery uses local error state rather than useChat.error. The movie catalogue, lookup tool, favorites and authentication remain part of the application; favorites/auth were covered by the automated suite, not manually re-verified on this preview.

## Evidence and submission

Screenshots were uploaded in the A8 conversation. See EVIDENCE.md for the attachment inventory and SUBMISSION.md for the Portal text. Portal submission has not been performed.

## AI assistance

ChatGPT inspected A7, added recovery and a route boundary, ran deterministic sabotage tests, and diagnosed the Preview environment mismatch. The learner manually tested the deployed app, captured desktop/mobile evidence, and confirmed keyboard and scrolling behavior. Ambiguous text queries and raw Zod validation messages found during the first test run were corrected.
