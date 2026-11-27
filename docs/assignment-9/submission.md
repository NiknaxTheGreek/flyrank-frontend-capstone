# Assignment 9 — Button lifecycle

In this assignment, asynchronous actions are designed as a reusable, accessible five-state button. Motion Lab demonstrates how idle, loading, success, error and disabled states communicate progress and recovery without distracting motion or layout shifts.

- Demo: https://flyrank-frontend-capstone-git-fe09-button-d06295-niknaxthegreek.vercel.app/motion-lab
- [Reusable button component](../../src/components/AsyncActionButton.tsx).
- Motion rationale and checks: [README](README.md).

## Reviewing the assignment

Open the live demo and select success or failure to observe the button's feedback and recovery behavior. Test keyboard activation, repeated clicks, disabled controls and reduced motion. The Send and Save buttons share the same component while maintaining independent action states.

The actions use a simulated 900–1800 ms delay. Random mode fails 20% of requests. Only transform and opacity are animated; the button reserves its size, all state faces remain mounted, success pauses for 900 ms, errors persist for retry, and reduced motion removes spatial/repeating animation while retaining feedback.

## Verification

The recorded verification found 64 tests passed and the production build passed. Desktop Chrome was checked live. Physical mobile browsers and OS-level reduced-motion emulation were not tested in this session.

The public demo opened without sign-in on 27 November 2026, and the current application-source build passed TypeScript and Vite. The original interactive Chrome verification and three screenshots support the lifecycle; the latest audit did not repeat the interactive checks.

## Screenshot evidence

| Screenshot | What it shows |
|---|---|
| [Idle state](evidence/desktop-idle.jpg) | Initial demo layout, available actions and outcome controls. |
| [Error state](evidence/desktop-error.jpg) | Persistent error feedback and the retry action after a simulated failure. |
| [Reduced-motion preview](evidence/reduced-motion-error.jpg) | Error feedback remains visible with the reduced-motion preview selected. |

Each file is a separate capture. The still images illustrate visible states; transition timing, loading, success and keyboard behavior can be reviewed in the live demo and recorded checks.
