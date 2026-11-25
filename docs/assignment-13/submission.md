# Assignment 13 submission — Afterlight

Status: **COMPLETED — PENDING SUBMISSION**.

- Branch: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe13-fragment-shader
- Hero route: `/shader-lab`.
- Deployed application: https://flyrank-frontend-capstone-k78rt6dem-niknaxthegreek.vercel.app/shader-lab (deployment base URL; use the reviewer link below).
- Reviewer URL (no Vercel sign-in, no expiry): https://flyrank-frontend-capstone-k78rt6dem-niknaxthegreek.vercel.app/shader-lab?_vercel_share=0Y9NKNppBl1HAPbc9qPSMpPTnZ9D0Ifn
- Passing CI: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44605085805.
- Fragment shader: [commented GLSL source](../../src/shaders/afterlight.frag).
- Mentor explanation, uniform map and runtime decisions: [README](README.md).
- Measured checks: [verification](verification.md).
- Screenshots: [evidence](evidence/).

The hero uses all three core uniforms (`u_time`, `u_resolution`, `u_mouse`), plus a palette selector. Real foreground content links to Reel Good's movie picker and collection. The native Pause button supports keyboard activation and retains its pressed state. The shader is original to this assignment, authored with ChatGPT assistance; the learner's own explanation and rehearsal are still required.

Fallback: Reduced motion and unavailable WebGL show a static gradient in the selected palette; the animation loop runs at up to 30 fps with DPR capped at 1.5 and at most 1.6 million pixels, and stops while hidden, offscreen or paused.

Reviewer access: Nicholas explicitly approved the non-expiring reviewer link. On 20 November 2026, Vercel confirmed that this Share link does not expire, and the live hero was opened without signing in to Vercel. Copy the complete reviewer URL, including its `_vercel_share` parameter, into the course submission. Access is scoped to this A13 preview. See [access verification](evidence/reviewer-access.json) and [live access screenshot](evidence/reviewer-access-verified.jpg).

Validation: 64 regression tests, 12 real-browser checks, the production build and TypeScript checks passed. The evidence folder contains committed screenshots and a machine-readable report; it does not depend on workflow artifact retention.
