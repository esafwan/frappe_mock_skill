// Pixel compare of a rendered LA page variant vs a real screenshot, restricted to the body region (shell excluded by default).
//   node scripts/la-page-compare.mjs <pageFile> <refPng> [x y w h]   -> <pageFile>.compare.png (ref | render | diff) + mismatch %
import fs from 'fs'; import { chromium } from 'playwright'; import { ROOT } from './lib.mjs';
const [pf, rp, ...r] = process.argv.slice(2); const [x, y, w, h] = r.length ? r.map(Number) : [281, 48, 1159, 852];
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto('file://' + ROOT + pf); await p.evaluate(() => document.fonts.ready);
const shot = (await p.screenshot()).toString('base64'); const ref = fs.readFileSync(rp).toString('base64'); const c = await b.newPage({ viewport: { width: w * 3 + 20, height: h } });
await c.setContent(`<body style="margin:0"><canvas id=c width=${w * 3 + 20} height=${h}></canvas><img id=a src="data:image/png;base64,${ref}"><img id=b src="data:image/png;base64,${shot}"></body>`);
const pct = await c.evaluate(async ([x, y, w, h]) => { const A = document.getElementById('a'), B = document.getElementById('b'); await A.decode(); await B.decode(); const k = document.getElementById('c').getContext('2d'); const s = A.naturalWidth / 1440;
  k.drawImage(A, x * s, y * s, w * s, h * s, 0, 0, w, h); k.drawImage(B, x, y, w, h, w + 10, 0, w, h); const da = k.getImageData(0, 0, w, h).data, db = k.getImageData(w + 10, 0, w, h).data, o = k.createImageData(w, h); let bad = 0;
  for (let i = 0; i < da.length; i += 4) { const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])); const hit = d > 40; if (hit) bad++; o.data[i] = hit ? 255 : 255 - d; o.data[i + 1] = hit ? 0 : 255 - d; o.data[i + 2] = hit ? 0 : 255 - d; o.data[i + 3] = 255; } k.putImageData(o, 2 * w + 20, 0); return +(100 * bad / (w * h)).toFixed(2); }, [x, y, w, h]);
await (await c.$('canvas')).screenshot({ path: ROOT + pf.replace(/\.html$/, '.compare.png') }); console.log(pf, 'mismatch', pct + '%'); await b.close();
