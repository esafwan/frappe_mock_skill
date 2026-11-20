// HUF DESKTOP "app" capture mode (modelled on scripts/huf/app.mjs): runs the REAL Huf Desktop renderer (Electron + React,
// built with Vite into .huf-cache/dist-desktop) in plain Chromium, with NO Electron, NO main process and NO Huf server.
//   http://desktop.mock/**         -> static files from the renderer dist (index.html, approval/index.html, assets)
//   http://desktop.mock/__kit/**   -> files from this kit (bundled fonts injected into the live page so live == preview)
//   window.desktop / approvalPanel -> scripts/huf-desktop/bridge.js (the preload bridges, answered from data/huf/desktop.json)
//   https://northwind.huf.example  -> the Huf server the app is "connected" to: scripts/huf-desktop/server.mjs fixtures
//   socket.io, anything else       -> aborted, so nothing ever reaches the network
// The router is a HashRouter (the packaged renderer runs from file://), so routes are '#/chat/<id>', '#/settings/...'.
// Build: scripts/huf-desktop/build.sh (renderer only) then node scripts/huf-desktop/tokens.mjs.
import fs from 'fs'; import path from 'path';
import { ROOT, launch } from '../lib.mjs';

export const ORIGIN = 'http://desktop.mock';
export const FIXED_TIME = '2026-01-01T09:00:00Z';
export const VIEWPORT = { width: 1440, height: 900 };
export const DIST = process.env.HUF_DESKTOP_DIST || path.join(ROOT, '.huf-cache/dist-desktop');
export const SOURCE = 'huf-desktop';
const MIME = { js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', html: 'text/html', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp', woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf', json: 'application/json', wasm: 'application/wasm', ico: 'image/x-icon' };
// Sonner toasts are hidden (none are part of a captured state); the blinking caret and motion are frozen.
export const FREEZE_CSS = '*{animation:none!important;transition:none!important;caret-color:transparent!important}[data-sonner-toaster]{display:none!important}';
const BRIDGE_JS = fs.readFileSync(new URL('./bridge.js', import.meta.url), 'utf8');
export const DATA = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'data/huf/desktop.json'), 'utf8'));
const deepMerge = (a, b) => { if (!b || typeof b !== 'object' || Array.isArray(b)) return b === undefined ? a : b; const o = { ...(a || {}) }; for (const [k, v] of Object.entries(b)) o[k] = deepMerge(o[k], v); return o; };

/** Approval items carry epoch-ms times relative to "now": turn the fixture's relative seconds into absolute ones. */
function absolutise(bridge, now) {
  const p = bridge.approvalPanel; if (!p) return bridge;
  for (const it of p.items || []) {
    if (it.requestedAgoSec !== undefined) { it.requestedAt = now - it.requestedAgoSec * 1000; delete it.requestedAgoSec; }
    if (it.expiresInSec !== undefined) { it.expiresAt = now + it.expiresInSec * 1000; delete it.expiresInSec; }
  }
  return bridge;
}

export async function mountApp(page, spec) {
  if (!fs.existsSync(path.join(DIST, 'index.html'))) throw new Error(`no Huf Desktop renderer dist at ${DIST}: run scripts/huf-desktop/build.sh`);
  const data = DATA();
  const now = new Date(spec.time || FIXED_TIME).getTime();
  const bridge = absolutise(deepMerge(data.bridge, JSON.parse(JSON.stringify(spec.bridge || {}))), now);
  await page.addInitScript({ content: `${BRIDGE_JS}\ninstallHufDesktopBridge(${JSON.stringify({ data: bridge, overrides: spec.bridgeOverrides || {} })});` });
  // Lowest precedence first: Playwright tries the LAST registered matching route first.
  await page.route(/^https?:\/\//, (route) => route.abort()); // never touch the network
  await page.route(ORIGIN + '/**', async (route) => {
    const p = decodeURIComponent(new URL(route.request().url()).pathname);
    if (p.startsWith('/__kit/')) { const f = path.join(ROOT, p.slice(7)); return fs.existsSync(f) ? route.fulfill({ status: 200, contentType: MIME[f.split('.').pop()] || 'application/octet-stream', body: fs.readFileSync(f) }) : route.fulfill({ status: 404, body: '' }); }
    const f = path.join(DIST, p === '/' ? 'index.html' : p);
    if (!fs.existsSync(f) || !fs.statSync(f).isFile()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, contentType: MIME[f.split('.').pop()] || 'application/octet-stream', body: fs.readFileSync(f) });
  });
  const server = await import(new URL('./server.mjs', import.meta.url));
  await server.install(page, { data, spec, bridge });
}

