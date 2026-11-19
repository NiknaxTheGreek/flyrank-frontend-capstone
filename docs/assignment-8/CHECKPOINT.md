# A8 — Resilience / Checkpoint 1

Status: code implemented; all 50 automated tests and production build passed. Live review, screenshots and real-device mobile Safari pass pending.

Preview deployment: https://flyrank-frontend-capstone-ggwkcwu3d-niknaxthegreek.vercel.app/pick-a-movie
Vercel Authentication currently blocks anonymous access. Creating a shareable review link was blocked by automatic approval review pending explicit user authorization.

Local Chromium browser verification was attempted but blocked by workspace socket restrictions; no browser, console-clean, layout-shift or Safari pass is claimed.

## Failure inventory

| Case | Handling | Verification |
|---|---|---|
| Network unavailable before send | Error panel, retained user message and retry | Component sabotage test |
| Connection dies mid-stream | Partial answer marked interrupted; retry replaces only that turn | Component sabotage test |
| 429 / API unavailable | Provider-safe error and retry action | Component and server tests |
| Malformed tool result | Validated at stream boundary; readable error instead of JSON/crash | Component sabotage test |
| No matching movie | Designed tool error; retry or edit title | Manual live check pending |
| Empty input | Send disabled for whitespace | Existing guard; manual live check pending |
| First run | Explanation and click-to-fill example | Existing UI; manual live check pending |
| Slow response | Pending skeleton; after 8 seconds wait/stop guidance | Manual throttling pending |
| Route rendering failure | React boundary with retry and catalogue link | Manual check pending |
| Refusal / reply length cap | Stream error explaining alternate prompt/continue | Server handling; manual check pending |

## Retry contract

“Retry failed message” resends the failed user turn with its earlier conversation context. It replaces the failed assistant attempt; it does not add another user message or regenerate previous turns. A synchronous in-flight guard prevents double requests. Stop remains available during the retry. A successful new send clears the old retry target. Tool execution errors also expose retry.

## Stack adaptation

This branch is React/Vite + React Router, Gemini REST streaming and a typed SSE consumer. `RouteErrorBoundary` is the equivalent of Next.js `error.tsx`; chat recovery uses local error state rather than `useChat.error`. It preserves the movie catalogue, OMDb lookup, favorites and authentication from A7.

## Manual sabotage order

1. Open `/pick-a-movie` in a new tab. Confirm the example fills the field and whitespace cannot send.
2. Send a normal recommendation request; verify streaming, follow-up context and no happy-path console errors.
3. DevTools → Network → Offline before sending. Restore connectivity, click Retry failed message; confirm one user turn.
4. Slow the network, send, then switch Offline after text starts. Confirm partial output/error and successful retry after restoring connection.
5. Intercept `/api/movie-chat` with a 429 response; verify recovery. Do not ship public sabotage flags.
6. Intercept its SSE response with malformed tool output; verify the friendly error.
7. Ask for a deliberately nonexistent title; use a corrected title next.
8. Check at 375px and desktop width; test an actual iPhone Safari keyboard, scrolling, Stop and Retry. Prior A6 mobile verification does not prove this branch passed.
9. Capture happy path and at least two failures, with recovery; upload to Checkpoint 1 with the public preview URL.

## AI assistance

ChatGPT inspected A7, added failure recovery and a route boundary, then used mocked stream/network/tool responses to verify behavior. Tests use no paid AI calls. A first test run exposed ambiguous text queries and raw Zod validation text; both were corrected before final checks.
