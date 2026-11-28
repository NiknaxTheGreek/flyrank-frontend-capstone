# Assignment 11 — Planet Studio

In this assignment, Reel Good gains an interactive fictional world configurator using Three.js. The experience explores real 3D geometry, responsive controls, optional loading and accessible static fallbacks while respecting rendering budgets.

- **Public URL:** https://reel-good-planet-studio.vercel.app/planet-studio
- **Runtime source snapshot:** https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/0dbe2b5980d7b2c93c8beb3c03d4d2ae55c1e530
- **Green CI:** https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44603515494
- **README:** [what was built, run instructions, decisions and future work](README.md).
- **FE-10 review:** [performance note](PERFORMANCE.md) and [machine-readable measurement](performance.json).
- **Geometry and renderer:** [PlanetCanvas.tsx](../../src/features/planet-studio/PlanetCanvas.tsx).
- **Static fallback and preferences:** [PlanetStudioPage.tsx](../../src/pages/PlanetStudioPage.tsx).

## Review the experience

Choose **Launch 3D**. Select **Ocean** or **Glacier** to change the real mesh surface; turn rings off/on; move the light; enable and stop rotation. Drag, pinch or use the canvas's arrow/zoom keys. Use **Reset world** and **Use static view**. The static view supports surface, ring and zoom controls independently of WebGL. On a browser with WebGL unavailable, the error preserves the static configurator and offers retry.

## Evidence

- [Desktop real 3D](evidence/desktop-dune-3d.jpg)
- [Changed material](evidence/desktop-ocean-3d.jpg)
- [Phone layout and 3D](evidence/mobile-ocean-3d.jpg)
- [Reduced-motion static fallback](evidence/reduced-motion-static.jpg)
- [Handled WebGL context loss](evidence/context-loss-fallback.jpg)

The public release is a static site with no API routes or credentials, and no sign-in or expiring share token is needed. Source and final evidence are committed to this assignment's branch. Prior assignment branches were preserved.

Verification: 70 unit/component/server tests passed; 4 local-build and 4 public-production desktop/mobile Chromium browser checks passed. Context-loss recovery, keyboard controls and touch drag/pinch passed. The measured public scene reached 22.7/22.8 FPS in the software renderer and rendered zero extra frames while idle/hidden. Phone tests use touch/viewport emulation; physical iOS Safari and low-end-device thermal testing are not claimed. The cloud browser verified anonymous production access and the no-WebGL fallback.
