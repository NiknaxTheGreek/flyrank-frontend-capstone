# A10 submission

Status: implementation verified locally; GitHub CI verification in progress.

- Branch: `fe10-tests-and-ci`
- Test files: `src/components/MovieMessage.test.tsx`,
  `src/components/MovieToolCard.test.tsx`,
  `src/components/MovieChat.lifecycle.test.tsx`, existing chat and form suites,
  and `e2e/movie-picker.spec.ts`.
- Configuration: `vite.config.ts`, `playwright.config.ts`, `tsconfig.tests.json`,
  `.github/workflows/tests.yml`.
- Full coverage and actual failure/fix evidence: [README](./README.md).
- Local checks: 86 Vitest tests, application/test type checks and production build pass.
- CI run and CI screenshot: pending the first workflow completion.
- Required merge-check enforcement: not configured through this connection;
  the GitHub setting still needs confirmation.

ChatGPT added and ran the tests, diagnosed the second-result regression, fixed
the renderer, and reran the suite. All AI requests are mocked during testing.
