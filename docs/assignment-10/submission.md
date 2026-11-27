# Assignment 10 — Testing and CI

In this assignment, automated verification protects the movie assistant, structured results and validated forms from regressions. Component and browser tests cover the primary interaction and recovery paths, while a continuous integration workflow provides a required merge check.

- Branch: `fe10-tests-and-ci`
- Test files: `src/components/MovieMessage.test.tsx`,
  `src/components/MovieToolCard.test.tsx`,
  `src/components/MovieChat.lifecycle.test.tsx`, existing chat and form suites,
  and `e2e/movie-picker.spec.ts`.
- Configuration: `vite.config.ts`, `playwright.config.ts`, `tsconfig.tests.json`,
  `.github/workflows/tests.yml`.
- Full coverage and actual failure/fix evidence: [README](./README.md).
- Local checks: 86 Vitest tests, application/test type checks and production build pass.
- [Successful 27 November push workflow](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/46014127073) (audited source `fdccb215`; all steps passed).
- [Original successful CI run](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44602615431)
- [Successful pull-request CI run](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44602627425)
- [Screenshot of the actual CI results](./evidence/ci-suite.png)
- [Machine-readable CI result](./evidence/ci-verified-results.json)
- [Full CI transcript](./evidence/ci-run.txt)
- CI passed: 86/86 Vitest tests and 4/4 Playwright executions, covering both
  primary flow and interrupted-response retry at desktop and 375px phone widths.
- Application and test TypeScript and the production build passed in CI too.
- The active [A10 ruleset](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/rules/27792069) targets the default branch (`main`) and requires the GitHub Actions check `A10 merge gate`, verified active on 27 November 2026. It does not target every assignment branch.

The CI screenshot is a labelled report rendered in the GitHub runner from
the real test outputs, with its source run and commit printed on the image.
It is not a screenshot of GitHub's web interface. The committed evidence
does not depend on GitHub Actions artifact retention.

ChatGPT assisted with test development and regression verification. The required failing-test and implementation-fix evidence is recorded in the linked README. All AI requests are mocked during testing.
