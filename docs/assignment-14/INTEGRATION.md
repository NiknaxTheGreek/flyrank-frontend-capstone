# Combined product integration — 20 November 2026

The initial A14 release omitted completed feature branches. This release combines those features without replacing newer chat safeguards or earlier assignment provenance.

## Source commits

- A11 Planet Studio: `b6d68b4a323bbf14ce2d0a6c4902ddd0d184a3b2`.
- A12 accessibility/performance: `6d46a81382a8f94e92b9e898d4c31ed35ed9422b`.
- A13 Shader Lab: `47905528da51d62bf4ecc426b675d4403b061139`.
- A5 custom controls and shadcn comparison: `ff0de2990a71a483fd0b2a12c9fbac09a868e188`.
- A14 base: `c889befe6ae8d90671799e0490df74b8eb38cb43`.

## Product changes

Shared navigation reaches `/shader-lab`, `/planet-studio`, `/playground`, `/health`, `/motion-lab` and the movie routes. Vercel rewrites support reloads/deep links. A5 components retain their behaviors and get scoped final-product styling; the health fetch is hosted in a bounded server function. A12 lazy loading, Firebase splitting, keyboard/focus, contrast and announcement fixes are preserved. GPU code is lazy; motion and static fallbacks remain available. Historical Next.js scaffold and workflow-comparison branches remain original exercises, not a forced framework migration.

## Verification

Local TypeScript checks and production build passed. The initial JS bundle is about 184 KB uncompressed; the ~532 KB Three.js chunk is loaded only after Launch 3D. The merged component suite passed 97 tests; two new health-handler tests also passed. CI verifies the full suite and browser journeys, including new cross-lab navigation, keyboard dialogs, deep-link reload, shader rendering/pause and real 3D context-loss recovery. GPU-specific checks run in Chromium; other engines check static/reduced-motion behavior.

CI/deployment results will be appended after verification. Original A12 audit results apply to the audited commit and routes, not automatically to this combined release.

## Screenshot replacement

`evidence/production-chrome-address-bar-2026-11-20.png` is the earlier, pre-integration product. Preserve it as history, but replace the current submission screenshot after production deployment: show `/pick-a-movie`, the updated shared navigation including Shader Lab and Planet Studio, the completed Inception card and browser address bar.
