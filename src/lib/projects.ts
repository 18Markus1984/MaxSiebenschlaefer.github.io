import { getCollection, type CollectionEntry } from 'astro:content';
import localImages from '../data/local-images.json';

export type Project = CollectionEntry<'projects'>;
export type Shot = { src: string; w: number; h: number; fx: number; fy: number; alt?: string };

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects', (p) => !p.data.draft);
  return all.sort((a, b) => a.data.order - b.data.order || (b.data.date ?? `${b.data.year}`).localeCompare(a.data.date ?? `${a.data.year}`));
}

export const isHighlight = (p: Project) => p.data.order < 100;

// Titelbild: eigenes Foto (image) oder das erste Galeriebild von Printables
export function cover(p: Project): Shot | undefined {
  const d = p.data;
  // Printables-Galerie hat Vorrang, ein eigenes Bild (image) nur, wenn es keine Galerie gibt
  if (d.image && d.gallery.length === 0) {
    const info = (localImages as Record<string, { w: number; h: number }>)[d.image] ?? { w: 4, h: 3 };
    return { src: `/images/projects/${d.image}`, w: info.w, h: info.h, fx: 50, fy: 50, alt: d.imageAlt };
  }
  const g = d.gallery[0];
  return g ? { ...g, alt: d.imageAlt ?? d.title } : undefined;
}

// Alle Bilder für die Projektseite, ohne Doppelungen
export function shots(p: Project): Shot[] {
  const c = cover(p);
  const rest = p.data.gallery.filter((g) => g.src !== c?.src);
  return [...(c ? [c] : []), ...rest.map((g, i) => ({ ...g, alt: `${p.data.title}, Bild ${i + 2}` }))];
}

// Reihenfolge der Mikrocontroller auf der Elektronik-Seite. Unbekannte landen am Ende.
const CONTROLLER_ORDER = ['ESP32', 'ESP32-S3', 'ESP32-S2', 'ESP32-C3', 'ESP8266', 'Arduino Pro Micro', 'Arduino Nano', 'Arduino', 'Raspberry Pi'];

export function groupByController(projects: Project[]): [string, Project[]][] {
  const groups = new Map<string, Project[]>();
  for (const p of projects) {
    if (p.data.category !== 'elektronik') continue;
    const key = p.data.controller ?? 'Weitere Elektronik';
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  const rank = (k: string) => (CONTROLLER_ORDER.indexOf(k) === -1 ? 999 : CONTROLLER_ORDER.indexOf(k));
  return [...groups.entries()].sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]));
}
