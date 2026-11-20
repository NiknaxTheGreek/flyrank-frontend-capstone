# Assignment 3 review log

## Initial implementation review

- The existing `App` rendered the previous dashboard prototype, and the App-level test asserted dashboard headings; that assertion no longer described the requested Home screen.
- The same test file also covered the independent `NotificationSettings` component. Those tests were retained while the obsolete dashboard assertion was replaced with movie Home screen coverage.
- The new UI has a labelled search input and buttons, but no browser routing or external movie-data service was introduced.

## Corrections after validation

- The first test run exposed two visible “Clear search” buttons in the no-results state. Kept one clear action in the search controls and clarified the empty-state instructions to point to it; this also avoids duplicate accessible names.
- Replaced locale-specific lowercasing in title matching with standard case normalization so matching does not vary with the browser locale.

## Editing attribution

The changes in this log describe work performed by the coding assistant in response to the recorded prompt. No manual edits by the learner are claimed.

## Poster review follow-up

- **Visual review — learner:** During mobile inspection, the learner observed “Poster unavailable” for Pulp Fiction and Interstellar while the other four sample posters rendered.
- **Diagnosis — coding assistant:** The configured TMDB image URLs were checked directly. Both returned HTTP 404 with `text/html`: Pulp Fiction's `d5iIlFn5s0ImszYzBPb8JPIfbXP.jpg` and Interstellar's `gEU2QniE6E77NI6lCU6M.jpg`. For comparison, the checked Shawshank Redemption and The Dark Knight poster URLs returned HTTP 200 with `image/jpeg`.
- **Fix — coding assistant:** Read each movie's poster path from its corresponding TMDB movie page (Pulp Fiction: https://www.themoviedb.org/movie/680-pulp-fiction; Interstellar: https://www.themoviedb.org/movie/157336-interstellar), then verified the resulting image URLs directly. The replacement Pulp Fiction path `vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg` and Interstellar path `yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg` both returned HTTP 200 with `image/jpeg`. Updated the sample data with those verified paths.
- **Fallback — coding assistant:** Kept MovieCard's existing image-error fallback and added a component test confirming that a failed poster shows the accessible fallback while preserving the movie title and rating.


## Milestone 2 — AI code review and refactoring

Codex extracted HomePage from App and shared MoviePoster between cards and the new details view, avoiding duplicate fallback logic. Movie cards now use semantic links; detail navigation focuses the new heading and updates the document title. Mobile card titles wrap instead of being truncated.

Code review found that the empty-state text used the draft input even though results used the last submitted input. Codex corrected it to use the submitted query and added a regression test. Submitted searches now live in the q URL parameter, allowing direct links and history navigation to restore results. These changes were implemented by AI; no manual user code edits are claimed.

Validation: 19 tests and TypeScript/Vite build passed locally. Routing tests cover detail navigation, search restoration, history back/forward, direct detail entry, unknown movie/page recovery, and stable empty-state copy. No new user visual review is claimed.

## Milestone 3 — live data review

Codex replaced local filtering for submitted searches with a typed API service. Review identified that OMDb search results lack ratings and genres: these stay unavailable until details are fetched rather than becoming invented values. Shared poster rendering handles empty URLs. No user manual code edits are claimed.

Build review caught missing Node type definitions in the Vite server configuration; Codex added @types/node. Validation: 27 automated tests passed, including mocked API normalization, cache, input checks, rate limiting, errors/retry, pagination, details and cancelled search. Production build passed. Secret scan confirmed the activated key is absent from dist. Real detail request returned HTTP 200 for Inception; first live search timed out and was retried separately. Local development API was exercised through Vite middleware, not just direct function calls.

Live search diagnosis: a bounded direct request succeeded in 9.7 seconds, exceeding the initial eight-second timeout. Codex raised the server timeout to 15 seconds; the upstream response had 10 results and 38 total matches for Inception.

Final live verification: the Vite /api/movies search endpoint returned HTTP 200, 10 movies and 38 total matches after the timeout adjustment. All 27 tests and the production build passed again.

## Assignment 3 movie-browsing improvements — 2026-10-04

- Inspected `fe03-movie-app` and the existing worktree before editing. Preserved the pre-existing Firebase/authentication and other uncommitted changes; no reset, pull, or commit was performed.
- Confirmed all six curated poster image URLs returned HTTP 200 with `image/jpeg`. The shared poster fallback now visibly includes a film icon and movie title inside the same 2:3 poster frame.
- Verified the six curated IMDb IDs against live OMDb detail responses. Each returned HTTP 200 with the matching title and IMDb ID, a plot description, genre, and poster metadata. The curated movie cards have meaningful plot summaries and separate, secure IMDb profile links; tests assert the ID-based URLs and that the links are not nested inside the movie-navigation link.
- Added an accessible genre selector for the initial collection while retaining its labelled genre sections. Search genres are taken from the OMDb detail response, not inferred from the title-search response.
- Enriched live search results through IMDb-ID detail calls. Detail results are shared with direct movie-detail requests, cached for five minutes, deduplicated while in flight, and limited to three concurrent upstream detail requests. Live movie details display the returned plot and IMDb profile link; unavailable plot/genre values are labelled rather than fabricated.
- Recorded the request in `prompts.md` without credentials. Updated the Assignment 3 README to describe live detail enrichment. Assignment 3 remains in progress; Firebase setup and final end-to-end/submission work are still pending.

Validation:

- `npm test`: 7 test files passed, 36 tests passed.
- `npm run build`: passed TypeScript and Vite production build. Vite reports the existing large JavaScript bundle advisory (>500 kB); the build succeeds.
- Focused API/UI tests: 5 files passed, 22 tests passed, including detail caching and the three-request concurrency limit.
- Live Vite preview: `/api/movies?q=Inception` returned 10 results (38 total) with OMDb-supplied genre, plot, IMDb ID, and poster. Direct detail requests for all six curated IMDb IDs returned matching metadata and plots.
- Poster URL check: all six curated image URLs returned HTTP 200 with `image/jpeg`.
- `git diff --check`: passed.
