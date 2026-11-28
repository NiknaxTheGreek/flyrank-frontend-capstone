# Assignment 12 — Performance and accessibility

In this assignment, the application is measured and improved using mobile Lighthouse, WAVE and keyboard verification. The goal is to reduce loading cost and improve access to the primary movie discovery and chat flows, with documented before/after results.

- [AUDIT.md](../../AUDIT.md) contains measured deltas, fixes, actual before/after Lighthouse screenshots, WAVE evidence and keyboard results.
- [Public assignment preview](https://flyrank-frontend-capstone-snowy.vercel.app/) · [movie picker](https://flyrank-frontend-capstone-snowy.vercel.app/pick-a-movie). The audit results below are from the recorded audit of the deployed source snapshot.
- Lighthouse mobile Home: **81 → 98 performance; 96 → 100 accessibility**.
- Lighthouse mobile movie picker: **97 → 100 performance; 100 → 100 accessibility**.
- Deployed WAVE: **zero errors, contrast errors and alerts** on populated Home, chat, Motion lab and the configured sign-in page.
- Keyboard: catalogue search/detail/back/navigation and chat example/input/stream/Stop/retry/recovery passed. Manual live Stop and next-turn tool lookup were also verified.
- Final live audit: [successful run 44773847462](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44773847462).
- Final deployed application source: `bfdd95eb274f6342a9f86c9023d1dcb24d425131`.
- [Release verification](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44775059755) passed: TypeScript checks, 91/91 component/server tests, production build and 10/10 browser journeys; zero failures, skips or flaky tests. Additional scope and assistive-technology limits are documented in AUDIT.md.

Submit the public URL and AUDIT.md. Portal submission remains pending.
## Reviewing the assignment

Review the measured before/after reports and keyboard checks, then explore the application using keyboard navigation. The audit results refer to the dated source snapshot.
