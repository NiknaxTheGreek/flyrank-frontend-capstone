# Assignment 3 — verification record

Verification status for the current `fe03-movie-app` worktree. Only completed checks are listed as verified.

## Executed checks

- `npm test`: passed **41 tests across 8 files** after configuring Vitest to use a single thread for this resource-constrained Codespace. Coverage includes genre sections/filter, descriptions/IMDb IDs, poster fallback, separate links, API enrichment/concurrency/cache, search pagination/history/retry, auth initialization/return routing, favorite pending/success/failure, logout, user-state clearing, and mocked database record validation.
- `npm run build`: passed; TypeScript and production Vite bundle completed (64 modules). Vite reported a chunk larger than 500 kB after minification (538.08 kB JS; 135.08 kB gzip).
- Fresh `npm run preview`: `/` and `/movies` returned HTTP 200. The live `/api/movies?q=Inception` request returned HTTP 200 with 10 movies, 38 total matches, and genre/plot on Inception. Response did not contain the OMDb key name/value.
- Poster URL HTTP checks: all six configured TMDB URLs returned **200 `image/jpeg`**.
- `git diff --check`: passed before the last documentation and routing edits; rerun before commit.
- `firebase.json` and `database.rules.json`: parsed as valid JSON.
- Secret/config inspection: `.env.local` is ignored; Firebase config is not present. No secret value was printed or added to tracked docs.
- Current Vite development server: `/` and `/movies` returned HTTP 200; `/api/movies?q=Inception` returned HTTP 200 with 10 movies, 38 total matches, and genre/plot on Inception. Response did not contain the OMDb key name/value. This is a development-server check, not the requested fresh production-build preview.

## Unverified or blocked

- Firebase CLI and emulators are unavailable; database rule isolation was not run against the emulator.
- Firebase project configuration is absent, so real sign-up/sign-in/out, actual Realtime Database reads/writes, persistence across refresh, and cross-user isolation are unverified.
- Full human browser verification of the requested end-to-end sequence, retry/network conditions, keyboard-only navigation, mobile layout and missing-poster rendering is not evidenced.
- No browser automation/screenshot tool was available in this session. The learner should capture genuine screenshots of home/genre browsing, search/detail/IMDb, account/favorites and mobile layout after configuring Firebase.
- GitHub CLI cannot retrieve the active Codespaces forwarded URL because it lacks the `codespace` OAuth scope. Final commit and remote push are pending.

## Screenshots the learner still needs to capture

1. Home at desktop width with genre sections, genre filter, plots and IMDb links.
2. Search results, a live movie detail page, and the separate IMDb link.
3. Signed-in Favorites after adding a movie, followed by the empty/removal state.
4. A narrow/mobile viewport showing cards and keyboard-visible focus on navigation and actions.
