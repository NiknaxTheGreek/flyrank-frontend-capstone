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

The structured version's archived result is 11 passing tests and a passing build. Results were not rerun for this index. The evidence manifest in the archived A2 pack was empty; a screenshot and public/authorized demo access still need to be added for submission.
