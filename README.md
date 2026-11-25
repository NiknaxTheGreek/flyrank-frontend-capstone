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

[Three rules learned in Assignment 2](CLAUDE.md#rules-learned-in-assignment-2)

## Preview and evidence

| Version | Live preview | Screenshot |
| --- | --- | --- |
| Structured prompt | [Open dashboard](https://flyrank-frontend-capstone-git-fe02-spec-niknaxthegreek.vercel.app/) | [Dashboard and notification form](docs/assignment-2/evidence/fe02-spec.jpg) |
| Vague prompt | [Open settings](https://flyrank-frontend-capstone-git-fe02-vague-niknaxthegreek.vercel.app/) | [Notification settings](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/blob/fe02-vague/docs/assignment-2/evidence/fe02-vague.jpg) |
