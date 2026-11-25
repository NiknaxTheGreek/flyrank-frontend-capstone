# Reel Good — Assignment 7

[Open the public movie picker](https://flyrank-frontend-capstone-bwlejorqv-niknaxthegreek.vercel.app/pick-a-movie) and ask for Inception’s IMDb rating and runtime. The live lookup returned 8.8 and 148 minutes during the 21 November check. [Tool definition](server/lookup-movie-tool.mjs)

## Assignment 7 — Movie lookup in chat

Open **Movie picker** (`/pick-a-movie`) and ask:
“Show me Inception’s IMDb rating and runtime.”

- **Tool:** [`lookupMovie`](server/lookup-movie-tool.mjs), a read-only
  server-side tool that fetches movie details from OMDb.
- **Input:** `{ title: string }`, trimmed and validated with Zod. Titles
  must be 2–100 characters long.
- **Output:** `{ title, year, genre, runtime, rating, plot, imdbId }`.
  All fields are strings except `rating`, which is a number from 0 to 10
  or `null`. Missing descriptive fields are empty strings.
- **Lifecycle:** Preparing lookup → Looking up a title → Movie card or
  an inline error. A failed lookup leaves the chat ready for another request.
- **Configuration:** Set `GEMINI_API_KEY` and `OMDB_API_KEY` server-side.
  For local development, use `.env.local`.

Verified in Codespaces: Inception returned a movie card, an unknown title
showed an inline error, and The Matrix returned a card in the same chat.