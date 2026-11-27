# Assignment 7 — Tool Lifecycle UI

## Assignment overview

The goal of this assignment is to move beyond a conventional streaming chat interface by allowing the AI to invoke a real server-side tool and communicate its progress through purpose-built UI components. In Reel Good, this is implemented as a movie lookup that retrieves factual details from OMDb. Users can ask about different films and receive structured cards directly in the conversation. The interface also explains when a lookup fails and allows the user to continue without restarting the chat.

**Live preview:** [Reel Good movie picker](https://flyrank-frontend-capstone-git-fe07-movie-8e393b-niknaxthegreek.vercel.app/pick-a-movie)  
**Source branch:** [fe07-movie-lookup-tool](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe07-movie-lookup-tool)

## Implementation and deliverables

The AI receives a function declaration derived from a Zod schema. The server validates the movie title, executes the read-only lookup, normalizes the result and streams typed tool events back to the client. React renders each state using a dedicated movie card and distinct visual styling.

| Evaluation criterion | Implementation |
|---|---|
| Typed tool schema | Zod validates a trimmed title of 2–100 characters. The client also validates tool events with a discriminated union. |
| Four distinct states | Preparing, validated title/lookup, successful result and inline error have separate presentations. |
| Structured component | A semantic movie card presents title, year, rating, genre, runtime, plot and an IMDb link; unavailable values are handled explicitly. |
| Recoverable tool failure | Invalid titles, missing matches and upstream errors are handled without crashing the chat. |
| Documented contract | The README explains the input schema, execution, return shape and error behavior. |

- [Tool definition and execute function](../../server/lookup-movie-tool.mjs)
- [Server route](../../api/movie-chat.mjs) and [stream handler](../../server/movie-chat-handler.mjs)
- [Typed tool parts](../../src/services/movie-tool-part.ts) and [SSE consumer](../../src/services/movie-chat-stream.ts)
- [MovieToolCard](../../src/components/MovieToolCard.tsx) and [state styling](../../src/components/movie-tool-card.css)
- [README tool contract](../../README.md#tool-contract)

## Reviewing the interaction

Open the preview and ask for factual details about any movie. Watch the interface prepare the lookup, display the validated title and present the result. To explore failure handling, request a title that does not exist, then try another movie in the same chat. The tool is read-only and does not require a confirmation step.

## Screenshot and video evidence

The evidence below was captured on 19 November 2026 during development and hosted-preview testing. Movie titles illustrate the different states; the tool is not restricted to those examples.

| Evidence | What it demonstrates |
|---|---|
| [Service unavailable](evidence/01-service-unavailable.png) | The deployed movie picker handles an unavailable OMDb lookup with an inline error card rather than interrupting the conversation. |
| [Successful lookup](evidence/02-successful-lookup.png) | Inception returns a structured movie card with IMDb rating, genre, runtime, plot and an IMDb link. |
| [Unknown title](evidence/03-no-matching-movie.png) | The lookup returns a designed no-match error with guidance to check the title and try again. |
| [Recovery](evidence/04-recovery-after-error.png) | A successful Matrix lookup after the preceding error demonstrates that the conversation remains usable. |
| [Responsive movie card](evidence/05-mobile-layout.png) | An Interstellar lookup in Chrome's mobile viewport emulator illustrates the tool card at a narrow width. |
| [Development verification](evidence/06-test-and-push.png) | The terminal records 46 passing tests across 10 files and a successful push of the change that makes pending states visible. The suite is inherited coverage, not a dedicated four-state tool test. |
| [Live lifecycle recording](evidence/07-tool-lifecycle.mp4) | The 22-second recording shows request submission, a recoverable request error, resubmission, preparing lookup (about 18.0 s), checking OMDb (about 18.4 s), and a structured Arrival result. |

All six screenshots are unchanged from the supplied originals. The repository video is a full-resolution re-encode of the original recording (1920 × 1020, approximately 22.3 seconds), prepared for the repository transfer limit. Both pending states were visually checked in the re-encoded file. The original recording is retained separately by the learner. The video includes browser development tools and a handled request error; it does not establish a clean console.

## Verification scope

The 26 November source audit inspected the implementation and confirmed that the Git-triggered Vercel deployment of `6fdf75d5` reached READY, with a successful TypeScript/Vite build and accessible public route. The supplied historical evidence documents successful lookup, designed tool failure, recovery and both pending presentations. The preparing state is a presentation event emitted after the model supplies the function call, not genuine incremental argument streaming. The historical test screenshot records 46 passing tests, but a dedicated A7 lifecycle test suite and fresh interactive verification of the latest deployment were not performed. Gemini replaces the Claude provider from A6; the tool uses private server-side credentials. Repository-wide historical credential remediation is tracked separately.
