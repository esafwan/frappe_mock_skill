// Geometry gate: every visible [data-ui] slot has nonzero area; no horizontal overflow. Usage: node tests/geometry.mjs [files...]  (default out/**.html at 1440x900; mobile documents at 375x812)
import fs from 'node:fs'; import path from 'node:path'; import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { loadSpec, renderSpec } from '../bin/mock.mjs';
const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// default run: render every samples/*.json first so no sample is left ungated
if (!process.argv.slice(2).length) {
  fs.mkdirSync(path.join(KIT, 'out', 'slice4'), { recursive: true });
  for (const f of fs.readdirSync(path.join(KIT, 'samples')).filter((n) => n.endsWith('.json')).sort()) {
    const outFile = path.join(KIT, 'out', 'slice4', path.basename(f, '.json') + '.html');
    fs.writeFileSync(outFile, (await renderSpec(loadSpec(path.join(KIT, 'samples', f)), { outFile })).html);
  }
}
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'out');
const DEFAULT_DIR = path.join(root, 'slice4'); // default run gates the freshly rendered set only (older out/slice* folders are frozen history)
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? (e.name === 'node_modules' ? [] : walk(path.join(d, e.name))) : e.name.endsWith('.html') ? [path.join(d, e.name)] : []) : [];
const files = (process.argv.slice(2).length ? process.argv.slice(2).map((f) => path.resolve(f)) : walk(DEFAULT_DIR)).sort();
let b; try { b = await chromium.launch(); } catch { b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); }
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
const bad = [];
for (const f of files) {
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto('file://' + f); await p.waitForTimeout(200);
  // mobile documents are checked at phone width
  if (await p.evaluate(() => document.body.classList.contains('mobile-view'))) { await p.setViewportSize({ width: 375, height: 812 }); await p.waitForTimeout(150); }
  const r = await p.evaluate(() => {
    const out = { slots: 0, empty: [], over: [] };
    for (const el of document.querySelectorAll('[data-ui]')) {
      out.slots++; const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || el.hidden || (el.checkVisibility && !el.checkVisibility()) || el.closest('[data-state="closed"]')) continue; // closed off-canvas drawer is intentionally empty
      const r = el.getBoundingClientRect();
      if (!(r.width > 0 && r.height > 0)) out.empty.push(el.getAttribute('data-ui'));
    }
    const de = document.documentElement;
    if (de.scrollWidth > de.clientWidth + 1) out.over.push(`document ${de.scrollWidth}>${de.clientWidth}`);
    const rv = document.querySelector('[data-ui="report-view"]'), area = document.querySelector('.layout-main-section');
    if (rv && area && rv.getBoundingClientRect().width < area.getBoundingClientRect().width * 0.95) out.over.push(`report width ${Math.round(rv.getBoundingClientRect().width)} < 95% of content area ${Math.round(area.getBoundingClientRect().width)}`);
    return out;
  });
  const rel = path.relative(root, f);
  if (r.empty.length) bad.push(`${rel}: zero-area [data-ui] ${[...new Set(r.empty)].slice(0, 8).join(', ')}`);
  for (const o of r.over) bad.push(`${rel}: horizontal overflow ${o}`);
}
await b.close();
console.log(`geometry: ${files.length} files, ${bad.length} problems`);
for (const x of bad) console.log('  FAIL ' + x);
process.exit(bad.length ? 1 : 0);
