import { Component, Suspense, lazy, useCallback, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import StaticPlanet from '../features/planet-studio/StaticPlanet';
import { getWorld, initialSettings, worlds, type PlanetSettings } from '../features/planet-studio/worlds';
import './planet-studio.css';

// No Three.js import is evaluated or downloaded until the visitor chooses 3D.
const PlanetCanvas = lazy(() => import('../features/planet-studio/PlanetCanvas'));

class SceneBoundary extends Component<{ children: ReactNode; onFailure: (reason: string) => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure('The 3D scene could not load. Check your connection and try again; the static view still works.'); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function PlanetStudioPage() {
  const [settings, setSettings] = useState<PlanetSettings>({ ...initialSettings });
  const [mode, setMode] = useState<'static' | 'loading' | 'live' | 'error'>('static');
  const [message, setMessage] = useState('A small world. A little imagination.');
  const [saveMode, setSaveMode] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const world = getWorld(settings.world);
  const update = (patch: Partial<PlanetSettings>) => setSettings(previous => ({ ...previous, ...patch }));
  const fail = useCallback((reason: string) => { setMessage(reason); setMode('error'); setSettings(previous => ({ ...previous, rotating: false })); }, []);
  const ready = useCallback(() => { setMode('live'); setMessage('3D is ready. Drag the world to explore.'); }, []);

  useEffect(() => {
    document.title = 'Planet studio | Reel Good';
    document.getElementById('ps-title')?.focus();
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; addEventListener?: (type: string, listener: () => void) => void; removeEventListener?: (type: string, listener: () => void) => void } }).connection;
    const lowPower = (navigator.hardwareConcurrency || 8) <= 4;
    const sync = () => {
      const saving = media.matches || Boolean(connection?.saveData) || lowPower;
      setSaveMode(saving);
      if (saving) {
        setSettings(previous => ({ ...previous, rotating: false }));
        setMode('static');
        setMessage('Static view is on for your motion or device preferences. You can choose to explore in 3D.');
      }
    };
    sync(); media.addEventListener('change', sync); connection?.addEventListener?.('change', sync);
    return () => { media.removeEventListener('change', sync); connection?.removeEventListener?.('change', sync); };
  }, []);

  const launch = () => { setSceneKey(previous => previous + 1); setMessage('Preparing your world…'); setMode('loading'); };
  const staticView = () => { setMode('static'); update({ rotating: false }); setMessage('Static view is on. Your world settings are kept.'); };
  const reset = () => { setSettings(previous => ({ ...initialSettings, resetKey: previous.resetKey + 1 })); setMessage('World and camera reset.'); };

  return <section className="planet-studio" style={{ '--ps-world': world.color } as CSSProperties} aria-labelledby="ps-title">
    <header className="ps-heading">
      <div><p className="ps-eyebrow"><span aria-hidden="true">✦</span> REEL GOOD / AN INTERACTIVE SIDE QUEST</p>
        <h1 id="ps-title" tabIndex={-1}>Small world.<br /><span>Big imagination.</span></h1>
        <p className="ps-lede">Build the setting for your next sci-fi daydream.</p>
      </div>
      <div className="ps-edition"><span>PLANET STUDIO</span><span>VOL. 01 — WORLD BUILDING</span></div>
    </header>

    <div className="ps-workspace">
      <div className="ps-stage">
        <div className="ps-stage-top"><span className="ps-live-badge"><i aria-hidden="true" />{mode === 'live' ? 'LIVE 3D' : mode === 'loading' ? 'PREPARING 3D' : 'STATIC PREVIEW'}</span><span>0{worlds.findIndex(item => item.id === world.id) + 1} / 03</span></div>
        <div className="ps-art">
          {mode !== 'live' && <StaticPlanet settings={settings} />}
          {(mode === 'loading' || mode === 'live') && <SceneBoundary key={sceneKey} onFailure={fail}>
            <Suspense fallback={null}><PlanetCanvas settings={settings} onReady={ready} onFailure={fail} /></Suspense>
          </SceneBoundary>}
          {mode !== 'live' && <div className="ps-launch">
            <button className="ps-primary" disabled={mode === 'loading'} onClick={launch}>{mode === 'loading' ? 'Preparing your world…' : mode === 'error' ? 'Try 3D again' : 'Launch 3D'}<span aria-hidden="true">↗</span></button>
            <span>{saveMode ? 'Static by preference. 3D is optional.' : 'A small, optional download. No sign-in.'}</span>
          </div>}
        </div>
        <div className="ps-stage-bottom"><span><span className="ps-coordinate">RG—0{worlds.findIndex(item => item.id === world.id) + 1}</span> {world.subtitle}</span>
          {mode === 'live' ? <button onClick={staticView}>Use static view ↙</button> : <span>CRAFTED, NOT DISCOVERED</span>}
        </div>
      </div>

      <aside className="ps-panel" aria-label="World configurator">
        <div className="ps-panel-title"><span>YOUR WORLD, YOUR RULES</span><span aria-hidden="true">✳</span></div>
        <fieldset className="ps-surfaces"><legend><span>01</span> Choose a surface</legend>
          <div>{worlds.map(item => <label key={item.id} className={settings.world === item.id ? 'ps-world-option selected' : 'ps-world-option'}>
            <input type="radio" name="planet-surface" value={item.id} checked={settings.world === item.id} onChange={() => update({ world: item.id })} />
            <span className={`ps-swatch ps-swatch-${item.id}`} aria-hidden="true" /><span>{item.name}</span>
          </label>)}</div>
        </fieldset>
        <div className="ps-world-copy"><h2>{world.name}<span aria-hidden="true">↗</span></h2><p>{world.description}</p></div>
        <fieldset className="ps-arrangement"><legend><span>02</span> Make it yours</legend>
          <label className="ps-switch"><span>Add planetary rings</span><input type="checkbox" checked={settings.rings} onChange={event => update({ rings: event.target.checked })} /><span className="ps-track" aria-hidden="true" /></label>
          <label className="ps-switch"><span>Auto-rotate</span><input type="checkbox" checked={settings.rotating} disabled={mode !== 'live'} onChange={event => update({ rotating: event.target.checked })} /><span className="ps-track" aria-hidden="true" /></label>
          <label className="ps-slider" htmlFor="ps-light"><span id="ps-light-label">Light direction</span><output aria-hidden="true">{settings.light}°</output></label>
          <input id="ps-light" aria-labelledby="ps-light-label" type="range" min="0" max="180" step="5" value={settings.light} disabled={mode !== 'live'} onChange={event => update({ light: Number(event.target.value) })} />
        </fieldset>
        <div className="ps-zoom"><span>Get closer</span><div><button aria-label="Zoom out" disabled={settings.zoom <= .8} onClick={() => update({ zoom: Math.max(.8, Number((settings.zoom - .1).toFixed(1))) })}>−</button><output aria-label="Zoom level">{Math.round(settings.zoom * 100)}%</output><button aria-label="Zoom in" disabled={settings.zoom >= 1.3} onClick={() => update({ zoom: Math.min(1.3, Number((settings.zoom + .1).toFixed(1))) })}>+</button></div></div>
        <button className="ps-reset" onClick={reset}><span aria-hidden="true">↺</span> Reset world</button>
      </aside>
    </div>

    <div className="ps-footer"><p role={mode === 'error' ? 'alert' : 'status'} aria-label="Scene status" className={mode === 'error' ? 'ps-error' : ''}>{message}</p><p id="ps-canvas-help">Drag to orbit · Pinch to zoom · Arrow keys to rotate<br /><span>Fictional worlds. Real-time 3D. A little escape.</span></p></div>
    <noscript>Planet studio needs JavaScript for configuration. Its worlds are fictional illustrations.</noscript>
  </section>;
}
