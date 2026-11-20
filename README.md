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

The archived result recorded 11 passing tests and a passing build; these commands were not rerun while preparing this submission index. The vague-prompt branch has no test script.

## Evidence

- [Structured-version screenshot](docs/assignment-2/evidence/a2-fe02-spec.jpg), captured from the live `fe02-spec` preview.
- The [vague-version screenshot](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/blob/fe02-vague/docs/assignment-2/evidence/a2-fe02-vague.jpg) is on its matching branch.

Both Vercel previews require authentication. Reviewer access is unverified; the repository is private.