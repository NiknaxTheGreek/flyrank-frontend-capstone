# A2 — Vague-prompt implementation

This branch preserves the first, broadly prompted version of the Assignment 2 notification-settings task. It replaces the starter dashboard view with notification preferences for email and in-app alerts, delivery frequency and quiet hours.

The structured-specification comparison is documented on [`fe02-spec`](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe02-spec) in `WORKFLOW.md` and `docs/assignment-2/SUBMISSION.md`.

## Run

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
npm run build
```

This variant's `package.json` has no test script or automated feature tests. Review its accessible labels, storage fallback and save-error behavior in `src/App.tsx`.

`npm ci` and `npm run build` passed on 2026-11-21 with Node.js 24.22.3 and npm 11.19.1.

## Evidence

- Live Reel Good preview: https://flyrank-frontend-capstone-kgesba0fa-niknaxthegreek.vercel.app/
- The current notification-settings screen was opened and visually verified on 2026-11-21 without a sign-in prompt. A screenshot was captured during the audit and is shown in the audit conversation; the image file is not stored in this branch.
- The earlier screenshot showed a superseded interface and has been removed. The GitHub repository is public.
