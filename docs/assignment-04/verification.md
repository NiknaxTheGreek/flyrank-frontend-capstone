# Assignment 4 verification

## Starting state
- Branch: fe04-scaffold-deploy
- Base: assignment-03-final
- Base commit: d216f77f97b958fd247836a6aeb4ca51a6f8edf3
- Assignment 3 branch, tag and history must remain unchanged.

## Verified baseline — 2026-10-18
- npm test: PASS — 41 tests across 8 files.
- npm run build: PASS — Vite production build.
- Existing warning: JavaScript bundle exceeds 500 kB.
- Migration, deployment and responsive checks: pending.

## Delivery rules
- Free, simple and quick first; preserve rubric and security safeguards.
- Document fallbacks.
- Finish code, verify tests/build, commit, push, then freeze the verified assignment with a tag that must not be moved.
- Screenshots may follow from the frozen version.

## Tooling upgrade verification — 2026-11-11
- Installed Next.js 16.4.2; Next.js scaffold not yet implemented.
- Upgraded Vite to 8.3.4, React plugin to 6.1.2 and Vitest to 5.0.5.
- Removed unsupported --minWorkers option from the test script.
- npm test: PASS — 41 tests across 8 files.
- npm run build: PASS — Vite production build, no chunk-size warning.
- Last installation audit: 6 vulnerabilities (2 moderate, 4 high); review pending.
- Next.js build and Git-connected preview deployment: pending.
