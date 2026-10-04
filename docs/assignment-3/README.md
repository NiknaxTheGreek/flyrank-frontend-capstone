# Reel Good — Assignment 3

React 18, TypeScript and Vite movie-browsing app. Home shows six sample picks; submitted searches and IMDb-ID detail routes use live OMDb data.

## Run

Use Node 24 and npm. Run `npm ci`, copy `.env.example` to `.env.local`, set `OMDB_API_KEY` to your activated key, then run `npm run dev`. The OMDb key must never use a `VITE_` prefix. To enable accounts and favorites, also provide `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, and `VITE_FIREBASE_DATABASE_URL` from the Firebase web app and Realtime Database. Restart Vite after changing environment values. Run `npm test` and `npm run build` to validate.

## Routes

- `/` and `/movies`: genre-grouped sample collection; `/?q=Inception` restores a search.
- `/movies/inception`: movie details; all sample IDs have detail URLs.
- `/account`: create an account, sign in, or sign out.
- `/favorites`: protected, per-user Realtime Database favorites.
- Unknown URLs and unknown movie IDs show a recovery link.

BrowserRouter requires the deployment host to serve index.html for app paths. Vite handles this during development; configure an SPA rewrite on the eventual production host.

## Architecture

Data/model: src/types/movie.ts and src/data/movies.ts. View logic: useMovieSearch reads the submitted URL query and manages draft input. Views: pages and shared MovieCard/MoviePoster. App supplies shared layout and routes.

## AI assistance and evidence

ChatGPT guided initial prompts and review; GitHub Copilot implemented the first milestone in Codespaces. Codex implemented routing and details and ran validation directly. See prompts.md and review-log.md for actual instructions, observed issues and AI corrections. The user supplied mobile screenshots; no manual user source edits are claimed.

## Firebase setup and remaining verification

Firebase is implemented but is not configured or live-verified in this workspace. In the Firebase console:

1. Create/select a project and register a web app.
2. Under **Authentication → Sign-in method**, enable **Email/Password**.
3. Create a **Realtime Database** and note its exact database URL.
4. Copy values from the web app and database into `.env.local`: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`, and `VITE_FIREBASE_DATABASE_URL`. `.env.example` lists these names without credentials.
5. Select the matching Firebase project in the Firebase CLI and deploy the checked-in database rules with `firebase deploy --only database`.
6. Restart Vite. For public hosting, add the deployment hostname to Authentication's authorized domains.

Never put private service-account credentials in the frontend. `OMDB_API_KEY` remains a server-only variable without a `VITE_` prefix.

Firebase emulation is configured for Realtime Database port 9000, but the Firebase CLI/emulator is not installed in this environment. Live sign-up/sign-in, persistence, cross-user isolation, final end-to-end verification, and submission remain. Assignment 3 is not complete.

## Live movie API

The browser calls /api/movies?q=TITLE&page=1 or /api/movies?id=IMDB_ID. api/movies.mjs validates bounded inputs, calls the fixed HTTPS OMDb origin with a server-only key, normalizes missing values, and returns sanitized errors. Search results are enriched using their verified IMDb IDs; detail requests are deduplicated, cached, and limited to three concurrent upstream calls. Vite mounts this handler for development and preview. Static hosting alone cannot serve this API: production requires a Node function/server plus the SPA rewrite and OMDB_API_KEY configured on that host. No production deployment is claimed.

Requests time out after 15 seconds. A bounded five-minute in-memory cache and a process-wide limit of 30 uncached upstream requests per minute reduce quota usage. This limit is shared by users of one process, resets on restart, and is not distributed protection across serverless instances.

Live queries support 2–100 characters, pages 1–100, loading, no results, errors and retry. AbortController and stale-result guards protect navigation from delayed responses. The q and page parameters preserve result position on return from details. The six original slug routes retain their clearly labelled sample details; live search results use IMDb IDs.

OMDb source/documentation: https://www.omdbapi.com/
