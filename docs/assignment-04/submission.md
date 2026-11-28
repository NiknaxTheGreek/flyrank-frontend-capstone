# Assignment 4 — Scaffold and deploy

In this assignment, the movie application is organized into a deployable Next.js scaffold with shared navigation, responsive design and a server-side health check. Git-connected previews make incremental work available for review from the beginning.

**Scaffold deployed; Git-triggered build and live route checks verified on 25 November 2026. Responsive evidence from 11 November is packaged.**

Repository: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone  
Application snapshot verified: `d4f0ac7aef3dfda81ffca562b30833c465075506`

## Preview

- [Current branch preview](https://flyrank-frontend-capstone-git-fe04-scaffo-77e33b-niknaxthegreek.vercel.app)
- [Verified deployment snapshot](https://flyrank-frontend-capstone-a55u04u3s-niknaxthegreek.vercel.app)
- [Live health check](https://flyrank-frontend-capstone-git-fe04-scaffo-77e33b-niknaxthegreek.vercel.app/health)

Vercel recorded a successful Git-triggered Preview deployment with matching commit SHA. Build logs show Next.js 16.4.2 compilation, TypeScript checking and all App Router routes. A signed-out fetch of the home, movies, detail, account, favorites, health and search URLs returned expected scaffold content on 25 November. The health page reported “Data fetched successfully” and displayed record #1.

## Screenshot evidence — 11 November 2026

| Check | Result | Evidence |
|---|---|---|
| 375px | Mobile layout shown | [375px screenshot](evidence/responsive-375px.png) |
| 1280px | Desktop layout shown | [1280px screenshot](evidence/responsive-1280px.png) |
| Deployed health | Record #1 displayed | [Health success](evidence/health-success.png) |

All three PNGs were retrieved and visually inspected on 25 November. Browser console messages are retained; the screenshots do not establish a clean console or every-route responsive pass. No fresh automated viewport run is claimed. This assignment intentionally uses sample catalogue data and account/favorites placeholders.

## Verification scope

- The current setup example has blank credential values; local environment files are ignored. Historical credential purge, tag replacement and key rotation remain separate repository-wide tasks.
- The current Vercel install reports one moderate dependency advisory and non-fatal React 18/tooling warnings; the build succeeded.

See [verification](verification.md) for the original test/build records and latest audit.

## Reviewing the assignment

Open the preview, navigate between the planned screens, inspect the layout at phone and desktop widths, and open the health page.
