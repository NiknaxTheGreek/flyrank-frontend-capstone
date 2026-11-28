# Assignment 4 verification

## Current verification

### 25 November 2026 — post-consolidation audit

- Vercel Git-triggered Preview: READY for commit `d4f0ac7aef3dfda81ffca562b30833c465075506`; build logs show `next build`, successful compilation and TypeScript, and App Router output for `/`, `/movies`, `/movies/[movieId]`, `/account`, `/favorites`, `/health` and not-found.
- Public branch alias returned expected content for `/`, `/movies`, `/movies/tt1375666`, `/account`, `/favorites`, `/health` and `/?q=Inception&page=1` without sign-in. Health returned record #1: delectus aut autem.
- Original PNG captures were visually inspected: 375px, 1280px and successful health fetch. The redundant damaged JPEG was removed from the current tree. Console messages are visible in the responsive captures; no fresh viewport or console test is claimed.
- `.env.example` has blank values and `.gitignore` excludes local env files. Known historical credential exposure remains subject to separate repository-wide remediation.
- Latest deployment install reported one moderate vulnerability and non-fatal warnings, superseding the earlier zero-vulnerability audit as a current dependency status. No new unit test run was performed in this audit.


## Screenshot evidence — checks completed 11 November 2026

The original screenshots supplied by Nicholas in the A4 chat are now packaged in this branch.

| Check | Result | Evidence |
|---|---|---|
| 375px responsive layout | Complete — mobile layout reviewed | [375px screenshot](evidence/responsive-375px.png) |
| 1280px responsive layout | Complete — desktop layout reviewed | [1280px screenshot](evidence/responsive-1280px.png) |
| Deployed health fetch | Success — fetched record #1 displayed | [Health success](evidence/health-success.png) |

These are manual browser captures, not a newly executed automated browser suite. The responsive captures show the configured widths and visible layout; they do not independently prove every route or a clean console. Console messages are retained in the unedited captures. The typed Transformers query is not submitted in these captures and is not evidence of a live catalogue search.

See the [submission record](submission.md) for the preview and separate public-access/final-tag status.

## Historical checkpoints

The dated pending items below describe earlier states and are superseded by the current verification above for the completed responsive checks and deployed health success. The assistant-runtime browser limitation remains historical and does not negate the manual browser evidence.

### Starting state
- Branch: fe04-scaffold-deploy
- Base: assignment-03-final
- Base: original A3 evidence checkpoint (historical; superseded by history consolidation)
- Assignment 3 was originally frozen; the repository-wide history consolidation subsequently changed branch references.

## Verified baseline — 2026-10-18
- npm test: PASS — 41 tests across 8 files.
- npm run build: PASS — Vite production build.
- Existing warning: JavaScript bundle exceeds 500 kB.
- Migration, deployment and responsive checks: pending.

## Delivery rules
- Free, simple and quick first; preserve rubric and security safeguards.
- Document fallbacks.
- Original workflow: finish code, verify tests/build, commit, push and tag. Historical tag replacement is now a separate deferred security task.
- Screenshots may follow from the frozen version.

## Tooling upgrade verification — 2026-11-11
- Installed Next.js 16.4.2; Next.js scaffold not yet implemented.
- Upgraded Vite to 8.3.4, React plugin to 6.1.2 and Vitest to 5.0.5.
- Removed unsupported --minWorkers option from the test script.
- npm test: PASS — 41 tests across 8 files.
- npm run build: PASS — Vite production build, no chunk-size warning.
- Last installation audit: 6 vulnerabilities (2 moderate, 4 high); review pending.
- Next.js build and Git-connected preview deployment: pending.

## Next.js implementation checkpoint — 2026-11-11

Checks executed in the assistant runtime after retrieving the pushed branch:
- npm ci --ignore-scripts: PASS for initial checkpoint dependency installation.
- npm test after targeted dependency fixes: PASS — 52 tests across 9 files.
- npm run build: PASS — Next.js 16.4.2 compiled, checked TypeScript and generated the App Router routes.
- npm run typecheck: PASS.
- npm audit --json after fixes: PASS — 0 vulnerabilities in all severity categories.
- Existing React 18 deprecation warning remains; build succeeds. This is not a React 19 migration.
- Health success/HTTP failure/network failure/malformed JSON/invalid schema: tested with mocked fetch responses.
- Actual external health request from this runtime: timed out and returned the handled failure result. Successful live provider fetch remains unverified.
- Local browser smoke attempt: BLOCKED. System Chromium failed with socket operation not permitted; Playwright headless-shell fallback download failed with invalid/truncated ZIP.
- No 375px/1280px browser pass or screenshot is claimed. scripts/smoke.mjs is supplied for repeatable checks in Codespaces and against the eventual deployment.
- Git-connected hosting: NOT CONFIGURED here. No Vercel/Netlify connector or authenticated hosting browser session available.
- Assignment 4 is NOT complete. Public URL, actual push-triggered preview, deployed browser checks, and final tag remain pending.

Implementation: App Router routes, shared server layout, Tailwind tokens, URL search/genre/pagination over explicitly labelled sample data, movie details and recovery states, account/favorites placeholders, server-fetched health screen, loading and client error retry boundary. Legacy pages relocated to src/legacy-pages; Assignment 3 files remain untouched in the frozen history.
