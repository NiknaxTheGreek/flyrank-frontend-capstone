# Assignment 3 prompts

## First milestone

> Implement Assignment 3’s first milestone on fe03-movie-app.
>
> Use the existing React, TypeScript, Vite and CSS setup.
>
> Requirements:
> - Replace the dashboard with a responsive movie-browsing Home screen.
> - Create a typed Movie model and a separate sample-data file with six movies.
> - Create a reusable MovieCard component receiving its movie through props.
> - Add a labelled search form. Submitting it filters sample movies by title, ignoring case and surrounding whitespace.
> - Show an informative empty state when nothing matches.
> - Add a Clear search button that restores all movies.
> - Use accessible controls, visible keyboard focus and a poster fallback.
> - Keep filtering logic in a custom useMovieSearch hook, separate from presentation.
> - Do not add routing, OMDb, Firebase or authentication yet.
>
> Evidence:
> - Create docs/assignment-3/prompts.md and record this prompt.
> - Create docs/assignment-3/review-log.md for review findings and subsequent corrections. Do not invent manual improvements or claim I edited code.
>
> Validation:
> - Update tests that target the replaced dashboard.
> - Test initial movie display, search and clearing, and the empty state using React Testing Library.
> - Run npm test and npm run build; resolve any failures.
> - Summarize changed files, actual validation results, and explain how props, state and the custom hook work.
> - Do not commit yet; I will review the result first.

## Poster review follow-up

> Review the Assignment 3 Home screen following my mobile inspection.
>
> Observed: Pulp Fiction and Interstellar show “Poster unavailable”, while the other four posters render.
>
> 1. Investigate their sample poster URLs and correct them if invalid. Do not guess replacement URLs.
> 2. Preserve the existing fallback for genuinely missing or failed images.
> 3. Add a meaningful MovieCard test confirming that an image error displays the fallback while retaining the movie title and rating.
> 4. Record my observation and your diagnosis/fix in docs/assignment-3/review-log.md. Attribute the visual review to me and code changes to the AI assistant.
> 5. Record this prompt in docs/assignment-3/prompts.md.
> 6. Run npm test, npm run build and git diff --check.
> 7. Report the results. Do not commit yet.


## Milestone 2 — routing and details

User instruction: “Go”, accepting the proposed routing and movie-details milestone.

Assistant implementation scope: add Home and /movies/:movieId routes, clickable movie cards, direct-link and unknown-route handling; retain search in the URL; share poster fallback rendering; test navigation and search restoration. Codex edited and ran commands directly using the pushed source snapshot.

## Milestone 3 — live OMDb integration

User confirmed “Activated” after registering the OMDb key. This authorized the previously proposed live search and details implementation. Codex implemented a server-only key boundary, normalized movie responses, pagination, cancellation, loading/error/empty states and retry. The supplied credential is intentionally omitted from this evidence.

## Assignment 3 movie browsing improvements

> Continue Assignment 3 in flyrank-frontend-capstone on fe03-movie-app.
>
> First inspect the branch, working tree, project instructions and existing implementation. Preserve all uncommitted work, including Firebase changes. Do not reset, overwrite or blindly pull over local changes.
>
> Fix the movie-browsing experience:
> - Every popular/recommended movie must have a meaningful description and a working IMDb profile link using its verified IMDb ID.
> - Apply this to the initial collection as well as live movie details.
> - Verify poster URLs. Correct broken URLs using verified movie metadata; never guess image paths.
> - For unavailable posters, show an intentional fallback with a film icon and movie title, keeping card dimensions consistent.
> - Organize the initial collection into clearly labelled genre sections and add an accessible genre filter.
> - Do not invent genres for OMDb search results: search responses omit genres. Fetch/cache details where needed, limit concurrency and avoid repeated requests on every render.
> - Keep movie navigation and IMDb links as separate accessible controls; do not nest links.
> - Preserve search pagination, loading, empty/error states, retry, URL state and mobile responsiveness.
>
> Run appropriate tests and npm run build. Report actual results and unresolved issues. Record this prompt without any credentials in docs/assignment-3/prompts.md and document the changes in review-log.md.
>
> Do not mark Assignment 3 complete yet.
