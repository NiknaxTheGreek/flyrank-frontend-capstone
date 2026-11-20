# Assignment 2 — Submission deliverables

**Primary branch:** [`fe02-spec`](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe02-spec)  
**Comparison branch:** [`fe02-vague`](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe02-vague)  
**Shared baseline:** `059c8fa`

## Structured-specification version

- Dashboard plus notification-settings feature: [`src/components/NotificationSettings.tsx`](../../src/components/NotificationSettings.tsx).
- Role-based tests: [`src/components/NotificationSettings.test.tsx`](../../src/components/NotificationSettings.test.tsx).
- Commands: `npm ci`, `npm test`, `npm run build`.

## Vague-prompt version

- Separate implementation at [`fe02-vague`](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe02-vague).
- Provides notification preferences and replaces the original dashboard view.
- Its package scripts contain no test command; review the code and manually exercise the settings.

## Comparison and review

[`WORKFLOW.md`](../../WORKFLOW.md) records the differences in scope, accessibility, persistence/error handling and verification. It also states that exact task durations were not recorded, so it does not claim one prompt was faster.

The structured version's archived result is 11 passing tests and a passing build. Results were not rerun for this index.

## Evidence and preview access

- [Structured-version screenshot](evidence/a2-fe02-spec.jpg), captured from the [`fe02-spec` Vercel preview](https://flyrank-frontend-capstone-bhsn72y0q-niknaxthegreek.vercel.app/).
- [Vague-version screenshot](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/blob/fe02-vague/docs/assignment-2/evidence/a2-fe02-vague.jpg), captured from the [`fe02-vague` Vercel preview](https://flyrank-frontend-capstone-3d9ae1afv-niknaxthegreek.vercel.app/).

Both screenshots were captured from the live branch previews in an authenticated browser on 2026-11-20. The previews require Vercel authentication; reviewer access has not been verified. The GitHub repository is now public, so the evaluator can access the branch and committed screenshots. The Vercel previews still require authentication; reviewer access to those previews remains unverified.