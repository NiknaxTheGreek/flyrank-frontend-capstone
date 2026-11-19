import { useEffect, useRef } from 'react';
import {
  AmbientLight, BackSide, BufferAttribute, BufferGeometry, CanvasTexture, Color,
  DirectionalLight, DoubleSide, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial,
  PerspectiveCamera, Points, PointsMaterial, RingGeometry, Scene, ShaderMaterial,
  SphereGeometry, SRGBColorSpace, Vector3, WebGLRenderer,
} from 'three';
import { getWorld, type PlanetSettings, type WorldId } from './worlds';

export interface PlanetCanvasProps {
  settings: PlanetSettings;
  onReady: () => void;
  onFailure: (reason: string) => void;
}

/** Procedural, seamless texture: no GLB, HDR, images, decoder or external requests. */
function makeTexture(id: WorldId) {
  const canvas = document.createElement('canvas');
  canvas.width = 512; canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Surface preview unavailable');
  const image = context.createImageData(canvas.width, canvas.height);
  const world = getWorld(id);
  const dark = new Color(world.dark), mid = new Color(world.color), light = new Color(world.light);
  const color = new Color();
  for (let y = 0; y < 256; y++) {
    const latitude = y / 255 * Math.PI;
    for (let x = 0; x < 512; x++) {
      const longitude = x / 511 * Math.PI * 2;
      const a = Math.cos(longitude) * Math.sin(latitude), b = Math.cos(latitude), c = Math.sin(longitude) * Math.sin(latitude);
      const noise = Math.sin(a * 6 + Math.sin(c * 4)) * Math.cos(b * 7 - c * 3) * .25
        + Math.sin(a * 17 + b * 9 + c * 6) * .12 + Math.cos(b * 35 + a * 19 - c * 16) * .05;
      const band = .5 + .28 * Math.sin(b * 27 + noise * 5) + noise * .4;
      let value = id === 'dune' ? band : .5 + noise * 1.8;
      if (id === 'ocean') value = value > .62 ? .7 + noise * .4 : .12 + value * .35;
      if (id === 'glacier') value = .55 + value * .4;
      value = Math.max(0, Math.min(1, value));
      color.copy(value < .5 ? dark : mid).lerp(value < .5 ? mid : light, value < .5 ? value * 2 : (value - .5) * 2);
      color.convertLinearToSRGB();
      const offset = (y * 512 + x) * 4;
      image.data[offset] = color.r * 255; image.data[offset + 1] = color.g * 255; image.data[offset + 2] = color.b * 255; image.data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new CanvasTexture(canvas);
  texture.colorSpace = SRGBColorSpace;
  return texture;
}

export default function PlanetCanvas({ settings, onReady, onFailure }: PlanetCanvasProps) {
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef(settings);
  latest.current = settings;
  const refresh = useRef<() => void>(() => {});
  const callbacks = useRef({ onReady, onFailure });
  callbacks.current = { onReady, onFailure };

  useEffect(() => {
    if (!host.current) return;
    const container = host.current;
    let renderer: WebGLRenderer;
    try { renderer = new WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'low-power' }); }
    catch { callbacks.current.onFailure('Your browser could not start 3D. The static studio is still ready to use.'); return; }
    const canvas = renderer.domElement;
    canvas.setAttribute('aria-label', 'Interactive planet. Drag to rotate, pinch to zoom. Arrow keys rotate, plus and minus zoom, Home resets.');
    canvas.setAttribute('aria-describedby', 'ps-canvas-help');
    canvas.setAttribute('role', 'img');
    canvas.tabIndex = 0;
    container.appendChild(canvas);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5));
    renderer.outputColorSpace = SRGBColorSpace;
    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, .1, 40);
    const group = new Group();
    group.rotation.set(.16, -.4, -.23);
    scene.add(group);
    const geometry = new SphereGeometry(1.25, 56, 36);
    const material = new MeshStandardMaterial({ roughness: .86, metalness: .02 });
    const planet = new Mesh(geometry, material);
    group.add(planet);
    const atmosphereGeometry = new SphereGeometry(1.28, 40, 24);
    const atmosphereMaterial = new ShaderMaterial({
      uniforms: { tint: { value: new Color('#96bfe6') } },
      vertexShader: 'varying vec3 vNormal; varying vec3 vView; void main(){ vec4 p=modelViewMatrix*vec4(position,1.0); vNormal=normalize(normalMatrix*normal); vView=normalize(-p.xyz); gl_Position=projectionMatrix*p; }',
      fragmentShader: 'uniform vec3 tint; varying vec3 vNormal; varying vec3 vView; void main(){float rim=pow(1.0-abs(dot(normalize(vNormal),normalize(vView))),3.0); gl_FragColor=vec4(tint,rim*0.28);}',
      transparent: true, side: BackSide, depthWrite: false,
    });
    group.add(new Mesh(atmosphereGeometry, atmosphereMaterial));
    const rings = new Group();
    rings.rotation.x = Math.PI / 2.35;
    const ringGeometries: RingGeometry[] = [], ringMaterials: MeshStandardMaterial[] = [];
    for (let i = 0; i < 7; i++) {
      const inner = 1.62 + i * .094;
      const ringGeometry = new RingGeometry(inner, inner + (i === 3 ? .04 : .078), 100);
      const ringMaterial = new MeshStandardMaterial({ color: i % 2 ? '#987856' : '#d9b78c', side: DoubleSide, transparent: true, opacity: .5 + i % 3 * .12, roughness: 1, depthWrite: false });
      ringGeometries.push(ringGeometry); ringMaterials.push(ringMaterial);
      rings.add(new Mesh(ringGeometry, ringMaterial));
    }
    group.add(rings);
    scene.add(new AmbientLight('#becde0', .55));
    const sun = new DirectionalLight('#fff0da', 3.1); scene.add(sun);
    const rim = new DirectionalLight('#82b3ff', .7); rim.position.set(-3, .2, -3); scene.add(rim);
    const starsGeometry = new BufferGeometry();
    const starPositions = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i++) {
      starPositions[i * 3] = Math.sin(i * 137.5) * 13;
      starPositions[i * 3 + 1] = Math.cos(i * 47.1) * 9;
      starPositions[i * 3 + 2] = -7 - (i % 6);
    }
    starsGeometry.setAttribute('position', new BufferAttribute(starPositions, 3));
    const starsMaterial = new PointsMaterial({ color: '#8c9cb8', size: .022, transparent: true, opacity: .6 });
    scene.add(new Points(starsGeometry, starsMaterial));
    const textures = new Map<WorldId, CanvasTexture>();
    let previousWorld: WorldId | undefined;
    let previousReset = -1, previousZoom = 1;
    let distance = 7.7, visible = true, disposed = false, frame = 0, lastTime = 0, rendered = 0;
    let rotationX = .16, rotationY = -.4;
    let dirty = true;
    const pointers = new Map<number, { x: number; y: number }>();
    let pinchDistance = 0;
    const clampDistance = () => { distance = Math.max(5.6, Math.min(10, distance)); };
    const pointerDistance = () => { const p = [...pointers.values()]; return p.length === 2 ? Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y) : 0; };

    function draw(time: number) {
      frame = 0;
      if (disposed || !visible || document.hidden) return;
      try {
      const current = latest.current;
      const elapsed = time - lastTime;
      if (!dirty && current.rotating && elapsed < 1000 / 30) { frame = requestAnimationFrame(draw); return; }
      if (current.resetKey !== previousReset) {
        rotationX = .16; rotationY = -.4; distance = 7.7 / current.zoom;
        previousReset = current.resetKey;
      }
      if (current.zoom !== previousZoom) { distance = 7.7 / current.zoom; clampDistance(); previousZoom = current.zoom; }
      if (current.world !== previousWorld) {
        if (!textures.has(current.world)) textures.set(current.world, makeTexture(current.world));
        material.map = textures.get(current.world)!;
        material.roughness = current.world === 'ocean' ? .4 : .86;
        material.needsUpdate = true;
        atmosphereMaterial.uniforms.tint.value.set(getWorld(current.world).color);
        previousWorld = current.world;
      }
      if (current.rotating && lastTime) rotationY += Math.min(elapsed, 100) / 1000 * .13;
      group.rotation.set(rotationX, rotationY, -.23);
      rings.visible = current.rings;
      const angle = current.light * Math.PI / 180;
      sun.position.set(Math.cos(angle) * 5, 2.8, Math.sin(angle) * 5);
      camera.position.set(0, .18, distance);
      camera.lookAt(new Vector3(0, 0, 0));
      renderer.render(scene, camera);
      rendered++;
      // Inspection counters let the performance check verify idle/background work.
      canvas.dataset.frames = String(rendered);
      canvas.dataset.triangles = String(renderer.info.render.triangles);
      canvas.dataset.drawCalls = String(renderer.info.render.calls);
      canvas.dataset.world = current.world;
      canvas.dataset.cameraDistance = distance.toFixed(2);
      lastTime = time; dirty = false;
      if (rendered === 1) callbacks.current.onReady();
      if (current.rotating) frame = requestAnimationFrame(draw);
      } catch {
        callbacks.current.onFailure('The 3D scene stopped unexpectedly. Your settings are kept in the static view; try 3D again.');
      }
    }
    function invalidate() { if (disposed) return; dirty = true; if (!frame && visible && !document.hidden) frame = requestAnimationFrame(draw); }
    refresh.current = invalidate;
    const resize = new ResizeObserver(() => {
      const width = container.clientWidth, height = container.clientHeight;
      if (!width || !height) return;
      renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); invalidate();
    });
    resize.observe(container);
    const intersection = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (!visible) { cancelAnimationFrame(frame); frame = 0; }
      else { lastTime = 0; invalidate(); }
    });
    intersection.observe(container);
    const visibility = () => {
      cancelAnimationFrame(frame); frame = 0; lastTime = 0;
      if (!document.hidden) invalidate();
    };
    const down = (event: PointerEvent) => {
      canvas.focus({ preventScroll: true });
      canvas.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      pinchDistance = pointerDistance();
    };
    const move = (event: PointerEvent) => {
      const old = pointers.get(event.pointerId); if (!old) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 1) {
        rotationY += (event.clientX - old.x) * .008;
        rotationX = Math.max(-1.2, Math.min(1.2, rotationX + (event.clientY - old.y) * .006));
      } else {
        const next = pointerDistance();
        if (next && pinchDistance) distance *= pinchDistance / next;
        pinchDistance = next; clampDistance();
      }
      invalidate();
    };
    const up = (event: PointerEvent) => { pointers.delete(event.pointerId); pinchDistance = pointerDistance(); };
    const wheel = (event: WheelEvent) => { if (!event.ctrlKey) return; event.preventDefault(); distance += event.deltaY * .008; clampDistance(); invalidate(); };
    const key = (event: KeyboardEvent) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'Home'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'ArrowLeft') rotationY -= .13;
      if (event.key === 'ArrowRight') rotationY += .13;
      if (event.key === 'ArrowUp') rotationX = Math.max(-1.2, rotationX - .13);
      if (event.key === 'ArrowDown') rotationX = Math.min(1.2, rotationX + .13);
      if (event.key === '+' || event.key === '=') distance -= .3;
      if (event.key === '-') distance += .3;
      if (event.key === 'Home') { rotationX = .16; rotationY = -.4; distance = 7.7; }
      clampDistance(); invalidate();
    };
    const lost = (event: Event) => { event.preventDefault(); callbacks.current.onFailure('3D was interrupted. Your world settings are saved below. Try 3D again or keep the static view.'); };
    canvas.addEventListener('pointerdown', down); canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('lostpointercapture', up); canvas.addEventListener('wheel', wheel, { passive: false });
    canvas.addEventListener('keydown', key); canvas.addEventListener('webglcontextlost', lost);
    document.addEventListener('visibilitychange', visibility);
    invalidate();
    return () => {
      disposed = true; refresh.current = () => {}; cancelAnimationFrame(frame);
      resize.disconnect(); intersection.disconnect(); document.removeEventListener('visibilitychange', visibility);
      canvas.removeEventListener('pointerdown', down); canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up); canvas.removeEventListener('pointercancel', up);
      canvas.removeEventListener('lostpointercapture', up); canvas.removeEventListener('wheel', wheel);
      canvas.removeEventListener('keydown', key); canvas.removeEventListener('webglcontextlost', lost);
      geometry.dispose(); material.dispose(); atmosphereGeometry.dispose(); atmosphereMaterial.dispose();
      ringGeometries.forEach(value => value.dispose()); ringMaterials.forEach(value => value.dispose());
      starsGeometry.dispose(); starsMaterial.dispose(); textures.forEach(value => value.dispose());
      renderer.dispose(); renderer.forceContextLoss(); canvas.remove();
    };
  }, []);

  useEffect(() => { refresh.current(); }, [settings]);
  return <div ref={host} className="ps-canvas" />;
}
