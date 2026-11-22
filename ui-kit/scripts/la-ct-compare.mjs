// Counter-app component compare: render each state (JS-off, 1x) and write compare.<state>.png = ours | reference (refs/<state>.png) | diff, with % of pixels differing.
//   node scripts/la-ct-compare.mjs <folder> [...]
import fs from 'fs'; import { chromium } from 'playwright'; import { renderLa, laMeta } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const b = await chromium.launch(); const ids = process.argv.slice(2);
for (const id of ids) {
  const dir = ROOT + 'components/la/' + id + '/'; const meta = laMeta(id); const vp = meta.viewport;
  for (const st of meta.states) {
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, javaScriptEnabled: false }); const p = await ctx.newPage();
    const f = dir + `.tmp-${st}.html`; fs.writeFileSync(f, renderLa(id, { state: st })); await p.goto('file://' + f); const ours = await p.screenshot(); fs.unlinkSync(f); await ctx.close();
    const ref = dir + `refs/${st}.png`; if (!fs.existsSync(ref)) { console.log(id, st, 'no reference'); continue; }
    const jp = await (await b.newContext({ viewport: { width: vp.w * 3, height: vp.h } })).newPage(); await jp.setContent(`<body style="margin:0"><canvas id=o></canvas></body>`);
    const r = await jp.evaluate(async ([a, rr, w, h]) => { const L = s => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.src = 'data:image/png;base64,' + s; });
      const [A, B] = await Promise.all([L(a), L(rr)]); const c = document.getElementById('o'); c.width = w * 3; c.height = h; const x = c.getContext('2d'); x.drawImage(A, 0, 0, w, h); x.drawImage(B, w, 0, w, h);
      const t = document.createElement('canvas'); t.width = w; t.height = h; const tx = t.getContext('2d'); tx.drawImage(A, 0, 0, w, h); const da = tx.getImageData(0, 0, w, h); tx.drawImage(B, 0, 0, w, h); const db = tx.getImageData(0, 0, w, h);
      let n = 0; for (let i = 0; i < da.data.length; i += 4) { const d = Math.abs(da.data[i] - db.data[i]) + Math.abs(da.data[i + 1] - db.data[i + 1]) + Math.abs(da.data[i + 2] - db.data[i + 2]); da.data[i] = da.data[i + 1] = da.data[i + 2] = 255 - Math.min(255, d * 2); da.data[i + 3] = 255; if (d > 60) n++; }
      x.putImageData(da, w * 2, 0); return { pct: +(100 * n / (w * h)).toFixed(2), url: c.toDataURL('image/png').split(',')[1] }; }, [ours.toString('base64'), fs.readFileSync(ref).toString('base64'), vp.w, vp.h]);
    fs.writeFileSync(dir + `compare.${st}.png`, Buffer.from(r.url, 'base64')); console.log(id, st, 'differing px (>60):', r.pct + '%');
  }
}
await b.close();
