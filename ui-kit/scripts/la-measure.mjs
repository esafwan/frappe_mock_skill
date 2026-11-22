// Capture hook for LA components: render light/dark/rtl, screenshot, write measurements.json with pixel boxes of every [data-ui].
//   node scripts/la-measure.mjs [id ...]      (no ids = all in components/la/)
import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright';
import { renderLa, laComponents, laMeta } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : laComponents();
const browser = await chromium.launch(); let bad = 0;
for (const id of ids) {
  const dir = ROOT + 'components/la/' + id + '/'; const meta = laMeta(id); const vp = meta.viewport || { w: 1440, h: 900 }; const out = { id: meta.id, viewport: vp, modes: {} };
  for (const [mode, o] of [['light', {}], ['dark', { theme: 'dark' }], ['rtl', { lang: 'ar' }]]) {
    const f = dir + `preview${mode === 'light' ? '' : '.' + mode}.html`; fs.writeFileSync(f, renderLa(id, { ...o, in: meta.kind === 'shell' ? undefined : meta.shell === false ? undefined : (fs.existsSync(ROOT + 'components/la/shell') && meta.shell ? 'shell' : undefined) }));
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2, javaScriptEnabled: false });   // JS off: proves JS-free
    const jsCtx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 });
    const p = await jsCtx.newPage(); await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
    const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), tag: e.tagName.toLowerCase(), x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }; }));
    const ids2 = boxes.map(b => b.id); if (new Set(ids2).size !== ids2.length) { bad++; console.log('DUPLICATE data-ui in', id, mode); }
    if (!boxes.some(b => b.id === meta.id)) { bad++; console.log('root data-ui', meta.id, 'missing'); }
    out.modes[mode] = boxes; await p.screenshot({ path: dir + `screenshot${mode === 'light' ? '' : '.' + mode}.png` }); await ctx.close(); await jsCtx.close();
  }
  fs.writeFileSync(dir + 'measurements.json', JSON.stringify(out, null, 1)); console.log('measured', id, out.modes.light.length, 'targets');
}
await browser.close(); process.exit(bad ? 1 : 0);
