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

## Movie browsing and Firebase authentication/favorites follow-up

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
>
> Complete Assignment 3 authentication and favorites, building on the existing Firebase work.
>
> Inspect what is already implemented before changing anything.
>
> Required behavior:
> - Firebase Authentication with sign-up, sign-in and sign-out.
> - Clear form validation and useful authentication errors.
> - Wait for the initial authentication check before deciding whether to redirect.
> - Protect the Favorites route and return users to their intended internal page after sign-in.
> - Save and remove movies in Firebase Realtime Database under the authenticated user's UID.
> - Favorites survive refresh and signing out/back in.
> - Prevent duplicate favorites and show pending, success and failure feedback.
> - Clear user-specific state when the account changes or signs out.
> - Database rules must deny unauthenticated access and prevent one user reading or writing another user's favorites. Validate stored record shape.
> - Support favorites for both the initial collection and live OMDb results using consistent IMDb IDs.
>
> Keep OMDB_API_KEY server-side. Never print, commit or document secret values. Use .env.example for variable names and placeholders.
>
> If Firebase project configuration is missing, complete all independent code and tests, then give me the exact remaining console steps and configuration fields. Do not claim live Firebase integration works until verified.
>
> Test auth routing and favorites behavior with mocks, and test database isolation with Firebase emulators where available. Run npm test and npm run build.
>
> Update the prompt and review logs, distinguishing AI implementation from my actual review or manual edits.

## Assignment 3 deliverables and branch completion follow-up

The following is the exact available user prompt, recorded without credentials:

> cintinue where you left off from and then Prepare the Assignment 3 deliverables using the actual implemented app.
>
> Verify this flow:
> Home → genre browsing → search → movie details → IMDb link → sign-in → add favorite → Favorites → refresh → remove favorite → sign-out.
>
> Also verify:
> - Signed-out access to Favorites.
> - Loading, empty, network-error and retry behavior.
> - Missing posters.
> - Search pagination and browser Back/Forward.
> - Mobile layout and keyboard navigation.
> - Cross-user favorite isolation.
> - OMDb credentials are absent from tracked files and the browser bundle.
>
> Run npm test and npm run build. Serve the fresh build and verify the homepage and live OMDb endpoint. Obtain the current forwarded URL from Codespaces; do not guess it. Label it as a temporary preview, not a permanent deployment.
>
> Create/update:
> 1. README.md — purpose, implemented features, setup, environment-variable names, commands, architecture, Firebase setup/rules and limitations.
> 2. docs/assignment-3/prompts.md — actual available development prompts in order, with credentials redacted. Clearly label summaries where exact prompts were not retained.
> 3. docs/assignment-3/ai-assistance.md — specific contributions from ChatGPT, Codex and Copilot.
> 4. docs/assignment-3/review-log.md — concrete problem → correction → reason → verification examples, with accurate attribution.
> 5. docs/assignment-3/verification.md — checks actually executed, results, and anything still unverified.
> 6. docs/assignment-3/submission.md — concise submission text linking to the app, source and evidence.
>
> Do not describe AI-written changes as manual code edits by me. If genuine manual-edit evidence is still missing, state that and identify one useful small change I can personally make and explain.
>
> Capture screenshots if browser tools are available; otherwise provide a short list of screenshots I must capture. Never fabricate screenshots, test results or completion claims. and Review the Assignment 3 changes and save the completed work to fe03-movie-app.
>
> - Preserve unrelated work.
> - Confirm no secrets, .env.local, node_modules or build output will be committed.
> - Commit only reviewed assignment changes using focused Conventional Commit messages.
> - Push the branch without merging into main or force-pushing.
> - Verify the remote commit matches the local HEAD.
>
> Return:
> - GitHub branch URL and final commit SHA.
> - Verified current app URL, noting whether temporary or permanent.
> - Links to the submission, prompt log, AI-assistance explanation, review log and verification report.
> - Actual test/build results.
> - Any remaining setup, manual-review or screenshot requirements.
>
> Only label this “Completed — awaiting submission” if all required functionality and evidence are complete. Otherwise give an accurate remaining-work list.
