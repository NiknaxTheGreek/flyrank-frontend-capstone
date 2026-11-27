# Reel Good — Assignment 10: Testing and CI

In this assignment, automated verification protects the movie assistant, structured results and validated forms from regressions. Component and browser tests cover the primary interaction and recovery paths, while a continuous integration workflow provides a required merge check.

[Testing and CI details](docs/assignment-10/README.md) · [Submission and evidence](docs/assignment-10/submission.md)

## Implementation

Vitest and React Testing Library verify components and server behavior. Playwright exercises the primary flow and interruption/retry on desktop and phone widths. The recorded CI run passed 86 component/server tests and four browser executions. The active ruleset requires the A10 merge gate.

## Reviewing the assignment

Inspect the test coverage, actual failing-test/fix evidence and passing CI reports. Run the verification commands with mocked provider requests.

## Local development and verification

Use Node 24, `npm ci`, `npm run typecheck`, `npm run test:ci`, `npm run build`, `npm run test:e2e:install` and `npm run test:e2e`. No API keys are needed for tests.

## Connection to the capstone

The test suite builds on the existing product and resilience features and supports later release verification.
