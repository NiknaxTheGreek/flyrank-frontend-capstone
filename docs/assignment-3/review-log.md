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

Nicholas spotted the defect during a mobile review of the first six-film catalogue. *Pulp Fiction* and *Interstellar* showed “Poster unavailable” while the other four posters loaded. The coding assistant traced the failure to the two TMDB filenames in `src/data/movies.ts` and updated the sample records.

| Movie | Original filename | Replacement filename |
| --- | --- | --- |
| Pulp Fiction | `d5iIlFn5s0ImszYzBPb8JPIfbXP.jpg` | `vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg` |
| Interstellar | `gEU2QniE6E77NI6lCU6M.jpg` | `yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg` |

During the original review, both old URLs returned HTTP 404 with an HTML response. The browser could not display an image, so the card showed its fallback. The assistant obtained the replacements from the TMDB pages for [Pulp Fiction](https://www.themoviedb.org/movie/680-pulp-fiction) and [Interstellar](https://www.themoviedb.org/movie/157336-interstellar). Each replacement returned HTTP 200 with an `image/jpeg` response and worked with the existing card. The [historical sample data](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/blob/c2a75213418bd4e147941838e243883e275cdc75/src/data/movies.ts) contains both corrected filenames.

The assistant also added a [component test](../../src/components/MovieCard.test.tsx) that simulates an image-load error and checks that the fallback, film title and rating remain visible. That test exercises the card's behaviour without contacting TMDB.

The [current catalogue](../../src/data/movies.ts) stores featured IMDb IDs. The app now obtains poster URLs from OMDb. The filename correction above applies to the earlier sample-data implementation.

### Technical correction and evidence (25 November 2026 audit)

**Observed defect:** In the original mobile review, two of the six movie cards displayed the unavailable-poster state, while the other four rendered images. This localized the problem to individual movie records rather than the entire catalogue or a general layout failure. The learner reported the observation and requested investigation; the coding assistant performed the diagnosis, edits and test.

**Reconstructed before/after code:** In the original sample catalogue, `posterBaseUrl` was `https://image.tmdb.org/t/p/w500`. The following shows the two historical property replacements described in the review record. It is a reconstruction of the correction, not a literal Git parent-to-child diff: the retained implementation commit adds the sample file with the corrected values already present.

```diff
 // Pulp Fiction
-posterUrl: `${posterBaseUrl}/d5iIlFn5s0ImszYzBPb8JPIfbXP.jpg`,
+posterUrl: `${posterBaseUrl}/vQWk5YBFWF4bZaofAbv0tShwBvQ.jpg`,

 // Interstellar
-posterUrl: `${posterBaseUrl}/gEU2QniE6E77NI6lCU6M.jpg`,
+posterUrl: `${posterBaseUrl}/yQvGrMoipbRoddT0ZR8tPoR7NfX.jpg`,
```

**Root cause and rationale:** The browser builds a complete image URL from the base path and the filename. The original review recorded HTTP 404 responses with HTML for the two old paths, whereas the corrected paths returned HTTP 200 with JPEG content. An image-load error activated the existing fallback. The narrow correction replaced only the bad image references; no CSS workaround, removal of the fallback, or change to the movie rating was required.

**Regression protection:** The historical component test in `src/components/MovieCard.test.tsx` uses Testing Library to simulate an image error, rather than relying on a live external image server:

```tsx
fireEvent.error(screen.getByRole('img', { name: 'Poster for Pulp Fiction' }));
expect(screen.getByRole('img', { name: 'Poster unavailable for Pulp Fiction' })).toBeTruthy();
expect(screen.getByRole('heading', { name: 'Pulp Fiction' })).toBeTruthy();
expect(screen.getByLabelText('Rated 8.9 out of 10')).toBeTruthy();
```

This verifies that an image failure does not erase the accessible fallback, movie title or rating. The current test additionally checks the fallback title and plot. The test protects UI resilience; it does not independently prove that a TMDB URL returns 200.

**Evidence checked in the November audit:** [Historical implementation commit](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/commit/c2a75213418bd4e147941838e243883e275cdc75) contains the corrected sample records and original regression test. The [recorded prompt](prompts.md#poster-review-follow-up), [current regression test](../../src/components/MovieCard.test.tsx) and [current featured-ID catalogue](../../src/data/movies.ts) provide additional traceability. The current catalogue uses OMDb, so the historical filenames are not present in its current source. The HTTP outcomes are from the original review, not newly measured in this documentation audit. No new automated test execution or visual check is claimed.

**Attribution and manual-improvement requirement:** This is evidence of learner-led defect discovery and AI-assisted implementation. It does not establish that the learner personally edited the two source lines. A learner-authored code improvement, if required, needs its own actual edit and verification record.

## Milestone 2 — AI code review and refactoring

Codex extracted HomePage from App and shared MoviePoster between cards and the new details view, avoiding duplicate fallback logic. Movie cards now use semantic links; detail navigation focuses the new heading and updates the document title. Mobile card titles wrap instead of being truncated.

Code review found that the empty-state text used the draft input even though results used the last submitted input. Codex corrected it to use the submitted query and added a regression test. Submitted searches now live in the q URL parameter, allowing direct links and history navigation to restore results. These changes were implemented by AI; no manual user code edits are claimed.

Validation: 19 tests and TypeScript/Vite build passed locally. Routing tests cover detail navigation, search restoration, history back/forward, direct detail entry, unknown movie/page recovery, and stable empty-state copy. No new user visual review is claimed.

## Milestone 3 — live data review

Codex replaced local filtering for submitted searches with a typed API service. Review identified that OMDb search results lack ratings and genres: these stay unavailable until details are fetched rather than becoming invented values. Shared poster rendering handles empty URLs. No user manual code edits are claimed.

Build review caught missing Node type definitions in the Vite server configuration; Codex added @types/node. Validation: 27 automated tests passed, including mocked API normalization, cache, input checks, rate limiting, errors/retry, pagination, details and cancelled search. Production build passed. Secret scan confirmed the activated key is absent from dist. Real detail request returned HTTP 200 for Inception; first live search timed out and was retried separately. Local development API was exercised through Vite middleware, not just direct function calls.

Live search diagnosis: a bounded direct request succeeded in 9.7 seconds, exceeding the initial eight-second timeout. Codex raised the server timeout to 15 seconds; the upstream response had 10 results and 38 total matches for Inception.

Final live verification: the Vite /api/movies search endpoint returned HTTP 200, 10 movies and 38 total matches after the timeout adjustment. All 27 tests and the production build passed again.

## Movie browsing and authentication/favorites follow-up

- **Branch/worktree inspection — coding assistant:** Switched to the requested `fe03-movie-app` branch after confirming the worktree was clean. The other local deployment branch contained prior movie metadata and Firebase Authentication UI, but its favorites implementation used Firestore rather than the requested Realtime Database; no local uncommitted work was overwritten.
- **Problem → correction → reason → verification — recommendations lacked plots and usable IMDb links:** Added a meaningful plot and verified IMDb ID to all six sample movies; cards now expose the plot and an external IMDb profile link separately from navigation. Tests check all six records/links and that links are not nested. `npm test`: passed.
- **Problem → correction → reason → verification — sample collection had no clear genre browsing:** Grouped recommendations under genre headings and added a labelled genre selector. The accessible control is covered by a test that filters to Sci-Fi. Mobile CSS remains responsive; visual review is still outstanding.
- **Problem → correction → reason → verification — OMDb search lacks genre/plot fields:** Enriched result IDs with detail lookups rather than inventing metadata. The API deduplicates in-flight details, caches details/search for five minutes, and limits detail concurrency to three; tests verify the returned metadata, request reuse, and concurrency bound. Existing pagination, URL state, cancellation, loading/error/empty/retry remain covered by tests.
- **Problem → correction → reason → verification — fallback omitted the film title:** Added film icon, title and unavailable label inside the fixed poster frame; the component test asserts the title and existing rating survive an image error. All six current TMDB poster URLs were checked and returned HTTP 200 `image/jpeg`, so no URL correction was needed.
- **Problem → correction → reason → verification — prior Firebase favorite storage used Firestore:** Replaced the storage layer with Realtime Database records at `users/{uid}/favorites/{imdbId}` so sample slugs and live IMDb IDs map to one canonical key. Unit tests mock the SDK to verify UID paths, canonical save/remove keys and invalid-record rejection. Emulator rules isolation remains unverified because Firebase CLI/emulator is unavailable.
- **Problem → correction → reason → verification — private route could redirect before auth initialization:** Added an auth-loading state before route decisions, a protected Favorites route, and a same-origin return-path guard. Mocks verify the initial check and return-to-favorites after sign-in. A real Firebase session remains unverified.
- **Problem → correction → reason → verification — favorites can leak in UI across account changes:** The favorites context tags observed data with the current UID, clears on sign-out, ignores stale listener callbacks, and re-subscribes on account changes. Mock tests cover changing users, restored saved data, and sign-out.
- **Problem → correction → reason → verification — unconstrained test workers were terminated in this Codespace:** Configured Vitest to run on a single thread. `npm test` then passed 41 tests across 8 files.
- **Build/resource issue → correction → reason → verification:** Several build attempts were terminated while the Codespace was under memory pressure. After stopping the preview process and rerunning, standard `npm run build` passed for the current worktree (64 modules; Vite warned the 538.08 kB JS chunk exceeds 500 kB). A fresh production preview returned HTTP 200 for `/` and `/movies`; its live OMDb API returned 10 movies, 38 total matches, and verified genre/plot fields.
- **Database rules/config — coding assistant:** Added UID-scoped read/write permissions and record shape/type validation in `database.rules.json`; `firebase.json` points to those rules and configures the database emulator port. JSON syntax validation passed. The workspace has no Firebase web configuration values and no Firebase CLI/emulator executable, so live authentication, persistence, and emulator isolation have not been verified.
- **Learner review/manual edits:** This follow-up was implemented by the coding assistant. No manual code edits or visual review by the learner are claimed. The [later verification record](verification.md#firebase-verification) documents the subsequent end-to-end Firebase check.
