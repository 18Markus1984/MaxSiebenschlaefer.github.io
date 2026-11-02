import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Jedes Projekt ist eine Markdown-Datei in src/content/projects/.
// Neue Datei anlegen = neues Projekt auf Start, Elektronik, Logbuch und eigener Projektseite.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    year: z.number().int(),
    summary: z.string(),
    // "elektronik" erscheint auf der Elektronik-Seite, "druck" nur im 3D-Druck-Bereich
    category: z.enum(['elektronik', 'druck']),
    controller: z.string().optional(),
    status: z.enum(['in Arbeit', 'fertig']).default('fertig'),
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // Reihenfolge auf der Startseite, kleinere Zahl = weiter vorne
    order: z.number().default(100),
    featured: z.boolean().default(false),
    // draft: true = noch nicht veröffentlicht, erscheint nirgends auf der Seite
    draft: z.boolean().default(false),
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
