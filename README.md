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

- Live Reel Good preview: https://flyrank-frontend-capstone-git-fe02-vague-niknaxthegreek.vercel.app/
- Public preview verified while signed out. [Notification preferences screenshot](docs/assignment-2/evidence/fe02-vague.jpg)
- The earlier screenshot showed a superseded interface and has been removed. The GitHub repository is public.
