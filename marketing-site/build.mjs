import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = dirname(fileURLToPath(import.meta.url));
const source = join(directory, 'src');
const output = join(directory, 'dist');
const configuredOrigin = process.env.SITE_URL || process.env.RENDER_EXTERNAL_URL;
if (!configuredOrigin) throw new Error('Set SITE_URL or use Render’s RENDER_EXTERNAL_URL.');
const url = new URL(configuredOrigin);
if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) {
  throw new Error('The website origin must be an HTTP(S) URL without credentials.');
}

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
cpSync(source, output, { recursive: true });
const pages = readdirSync(output).filter(name => name.endsWith('.html'));
for (const page of pages) {
  const htmlPath = join(output, page);
  const html = readFileSync(htmlPath, 'utf8').replaceAll('__SITE_ORIGIN__', url.origin);
  if (html.includes('__SITE_ORIGIN__')) throw new Error('Website origin was not replaced.');
  writeFileSync(htmlPath, html);
}
writeFileSync(join(output, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${url.origin}/sitemap.xml\n`);
writeFileSync(join(output, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${url.origin}/${page === 'index.html' ? '' : page}</loc></url>`).join('')}</urlset>\n`);
console.log(`Built the Wave Transakt website for ${url.origin}`);
