// Screenshots every la-workspace variant (pages/la/shots/) and a ref|ours compare for the default variant. Also writes pixel-box targets (pages/la/la-workspace.targets.json).
import fs from 'fs'; import { chromium } from 'playwright'; import { VARIANTS } from './la-build-workspace.mjs';
const ROOT = new URL('..', import.meta.url).pathname; const REF = process.env.LA_REF || '/Users/safwan/Code/LoyalArrow/dumps/screenshots/ux-after-r1/la-workspace__desktop-%T.png';
fs.mkdirSync(ROOT + 'pages/la/shots', { recursive: true }); const b = await chromium.launch(); const targets = { id: 'la-workspace', viewport: { w: 1440, h: 900 }, variants: {}, interactions: [
  { kind: 'count-up', targets: ['la-workspace.kpi-1.value', 'la-workspace.kpi-2.value', 'la-workspace.kpi-3.value', 'la-workspace.kpi-4.value'], note: 'interpolate the value text 0 -> populated value (variant populated); tabular-nums keeps width stable' },
  { kind: 'draw-in', targets: ['la-chart-line.line-a'], drive: '--la-progress on #la-chart-line root 0..1 (stroke-dashoffset); bars: --la-progress on la-chart-bar root scales heights' },
  { kind: 'range-change', targets: ['la-workspace.chart-1.range', 'la-workspace.chart-1.menu', 'la-workspace.chart-1.opt-1', 'la-workspace.chart-1.opt-3'], note: 'cursor to range chip, open (variant range-open shows the menu), click an option, redraw chart' },
  { kind: 'highlight', targets: ['la-workspace.today', 'la-workspace.quick-actions', 'la-workspace.trends', 'la-workspace.recent'] }] };
for (const v of Object.keys(VARIANTS)) {
  const name = 'la-workspace' + (v ? '.' + v : ''); const c = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); const p = await c.newPage(); await p.goto('file://' + ROOT + `pages/la/${name}.html`); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: ROOT + `pages/la/shots/${name}.png` });
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), box: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } }; }));
  const ids = boxes.map(x => x.id); const dup = ids.filter((x, i) => ids.indexOf(x) !== i); if (dup.length) { console.error('DUP data-ui', name, dup); process.exitCode = 1; }
  targets.variants[v || 'default'] = { file: `pages/la/${name}.html`, screenshot: `pages/la/shots/${name}.png`, targets: boxes }; await c.close();
}
fs.writeFileSync(ROOT + 'pages/la/la-workspace.targets.json', JSON.stringify(targets, null, 1)); await b.close(); console.log('ok', Object.keys(VARIANTS).length, 'variants');
