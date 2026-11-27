# Reel Good — Assignment 3: Movie discovery application

In this assignment, Reel Good becomes a working movie discovery application. It combines a responsive React interface, live movie information and authenticated favorites, establishing the core product that later assignments extend.

[Assignment 3 submission note](./docs/assignment-3/submission.md)

Reel Good is a responsive movie discovery app built with React, TypeScript and Vite. Browse 24 featured movies by genre, search live OMDb movie data, inspect movie details, follow verified IMDb links, and sign in to save personal favorites.

## Implemented features

- The featured catalogue loads titles, posters, plots and genres from OMDb using verified IMDb IDs.
- Accessible genre filtering, responsive poster cards, and a film-icon/title fallback for missing or failed posters.
- Live title search with URL-backed query and page state, pagination, loading, empty and error states, retry, request cancellation and stale-response protection.
- OMDb details enrichment supplies search results with genres and plots rather than inventing data omitted by OMDb search. The server caches requests, deduplicates detail lookups, limits concurrent detail requests to three, and bounds upstream calls.
- Separate accessible movie-navigation, IMDb-profile and favorite controls.
- Email/password Firebase sign-up, sign-in and sign-out; protected favorites; UID-scoped Realtime Database records keyed by IMDb ID.
- Realtime Database rules restrict access to the authenticated owner and validate stored record fields.


## Requirements

- Node.js 24 LTS and npm.
- An OMDb API key for live search and details.
- A Firebase project with Email/Password Authentication and a Realtime Database for accounts and persistent favorites.

## Setup

```sh
npm ci
cp .env.example .env.local
# Set the environment values described below in .env.local.
npm run dev
```

Restart Vite after editing environment values.

### Environment variable names

| Variable | Purpose |
| --- | --- |
| `OMDB_API_KEY` | Server-only OMDb API key. Never prefix this with `VITE_`. |
| `VITE_FIREBASE_API_KEY` | Firebase web app configuration. |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication domain. |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID. |
| `VITE_FIREBASE_APP_ID` | Firebase web app ID. |
| `VITE_FIREBASE_DATABASE_URL` | URL of the project's Realtime Database. |

Firebase `VITE_` values are public client configuration, not private credentials. Never put service-account credentials or private keys in the browser app. The repository's `.env.local` is ignored and must not be committed.

### Firebase setup and rules

1. In Firebase Console, create/select a project and register a web app.
2. Under **Authentication → Sign-in method**, enable **Email/Password**.
3. Create a **Realtime Database** and note its database URL.
4. Set the five `VITE_FIREBASE_*` values above in `.env.local` using the web app configuration and exact database URL.
5. Install/use Firebase CLI, select the same project, and deploy the rules:

   ```sh
   firebase login
   firebase use --add
   firebase deploy --only database
   ```

6. Restart Vite. For a public host, add its hostname under **Authentication → Settings → Authorized domains**.

Rules are in [database.rules.json](./database.rules.json); [firebase.json](./firebase.json) points to them and configures the Realtime Database emulator port. Emulator isolation has not been tested because Firebase CLI/emulator tools are unavailable here.

## Commands

```sh
npm run dev       # Vite development server (port 5173)
npm test          # Vitest and React Testing Library
npm run build     # TypeScript project build and optimized Vite production bundle
npm run preview   # Serve dist using Vite preview (port 4173)
```

## Routes

- `/` and `/movies` — initial genre collection and movie search.
- `/?q=Inception&page=2` — shareable search and page state.
- `/movies/:movieId` — movie detail by IMDb ID, for example `/movies/tt1375666`.
- `/account` — register, sign in or sign out.
- `/favorites` — protected, signed-in user's saved collection.

Unknown pages and movie IDs show a recovery path. Vite's SPA fallback serves app routes in development/preview; any deployment host must provide an equivalent SPA rewrite and a Node-compatible handler for `/api/movies`.

## Architecture

- `src/data/movies.ts` and `src/types/movie.ts` contain typed sample data and the movie model.
- `src/hooks/useMovieSearch.ts` manages URL-backed search state; `src/hooks/useMovieDetails.ts` loads details.
- `src/pages/` composes browse, detail, account and favorites screens; reusable cards, poster fallback and favorite controls live in `src/components/`.
- `src/services/movies.ts` calls the same-origin API. `api/movies.mjs` validates requests, calls the fixed HTTPS OMDb endpoint, normalizes results, enriches search results from detail lookups, and applies caching, request limits, concurrency control and sanitized errors. `vite.config.ts` mounts that handler for dev/preview; the secret stays server-side.
- `src/services/auth.ts`, `src/services/firebase.ts`, and `src/services/favorites.ts` wrap Firebase Auth and Realtime Database. Contexts observe auth/favorites and clear per-user state at UID changes.
- `database.rules.json` checks ownership, IMDb-key consistency and the accepted movie-record shape.

## Assignment verification

The test suite and production build passed. The manual Firebase check confirmed that a signed-in user could save a favorite, find it after refreshing and signing back in, and remove it. [Final verification](./docs/assignment-3/verification.md) · [Development review log](./docs/assignment-3/review-log.md)

## Reviewing the assignment

Browse or search for a film of your choice, inspect its details, and sign in to save or remove favorites. Review the source, prompt record and development review log.
