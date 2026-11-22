// Pixel check of an LA component against its real-screenshot reference crop (component.json "reference").
//   node scripts/la-compare.mjs <id> [state] [--shots DIR] [--save]    -> components/la/<id>/compare[.state].<theme>.png  (reference | render | diff) + mismatch %
// --save also writes the 1x reference crop to components/la/<id>/reference.<theme>.png (inputs are seeded synthetic screenshots; kept downscaled to the crop only).
import fs from 'fs'; import { chromium } from 'playwright'; import { renderLa, laMeta } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const a = process.argv.slice(2); const id = a[0]; const state = a[1] && !a[1].startsWith('--') ? a[1] : undefined;
const shots = a.includes('--shots') ? a[a.indexOf('--shots') + 1] : (process.env.LA_SHOTS || '/Users/safwan/Code/LoyalArrow/dumps/screenshots');
const dir = ROOT + 'components/la/' + id + '/'; const meta = laMeta(id); const ref = meta.reference; const [cx, cy, cw, ch] = ref.crop;
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] }); let worst = 0;
for (const theme of ['light', 'dark']) {
  const src = (fs.existsSync(dir + `reference.${theme}.png`) && !a.includes('--save')) ? dir + `reference.${theme}.png` : `${shots}/${ref.src.replace('{theme}', theme)}`;
  const crop = src.includes('reference.') ? '' : `background-position:${-cx}px ${-cy}px;`;
  const rp = await browser.newPage({ viewport: { width: cw, height: ch } });
  const rf = dir + `.ref.${theme}.html`; fs.writeFileSync(rf, `<body style="margin:0"><div id=r style="width:${cw}px;height:${ch}px;background:url('file://${src}') no-repeat;${crop}"></div></body>`); await rp.goto('file://' + rf); await rp.waitForTimeout(200);
  const refPng = dir + `reference.${theme}.png`; if (a.includes('--save') || !fs.existsSync(refPng)) await rp.screenshot({ path: refPng });
  fs.unlinkSync(rf);
  const html = renderLa(id, { theme, state, in: meta.shell ? 'shell' : undefined }); const f = dir + `.cmp.${theme}.html`; fs.writeFileSync(f, html);
  const p = await browser.newPage({ viewport: { width: meta.viewport.w, height: meta.viewport.h } }); await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
  const rend = await p.screenshot(); fs.unlinkSync(f);
  const cp = await browser.newPage({ viewport: { width: cw * 3 + 20, height: ch + 10 } });
  const b64 = (b) => 'data:image/png;base64,' + b.toString('base64');
  await cp.setContent(`<body style="margin:0;background:#888"><canvas id=c width=${cw * 3 + 20} height=${ch}></canvas><img id=a src="${b64(fs.readFileSync(refPng))}"><img id=b src="${b64(rend)}"></body>`); await cp.waitForTimeout(150);
  const stat = await cp.evaluate(async () => { const A = document.getElementById('a'), B = document.getElementById('b'); await A.decode(); await B.decode(); const w = A.naturalWidth, h = A.naturalHeight; const c = document.getElementById('c'), x = c.getContext('2d');
    x.drawImage(A, 0, 0); x.drawImage(B, w + 10, 0); const da = x.getImageData(0, 0, w, h).data, db = x.getImageData(w + 10, 0, w, h).data; const o = x.createImageData(w, h); let bad = 0;
    for (let i = 0; i < da.length; i += 4) { const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2])); const hit = d > 40; if (hit) bad++; o.data[i] = hit ? 255 : 255 - d; o.data[i + 1] = hit ? 0 : 255 - d; o.data[i + 2] = hit ? 0 : 255 - d; o.data[i + 3] = 255; }
    x.putImageData(o, 2 * w + 20, 0); return { pct: +(100 * bad / (w * h)).toFixed(2) }; });
  const out = dir + `compare${state ? '.' + state : ''}.${theme}.png`; await (await cp.$('canvas')).screenshot({ path: out }); worst = Math.max(worst, stat.pct);
  console.log(id, state || 'default', theme, 'mismatch', stat.pct + '%', '->', out.replace(ROOT, ''));
}
await browser.close();
