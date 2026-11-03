import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Ein Bild mit Abmessungen und Fokuspunkt (fx/fy in Prozent).
// Der Fokuspunkt sorgt dafür, dass beim Zuschneiden das Motiv mittig bleibt.
const shot = z.object({
  src: z.string(),
  w: z.number(),
  h: z.number(),
  fx: z.number().default(50),
  fy: z.number().default(50),
});

// Jedes Projekt ist eine Markdown-Datei in src/content/projects/.
// Neue Datei anlegen = neues Projekt auf Start, Modelle, Logbuch (und Elektronik) plus eigene Seite.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    year: z.number().int(),
    date: z.union([z.string(), z.date()]).transform((v) => (typeof v === 'string' ? v : v.toISOString().slice(0, 10))).optional(),
    summary: z.string(),
    // "elektronik" erscheint zusätzlich auf der Elektronik-Seite
    category: z.enum(['elektronik', 'druck']),
    // Rubrik für das Modell-Archiv, z. B. "Haushalt" oder "3D-Drucker"
    group: z.string().default('Sonstiges'),
    controller: z.string().optional(),
    status: z.enum(['in Arbeit', 'fertig']).default('fertig'),
    // Eigenes Titelbild aus public/images/projects/ (sonst das erste Galeriebild)
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    gallery: z.array(shot).default([]),
    // Reihenfolge der Highlights auf der Startseite, kleinere Zahl = weiter vorne.
    // Projekte mit order 100 (Standard) stehen nur im Archiv und im Logbuch.
    order: z.number().default(100),
    featured: z.boolean().default(false),
    // draft: true = noch nicht veröffentlicht, erscheint nirgends auf der Seite
    draft: z.boolean().default(false),
    printablesId: z.string().optional(),
    downloads: z.number().optional(),
    likes: z.number().optional(),
    specs: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    links: z
      .object({
        github: z.string().url().optional(),
        printables: z.string().url().optional(),
        youtube: z.string().url().optional(),
      })
      .default({}),
  }),
});

export const collections = { projects };
