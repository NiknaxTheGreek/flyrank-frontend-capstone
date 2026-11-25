# Assignment 4 — Next.js scaffold

Status: scaffold implemented; Git-connected preview build and live route checks verified on 25 November 2026. Responsive screenshot evidence is linked in [submission.md](submission.md). Repository-wide historical credential cleanup remains deferred.

## Run from Git

Use branch `fe04-scaffold-deploy`, Node 24 and `npm ci`.
Run `npm run verify`, then `npm start`. Open port 3000.
For development use `npm run dev`.
No environment variables are required for this scaffold.

## Screen map

| Screen | Route | Implementation |
|---|---|---|
| Discover | `/` | Server-rendered sample catalogue, GET search form, genre filter |
| Movies | `/movies` | Same shared discovery component |
| Search | `/?q=Inception&page=1` | URL state, pagination, empty state, native history |
| Details | `/movies/tt1375666` | Sample details, IMDb link, poster fallback, disabled favorite action |
| Account | `/account` | Explicit unconnected authentication placeholder; safe intended return path |
| Favorites | `/favorites` | Explicit protected-screen placeholder; no user data fetched |
| Generic 404 | unknown routes | Page not found with recovery |
| Movie 404 | invalid/unknown movie IDs | Separate Movie not found screen |
| Health | `/health` | Actual uncached external data fetch; success/failure and retry |

The scaffold uses three sample titles. It does not claim live OMDb search or working Firebase authentication. Full Assignment 3 functionality remains available on the [A3 source branch](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe03-movie-app).

## Architecture and decisions

App Router layout and pages are Server Components. Only the error-boundary retry button needs a Client Component. Tailwind 4 theme tokens define colours, font and spacing. GET forms and Next links preserve URL state without client state duplication.

Legacy Vite pages moved from `src/pages` to `src/legacy-pages` to prevent Next.js Pages Router conflicts. Legacy tests remain runnable. The Next TypeScript configuration checks the new application; legacy behaviour is separately exercised by the existing suite. `npm run legacy:dev` retains the older development entry point; Vite environment names apply only there.

The health page requests a fixed HTTPS JSONPlaceholder URL with a 5-second timeout, redirect rejection, no caching and response-shape validation. It reports fetched record data. This checks external data connectivity, not Firebase or OMDb health. No arbitrary user-supplied fetch URLs are accepted.

Firebase `NEXT_PUBLIC_*` names in `.env.example` are reserved public client configuration. `OMDB_API_KEY` remains private/server-only. Never put admin credentials in a public variable. Firebase rules are still required when real authentication/favorites are connected.

## Dependency maintenance

Vitest 5 removed the previous `--minWorkers` flag. The test script now uses only `--maxWorkers=1`. React Router was upgraded to 7.18.5 for legacy test code. A scoped `@grpc/grpc-js` override selects >=1.13.6 within major 1 to address Firebase's vulnerable transitive dependency. React 18 currently builds, but Next.js emits a deprecation warning; React 19 migration is deferred rather than silently claiming it was performed.

## Browser verification

With a production server running, install the browser using `npx playwright install chromium --only-shell`, then run `npm run smoke`.
For the actual public preview:

```bash
PREVIEW_URL=https://YOUR-PREVIEW.vercel.app npm run smoke
```

The smoke script checks routes, headings, horizontal overflow at 375px and 1280px, browser exceptions, search and details-return behaviour. A login-gated host preview must be made accessible to reviewers before submission. Unit tests separately simulate health success, HTTP failure, invalid data and network failure. Do not claim a live successful fetch solely from mocked tests.

## Git-connected hosting setup and repeatable verification

1. Import this existing repository into Vercel on its free personal plan. Use Next.js preset, repository root, Node 24, `npm ci`, and `npm run build`. Keep Production Branch set to `main` so `fe04-scaffold-deploy` is a Preview branch. Do not merge or change Assignment 3.
2. Configure Preview environment variables only if enabling a real provider. This scaffold needs none. No payment service is needed.
3. After the Git connection is established, push a new conventional commit on this branch. Confirm Vercel automatically creates a Preview deployment and its displayed commit SHA matches that pushed commit. A manual deployment alone does not pass this gate.
4. Run the smoke command against that deployment; manually inspect both sizes and run `/health`. Record URL, SHA and actual output in verification.md.
5. Update submission.md, commit/push final evidence, and verify its automatic preview as well.
6. Use the verified branch and preview for submission. The existing historical final tag requires separate repository-wide cleanup; do not use it as the current submission source.

Fallback: Netlify Git import with its Next.js support and branch deploys enabled for `fe04-scaffold-deploy`. Verify a fresh push-triggered deployment and the same browser checks. Paid services are not authorized or required. If hosting access is unavailable, retain pending status rather than substitute a manually hosted site.
