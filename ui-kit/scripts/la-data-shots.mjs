// Render every state x theme x lang of the LA data components with headless Chrome; screenshot each; write
// components/la/<id>/screenshot.<state>.<light|dark|rtl>.png and a side-by-side vs reference crop (compare.<id>.png, 1x) when --ref is given.
//   node scripts/la-data-shots.mjs [ids] [--outdir dir]
import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright'; import { renderLa, laMeta } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const a = process.argv.slice(2); const od = a.includes('--outdir') ? a[a.indexOf('--outdir') + 1] : null; const ids = a.filter((x, i) => !x.startsWith('--') && a[i - 1] !== '--outdir'); const list = ids.length ? ids : ['heat-table', 'cat-heat-grid', 'report-table', 'empty-state'];
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); let n = 0;
for (const id of list) { const m = laMeta(id); const dir = ROOT + 'components/la/' + id + '/';
  for (const st of m.states) for (const [mode, o] of [['light', {}], ['dark', { theme: 'dark' }], ['rtl', { lang: 'ar' }]]) {
    const f = dir + `preview.state-${st}.${mode}.html`; fs.writeFileSync(f, renderLa(id, { ...o, state: st, in: 'shell' })); await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
    await p.screenshot({ path: (od || dir) + `/screenshot.state-${st}.${mode}.png`.replace('//', '/') }); n++; } }
await b.close(); console.log('shots', n);
