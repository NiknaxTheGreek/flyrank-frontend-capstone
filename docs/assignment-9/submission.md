# Assignment 9 submission

Status: implementation and live desktop verification complete; awaiting learner submission.

- Demo: https://flyrank-frontend-capstone-git-fe09-button-d06295-niknaxthegreek.vercel.app/motion-lab
- Branch: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe09-button-lifecycle
- Component: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/blob/fe09-button-lifecycle/src/components/AsyncActionButton.tsx
- Motion rationale and checks: [README](README.md).
- Evidence: [idle](evidence/desktop-idle.jpg), [error](evidence/desktop-error.jpg), [reduced motion](evidence/reduced-motion-error.jpg).

Review sequence: select **Success**, send; select **Failure**, send; select **Success**, retry. Test Tab/Space/Enter, double-clicking, empty input, disabled controls and reduced motion. **Save movie** uses the same component with an independent lifecycle.

The actions use a simulated 900–1800 ms delay. Random mode fails 20% of requests. Only transform and opacity are animated; the button reserves its size, all state faces remain mounted, success pauses for 900 ms, errors persist for retry, and reduced motion removes spatial/repeating animation while retaining feedback.

Validation: 64 tests passed and the production build passed. Desktop Chrome was checked live. Physical mobile browsers and OS-level reduced-motion emulation were not tested in this session.

Access: this Vercel project requires authentication for preview deployments. A temporary review Share link was created for this branch, expiring 20 November 2026 at 19:53 SAST. Generate a fresh Share link in Vercel before submitting if that access has expired. No share token is committed to source control.
