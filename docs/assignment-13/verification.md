# A13 verification

Verified 19 November 2026. Technical implementation passed; reviewer access remains pending.

- Regression suite: **64 tests passed across 13 files**.
- TypeScript and production build: **passed**.
- Browser checks: **12 passed**; zero application console errors.
- [Successful CI run](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44605085805), testing source commit `25753e778c10067017668635c538aa5086c3509d`.
- Chromium **151.0.7922.34**, with software WebGL for repeatability.

## Behaviour checks

| Check | Result |
| --- | --- |
| Real WebGL rendering and resolution caps at desktop DPR 2 | Pass |
| GPU draw rate stays within the 30 fps budget | Pass |
| Pause stops draws; colour redraws a still frame; Space resumes | Pass |
| Pointer reaches the shader as a smoothed uniform | Pass |
| Offscreen observer stops drawing and resumes when in view | Pass |
| Live OS motion preference changes stop and restart the renderer cleanly | Pass |
| Route cleanup deletes GPU program and stops callbacks; return works | Pass |
| GPU context loss exposes a working static fallback | Pass |
| Reduced motion makes zero WebGL calls and no shader request; all actions reachable by keyboard | Pass |
| Touch controls, DPR 3 cap and no horizontal overflow at 320/360/375/768px | Pass |
| Actual hidden document cancels scheduled frames and resumes without a time jump | Pass |
| Zero application console errors during all checks | Pass |

## Rendering budget

| Control | Measured or configured value |
| --- | --- |
| Device pixel ratio | At most 1.5; also bounded by total pixels |
| Total drawing-buffer area | At most 1,600,000 pixels |
| Desktop at DPR 2 | 1589 × 1006 = 1,598,534 pixels |
| Phone at DPR 3 | 562 × 1219 = 685,078 pixels |
| GPU drawing gate | At most 30 draws per second, allowing resize/palette redraws |
| Renderer + GLSL chunk | 6.28 kB minified; 2.80 kB gzip |
| Reduced-motion first load | Zero WebGL calls and no renderer request |

The frame-rate check verifies an upper budget, rather than a minimum frame rate. CI uses software rendering and does not establish physical-device GPU speed. Phone checks use Chromium touch and viewport emulation, including 320, 360, 375 and 768 CSS-pixel widths. Reduced motion is tested through browser media emulation, including changes while the page is open.

The visibility check uses a separate owned Chromium session with default test overrides disabled. Real window minimization makes `document.hidden` true. The test verifies no GPU draws, no queued animation frames, and a clean resume without including hidden time. Offscreen checks wait for observer delivery, then assert suspension and recovery.

## Evidence

- [Desktop Afterlight](evidence/desktop-afterlight.jpg).
- [Desktop Glacier, paused](evidence/desktop-glacier-paused.jpg).
- [Phone with touch controls](evidence/phone-glacier.jpg).
- [Reduced-motion gradient](evidence/desktop-reduced-motion.jpg).
- [GPU-context-loss fallback](evidence/context-loss-fallback.jpg).
- [Cloud-browser keyboard focus and unavailable-WebGL fallback](evidence/cloud-browser-fallback.jpg).
- [Machine-readable browser report](evidence/verification.json).

The cloud browser exposes no WebGL, which independently exercised the static fallback. Its real keyboard pass reached both foreground links and all colour controls, showed a visible focus outline, changed the selected palette, and had no horizontal overflow. The animated shader itself was rendered and captured in CI.

## Deployment and remaining steps

- [Application preview](https://flyrank-frontend-capstone-k78rt6dem-niknaxthegreek.vercel.app/shader-lab): Vercel reports READY; this preview requires sign-in. This is the exact commit used by the passing CI run above.
- A reviewer share link with no expiry is pending explicit user authorization after automatic approval review rejected that access change. Protection settings were preserved.
- Physical-device/browser checks and Nicholas's own mentor rehearsal are not claimed by the automated suite.
- Submit the source, walkthrough, fallback one-liner and approved reviewer URL through the course portal.
