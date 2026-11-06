import fs from 'fs'; import { chromium } from 'playwright'; import { PNG } from 'pngjs'; import pixelmatch from 'pixelmatch';
import { ROOT } from './lib.mjs';
const only = process.argv.slice(2); const LIM = 0.005;
const ids = fs.readdirSync(ROOT + 'components').filter(d => fs.existsSync(ROOT + `components/${d}/harness.json`) && (!only.length || only.includes(d)));
const browser = await chromium.launch(); let fail = 0; const report = {};
for (const id of ids) {
  const dir = ROOT + 'components/' + id + '/';
  for (const mode of ['light', 'dark', 'rtl']) { const dark = mode === 'dark';
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, javaScriptEnabled: false });
    const page = await ctx.newPage(); const reqs = [];
    page.on('request', r => { if (!r.url().startsWith('file:') && !r.url().startsWith('data:')) reqs.push(r.url()); });
    await page.goto('file://' + dir + (mode === 'light' ? 'preview.html' : `preview.${mode}.html`)); await page.evaluate?.(() => 0).catch(() => {});
    await page.waitForTimeout(300);
    const meta = JSON.parse(fs.readFileSync(dir + 'harness.json')); const buf = await (meta.clip ? (async () => { const bb = await page.locator('[data-ui="' + id + '"]').first().boundingBox(); const pd = meta.pad; return page.screenshot({ fullPage: true, clip: { x: Math.max(0, bb.x - pd.l), y: Math.max(0, bb.y - pd.t), width: meta.clip.w, height: meta.clip.h } }); })() : page.locator('[data-ui="' + id + '"]').first().screenshot()).catch((e) => { throw new Error('verify: component root not found/screenshot failed for ' + id + ': ' + e.message.split('\n')[0]); });
    const a = PNG.sync.read(buf), b = PNG.sync.read(fs.readFileSync(dir + (mode === 'light' ? 'screenshot.png' : `screenshot.${mode}.png`)));
    let pct, note = '';
    if (Math.abs(a.width - b.width) > 4 || Math.abs(a.height - b.height) > 4) { pct = 1; note = `size ${a.width}x${a.height} vs ${b.width}x${b.height}`; }
    else { const w = Math.min(a.width, b.width), h = Math.min(a.height, b.height); const crop = (p) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(p, o, 0, 0, w, h, 0, 0); return o; };
      const A = crop(a), B = crop(b); const d = new PNG({ width: w, height: h }); const n = pixelmatch(A.data, B.data, d.data, w, h, { threshold: 0.1 }); pct = n / (w * h) + Math.abs(a.width * a.height - b.width * b.height) / (w * h);
      if (pct > 0) fs.writeFileSync(dir + (mode === 'light' ? 'diff.png' : `diff.${mode}.png`), PNG.sync.write(d)); }
    const ok = pct <= LIM && !reqs.length; if (!ok) fail++;
    report[id + (mode === 'light' ? '' : ':' + mode)] = { diffPct: +(pct * 100).toFixed(3), ok, note, networkRequests: reqs.length };
    console.log(ok ? 'PASS' : 'FAIL', id + (mode === 'light' ? '' : ' (' + mode + ')'), (pct * 100).toFixed(3) + '%', note, reqs.slice(0, 2).join(','));
    await ctx.close();
  }
}
fs.writeFileSync(ROOT + 'verify-report.json', JSON.stringify(report, null, 2)); await browser.close(); process.exit(fail ? 1 : 0);
