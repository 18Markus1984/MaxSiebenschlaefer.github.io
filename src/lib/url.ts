// Baut Links und Bildpfade passend zum BASE_PATH (wichtig für GitHub Pages unter /repo-name/).
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}` || '/';
}

export function projectImage(file?: string): string | undefined {
  return file ? url(`/images/projects/${file}`) : undefined;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('de-DE').format(n);
}
