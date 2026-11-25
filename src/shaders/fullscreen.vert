attribute vec2 a_position;

void main() {
  // One oversized triangle covers the viewport; its excess is clipped by WebGL.
  // No camera or model matrix is needed for a purely screen-space image.
  gl_Position = vec4(a_position, 0.0, 1.0);
}
