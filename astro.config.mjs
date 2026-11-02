import { defineConfig } from 'astro/config';

// SITE_URL und BASE_PATH setzt der GitHub-Workflow automatisch.
// Repo "18Markus1984.github.io" -> Seite liegt unter https://18markus1984.github.io/
// Anderer Repo-Name, z. B. "website" -> https://18markus1984.github.io/website/
// Eigene Domain: SITE_URL auf die Domain setzen und BASE_PATH auf "/".
export default defineConfig({
  site: process.env.SITE_URL || 'https://18markus1984.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
});
