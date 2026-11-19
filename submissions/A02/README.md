# A02 — Vague prompt versus structured specification

Prepared 19 November 2026. Implementation status reported by the learner: complete, awaiting submission. This pack records evidence and access gaps separately; it does not claim Portal submission.

Both original implementations are preserved: `source/` is the structured-specification version, and `vague-source/` is the vague-prompt version. Read `source/WORKFLOW.md` for the actual comparison, tradeoffs, missing test-setup dependency and AI review. The specification version contains the notification-settings component and its role-based tests. The recorded original result was 11 passing tests; this archive operation does not rerun them.

No original A2 screenshot was found in the recovered project files. No hosted A2 deployment was found in the inspected Vercel deployment history. Both implementations can be run locally from their own source folder.

## Source

- Snapshot commit: [`7533ac22762d184542f3f99c3884fee67a87d04d`](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/commit/7533ac22762d184542f3f99c3884fee67a87d04d).
- Complete source: [source/](source/).
- Snapshot tree: `d2a72963d248df4efc0d1000fdf5af7731127556`.
- Vague-prompt snapshot: [`7f6cfc4fe31689e23fad4510ad7a9e7cb8533877`](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/commit/7f6cfc4fe31689e23fad4510ad7a9e7cb8533877), [vague-source/](vague-source/).

## Reviewer access

The GitHub repository is private. An authorized collaborator can review and clone the source; no public repository access is claimed.

## Evidence

No original screenshot has been recovered for this assignment. Code and written deliverables are preserved.

## Reproduce

From this assignment’s `source/` folder, follow its README, use its Node version and run `npm ci`. Configure only the variables in its `.env.example` where present. Then use the branch’s documented build/dev/test commands. Real provider calls require your own permitted credentials. A2’s vague version has no test script. No private environment files are included.
