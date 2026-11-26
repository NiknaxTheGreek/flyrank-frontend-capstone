# Assignment 7 — Tool lifecycle

**Source:** [fe07-movie-lookup-tool](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe07-movie-lookup-tool)  
**Preview:** [Movie picker](https://flyrank-frontend-capstone-git-fe07-movie-8e393b-niknaxthegreek.vercel.app/pick-a-movie)

## Required deliverables

- [Tool definition and execute function](../../server/lookup-movie-tool.mjs).
- [Server AI route](../../api/movie-chat.mjs) and [stream handler](../../server/movie-chat-handler.mjs).
- [Typed tool parts](../../src/services/movie-tool-part.ts), [SSE consumer](../../src/services/movie-chat-stream.ts), [result card](../../src/components/MovieToolCard.tsx) and [state styling](../../src/components/movie-tool-card.css).
- [README tool contract](../../README.md#tool-contract).

## Evaluation — 26 November 2026

| Criterion | Source audit |
|---|---|
| Typed schema | Zod input validation for trimmed title of 2–100 characters; Gemini JSON schema derived from it. Client uses Zod discriminated union for all four tool states. |
| Distinct lifecycle states | Preparing indicator/dashed border; validated title/blue accent; structured result/green accent; inline alert/red accent. The input-streaming presentation does not expose real incremental argument fragments; the full call arrives from Gemini before the preparing event. |
| Component result | MovieToolCard renders semantic heading, definition list, descriptive plot and IMDb link. Rating null renders Unrated; missing genre/runtime render Unavailable. |
| Failure handling | No-match and upstream failure produce safe output-error events; invalid arguments also produce an error state. Inline alert leaves the conversation usable. |
| Tool contract | README gives name, Zod schema, execute behavior and return shape. |

The tool is read-only; no confirmation step is necessary. The A6 Gemini provider substitution remains in place. Server-side environment examples contain blank values and local environment files are ignored; historical repository-wide credential remediation is tracked separately.

## Recorded verification

- Original Codespaces checks recorded in the prior README: Inception success, unknown-title inline error and The Matrix success in the same chat. On 21 November the recorded public lookup returned Inception, IMDb rating 8.8 and runtime 148 minutes.
- On 26 November the Git-triggered Vercel deployment of `6fdf75d555c645965bed3e87db044a71cdf57602` was READY; TypeScript and Vite build passed (non-fatal bundle size warning). The public `/pick-a-movie` route returned the expected movie-picker content.
- All four state branches and the server execution/error paths were inspected. The inherited A6 tests cover streaming and cancellation, but no dedicated A7 lifecycle or OMDb tool test was found. No new test execution or interactive live lookup is claimed.
- No original A7 screenshot files were found in the current branch or recovered prior-chat context during the audit.

## Reviewer walkthrough

1. Ask “Show me Inception's IMDb rating and runtime.” Observe preparing, title lookup and the movie card.
2. Ask “Look up the IMDb rating and runtime of the movie Zzxqv Nonexistent Film 93871.” Observe an inline lookup error if the model invokes the tool.
3. Ask for The Matrix's IMDb rating and runtime in the same conversation to verify recovery.

A screen recording captures the short-lived pending states more reliably than still images. The brief requires a live preview and tool definition; optional screenshot or recording evidence can corroborate the walkthrough.
