# Max Siebenschläfer – Webseite

Statische Webseite mit [Astro](https://astro.build), gehostet auf GitHub Pages. Drei Seiten (Start, Elektronik, Logbuch) plus eine eigene Seite pro Projekt.

## Einmal einrichten

1. Neues **öffentliches** Repo auf GitHub anlegen. Heißt es `18Markus1984.github.io`, liegt die Seite unter `https://18markus1984.github.io/`. Jeder andere Name landet unter `https://18markus1984.github.io/<name>/`.
2. Inhalt dieses Ordners hochladen und auf `main` pushen.
3. Im Repo unter **Settings > Pages** bei „Source“ **GitHub Actions** wählen.
4. Unter **Settings > Secrets and variables > Actions**:
   - Variable `PRINTABLES_USER_ID` = deine Printables-User-ID (dieselbe wie im Trophy Counter)
   - optional Secret `YOUTUBE_API_KEY` für Video- und Abozahlen
   - optional Variable `CUSTOM_DOMAIN`, z. B. `maxsiebenschlaefer.de` (dann zusätzlich eine Datei `public/CNAME` mit der Domain anlegen)
5. Unter **Actions** den Workflow „Webseite bauen und veröffentlichen“ einmal von Hand starten.

Danach baut jeder Push die Seite neu, und einmal am Tag werden die Zahlen von GitHub, Printables und YouTube aktualisiert.

## Neues Projekt hinzufügen

1. Datei `src/content/projects/<kurzname>.md` anlegen, am einfachsten `src/content/projects/_vorlage.md.txt` kopieren.
2. Bilder:
   - Eigenes Foto: nach `public/images/projects/` legen und in `image:` eintragen (wird nur genutzt, wenn es keine `gallery` gibt).
   - Printables-Bilder: nach `public/images/printables/<modell-id>/` legen und unter `gallery:` eintragen, z. B.
     `- { src: /images/printables/123/0.jpg, w: 1200, h: 900, fx: 50, fy: 50 }`.
     `w`/`h` sind die Pixelmaße, `fx`/`fy` der Bildpunkt (in %), der beim Zuschneiden sichtbar bleiben soll.
   - Alle Bilder erscheinen im Format 4:3. Passt ein Bild nicht ungefähr hinein (z. B. Hochformat), wird es komplett gezeigt und der Rand mit einer unscharfen Kopie gefüllt. So steht nichts über.
3. Wichtige Felder: `group` (Rubrik für den Filter auf /modelle/), `order` unter 100 = Highlight auf der Startseite und groß im Logbuch, `featured: true` = Kasten auf der Elektronik-Seite, `draft: true` = ausgeblendet.
4. Committen und pushen. Das Projekt erscheint automatisch unter Modelle, im Logbuch, auf der Elektronik-Seite (bei `category: elektronik`) und bekommt eine eigene Seite.

Ereignisse ohne eigenes Projekt (z. B. ein beliebtes Printables-Modell) stehen in `src/data/logbuch.json`.

## Lokal ansehen

```bash
npm install
npm run dev
```

## Vor dem Veröffentlichen

- Impressum (`src/pages/impressum.astro`) und Datenschutz (`src/pages/datenschutz.astro`) ausfüllen, die Platzhalter stehen in eckigen Klammern.
- E-Mail-Adresse in `src/data/site.json` eintragen, wenn sie im Fuß stehen soll.
