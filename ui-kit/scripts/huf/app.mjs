// HUF "app" capture mode: runs the REAL HUF React SPA (a built dist of any branch) with NO backend and NO server.
// Every request to the fake origin http://huf.mock is answered by Playwright routes:
//   /huf/**        -> static files from the dist (SPA fallback to index.html)
//   /__kit/**      -> files from this kit (bundled fonts injected into the live page so live == preview)
//   /api/**        -> fixtures (scripts/huf/fixtures/*.mjs; base mocks always on, area fixtures per spec)
//   socket.io      -> aborted (HUF shows a "Socket connection failed" toast; we hide the toaster)
//   models.dev     -> local monogram SVG (provider logos are hot-linked by the app)
// Nothing leaves the machine; the clock is fixed so relative times ("14 hours ago") are stable.
import fs from 'fs'; import path from 'path';
import { ROOT, launch } from '../lib.mjs';

export const ORIGIN = 'http://huf.mock';
export const BASE_PATH = '/huf';
export const FIXED_TIME = '2026-01-01T09:00:00Z';
export const VIEWPORT = { width: 1440, height: 900 };
const MIME = { js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', html: 'text/html', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', json: 'application/json', wasm: 'application/wasm', ico: 'image/x-icon' };
export const FREEZE_CSS = '*{animation:none!important;transition:none!important;caret-color:transparent!important}[data-sonner-toaster]{display:none!important}';

/** Where the built dist of a HUF branch lives. Build it with scripts/huf/build.sh <branch>. */
export function distFor(source = 'pre-develop') {
  if (process.env.HUF_DIST && source === (process.env.HUF_DIST_SOURCE || 'pre-develop')) return process.env.HUF_DIST;
  const d = path.join(ROOT, '.huf-cache/dist', slug(source));
  if (!fs.existsSync(path.join(d, 'index.html'))) throw new Error(`no HUF dist for "${source}" at ${d}: run scripts/huf/build.sh ${source}`);
  return d;
}
export const slug = (b) => b.replace(/[^a-z0-9._-]+/gi, '-');

export const json = (route, body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
/** Parse Frappe request args (query string or JSON/form body). */
export function args(req) {
  const u = new URL(req.url()); const o = Object.fromEntries(u.searchParams);
  const d = req.postData(); if (d) { try { Object.assign(o, JSON.parse(d)); } catch { Object.assign(o, Object.fromEntries(new URLSearchParams(d))); } }
  for (const k of ['filters', 'fields', 'order_by']) if (typeof o[k] === 'string' && /^[[{]/.test(o[k])) { try { o[k] = JSON.parse(o[k]); } catch {} }
  return o;
}

const monogram = (name) => { const ch = (name[0] || '?').toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#15181C"/><text x="12" y="16.2" text-anchor="middle" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="#fff">${ch}</text></svg>`; };

/** Install the app host + fixtures on a page. fixtures: list of fixture module names under scripts/huf/fixtures (base is implicit). */
export async function mountApp(page, { source = 'pre-develop', fixtures = [] } = {}) {
  const DIST = distFor(source);
  // Lowest precedence first: Playwright tries the LAST registered matching route first.
  await page.route(ORIGIN + '/**', async (route) => {
    const u = new URL(route.request().url()); const p = decodeURIComponent(u.pathname);
    if (p.startsWith('/api/') || p.includes('/socket.io')) return route.fallback();
    if (p.startsWith('/__kit/')) { const f = path.join(ROOT, p.slice(7)); return fs.existsSync(f) ? route.fulfill({ status: 200, contentType: MIME[f.split('.').pop()] || 'application/octet-stream', body: fs.readFileSync(f) }) : route.fulfill({ status: 404, body: '' }); }
    const rel = p.startsWith(BASE_PATH + '/') ? p.slice(BASE_PATH.length) : p;
    const f = path.join(DIST, rel); const file = fs.existsSync(f) && fs.statSync(f).isFile() ? f : path.join(DIST, 'index.html');
    return route.fulfill({ status: 200, contentType: MIME[file.split('.').pop()] || 'application/octet-stream', body: fs.readFileSync(file) });
  });
  await page.route(/^https?:\/\/(?!huf\.mock)/, (route) => route.abort()); // never touch the network
  await page.route('https://models.dev/logos/**', (route) => route.fulfill({ status: 200, contentType: 'image/svg+xml', headers: { 'access-control-allow-origin': ORIGIN, 'access-control-allow-credentials': 'true' }, body: monogram(path.basename(new URL(route.request().url()).pathname, '.svg')) }));
  await page.route('**/socket.io/**', (route) => route.abort());
  for (const name of ['base', ...fixtures]) {
    const mod = await import(new URL(`./fixtures/${name}.mjs`, import.meta.url));
    await mod.install(page, { json, args, ROOT });
  }
}

/** One browser context per spec: viewport 1440x900 @2x, UTC, fixed clock, seeded Math.random, no service workers. */
export async function openHuf(spec, browser) {
  const own = !browser; browser = browser || await launch();
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2, locale: 'en-US', timezoneId: 'UTC', serviceWorkers: 'block' });
  await ctx.addInitScript(() => { let s = 42; Math.random = () => (s = (s * 16807) % 2147483647) / 2147483647; try { localStorage.setItem('huf-mock', '1'); } catch {} });
  const page = await ctx.newPage(); page.setDefaultTimeout(15000);
  await page.clock.setFixedTime(new Date(spec.time || FIXED_TIME));
  await mountApp(page, { source: spec.source || 'pre-develop', fixtures: spec.fixtures || [] });
  return { browser, ctx, page, own };
}

/** Navigate to an app route ('/agents'), wait for data, freeze motion, swap in the bundled fonts. */
export async function goHuf(page, route, { waitFor, dark = false } = {}) {
  // HUF reads its colour scheme from localStorage ('light' | 'dark' | 'system'); dark = html[data-theme="midnight"].
  await page.goto(ORIGIN + BASE_PATH + route, { waitUntil: 'networkidle' });
  await page.evaluate((d) => { if (d) document.documentElement.setAttribute('data-theme', 'midnight'); else document.documentElement.removeAttribute('data-theme'); }, dark);
  if (waitFor) await page.waitForSelector(waitFor, { timeout: 15000 });
  await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 6000 }).catch(() => {});
  await page.evaluate(({ css }) => {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/__kit/tokens/css/huf/huf-fonts.css'; l.dataset.uikit = '1'; document.head.appendChild(l);
    const s = document.createElement('style'); s.dataset.uikit = '1'; s.textContent = css; document.head.appendChild(s);
    return new Promise((res, rej) => { l.onload = res; l.onerror = () => rej(new Error('huf-fonts.css failed to load')); });
  }, { css: FREEZE_CSS });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.fonts].filter((f) => f.status !== 'loaded').map((f) => f.load().catch(() => {}))); });
  await page.waitForTimeout(300);
}

/** Map the stylesheets the live page actually loaded to kit token files (tokens/css/huf/<source-slug>/<file>). */
export async function liveCss(page, source = 'pre-develop') {
  const hrefs = await page.evaluate(() => [...document.styleSheets].map((s) => s.href).filter(Boolean));
  const out = [];
  for (const h of hrefs) { const p = new URL(h).pathname; if (p.startsWith('/__kit/')) continue;
    const f = `huf/${slug(source)}/${path.basename(p)}`;
    if (!fs.existsSync(path.join(ROOT, 'tokens/css', f))) throw new Error(`stylesheet ${p} not in tokens: run node scripts/huf/tokens.mjs ${source}`);
    out.push(f); }
  out.push('huf/huf-fonts.css');
  return out;
}
