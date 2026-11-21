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

On 2026-11-21, with Node.js 24.22.3 and npm 11.19.1, the structured branch passed `npm ci`, all 11 tests, and `npm run build`. The vague branch passed `npm ci` and `npm run build`; it has no test script.

## Evidence and preview access

The previous screenshots showed a superseded interface and have been removed. Fresh screenshots of the current Reel Good implementation on each branch remain to be captured. Both Vercel previews require authentication, so reviewer access is unverified. The GitHub repository is public and the source branches are accessible.
