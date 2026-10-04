# Reel Good — Assignment 3

React 18, TypeScript and Vite movie-browsing app. Home shows six sample picks; submitted searches and IMDb-ID detail routes use live OMDb data.

## Run

Use Node 24 and npm. Run `npm ci`, copy `.env.example` to `.env.local`, set `OMDB_API_KEY` to your activated key, then run `npm run dev`. The key must never use a VITE_ prefix. Restart Vite after changing it. Run `npm test` and `npm run build` to validate.

## Routes

- `/`: sample movie collection; `/?q=Inception` restores a search.
- `/movies/inception`: movie details; all sample IDs have detail URLs.
- Unknown URLs and unknown movie IDs show a recovery link.

BrowserRouter requires the deployment host to serve index.html for app paths. Vite handles this during development; configure an SPA rewrite on the eventual production host.

## Architecture

Data/model: src/types/movie.ts and src/data/movies.ts. View logic: useMovieSearch reads the submitted URL query and manages draft input. Views: pages and shared MovieCard/MoviePoster. App supplies shared layout and routes.

## AI assistance and evidence

ChatGPT guided initial prompts and review; GitHub Copilot implemented the first milestone in Codespaces. Codex implemented routing and details and ran validation directly. See prompts.md and review-log.md for actual instructions, observed issues and AI corrections. The user supplied mobile screenshots; no manual user source edits are claimed.

## Remaining

Firebase Authentication and per-user favorites, database rules, final end-to-end verification and submission. Home sample ratings are static. Live search cards omit ratings because OMDb search does not supply them; opening details fetches the available rating.

## Live movie API

The browser calls /api/movies?q=TITLE&page=1 or /api/movies?id=IMDB_ID. api/movies.mjs validates bounded inputs, calls the fixed HTTPS OMDb origin with a server-only key, normalizes missing values, and returns sanitized errors. Vite mounts this handler for development and preview. Static hosting alone cannot serve this API: production requires a Node function/server plus the SPA rewrite and OMDB_API_KEY configured on that host. No production deployment is claimed.

Requests time out after 15 seconds. A bounded five-minute in-memory cache and a process-wide limit of 30 uncached upstream requests per minute reduce quota usage. This limit is shared by users of one process, resets on restart, and is not distributed protection across serverless instances.

Live queries support 2–100 characters, pages 1–100, loading, no results, errors and retry. AbortController and stale-result guards protect navigation from delayed responses. The q and page parameters preserve result position on return from details. The six original slug routes retain their clearly labelled sample details; live search results use IMDb IDs.

OMDb source/documentation: https://www.omdbapi.com/
