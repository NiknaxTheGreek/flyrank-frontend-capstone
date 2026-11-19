# Assignment 13 — Afterlight

A cinematic, interactive fragment-shader hero for Reel Good, created for Nicholas Perikli.

- Route: `/shader-lab` (also linked as **Afterlight** in the navigation).
- Branch: `fe13-fragment-shader`, based on `fe09-button-lifecycle`.
- Fragment shader: [afterlight.frag](../../src/shaders/afterlight.frag).
- Vertex shader: [fullscreen.vert](../../src/shaders/fullscreen.vert).
- Browser renderer: [aurora-renderer.ts](../../src/components/aurora-renderer.ts).
- React page: [ShaderHeroPage.tsx](../../src/pages/ShaderHeroPage.tsx).
- Styles and CSS fallback: [shader-hero.css](../../src/pages/shader-hero.css).

## Design and ownership

The composition borrows the feeling of a cinema before the opening frame: ink-blue space, warm light, large editorial type and a fine viewfinder border. Four curved light ribbons use a violet/copper palette, with Glacier and Ember alternatives. The foreground invites the visitor into the existing movie picker or catalogue. Cursor movement gently displaces the field; touch uses the same pointer events without blocking page scroll. The canvas is decorative, so the page's links, heading and controls remain ordinary accessible HTML.

This shader was authored with ChatGPT assistance for this assignment. No session playground or external shader was copied. The formulas use standard sine waves, exponential falloff and a deterministic hash. AI assistance also covered the React integration, GPU lifecycle, styling, documentation and verification. Reading the walkthrough is preparation; Nicholas should practise explaining and changing the code before claiming independent shader fluency.

## Fallback one-liner

**Reduced motion and unavailable WebGL show a static gradient in the selected palette; the animation loop runs at up to 30 fps with DPR capped at 1.5 and at most 1.6 million pixels, and stops while hidden, offscreen or paused.**

There are no image/model downloads or shader dependencies. The renderer and GLSL are a lazy-loaded chunk; reduced-motion users never import that chunk or allocate a GPU context. The static gradient is present before JavaScript and remains behind the canvas. GPU context loss hides the canvas and retains that fallback. Changing colour mood also works in the fallback.

The animated text area has an independent dark overlay, in addition to the shader's own attenuation. The grain stays fixed to the pixels so it does not shimmer. Pause is a native toggle button with a visible focus ring and `aria-pressed`. A polite status announces state changes, not every frame. The page does not require mouse input to access any content.

## UV, time and mouse

| Value | Supplied by | Meaning |
| --- | --- | --- |
| `u_resolution` | Actual canvas backing-buffer size | Width and height in rendered pixels, after both quality caps. |
| `u_time` | Active animation seconds | Stops accumulating when paused, hidden or offscreen. |
| `u_mouse` | Smoothed pointer position | 0–1 across each axis; y is flipped to match WebGL's bottom-left origin. |
| `u_palette` | Colour mood controls | 0 = Afterlight, 1 = Glacier, 2 = Ember. |
| `gl_FragCoord` | GPU | Current pixel position; the fragment shader calculates its final RGBA colour. |

`uv = gl_FragCoord.xy / u_resolution` converts pixels to a 0–1 rectangle. Subtracting 0.5 puts its centre at zero. Multiplying x by width/height makes the scene use the same distance scale on each axis. Resizing therefore changes the view without stretching the field.

## Mentor walkthrough: every shader block

