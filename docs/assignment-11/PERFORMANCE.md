# FE-10 performance review — Planet studio

Measured on 19 November 2026 using a GitHub-hosted Ubuntu 24.04 runner, headless Chromium 145 and software WebGL, against https://reel-good-planet-studio.vercel.app/planet-studio. The phone run emulates a 375×812 touch viewport with device scale factor 2. These are demonstration measurements, not physical-phone battery/thermal claims. Click-to-scene time includes the optional engine download and first render in a fresh browser context; it is one run per profile, not a network benchmark.

| Check | Desktop 1440×1100 | Emulated phone 375×812 |
| --- | ---: | ---: |
| 3D engine requests before Launch | 0 | 0 |
| Click to first live scene | 523 ms | 444 ms |
| Observed rotation frame rate | 22.7 FPS | 22.8 FPS |
| Extra rendered frames during 1 s idle | 0 | 0 |
| Extra frames during 700 ms hidden | 0 | 0 |
| Horizontal page overflow | No | No |
| Console / uncaught page errors in measured happy path | 0 | 0 |
| Touch drag / pinch | Not applicable | Both worked |

Reduced-motion run: zero canvases mounted and zero engine requests. Context loss was exercised in a real WebGL context; the static preview preserved the world, and retry created a working new scene. Four browser tests passed against the built capstone and four more against the public production site. All 70 unit/component/server tests passed too. [Green CI run](https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44603515494).

The scene rendered 8,560 triangles and 17 draw calls with all ring bands visible, including the transparent-material passes. DPR is capped at 1 on phone widths and 1.5 on desktop. Continuous rotation has a 30 FPS ceiling; the software renderer measured roughly 23 FPS. A paused world redraws only after input, settings, resize or visibility changes.

## Load cost

| Build | Initial JS gzip | Deferred 3D engine gzip | Extra model / texture downloads |
| --- | ---: | ---: | ---: |
| Integrated capstone | 167.53 KB entry + 3.74 KB page | 133.59 KB | 0 |
| Isolated public Planet studio build | 49.85 KB | 133.56 KB | 0 |

The public entry contains React and the studio UI; it excludes the capstone's Firebase and AI features. Both builds keep Three.js out of the initial request. The surface textures are created in memory at 512×256 and cached for the three palettes; the geometry is created in code. This satisfies the small-model approach without a GLB or decoder. The engine is within the 150 KB gzip budget.

The 500 KB uncompressed Vite chunk warning remains visible. The engine still costs CPU/GPU work after opt-in; it has been deferred and bounded, not made free. The primary opportunities are fewer transparent ring passes and adaptive detail on slower hardware. A physical low-end Android/iOS check remains a useful follow-up.

Reproduce with `npm run build`, `npm run build:planet`, `npm run test:3d`, then `npm run preview -- --host 127.0.0.1` and `npm run perf:3d` from another terminal. See `performance.json` for the final machine-readable run.
