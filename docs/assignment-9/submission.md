# Assignment 9 — Button lifecycle

In this assignment, asynchronous actions are designed as a reusable, accessible five-state button. Motion Lab demonstrates how idle, loading, success, error and disabled states communicate progress and recovery without distracting motion or layout shifts.

- Demo: https://flyrank-frontend-capstone-git-fe09-button-d06295-niknaxthegreek.vercel.app/motion-lab
- Branch: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe09-button-lifecycle
- Component: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/blob/fe09-button-lifecycle/src/components/AsyncActionButton.tsx
- Motion rationale and checks: [README](README.md).
- Evidence: [idle](evidence/desktop-idle.jpg), [error](evidence/desktop-error.jpg), [reduced motion](evidence/reduced-motion-error.jpg).

Review sequence: select **Success**, send; select **Failure**, send; select **Success**, retry. Test Tab/Space/Enter, double-clicking, empty input, disabled controls and reduced motion. **Save movie** uses the same component with an independent lifecycle.

The actions use a simulated 900–1800 ms delay. Random mode fails 20% of requests. Only transform and opacity are animated; the button reserves its size, all state faces remain mounted, success pauses for 900 ms, errors persist for retry, and reduced motion removes spatial/repeating animation while retaining feedback.

Validation: 64 tests passed and the production build passed. Desktop Chrome was checked live. Physical mobile browsers and OS-level reduced-motion emulation were not tested in this session.

The public demo opened without sign-in on 27 November 2026, and the current application-source build passed TypeScript and Vite. The original interactive Chrome verification and three screenshots support the lifecycle; the latest audit did not repeat the interactive checks.
