# Assignment 13 submission — Afterlight

Status: implementation, deployment and browser verification passed; reviewer access pending.

- Branch: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/tree/fe13-fragment-shader
- Hero route: `/shader-lab`.
- Deployed application: https://flyrank-frontend-capstone-k78rt6dem-niknaxthegreek.vercel.app/shader-lab (Vercel sign-in currently required).
- Passing CI: https://github.com/NiknaxTheGreek/flyrank-frontend-capstone/actions/runs/44605085805.
- Fragment shader: [commented GLSL source](../../src/shaders/afterlight.frag).
- Mentor explanation, uniform map and runtime decisions: [README](README.md).
- Measured checks: [verification](verification.md).
- Screenshots: [evidence](evidence/).

The hero uses all three core uniforms (`u_time`, `u_resolution`, `u_mouse`), plus a palette selector. Real foreground content links to Reel Good's movie picker and collection. The native Pause button supports keyboard activation and retains its pressed state. The shader is original to this assignment, authored with ChatGPT assistance; the learner's own explanation and rehearsal are still required.

Fallback: Reduced motion and unavailable WebGL show a static gradient in the selected palette; the animation loop runs at up to 30 fps with DPR capped at 1.5 and at most 1.6 million pixels, and stops while hidden, offscreen or paused.

Reviewer access: this Vercel project protects preview deployments with sign-in. Automatic approval review rejected creating a reviewer share link without explicit authorization. No protection settings were changed. A non-expiring reviewer link remains the final access step.

Validation: 64 regression tests, 12 real-browser checks, the production build and TypeScript checks passed. The evidence folder contains committed screenshots and a machine-readable report; it does not depend on workflow artifact retention.
