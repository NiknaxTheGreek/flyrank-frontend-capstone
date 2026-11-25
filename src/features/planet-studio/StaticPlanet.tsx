import { useId } from 'react';
import { getWorld, type PlanetSettings } from './worlds';

/** Inline SVG is the zero-download, non-animated fallback. No WebGL required. */
export default function StaticPlanet({ settings }: { settings: PlanetSettings }) {
  const id = useId().replace(/:/g, '');
  const world = getWorld(settings.world);
  return <svg className="ps-static" viewBox="0 0 720 590" role="img" aria-label={`${world.name} world, static illustration${settings.rings ? ' with rings' : ''}`}>
    <defs>
      <radialGradient id={`${id}-body`} cx="32%" cy="25%" r="80%">
        <stop offset="0" stopColor={world.light} /><stop offset=".4" stopColor={world.color} /><stop offset=".78" stopColor={world.dark} /><stop offset="1" stopColor="#0b1019" />
      </radialGradient>
      <linearGradient id={`${id}-ring`}><stop stopColor={world.dark} /><stop offset=".45" stopColor={world.light} /><stop offset="1" stopColor={world.color} /></linearGradient>
      <clipPath id={`${id}-clip`}><circle cx="360" cy="295" r="147" /></clipPath>
    </defs>
    <g transform={`translate(360 295) scale(${settings.zoom}) translate(-360 -295)`}>
      {settings.rings && <ellipse cx="360" cy="295" rx="267" ry="76" transform="rotate(-24 360 295)" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="31" opacity=".4" />}
      <circle cx="360" cy="295" r="153" fill="none" stroke={world.color} strokeWidth="2" opacity=".2" />
      <circle cx="360" cy="295" r="147" fill={`url(#${id}-body)`} />
      <g clipPath={`url(#${id}-clip)`} opacity=".18" fill="none" stroke={world.light} strokeWidth="9" transform="rotate(-14 360 295)">
        {[195, 224, 260, 306, 346, 379].map((y, index) => <path key={y} d={`M180 ${y} Q330 ${y + 30 + index * 3} 550 ${y - 8}`} />)}
      </g>
      {settings.rings && <path d="M116 403 C220 438 531 296 604 187" fill="none" stroke={`url(#${id}-ring)`} strokeWidth="24" opacity=".72" />}
    </g>
  </svg>;
}
