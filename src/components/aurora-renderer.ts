import fragmentSource from '../shaders/afterlight.frag?raw';
import vertexSource from '../shaders/fullscreen.vert?raw';

export interface AuroraRenderer {
  setPaused: (paused: boolean) => void;
  setPalette: (palette: number) => void;
  dispose: () => void;
}

/** One triangle, no textures. The drawing buffer is capped twice for mobile GPUs. */
export function createAuroraRenderer(canvas: HTMLCanvasElement, onContextLost: () => void): AuroraRenderer {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  });
  if (!gl) throw new Error('WebGL unavailable');

  function compile(type: number, source: string) {
    const shader = gl!.createShader(type);
    if (!shader) throw new Error('Cannot allocate shader');
    gl!.shaderSource(shader, source);
    gl!.compileShader(shader);
    if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
      gl!.deleteShader(shader);
      throw new Error('Cannot compile shader');
    }
    return shader;
  }

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  let fragment: WebGLShader;
  try { fragment = compile(gl.FRAGMENT_SHADER, fragmentSource); }
  catch (error) { gl.deleteShader(vertex); throw error; }
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertex); gl.deleteShader(fragment);
    throw new Error('Cannot allocate program');
  }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    throw new Error('Cannot link program');
  }
  const buffer = gl.createBuffer();
  if (!buffer) { gl.deleteProgram(program); throw new Error('Cannot allocate triangle'); }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const uniforms = {
    time: gl.getUniformLocation(program, 'u_time'),
    resolution: gl.getUniformLocation(program, 'u_resolution'),
    mouse: gl.getUniformLocation(program, 'u_mouse'),
    palette: gl.getUniformLocation(program, 'u_palette'),
  };

  let disposed = false;
  let paused = false;
  let visible = true;
  let contextLost = false;
  let frame = 0;
  let lastTick: number | null = null;
  let lastDraw = -Infinity;
  let activeSeconds = 0;
  let palette = 0;
  const pointer = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

  const canAnimate = () => !disposed && !paused && visible && !document.hidden && !contextLost;

  function draw() {
    if (disposed || document.hidden || !visible || contextLost) return;
    gl!.useProgram(program);
    gl!.uniform1f(uniforms.time, activeSeconds);
    gl!.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl!.uniform2f(uniforms.mouse, pointer.x, pointer.y);
    gl!.uniform1f(uniforms.palette, palette);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  function tick(now: number) {
    frame = 0;
    if (!canAnimate()) return;
    const elapsed = lastTick === null ? 0 : Math.min((now - lastTick) / 1000, 0.1);
    lastTick = now;
    activeSeconds += elapsed;
    // Refresh at 30 fps even on 120 Hz screens; smooth the pointer in elapsed time.
    const follow = 1 - Math.exp(-elapsed * 4);
    pointer.x += (pointer.targetX - pointer.x) * follow;
    pointer.y += (pointer.targetY - pointer.y) * follow;
    if (now - lastDraw >= 1000 / 30 - 1) {
      draw();
      lastDraw = now;
    }
    frame = requestAnimationFrame(tick);
  }

  function syncAnimation() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTick = null; // Hidden/paused time never accumulates into the animation.
    lastDraw = -Infinity;
    if (canAnimate()) frame = requestAnimationFrame(tick);
  }

  function resize() {
    const { width, height } = canvas.getBoundingClientRect();
    // Effective DPR <= 1.5; also bound total fragments at 1.6 million per draw.
    const scale = Math.min(window.devicePixelRatio || 1, 1.5,
      Math.sqrt(1_600_000 / Math.max(1, width * height)));
    const w = Math.max(1, Math.floor(width * scale));
    const h = Math.max(1, Math.floor(height * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w; canvas.height = h;
      gl!.viewport(0, 0, w, h);
    }
    draw(); // A paused frame still fits after a rotation or browser resize.
  }

  function move(event: PointerEvent) {
    if (paused) return;
    const rect = canvas.getBoundingClientRect();
    pointer.targetX = Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width)));
    // DOM y runs down, whereas gl_FragCoord.y runs up.
    pointer.targetY = 1 - Math.max(0, Math.min(1, (event.clientY - rect.top) / Math.max(1, rect.height)));
  }
  function resetPointer() { pointer.targetX = 0.5; pointer.targetY = 0.5; }

  // Listen on the hero: the decorative canvas never captures links or touch scroll.
  const hero = canvas.parentElement!;
  hero.addEventListener('pointermove', move, { passive: true });
  hero.addEventListener('pointerleave', resetPointer);
  hero.addEventListener('pointerup', resetPointer);
  document.addEventListener('visibilitychange', syncAnimation);
  window.addEventListener('resize', resize);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvas);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) resize();
    syncAnimation();
  });
  intersectionObserver.observe(canvas);

  function loseContext(event: Event) {
    // Keep the CSS artwork visible if the GPU driver discards this context.
    event.preventDefault();
    contextLost = true;
    onContextLost();
    syncAnimation();
  }
  canvas.addEventListener('webglcontextlost', loseContext);
  resize();
  syncAnimation();

  return {
    setPaused(value) { paused = value; syncAnimation(); },
    setPalette(value) { palette = value; draw(); },
    dispose() {
      disposed = true;
      syncAnimation();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      hero.removeEventListener('pointermove', move);
      hero.removeEventListener('pointerleave', resetPointer);
      hero.removeEventListener('pointerup', resetPointer);
      document.removeEventListener('visibilitychange', syncAnimation);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('webglcontextlost', loseContext);
      gl!.deleteBuffer(buffer);
      gl!.deleteProgram(program);
    },
  };
}
