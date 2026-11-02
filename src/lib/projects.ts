import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

export async function getProjects(): Promise<Project[]> {
  const all = await getCollection('projects');
  return all.sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
}

// Reihenfolge der Mikrocontroller auf der Elektronik-Seite. Unbekannte landen am Ende.
const CONTROLLER_ORDER = ['ESP32', 'ESP32-S3', 'ESP32-S2', 'ESP32-C3', 'ESP8266', 'Arduino Pro Micro', 'Raspberry Pi'];

export function groupByController(projects: Project[]): [string, Project[]][] {
  const groups = new Map<string, Project[]>();
  for (const p of projects) {
    if (p.data.category !== 'elektronik') continue;
    const key = p.data.controller ?? 'Sonstiges';
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }
  const rank = (k: string) => (CONTROLLER_ORDER.indexOf(k) === -1 ? 999 : CONTROLLER_ORDER.indexOf(k));
  return [...groups.entries()].sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]));
}
