# A2 — Structured-specification implementation

This branch is the **structured prompt** version of Assignment 2. It presents a Reel Good movie dashboard with illustrative demo values and adds a focused notification-settings component. The contrasting vague-prompt version is on [`fe02-vague`](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe02-vague).

## Deliverables

- [Notification settings component](src/components/NotificationSettings.tsx): labelled email preference, opt-in, validation and save feedback.
- [Role-based tests](src/components/NotificationSettings.test.tsx): coverage for defaults, valid/invalid email, persistence, malformed stored data, storage failures and feedback.
- [Prompting workflow comparison](WORKFLOW.md): scope, accessibility, error handling, test coverage and limitations for both variants.
- [Assignment 2 submission index](docs/assignment-2/SUBMISSION.md).

## Run and verify

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
npm test
npm run build
```

Verified on 2026-11-21 with Node.js 24.22.3 and npm 11.19.1: `npm ci`, `npm test` (11 tests passed), and `npm run build` passed. The vague-prompt branch has no test script; its production build also passed on this runtime.

## Evidence

- Structured branch preview: https://flyrank-frontend-capstone-git-fe02-spec-niknaxthegreek.vercel.app/
- Vague-prompt branch preview: https://flyrank-frontend-capstone-kgesba0fa-niknaxthegreek.vercel.app/
- Both live previews were opened and verified on 2026-11-21. Current Reel Good screenshots were captured during the audit and are shown in the audit conversation; screenshot files are not stored in this branch.
- The GitHub repository is public. Both preview URLs loaded without a sign-in prompt during the audit.
