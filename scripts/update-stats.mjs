// Aktualisiert src/data/stats.json mit Zahlen von GitHub, Printables und (optional) YouTube.
// Läuft täglich im GitHub-Workflow. Schlägt eine Quelle fehl, bleibt der alte Wert stehen.
//
// Umgebungsvariablen (im Repo unter Settings > Secrets and variables > Actions):
//   GITHUB_TOKEN        kommt im Workflow automatisch
//   PRINTABLES_USER_ID  deine Printables-User-ID (Variable), dieselbe wie im Trophy Counter
//   YOUTUBE_API_KEY     optional (Secret), für Video- und Abozahl
import { readFile, writeFile } from 'node:fs/promises';

const FILE = new URL('../src/data/stats.json', import.meta.url);
const GITHUB_USER = '18Markus1984';
const YOUTUBE_CHANNEL = 'UCKLloFoVPy84dioQ_5BPWQw';

const stats = JSON.parse(await readFile(FILE, 'utf8'));
const before = JSON.stringify(stats);

async function getJson(url, init = {}) {
  const res = await fetch(url, { ...init, signal: AbortSignal.timeout(15000) });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} bei ${url}`);
  return res.json();
}

async function github() {
  const headers = { 'User-Agent': 'maxsiebenschlaefer-website' };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const user = await getJson(`https://api.github.com/users/${GITHUB_USER}`, { headers });
  if (typeof user.public_repos === 'number') stats.github.repos = user.public_repos;
  console.log('GitHub: Repos', stats.github.repos);
}

async function printables() {
  const id = process.env.PRINTABLES_USER_ID;
  if (!id) return console.log('Printables: übersprungen, PRINTABLES_USER_ID fehlt');
  const query = `query { user(id: "${id}") { followersCount downloadCount } }`;
  const data = await getJson('https://api.printables.com/graphql/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'maxsiebenschlaefer-website' },
    body: JSON.stringify({ query }),
  });
  const u = data?.data?.user;
  if (!u) throw new Error('Printables: keine Daten');
  if (typeof u.followersCount === 'number') stats.printables.followers = u.followersCount;
  if (typeof u.downloadCount === 'number') stats.printables.downloads = u.downloadCount;
  console.log('Printables: Follower', stats.printables.followers, 'Downloads', stats.printables.downloads);
}

async function youtube() {
  const key = process.env.YOUTUBE_API_KEY;
  if (!key) return console.log('YouTube: übersprungen, YOUTUBE_API_KEY fehlt');
  const data = await getJson(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${YOUTUBE_CHANNEL}&key=${key}`);
  const s = data?.items?.[0]?.statistics;
  if (!s) throw new Error('YouTube: keine Daten');
  stats.youtube.videos = Number(s.videoCount);
  stats.youtube.subscribers = s.hiddenSubscriberCount ? null : Number(s.subscriberCount);
  console.log('YouTube: Videos', stats.youtube.videos);
}

for (const [name, fn] of [['GitHub', github], ['Printables', printables], ['YouTube', youtube]]) {
  try { await fn(); } catch (err) { console.warn(`${name}: alter Wert bleibt (${err.message})`); }
}

if (JSON.stringify(stats) !== before) {
  stats.updated = new Date().toISOString().slice(0, 10);
  await writeFile(FILE, JSON.stringify(stats, null, 2) + '\n');
  console.log('stats.json aktualisiert');
} else {
  console.log('Keine Änderungen');
}
