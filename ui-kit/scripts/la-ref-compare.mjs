// Side-by-side: reference crop | our render, per component state. Output components/la/<id>/compare/<state>.<mode>.png
//   node scripts/la-ref-compare.mjs <spec.json>   spec = [{id,state,set,ref,clip:{x,y,w,h}, at:{x,y}}]  (ref relative to ROOT or absolute; at = where our root sits, default 16,16)
import fs from 'fs'; import { chromium } from 'playwright'; import { renderLa, laMeta } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')); const b = await chromium.launch();
for (const s of spec) { const dir = ROOT + 'components/la/' + s.id + '/compare/'; fs.mkdirSync(dir, { recursive: true });
  for (const [mode, o] of [['light', {}], ['dark', { theme: 'dark' }], ['rtl', { lang: 'ar' }], ['rtl-dark', { lang: 'ar', theme: 'dark' }], ...(s.currencies || []).map(c => ['cur-' + c, { currency: c, lang: 'ar' }])]) {
    const name = `${s.state}${s.tag ? '.' + s.tag : ''}.${mode}`; const f = dir + name + '.html'; fs.writeFileSync(f, renderLa(s.id, { ...o, state: s.state, set: mode === 'light' ? (s.set || {}) : (s.set?.size ? { size: s.set.size } : {}), cssBase: '../../../../tokens/css/' }));
    const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
    const box = await p.evaluate(() => { const r = document.querySelector('[data-ui]').getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; });
    const ours = await p.screenshot({ clip: { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: Math.min(390, box.w + 16), height: box.h + 16 } }); await p.close();
    if (mode !== 'light') { fs.writeFileSync(dir + name + '.png', ours); continue; }
    const c = s.clip; const q = await b.newPage({ viewport: { width: Math.ceil(c.w * 2 + 60), height: Math.ceil(c.h + 40) }, deviceScaleFactor: 1 });
    fs.writeFileSync(dir + name + '.cmp.html', `<body style="margin:0;background:#888;font:11px sans-serif;color:#fff"><div style="display:flex;gap:20px;padding:10px"><div>ref<div style="width:${c.w}px;height:${c.h}px;background:url(file://${s.ref}) -${c.x}px -${c.y}px no-repeat"></div></div><div>ours<img src="data:image/png;base64,${ours.toString('base64')}"></div></div>`); await q.goto('file://' + dir + name + '.cmp.html');
    await q.screenshot({ path: dir + name + '.png' }); await q.close(); }
  console.log('compare', s.id, s.state); }
await b.close();
