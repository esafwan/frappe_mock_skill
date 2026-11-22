// Pixel boxes + 1x screenshots for every retail-experiments variant (JS off proves JS-free). Writes pages/la/retail-experiments.manifest.json and pages/la/shots/retail-experiments*.png
import fs from 'fs'; import { chromium } from 'playwright'; import { ROOT } from './lib.mjs';
const page = JSON.parse(fs.readFileSync(ROOT + 'pages/la/retail-experiments.page.json')); const b = await chromium.launch(); const out = { id: page.id, system: page.system, viewport: page.viewport, variants: {} }; let bad = 0;
fs.mkdirSync(ROOT + 'pages/la/shots', { recursive: true });
for (const f of page.variants) { const c = await b.newContext({ viewport: { width: page.viewport.w, height: page.viewport.h }, deviceScaleFactor: 1, javaScriptEnabled: false }); const p = await c.newPage(); await p.goto('file://' + ROOT + 'pages/la/' + f);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) { bad++; console.log('duplicate data-ui in', f); }
  out.variants[f] = boxes; await p.screenshot({ path: ROOT + 'pages/la/shots/' + f.replace('.html', '.png') }); await c.close(); }
fs.writeFileSync(ROOT + 'pages/la/retail-experiments.manifest.json', JSON.stringify(out, null, 1)); await b.close(); console.log('measured', page.variants.length, 'variants, dup errors:', bad); process.exit(bad ? 1 : 0);
