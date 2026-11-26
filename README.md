# Reel Good — Assignment 7: Movie lookup tool

[Open the public movie picker](https://flyrank-frontend-capstone-git-fe07-movie-8e393b-niknaxthegreek.vercel.app/pick-a-movie) and ask **“Show me Inception's IMDb rating and runtime.”** See the [submission and verification record](docs/assignment-7/SUBMISSION.md).

## Tool contract

- **Name:** [`lookupMovie`](server/lookup-movie-tool.mjs), a read-only server tool that fetches factual movie details from OMDb.
- **Input schema:** `z.object({ title: z.string().trim().min(2).max(100) })`. The model receives a JSON Schema declaration derived from the Zod schema; the server validates the arguments before calling execute.
- **Execute:** validates the title, uses the private OMDb API key, enforces an eight-second upstream timeout and checks the response.
- **Return shape:** `{ title, year, genre, runtime, rating, plot, imdbId }`. Descriptive fields are strings; missing descriptive information is represented by empty strings, and an unavailable rating is `null`. A non-null rating is a number between 0 and 10. IMDb IDs must match the verified identifier format.
- **Failure:** unknown titles produce a recoverable no-match message; unavailable service, malformed provider data and missing credentials produce a generic lookup error without exposing credentials.

## Typed tool lifecycle

| State | Presentation |
|---|---|
| `input-streaming` | Preparing movie lookup; dashed border and pending indicator |
| `input-available` | Checking OMDb, with the validated title and blue accent |
| `output-available` | Structured movie card, green accent, rating, genre, runtime, plot and IMDb link |
| `output-error` | Inline alert, red accent, explanation and recovery guidance |

The [server handler](server/movie-chat-handler.mjs) emits SSE events and the [Zod discriminated union](src/services/movie-tool-part.ts) validates them on the client. [MovieToolCard](src/components/MovieToolCard.tsx) renders the states. The preparing event is emitted when Gemini supplies the function call, rather than displaying incremental argument fragments. The client holds each pending state briefly (350 ms) to make it visible. A 200 ms content fade respects reduced-motion preferences.

Gemini is the provider carried forward from A6. The lookup is read-only, so action confirmation is not required. No chart or second tool is implemented; those are optional stretch goals.

## Run and review

Use Node 24, `npm ci`, `npm test`, and `npm run build`. For local development set `GEMINI_API_KEY` and `OMDB_API_KEY` in ignored `.env.local`, or configure them server-side for the Vercel Preview environment. Never prefix these private keys with `VITE_`.

Original recorded checks: Inception produced a card (8.8 IMDb rating, 148 minutes in the 21 November preview check), an unknown title displayed an inline error in Codespaces, and The Matrix returned a card in the same chat. The 26 November audit verified the source, current READY build and public route; it did not repeat an interactive tool call. See the submission record for scope and evidence.
