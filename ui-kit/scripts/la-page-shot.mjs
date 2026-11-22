// node scripts/la-page-shot.mjs rpt-cohorts [refpng]  -> pages/la/shots/<variant>.png (1x) + manifest boxes pages/la/<page>.targets.json
import fs from 'fs'; import { chromium } from 'playwright';
const ROOT = new URL('..', import.meta.url).pathname; const page = process.argv[2]; const ref = process.argv[3];
const b = await chromium.launch(); const files = fs.readdirSync(ROOT + 'pages/la').filter(f => f.startsWith(page) && f.endsWith('.html')); const targets = {};
for (const f of files) { const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto('file://' + ROOT + 'pages/la/' + f); await p.evaluate(() => document.fonts.ready);
  const name = f.replace('.html', ''); const full = name.endsWith('.tall');
  await p.screenshot({ path: ROOT + `pages/la/shots/${name}.png`, fullPage: full });
  targets[name] = await p.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return [e.dataset.ui, [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]]; })));
  await p.close(); }
fs.writeFileSync(ROOT + `pages/la/${page}.targets.json`, JSON.stringify(targets));
if (ref) { const p = await b.newPage({ viewport: { width: 2900, height: 910 } }); fs.writeFileSync(ROOT + `pages/la/shots/${page}.compare.html`, `<body style="margin:0;display:flex"><img src="file://${ref}" width=1440><img src=".png" width=1440>`); await p.goto('file://' + ROOT + `pages/la/shots/${page}.compare.html`); await p.screenshot({ path: ROOT + `pages/la/shots/${page}.compare.png` }); }
await b.close();
