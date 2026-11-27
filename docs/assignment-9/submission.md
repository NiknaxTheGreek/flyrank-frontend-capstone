# Assignment 9 — Button lifecycle

In this assignment, asynchronous actions are designed through a reusable, accessible button component. Motion Lab demonstrates how idle, hover/focus, pressed, loading, success, error and disabled states communicate progress and recovery without distracting motion or layout shifts.

- [Live Motion Lab](https://flyrank-frontend-capstone-git-fe09-button-d06295-niknaxthegreek.vercel.app/motion-lab)
- [Reusable button component](../../src/components/AsyncActionButton.tsx)
- [Motion rationale and verification](README.md)
- [Video demonstration](evidence/motion-lab-demo.mp4)

## Reviewing the assignment

Open the live demo and choose a simulated outcome. Observe the button's transitions through loading, success or error, and try recovery after a failure. Test keyboard activation, repeated clicks, disabled controls and the reduced-motion option. The Send and Save buttons share the same component while maintaining independent action states.

The actions use a simulated 900–1800 ms delay. Random mode fails 20% of requests. Only transform and opacity are animated; the button reserves its size, success pauses for 900 ms, errors remain retryable, and reduced motion removes spatial/repeating animation while retaining feedback.

## Visual evidence

| Evidence | What it demonstrates |
|---|---|
| [Idle](evidence/desktop-idle.jpg) | Initial demo layout, available actions and outcome controls. |
| [Loading](evidence/loading.png) | Sending feedback while a request is pending (recording, 12.4 s). |
| [Success](evidence/success.png) | Completed action with confirmation feedback (13.2 s). |
| [Error](evidence/desktop-error.jpg) | Persistent error and retry action after a simulated failure. |
| [Disabled](evidence/disabled.png) | Both actions disabled through the demo controls (30.0 s). |
| [Reduced-motion loading](evidence/reduced-loading.png) | Loading feedback retained with reduced-motion preview enabled (49.0 s). |
| [Motion demonstration (MP4)](evidence/motion-lab-demo.mp4) | Normal and reduced-motion interaction, success, return to idle and disabled controls. |

The four timed screenshots are frames from the learner's Chrome recording of 27 November 2026. The video preserves the screen resolution and sequence, compressed for repository storage. Motion is best reviewed in the recording or the live demo rather than still images.

## Verification

The recorded automated suite passed 64 tests and the production build passed. Earlier Chrome interaction checks covered failure/retry, keyboard focus and repeated-click protection. The 27 November recording additionally demonstrates loading, successful completion, return to idle and disabled controls, including the reduced-motion preview. Physical mobile browsers and OS-level reduced-motion emulation were not tested.

The public demo was verified to load without sign-in on 27 November 2026.
