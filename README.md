# Reel Good — Assignment 7: Tool Lifecycle UI

In this assignment, Reel Good extends its streaming movie assistant into a generative interface that retrieves factual movie information through a validated server-side tool. Distinct visual states explain the lookup's progress, structured results and recoverable failures.

[Open the live movie picker](https://flyrank-frontend-capstone-git-fe07-movie-8e393b-niknaxthegreek.vercel.app/pick-a-movie) · [Submission and visual evidence](docs/assignment-7/SUBMISSION.md) · [Tool definition](server/lookup-movie-tool.mjs)

## How the interaction works

When a user asks for factual information about a named film, Gemini can invoke the read-only `lookupMovie` tool. The server validates the title, retrieves details from OMDb and sends typed server-sent events to the React client. General recommendation requests can still receive ordinary streamed text. The lookup supports different titles; no particular movie is required.

## Tool contract

- **Name:** [`lookupMovie`](server/lookup-movie-tool.mjs).
- **Input schema:** `z.object({ title: z.string().trim().min(2).max(100) })`. A JSON Schema declaration is derived from Zod for Gemini.
- **Execute:** validates input, requests OMDb using a server-side key, imposes an eight-second timeout and checks the returned movie record.
- **Return shape:** `{ title, year, genre, runtime, rating, plot, imdbId }`. Fields are strings except rating (number between 0 and 10, or null). Missing descriptive values are empty strings; IMDb identifiers are format-validated.
- **Errors:** unknown movies receive a no-match message. Unavailable service, malformed upstream data and missing credentials receive a recoverable generic lookup error.

## Four tool states

| State | User experience |
|---|---|
| `input-streaming` | Preparing the lookup; dashed border and pending indicator. |
| `input-available` | Shows the validated title being checked against OMDb, with a blue accent. |
| `output-available` | Structured movie card with a green accent, IMDb rating, genre, runtime, plot and IMDb link. |
| `output-error` | Red-accented inline alert explaining the failure and how to recover. |

The [server handler](server/movie-chat-handler.mjs) emits events, the [typed tool-part schema](src/services/movie-tool-part.ts) validates them, and [MovieToolCard](src/components/MovieToolCard.tsx) renders the appropriate state. A short 200 ms fade respects reduced-motion preferences. The preparing state is emitted after Gemini supplies its function call rather than exposing partial argument fragments; a 350 ms presentation hold makes the pending states visible. Since the tool is read-only, confirmation before execution is not necessary.

## Reviewing the application

Open the preview and request factual details for a movie of your choice. Observe the pending states and the structured result. Try a title that has no matching movie to see the error treatment, then request another valid movie in the same conversation. The six screenshots and [lifecycle recording](docs/assignment-7/evidence/07-tool-lifecycle.mp4) document this interaction; their specific movie titles are illustrative, not required inputs.

## Local development

Use Node 24, `npm ci`, `npm test` and `npm run build`. Run `npm run dev` to start Vite. Configure `GEMINI_API_KEY` and `OMDB_API_KEY` server-side using ignored `.env.local` or the Vercel Preview environment; never prefix these keys with `VITE_`. Gemini is carried forward from Assignment 6.

See the [submission record](docs/assignment-7/SUBMISSION.md) for the original evidence, verification scope and technical limitations.
