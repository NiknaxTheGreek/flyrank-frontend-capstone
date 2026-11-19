import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { AuroraRenderer } from '../components/aurora-renderer';
import './shader-hero.css';

const moods = ['Afterlight', 'Glacier', 'Ember'] as const;

export default function ShaderHeroPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<AuroraRenderer | null>(null);
  const [palette, setPalette] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(media.matches);
    media.addEventListener('change', update);
    update();
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reducedMotion) { setReady(false); return; }
    let cancelled = false;
    // Reduced motion never imports the renderer or allocates a WebGL context.
    import('../components/aurora-renderer').then(({ createAuroraRenderer }) => {
      if (cancelled || !canvasRef.current) return;
      try {
        const renderer = createAuroraRenderer(canvasRef.current, () => setReady(false));
        rendererRef.current = renderer;
        // Current choices may have changed while the dynamic chunk was loading.
        renderer.setPalette(settings.current.palette);
        renderer.setPaused(settings.current.paused);
        setReady(true);
      } catch {
        setReady(false); // Same content and controls survive a GPU/compile failure.
      }
    }).catch(() => { if (!cancelled) setReady(false); });
    return () => {
      cancelled = true;
      rendererRef.current?.dispose();
      rendererRef.current = null;
    };
  }, [reducedMotion]);

  const settings = useRef({ palette, paused });
  settings.current = { palette, paused };
  useEffect(() => { rendererRef.current?.setPalette(palette); }, [palette]);
  useEffect(() => { rendererRef.current?.setPaused(paused); }, [paused]);

  const animated = ready && !reducedMotion;
  return (
    <section className="afterlight" data-mood={moods[palette].toLowerCase()} aria-labelledby="afterlight-title">
      <canvas ref={canvasRef} className={`afterlight__canvas${animated ? ' is-ready' : ''}`} aria-hidden="true" />
      <div className="afterlight__shade" aria-hidden="true" />
      <div className="afterlight__frame" aria-hidden="true" />

      <div className="afterlight__topline">
        <span className="afterlight__edition">THE AFTERLIGHT COLLECTION <span>—</span> VOL. 01</span>
        <span className="afterlight__signature">A visual experience by Nicholas Perikli</span>
      </div>

      <div className="afterlight__content">
        <p className="afterlight__eyebrow"><span aria-hidden="true" /> STORIES WORTH GETTING LOST IN</p>
        <h1 id="afterlight-title" tabIndex={-1}>A little light.<br /><em>A different world.</em></h1>
        <p className="afterlight__copy">For the nights you want to feel something.<br className="afterlight__desktop-break" /> Find a film that stays with you.</p>
        <div className="afterlight__actions">
          <Link className="afterlight__primary" to="/pick-a-movie">Find my next film <span aria-hidden="true">↗</span></Link>
          <Link className="afterlight__secondary" to="/movies">Explore the collection <span aria-hidden="true">→</span></Link>
        </div>
      </div>

      <div className="afterlight__caption" aria-hidden="true"><span>FIG. 013</span><p>In the quiet<br />before the story.</p></div>

      <div className="afterlight__footer">
        <div className="afterlight__invitation"><span aria-hidden="true">✧</span><p>{animated && !paused ? 'Move to shape the light.' : 'A moment, held still.'}<small>Stay a little. Then find your story.</small></p></div>
        <div className="afterlight__controls">
          <fieldset className="afterlight__moods">
            <legend>Colour mood</legend>
            {moods.map((name, index) => <button key={name} type="button" className="afterlight__mood" aria-pressed={palette === index} onClick={() => setPalette(index)}><span data-swatch={index} aria-hidden="true" />{name}</button>)}
          </fieldset>
          {animated ? <button className="afterlight__pause" type="button" aria-label="Pause animation" aria-pressed={paused} onClick={() => setPaused(value => !value)}><span aria-hidden="true">{paused ? '▷' : 'Ⅱ'}</span>{paused ? 'Resume' : 'Pause'}</button> : <span className="afterlight__still">Still edition</span>}
        </div>
      </div>
      <span className="afterlight__sr-status" role="status">{reducedMotion ? 'Reduced motion: static colour gradient.' : animated ? paused ? 'Animation paused.' : 'Animation playing.' : 'Static colour gradient.'}</span>
    </section>
  );
}