1. **Precision and uniforms.** `mediump` requests floating-point precision available in WebGL 1 fragment shaders. Uniforms are constant across one draw, but can change between draws. `vec2` holds x/y; `vec3` holds RGB; `vec4` adds alpha.
2. **Grain helper.** `dot` combines the two pixel coordinates with different weights. `sin` and multiplication spread that value, and `fract` keeps its fractional part. This gives repeatable pseudo-random texture, not cryptographic randomness. It has no time input, so it does not flash.
3. **Coordinates.** `uv` normalises the fragment position. `aspect` corrects the x distance. `p` and `mouse` share that centred coordinate system. `t` scales elapsed seconds by 0.16 to slow the effect.
4. **Pointer and flow.** Subtracting 12% of the centred mouse position leans the light toward the cursor. Two low-frequency sine waves warp x and y. Different frequencies and time directions keep the motion from looking like a rigid slide.
5. **Palette.** `ink` sets the dark background. `cool` and `warm` are endpoints for ribbon colour; the uniform selects different RGB triples. The numbers are 0–1 channel intensities.
6. **Four ribbons.** The fixed integer loop runs exactly four times. Casting `i` to float makes it usable in the continuous formulas. Two sine terms bend each ribbon's centre line; the layer offset separates the four ribbons vertically. `abs` measures the current pixel's vertical distance from that centre.
7. **Core, halo and folds.** `exp(-distance * scale)` falls rapidly toward zero as a pixel moves away from a ribbon. A larger scale makes the bright core thinner; a smaller scale spreads the halo. Another sine varies intensity along the ribbon. `mix` interpolates between the two colours; the sine mapped into 0–1 supplies its blend amount. Additive accumulation makes overlapping light glow.
8. **Broad glow and copy space.** Subtracting a point from `p`, then taking its squared distance with `dot`, creates a soft radial glow. `smoothstep` eases brightness across the image and keeps the left side darker for the headline. An additional CSS shade maintains contrast in every palette and fallback.
9. **Vignette and output.** `length` measures distance from the image centre. `smoothstep` makes the edges darker without a hard boundary. Grain is centred around zero and scaled to a small amplitude. `clamp` bounds RGB to 0–1; the final alpha of 1 makes the canvas opaque.
10. **Vertex shader.** The CPU uploads `(-1,-1), (3,-1), (-1,3)`. This oversized triangle covers clip space's visible -1 to 1 square. `gl_Position` writes each vertex directly, with z=0 and homogeneous w=1; excess geometry is clipped. No model, camera or texture coordinates are needed.

## Changes to practise during a mentor review

| Request | Change to make | Expected effect |
| --- | --- | --- |
| Slow it down | Change `u_time * 0.16` to `u_time * 0.08`. | Half-speed flow. |
| Use another palette | Edit the `cool` and `warm` RGB triples and corresponding CSS gradient. | Same geometry, different colours in both modes. |
| Thicker ribbons | Lower `58.0 + layer * 8.0`. | Slower falloff from each centre line. |
| More cursor influence | Raise `mouse * 0.12` modestly. | Larger field displacement. |
| Less texture | Lower the final grain multiplier from `0.018`. | Cleaner, smoother image. |

## Runtime lifecycle

`requestAnimationFrame` schedules work; a 30 fps drawing gate prevents high-refresh screens from multiplying fragment work. Elapsed-time smoothing makes the pointer behave consistently across refresh rates. The drawing scale is the minimum of device DPR, 1.5, and the scale needed to stay within 1.6 million pixels. Canvas sizing uses its own layout rectangle rather than the full device screen.

`visibilitychange` cancels the scheduled frame when the tab is hidden. `IntersectionObserver` does the same when the hero leaves view. The next activation resets the previous timestamp, so time spent away does not cause a jump. `ResizeObserver` and window resize keep resolution current; palette changes can redraw a paused frame. React cleanup removes event listeners, disconnects observers, cancels the frame and deletes the buffer/program, including during Strict Mode effect replay. No render loop calls React state setters.

## Run

Use the existing repository commands: `npm ci`, `npm run dev`, then open `/shader-lab`. No API key is needed for the shader. `npm test` runs the existing regression suite; `npm run build` checks TypeScript and creates the production bundle. Movie search and AI chat still require the environment variables documented in the root README.

## Verification

See [verification.md](verification.md) and [evidence](evidence/) for measured checks and captures. The GPU checks use Chromium with software WebGL in CI; they validate behaviour, not physical-device frame rates. Physical-device testing and Nicholas's own mentor rehearsal must be recorded separately from automated browser checks.

The dedicated [A13 workflow](../../.github/workflows/a13-shader.yml) runs the regression suite, production build and [browser verification script](../../scripts/verify-a13.mjs). Browser tooling is installed outside the project so it does not change the locked application dependencies. CI emits screenshot bytes in its logs because the account's Actions artifact quota is full; the reviewed captures are also committed under `docs/assignment-13/evidence/`. That committed copy is the submission evidence, rather than an expiring workflow artifact.
