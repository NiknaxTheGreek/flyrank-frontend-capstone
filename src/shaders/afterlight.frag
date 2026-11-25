precision mediump float;

// The CPU sends elapsed *active* seconds, backing-buffer pixels, and a 0–1 pointer.
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_palette;

// A repeatable pixel hash adds a little film texture without an image download.
float grain(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  // Divide by height so a circle stays round on both a phone and a wide screen.
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
  vec2 mouse = (u_mouse - 0.5) * vec2(aspect, 1.0);
  float t = u_time * 0.16;

  // The light leans toward the pointer; the field stays gentle and continuous.
  p -= mouse * 0.12;
  p.y += 0.045 * sin(p.x * 2.1 + t);
  p.x += 0.055 * sin(p.y * 3.0 - t * 0.7);

  // Three colour moods share the same geometry: violet, blue and copper.
  vec3 ink = vec3(0.020, 0.027, 0.065);
  vec3 cool = vec3(0.19, 0.42, 0.78);
  vec3 warm = vec3(0.95, 0.44, 0.24);
  if (u_palette > 0.5 && u_palette < 1.5) {
    cool = vec3(0.12, 0.57, 0.67);
    warm = vec3(0.35, 0.40, 0.95);
  } else if (u_palette > 1.5) {
    cool = vec3(0.51, 0.18, 0.42);
    warm = vec3(1.0, 0.58, 0.24);
  }
  vec3 colour = ink;

  // Each pass draws a long curved ribbon: a narrow luminous core + a soft halo.
  // Four fixed passes keep the per-pixel cost predictable; there is no raymarch.
  for (int i = 0; i < 4; i++) {
    float layer = float(i);
    float bend = 0.17 * sin(p.x * 1.65 + t + layer * 0.60);
    bend += 0.075 * sin(p.x * 3.2 - t * 0.65 + layer);
    float centre = 0.20 + p.x * 0.30 + bend - layer * 0.125;
    float distanceToRibbon = abs(p.y - centre);
    float core = exp(-distanceToRibbon * (58.0 + layer * 8.0));
    float halo = exp(-distanceToRibbon * 9.0);
    float folds = 0.62 + 0.38 * sin(p.x * 6.0 + layer * 2.0 + t);
    vec3 ribbon = mix(cool, warm, 0.5 + 0.5 * sin(p.x * 1.8 + layer));
    colour += ribbon * (core * 0.54 + halo * 0.18) * folds;
  }

  // A broad glow joins the ribbons; keep the brightest area right of the copy.
  vec2 glowPoint = p - vec2(0.42 * aspect, 0.12);
  float glow = exp(-dot(glowPoint, glowPoint) * 3.0);
  colour += cool * glow * 0.14;
  colour *= 0.52 + 0.48 * smoothstep(0.02, 0.85, uv.x);

  // Darken the edges and add stationary, low-amplitude grain (no flickering).
  float vignette = 1.0 - smoothstep(0.25, 1.05, length((uv - 0.5) * 1.15));
  colour *= 0.56 + 0.44 * vignette;
  colour += (grain(gl_FragCoord.xy) - 0.5) * 0.018;
  gl_FragColor = vec4(clamp(colour, 0.0, 1.0), 1.0);
}
