export type WorldId = 'dune' | 'ocean' | 'glacier';

export const worlds = [
  { id: 'dune', name: 'Dune', subtitle: 'THE DESERT WORLD', color: '#e4a878', dark: '#563929', light: '#ffd7a6', description: 'Warm mineral bands. Endless amber horizons. A world made for a slow, sweeping opening shot.' },
  { id: 'ocean', name: 'Ocean', subtitle: 'THE WATER WORLD', color: '#77c9d6', dark: '#183f59', light: '#c6f2dc', description: 'Deep blue water meets scattered green archipelagos. Set the light low and let the coastline catch it.' },
  { id: 'glacier', name: 'Glacier', subtitle: 'THE FROZEN WORLD', color: '#b5c5ee', dark: '#454f79', light: '#edf4ff', description: 'Pale ice, violet shadows and a quiet atmosphere. A little colder. A little further from home.' },
] as const;

export interface PlanetSettings {
  world: WorldId;
  rings: boolean;
  rotating: boolean;
  light: number;
  zoom: number;
  resetKey: number;
}

export const initialSettings: PlanetSettings = { world: 'dune', rings: true, rotating: false, light: 35, zoom: 1, resetKey: 0 };

export function getWorld(id: WorldId) { return worlds.find(world => world.id === id) ?? worlds[0]; }
