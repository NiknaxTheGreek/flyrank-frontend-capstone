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

- Structured Reel Good preview: https://flyrank-frontend-capstone-hx42m40hc-niknaxthegreek.vercel.app/
- Vague-prompt Reel Good preview: https://flyrank-frontend-capstone-kgesba0fa-niknaxthegreek.vercel.app/
- Both previews were opened and visually verified on 2026-11-21 without a sign-in prompt. Current screenshots were captured during the audit and are shown in the audit conversation; image files are not stored in these branches.
- The earlier screenshot files showed a superseded interface and have been removed from both A2 branches. The repository is public.
