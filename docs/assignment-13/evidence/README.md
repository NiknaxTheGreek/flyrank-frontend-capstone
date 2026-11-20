# A13 evidence

These files are committed submission evidence from the passing A13 verification. CI captures were rendered with Chromium 151.0.7922.34; the phone capture uses a 375 × 812 CSS-pixel viewport, touch emulation and device DPR 3. The cloud-browser capture independently shows the no-WebGL fallback and visible keyboard focus.

- `desktop-afterlight.jpg`: custom fragment shader, default palette.
- `desktop-glacier-paused.jpg`: second GPU palette and paused state.
- `phone-glacier.jpg`: responsive touch controls; Pause has been activated.
- `desktop-reduced-motion.jpg`: selected static gradient with no WebGL allocation.
- `context-loss-fallback.jpg`: graceful fallback after losing the GPU context.
- `cloud-browser-fallback.jpg`: keyboard-focused Ember control in a browser without WebGL.
- `verification.json`: measured checks from the successful CI run.

The GitHub workflow's artifact quota was full, so the exact CI screenshot bytes were transported through logs and committed here. These repository copies have no workflow-artifact expiration date. The associated tests and limitations are documented in [verification.md](../verification.md).
