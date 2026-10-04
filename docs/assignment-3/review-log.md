# Assignment 3 review log

## Initial implementation review

- The existing `App` rendered the FlyRank SEO dashboard, and the App-level test asserted dashboard headings; that assertion no longer described the requested Home screen.
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
