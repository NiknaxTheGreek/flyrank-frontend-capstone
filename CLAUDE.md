# Project context and conventions

## Assistant
ChatGPT is the chosen development assistant. This filename is retained for
assignment compatibility; it does not claim Claude Code was used.

## Product
Reel Good is the frontend movie discovery capstone: browse genres, search movies,
view details and IMDb links, sign in and save favorites. Later assignments extend
the experience with movie chat, motion, arcade, 3D and shader features.

## Stack
Read this branch's package.json and README for its exact stack and commands.
Early movie-app assignments use React, TypeScript and Vite; scaffold and later
assignments use Next.js where their manifests specify it. Use Node.js 24 and npm.
Keep movie API credentials server-side and protect per-user favorites.

## Development conventions
- Explain each change and its purpose to the learner.
- Use Conventional Commits: chore:, docs:, feat:, fix:, test:, refactor:.
- Keep commits focused; preserve meaningful history.
- Use npm and commit its lockfile once the app is scaffolded.
- Use semantic HTML, labelled controls, visible focus and reduced-motion support.
- Validate external input on the server; keep credentials server-side.
- Never commit secrets or real customer information; demo records are synthetic.
- Validate movie requests and bound external API calls.
- Render loading, streaming, success, empty and error states deliberately.
- Mock AI calls in tests. Do not use paid APIs during automated tests.
- Report only checks actually run. Mark planned work and unverified evidence.
- Before editing, inspect current files; do not overwrite unrelated user work.

## Assignment 2 development

This branch uses React 18, TypeScript and Vite. Keep application code in `src/` and follow its existing component patterns. Use `npm run dev` for development, `npm run build` for a production build, and `npm run preview` to serve that build locally. The package has no lint script.
