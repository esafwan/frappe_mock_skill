// huf-android: render screenshots of components/screens and compare screens to emulator refs.
//   node scripts/huf-mobile/compare-android.mjs shots [ids...]     -> components/<id>/screenshot{,.dark}.png (DPR 2, root element)
//   node scripts/huf-mobile/compare-android.mjs compare [ids...]   -> systems/huf-android/ref-compare.json (+ /tmp side-by-sides in $CMP_OUT)
import fs from 'fs'; import { chromium } from 'playwright'; import { PNG } from 'pngjs'; import pixelmatch from 'pixelmatch';
const ROOT = new URL('../../', import.meta.url).pathname;
const [mode, ...only] = process.argv.slice(2);
const { specs } = await import('../specs-huf-android.mjs');
const sel = specs.filter((s) => !only.length || only.includes(s.id));
const launch = async () => { try { return await chromium.launch(); } catch { return chromium.launch({ executablePath: process.env.CHROME_PATH }); } };
const browser = await launch();
const out = process.env.CMP_OUT || '/tmp/huf-android-cmp'; fs.mkdirSync(out, { recursive: true });
async function shot(s, dark, dpr) {
  const ctx = await browser.newContext({ viewport: { width: 412, height: 892 }, deviceScaleFactor: dpr, javaScriptEnabled: false });
  const p = await ctx.newPage(); await p.goto('file://' + ROOT + `components/${s.id}/preview${dark ? '.dark' : ''}.html`); await p.waitForTimeout(150);
  const b = await p.locator(`[data-ui="${s.id}"]`).first().screenshot(); await ctx.close(); return b;
}
if (mode === 'shots') {
  for (const s of sel) for (const d of [false, true]) fs.writeFileSync(ROOT + `components/${s.id}/screenshot${d ? '.dark' : ''}.png`, await shot(s, d, 2));
  console.log('shots', sel.length * 2);
} else {
  const rp = ROOT + 'systems/huf-android/ref-compare.json'; let rep = {}; try { rep = JSON.parse(fs.readFileSync(rp)); } catch {}
  for (const s of sel.filter((x) => x.screen)) {
    if (!s.ref) { rep[s.id] = { ref: null, note: 'authored from Compose source; no emulator reference' }; continue; }
    rep[s.id] = {};
    for (const [m, refp] of Object.entries(s.ref)) {
      if (!refp || !fs.existsSync(ROOT + refp)) continue;
      const R = PNG.sync.read(fs.readFileSync(ROOT + refp));
      const A = PNG.sync.read(await shot(s, m === 'dark', R.width / 412));
      const w = Math.min(A.width, R.width), h = Math.min(A.height, R.height);
      const crop = (p) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(p, o, 0, 0, w, h, 0, 0); return o; };
      const a = crop(A), r = crop(R), d = new PNG({ width: w, height: h });
      const n = pixelmatch(a.data, r.data, d.data, w, h, { threshold: 0.2 });
      // layout-tolerant score: compare 6x6 px block means (ignores antialiasing / 1-2 px shifts)
      let blk = 0, tot = 0; const B = 8;
      for (let y = 0; y + B <= h; y += B) for (let x = 0; x + B <= w; x += B) { let da = 0; for (let c = 0; c < 3; c++) { let sa = 0, sr = 0; for (let j = 0; j < B; j += 2) for (let i = 0; i < B; i += 2) { const o = ((y + j) * w + x + i) * 4 + c; sa += a.data[o]; sr += r.data[o]; } da = Math.max(da, Math.abs(sa - sr) / 16); } tot++; if (da > 24) blk++; }
      rep[s.id][m] = { pixelDiffPct: +(n / (w * h) * 100).toFixed(2), blockDiffPct: +(blk / tot * 100).toFixed(2), size: [A.width, A.height, R.width, R.height] };
      const sbs = new PNG({ width: w * 3, height: h }); PNG.bitblt(a, sbs, 0, 0, w, h, 0, 0); PNG.bitblt(r, sbs, 0, 0, w, h, w, 0); PNG.bitblt(d, sbs, 0, 0, w, h, w * 2, 0);
      fs.writeFileSync(`${out}/${s.id}.${m}.png`, PNG.sync.write(sbs));
      console.log(s.id, m, rep[s.id][m].pixelDiffPct + '% px', rep[s.id][m].blockDiffPct + '% blk');
    }
  }
  fs.writeFileSync(rp, JSON.stringify(rep, null, 1));
}
await browser.close();
