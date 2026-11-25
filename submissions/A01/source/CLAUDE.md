# Reel Good — Project context and conventions

## Assistant
ChatGPT is the chosen development assistant. The filename is retained for
assignment compatibility and does not claim Claude Code was used.

## Product and scope
Reel Good is the Frontend track movie discovery app: browse genres, search
movies, view details and IMDb links, sign in and save favorites.
This branch contains Assignment 1 setup documentation; application implementation
lives on later assignment branches.

## Stack
The movie-app foundation uses React, TypeScript, Vite, React Router, OMDb,
Firebase Authentication and Firebase Realtime Database.
Node.js 24, npm and Git support development in VS Code / GitHub Codespaces.
Vitest and React Testing Library cover components. Later assignments cover
Playwright, accessibility, motion, 3D, shaders and production deployment.
Inspect the target application's package.json before choosing commands or
changing dependencies; this setup branch has no runnable app.

## Conventions
- Explain changes and their purpose clearly to the learner.
- Use Conventional Commits and preserve meaningful history.
- Inspect existing files before edits; preserve unrelated work.
- Keep assignment deliverables on their appropriate branches.
- Keep documentation consistent with Reel Good's actual implementation.
- Use typed movie records and preserve valid IMDb identifiers.
- Do not invent movie metadata or claim unverified features work.
- Keep OMDb and LLM secrets server-side; never commit .env secrets.
- Firebase web configuration is public; private service-account keys are not.
- Enforce per-user access for favorites through database rules.
- Validate input and limit external requests.
- Use semantic HTML, accessible labels, keyboard focus and reduced-motion support.
- Handle loading, empty, error, retry and interrupted-request states.
- Mock external APIs in automated tests.
- Report only checks actually run; distinguish evidence from status declarations.
- Keep npm lockfiles alongside the app when dependencies are changed.
