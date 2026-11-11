# Active Assignment 4 context

Reel Good uses Next.js App Router, TypeScript and Tailwind on `fe04-scaffold-deploy`.
The notes below are retained historical context and do not override the current Assignment 4 screen spec.

- Preserve Assignment 3 branch/tag/history. Never move a frozen assignment tag.
- Pages/layouts are Server Components; use Client Components only for interaction.
- No secrets in Git; OMDb keys stay server-only. NEXT_PUBLIC variables are public.
- Keep account/favorites placeholders honest until real authenticated per-user access is implemented.
- Run `npm run verify`; validate the actual Git-triggered preview at 375px and 1280px before freezing.
- Prefer free/simple implementations; document fallback and outstanding evidence.

# Project context and conventions

## Assistant
ChatGPT is the chosen development assistant. This filename is retained for
assignment compatibility; it does not claim Claude Code was used.

## Product
AI Growth Workspace combines FE2 website review, FE1 lead scoring, and FE3
questions over saved pipeline data. Primary flow: enter a company URL and known
facts, review website metadata, score customer fit, save, and query the record.
All application features are planned at this setup stage.

## Planned stack
- Next.js App Router, React, TypeScript with strict mode.
- Tailwind CSS for responsive styling.
- Node.js 24 LTS, npm, Git; VS Code in GitHub Codespaces on Android.
- Vitest and React Testing Library; Playwright for end-to-end testing.
- WAVE for accessibility audits; Vercel as planned hosting.
- AI provider and persistence backend are not yet selected.

## Development conventions
- Explain each change and its purpose to the learner.
- Use Conventional Commits: chore:, docs:, feat:, fix:, test:, refactor:.
- Keep commits focused; preserve meaningful history.
- Use npm and commit its lockfile once the app is scaffolded.
- Use semantic HTML, labelled controls, visible focus and reduced-motion support.
- Validate external input on the server; keep credentials server-side.
- Never commit secrets or real customer information; demo records are synthetic.
- Website fetching must block private/local addresses, bound redirects and
  response sizes, and apply timeouts before it is exposed publicly.
- Keep website findings separate from lead fit. Unknown facts stay unknown.
- Lead scores follow explicit rules; AI explanations must cite supplied evidence.
- Query tools use validated, bounded operations, never arbitrary model-written SQL.
- Render loading, streaming, success, empty and error states deliberately.
- Mock AI calls in tests. Do not use paid APIs during automated tests.
- Report only checks actually run. Mark planned work and unverified evidence.
- Before editing, inspect current files; do not overwrite unrelated user work.
