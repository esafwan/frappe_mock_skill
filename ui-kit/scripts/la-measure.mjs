// Capture hook for LA components: render light/dark/rtl, screenshot, write measurements.json with pixel boxes of every [data-ui].
//   node scripts/la-measure.mjs [id ...]      (no ids = all in components/la/)
import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright';
import { renderLa, laComponents, laMeta, laStates } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const ids = process.argv.slice(2).length ? process.argv.slice(2) : laComponents();
const browser = await chromium.launch(); let bad = 0;
for (const id of ids) {
  const dir = ROOT + 'components/la/' + id + '/'; const meta = laMeta(id); const vp = meta.viewport || { w: 1440, h: 900 }; const out = { id: meta.id, viewport: vp, modes: {} };
  const stRuns = (meta.states || []).slice(1).map(st => ['state-' + st, { state: st }]);
  for (const [mode, o] of [['light', {}], ['dark', { theme: 'dark' }], ['rtl', { lang: 'ar' }], ...stRuns]) {
    const f = dir + `preview${mode === 'light' ? '' : '.' + mode.replace('state-', '')}.html`; fs.writeFileSync(f, renderLa(id, { ...o, in: meta.kind === 'shell' ? undefined : meta.shell === false ? undefined : (fs.existsSync(ROOT + 'components/la/shell') && meta.shell ? 'shell' : undefined) }));
    const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2, javaScriptEnabled: false });   // JS off: proves JS-free
    const jsCtx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 });
    const p = await jsCtx.newPage(); await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
    const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), tag: e.tagName.toLowerCase(), x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }; }));
    const ids2 = boxes.map(b => b.id); if (new Set(ids2).size !== ids2.length) { bad++; console.log('DUPLICATE data-ui in', id, mode); }
    if (!boxes.some(b => b.id === meta.id)) { bad++; console.log('root data-ui', meta.id, 'missing'); }
    out.modes[mode] = boxes; await p.screenshot({ path: dir + `screenshot${mode === 'light' ? '' : '.' + mode.replace('state-', '')}.png` }); await ctx.close(); await jsCtx.close();
  }
  for (const st of (meta.states || []).slice(1).concat(meta.states?.length ? [meta.states[0]] : [])) for (const th of ['light', 'dark']) {   // per-state shots
    const f = dir + `preview.state-${st}.${th}.html`; fs.writeFileSync(f, renderLa(id, { state: st, theme: th }));
    const p = await browser.newPage({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 }); await p.goto('file://' + f); await p.screenshot({ path: dir + `screenshot.state-${st}.${th}.png` }); await p.close();
  }
  // one screenshot per state (light), plus dark+rtl of every state, as screenshot.state-<name>[.dark|.rtl].png
  for (const st of Object.keys(laStates(id))) for (const [mode, o] of [['light', {}], ['dark', { theme: 'dark' }], ['rtl', { lang: 'ar' }]]) {
    const f = dir + `preview.state-${st}${mode === 'light' ? '' : '.' + mode}.html`; fs.writeFileSync(f, renderLa(id, { ...o, state: st, in: meta.shell && meta.kind !== 'shell' ? 'shell' : undefined }));
    const c = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 2 }); const p = await c.newPage(); await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: dir + `screenshot.state-${st}${mode === 'light' ? '' : '.' + mode}.png` }); await c.close();
  }
  fs.writeFileSync(dir + 'measurements.json', JSON.stringify(out, null, 1)); console.log('measured', id, out.modes.light.length, 'targets');
}
await browser.close(); process.exit(bad ? 1 : 0);