/** One browser context per spec: 1440x900 @2x (or spec.viewport), UTC, fixed clock, seeded Math.random, no service workers. */
export async function openHuf(spec, browser) {
  const own = !browser; browser = browser || await launch();
  const ctx = await browser.newContext({ viewport: spec.viewport || VIEWPORT, deviceScaleFactor: 2, locale: 'en-US', timezoneId: 'UTC', serviceWorkers: 'block' });
  await ctx.addInitScript(() => { let s = 42; Math.random = () => (s = (s * 16807) % 2147483647) / 2147483647; });
  const page = await ctx.newPage(); page.setDefaultTimeout(15000);
  if (process.env.HUF_DESKTOP_DEBUG) { page.on('console', (m) => console.log('[console]', m.type(), m.text().slice(0, 300))); page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 300))); page.on('requestfailed', (r) => console.log('[reqfail]', r.url().slice(0, 160))); }
  await page.clock.setFixedTime(new Date(spec.time || FIXED_TIME));
  await mountApp(page, spec);
  return { browser, ctx, page, own };
}

/**
 * Open a renderer route. `route` is what follows the origin: '#/chat/NW-CONV-0001', '#/settings/agents', or
 * 'approval/index.html' for the approval panel window. Dark = what the real app does (prefers-color-scheme drives
 * theme-boot.js and appearance.get; html gets class "dark" + data-theme="dark").
 */
export async function goHuf(page, route, { waitFor, dark = false } = {}) {
  await page.emulateMedia({ colorScheme: dark ? 'dark' : 'light' });
  const url = ORIGIN + '/' + (route.startsWith('#') ? 'index.html' + route : route.replace(/^\//, ''));
  await page.goto('about:blank');
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.evaluate((d) => { const r = document.documentElement; r.classList.toggle('dark', d); if (d) r.dataset.theme = 'dark'; else delete r.dataset.theme; r.style.colorScheme = d ? 'dark' : ''; if (!r.getAttribute('style')) r.removeAttribute('style'); }, dark);
  if (waitFor) await page.waitForSelector(waitFor, { timeout: 15000 });
  await page.waitForSelector('.animate-spin', { state: 'detached', timeout: 6000 }).catch(() => {});
  await page.evaluate(({ css }) => {
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '/__kit/tokens/css/huf-desktop/huf-desktop-fonts.css'; l.dataset.uikit = '1'; document.head.appendChild(l);
    const s = document.createElement('style'); s.dataset.uikit = '1'; s.textContent = css; document.head.appendChild(s);
    return new Promise((res, rej) => { l.onload = res; l.onerror = () => rej(new Error('huf-desktop-fonts.css failed to load')); });
  }, { css: FREEZE_CSS });
  await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.fonts].filter((f) => f.status !== 'loaded').map((f) => f.load().catch(() => {}))); });
  await page.waitForTimeout(300);
}

/** Map the stylesheets the live page loaded to kit token files (tokens/css/huf-desktop/<build>/<file>). */
export async function liveCss(page) {
  const hrefs = await page.evaluate(() => [...document.styleSheets].map((s) => s.href).filter(Boolean));
  const out = [];
  for (const h of hrefs) { const p = new URL(h).pathname; if (p.startsWith('/__kit/')) continue;
    const f = `huf-desktop/build/${path.basename(p)}`;
    if (!fs.existsSync(path.join(ROOT, 'tokens/css', f))) throw new Error(`stylesheet ${p} not in tokens: run node scripts/huf-desktop/tokens.mjs`);
    out.push(f); }
  out.push('huf-desktop/huf-desktop-fonts.css');
  return out;
}
