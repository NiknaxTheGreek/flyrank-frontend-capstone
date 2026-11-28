# Reel Good — project rules

ChatGPT is the chosen development assistant. These conventions consolidate the former separate assistant notes; they do not claim Claude Code was used.

## Shared conventions

- Explain changes and their purpose clearly. Inspect existing files first; preserve unrelated work and assignment-specific deliverables.
- Use focused Conventional Commits and retain meaningful evidence. Use Node.js 24 and npm; retain the lockfile. Check the current package.json before running commands.
- Keep movie API and LLM credentials server-side; never commit environment secrets or private customer data. Firebase client identifiers are public, not admin credentials. Enforce per-user favorites access through database rules.
- Validate server input and bound external requests. Use verified IMDb identifiers; never invent metadata.
- Use semantic HTML, accessible labels and focus, and reduced-motion support. Handle loading, empty, streaming (where applicable), success, error and retry states.
- Mock external AI and movie API calls in automated tests; avoid paid requests during tests. Report only checks actually executed, distinguish historical evidence from current verification.
- For settings changes, use a separate component and preserve the existing screen sections. Validate localStorage data, handle read/write failures, and show save success only after a successful write. Use role/name-based tests for invalid input, persistence, and visible failure feedback. These rules originated in Assignment 2.

## Active branch

Assignment 12 — React 18, TypeScript and Vite. Preserve app functionality while measuring performance and accessibility. Retain original Lighthouse, WAVE and keyboard audit evidence; distinguish measured results from targets.

Development: `npm run dev`. Production preview: `npm run preview` after build. Validation: npm run verify; npm run audit:lighthouse; npm run audit:wave. This branch has no lint script.

## Testing rules

- Query interactive components by role and accessible name; avoid CSS selectors and test IDs.
- Keep all AI and movie requests mocked. The Vitest setup rejects unmocked fetches.
- Run `npm run typecheck` for application and test source. Run the component suite, production build and mocked Playwright journeys after changes to the chat or stream contract.
- A passing workflow is distinct from enforced branch protection. Report both honestly.
