# Reel Good — Assignment 3

React 18, TypeScript and Vite movie-browsing app. Current milestone uses six sample movies.

## Run

Use Node 24 and npm. Run `npm ci`, then `npm run dev`. Run `npm test` and `npm run build` to validate.

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

OMDb live search, Firebase Authentication and per-user favorites, database rules, final end-to-end verification and submission. Ratings are static sample data, not current API results.
