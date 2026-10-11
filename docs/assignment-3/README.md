# Reel Good — Assignment 3

React 18, TypeScript and Vite movie-browsing app. Home shows six sample picks grouped by genre with summaries and IMDb links; submitted searches and IMDb-ID detail routes use live OMDb data.

## Run

Use Node 24 and npm. Run `npm ci`, copy `.env.example` to `.env.local`, set `OMDB_API_KEY` to your activated key, then run `npm run dev`. The OMDb key must never use a `VITE_` prefix. To enable Firebase, fill the `VITE_FIREBASE_*` values from your Firebase web app in `.env.local`. These client configuration values are public by design; do not put service-account credentials or private keys in the frontend. Enable Email/Password and Google providers in Firebase Authentication. Deploy `firestore.rules` with the Firebase CLI (`firebase deploy --only firestore:rules`) or paste its rules into the Firebase console. Restart Vite after changing environment values. Run `npm test` and `npm run build` to validate.

## Routes

- `/` and `/movies`: sample movie collection grouped by genre; `/?q=Inception` restores a search.
- `/movies/inception`: movie details; all sample IDs have detail URLs.
- `/account`: create an account or sign in using email/password or Google.
- `/favorites`: view the signed-in user's Firestore-backed favorites.
- Unknown URLs and unknown movie IDs show a recovery link.

BrowserRouter requires the deployment host to serve index.html for app paths. Vite handles this during development; configure an SPA rewrite on the eventual production host.

## Public deployment on Render

The `render.yaml` Blueprint deploys this as a public Node web service so both the single-page app and `/api/movies` are served together. In Render, create a new Blueprint Instance for this GitHub repository and provide `OMDB_API_KEY` when prompted. To enable Firebase sign-in and saved favorites, also provide the `VITE_FIREBASE_*` values from your Firebase web app; those values are embedded during the build and are public client configuration, not secrets. After deployment, add the Render site hostname to Firebase Authentication's authorized domains. Visitors can open the deployed site without GitHub authentication; GitHub access is only used by Render to fetch this private source repository.

## Architecture

Data/model: src/types/movie.ts and src/data/movies.ts. View logic: useMovieSearch reads the submitted URL query and manages draft input. Views: pages and shared MovieCard/MoviePoster. App supplies shared layout and routes.

## AI assistance and evidence

ChatGPT guided initial prompts and review; GitHub Copilot implemented the first milestone in Codespaces. Codex implemented routing and details and ran validation directly. See prompts.md and review-log.md for actual instructions, observed issues and AI corrections. The user supplied mobile screenshots; no manual user source edits are claimed.

## Remaining

Firebase Authentication and per-user favorites are implemented but need a Firebase project configured in `.env.local`, enabled sign-in providers, and deployed Firestore rules before live account testing. Final end-to-end verification and submission remain. Home sample ratings are static. Live search results are enriched with bounded, cached OMDb detail requests so their genres and plot descriptions come from movie details rather than the search response.

## Live movie API

The browser calls /api/movies?q=TITLE&page=1 or /api/movies?id=IMDB_ID. api/movies.mjs validates bounded inputs, calls the fixed HTTPS OMDb origin with a server-only key, normalizes missing values, and returns sanitized errors. Search results are enriched using their verified IMDb IDs; detail requests are deduplicated, cached, and limited to three concurrent upstream calls. Vite mounts this handler for development and preview. Static hosting alone cannot serve this API: production requires a Node function/server plus the SPA rewrite and OMDB_API_KEY configured on that host. No production deployment is claimed.

Requests time out after 15 seconds. A bounded five-minute in-memory cache and a process-wide limit of 30 uncached upstream requests per minute reduce quota usage. This limit is shared by users of one process, resets on restart, and is not distributed protection across serverless instances.

Live queries support 2–100 characters, pages 1–100, loading, no results, errors and retry. AbortController and stale-result guards protect navigation from delayed responses. The q and page parameters preserve result position on return from details. The six original slug routes retain their clearly labelled sample details; live search results use IMDb IDs.

OMDb source/documentation: https://www.omdbapi.com/
