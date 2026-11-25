# Assignment 5 — Accessibility playground

**Source branch:** [`fe05-accessibility-playground`](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe05-accessibility-playground)  
**Route:** `/playground`

## Deliverables

- Custom disclosure, tabs and modal components in `playground/`.
- shadcn/Radix dialog and tabs comparison on the playground route.
- [Implementation, keyboard checks and source-review notes](../../NOTES.md).
- [Branch README](../../README.md).

## Verification recorded

The notes report manual keyboard checks for disclosure, tabs, modal focus, dismissal and restoration, plus production build/type checks. This was AI-assisted work with learner keyboard review. The notes also record limitations in reusable modal composition and vertical tabs.

## Evidence

- [Accessibility playground screenshot](evidence/accessibility-playground.jpg) shows the disclosure and keyboard-accessible UI at `/playground`.
- This historical preview screenshot supports visual inspection only; keyboard and screen-reader behavior must be supported by the recorded manual checks, not inferred from the image.

The old final line in `NOTES.md` claiming the Git push is pending is stale: the branch already contains commit `8c0783fa9c02da195f0ff1846ca9692741e1de73`. The public Preview returned HTTP 200 on 24 November 2026; no sign-in wall was observed. This recheck confirms route availability only, not keyboard or screen-reader behavior.