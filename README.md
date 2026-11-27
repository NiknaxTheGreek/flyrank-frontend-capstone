# Reel Good — Assignment 13: Afterlight shader

In this assignment, Reel Good gains a cinematic interactive hero driven by a custom GLSL fragment shader. The experience combines time, resolution and pointer uniforms with selectable palettes, a pause control and a static fallback that respects reduced motion.

[Design and source walkthrough](docs/assignment-13/README.md) · [Preview and submission evidence](docs/assignment-13/submission.md) · [Verification](docs/assignment-13/verification.md)

## Implementation

Afterlight uses a custom fragment shader and a lazy-loaded WebGL renderer. The animation is bounded by frame-rate and pixel budgets, suspends when hidden or offscreen, and retains accessible HTML foreground controls. The static gradient remains available when motion is reduced or WebGL is unavailable.

## Reviewing the assignment

Open Afterlight, explore the color moods, pointer interaction and pause control, and compare the static reduced-motion fallback.

## Local development and verification

Use Node 24, `npm ci` and `npm run dev`, then open `/shader-lab`. No API key is needed for this experience. The recorded checks passed 64 regression tests and 12 browser checks, including fallback, pause, keyboard and responsive behavior. See the linked verification for software-renderer and physical-device scope.
