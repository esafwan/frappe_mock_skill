// Perceptual diff of every huf-ios screen vs the simulator reference PNG (systems/huf-ios/ref/<state>.<theme>.png, 1206x2622 = 402x874 @3x).
// Both images are box-downsampled to 402x874, blurred (3x3 x2) so glyph-level differences (Inter vs SF) vanish, then a pixel counts as
// different when any channel differs by > 26/255. Status bar (top 54 pt) is masked; Arabic text regions of the refs (app language leaked
// into the capture) are masked per state. Usage: node scripts/huf-mobile/compare-ref.mjs [states...] [--dark]; report: systems/huf-ios/ref-compare.json
import fs from 'fs'; import { PNG } from 'pngjs'; import { chromium } from 'playwright'; import { ROOT, launch } from '../lib.mjs';
const args = process.argv.slice(2); const dark = args.includes('--dark'); const only = args.filter((a) => !a.startsWith('--'));
const refDir = ROOT + 'systems/huf-ios/ref/'; const states = JSON.parse(fs.readFileSync(refDir + 'index.json')).filter((r) => r.theme === 'light').map((r) => r.state).filter((s) => !only.length || only.includes(s));
const ARABIC_COMPOSER = [70, 786, 330, 836]; const CHAT = ['chat', 'rich-content', 'dashboard', 'agent-switcher', 'attach', 'upload', 'uploading', 'busy', 'draft', 'whitespace', 'no-files', 'disabled-agent', 'empty'];
const MASK = { you: [[0, 100, 402, 874]], computers: [[0, 100, 402, 874]], projects: [[60, 460, 330, 700]], dashboard: [[0, 54, 402, 600]], 'disabled-agent': [[0, 700, 402, 780]] };
const load = (b) => PNG.sync.read(b);
const down = (p, f) => { const w = Math.floor(p.width / f), h = Math.floor(p.height / f); const o = new Float32Array(w * h * 3); for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) for (let c = 0; c < 3; c++) { let s = 0; for (let j = 0; j < f; j++) for (let i = 0; i < f; i++) s += p.data[((y * f + j) * p.width + x * f + i) * 4 + c]; o[(y * w + x) * 3 + c] = s / (f * f); } return { w, h, d: o }; };
const blur = (im) => { const o = new Float32Array(im.d.length); for (let y = 0; y < im.h; y++) for (let x = 0; x < im.w; x++) for (let c = 0; c < 3; c++) { let s = 0, n = 0; for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { const xx = x + i, yy = y + j; if (xx < 0 || yy < 0 || xx >= im.w || yy >= im.h) continue; s += im.d[(yy * im.w + xx) * 3 + c]; n++; } o[(y * im.w + x) * 3 + c] = s / n; } return { ...im, d: o }; };
const browser = await launch(); const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 }); const page = await ctx.newPage();
const report = {}; const outDir = ROOT + 'systems/huf-ios/.compare/'; fs.mkdirSync(outDir, { recursive: true });
for (const st of states) {
  const id = 'huf-ios-screen-' + st; const f = ROOT + `components/${id}/preview${dark ? '.dark' : ''}.html`; if (!fs.existsSync(f)) { report[st] = { error: 'missing preview' }; continue; }
  await page.goto('file://' + f); await page.evaluate(() => document.fonts.ready);
  const mine = load(await page.locator(`[data-ui="${id}"]`).first().screenshot()); const ref = load(fs.readFileSync(refDir + `${st}.${dark ? 'dark' : 'light'}.png`));
  const a = blur(blur(down(mine, 3))), b = blur(blur(down(ref, 3)));
  const masks = [[0, 0, 402, 54], ...(MASK[st] || [])]; if (CHAT.includes(st)) masks.push(ARABIC_COMPOSER);
  const masked = (x, y) => masks.some(([x0, y0, x1, y1]) => x >= x0 && x < x1 && y >= y0 && y < y1);
  let bad = 0, tot = 0; const diff = new PNG({ width: a.w, height: a.h });
  for (let y = 0; y < a.h; y++) for (let x = 0; x < a.w; x++) { const i = (y * a.w + x); const m = masked(x, y); let mx = 0; for (let c = 0; c < 3; c++) mx = Math.max(mx, Math.abs(a.d[i * 3 + c] - b.d[i * 3 + c])); const d = !m && mx > 26; if (!m) tot++; if (d) bad++; diff.data.set(m ? [128, 128, 255, 255] : d ? [255, 0, 0, 255] : [Math.round(b.d[i * 3]), Math.round(b.d[i * 3 + 1]), Math.round(b.d[i * 3 + 2]), 255], i * 4); }
  fs.writeFileSync(outDir + `${st}${dark ? '.dark' : ''}.diff.png`, PNG.sync.write(diff));
  report[st] = { diffPct: +(bad / tot * 100).toFixed(2), maskedRegionsPt: masks.length - 1, note: ['you', 'computers'].includes(st) ? 'ref is Arabic/RTL (body masked); only layout of title area compared' : undefined };
  console.log(st.padEnd(16), report[st].diffPct + '%');
}
const vals = Object.values(report).filter((r) => r.diffPct != null).map((r) => r.diffPct);
const outFile = ROOT + 'systems/huf-ios/ref-compare.json'; let prev = {}; try { prev = JSON.parse(fs.readFileSync(outFile)); } catch {}
const key = dark ? 'dark' : 'light'; prev[key] = { method: 'box-downsample to 402x874, 2x 5x5 blur, channel delta > 26/255, status bar + Arabic regions masked', screens: { ...(prev[key]?.screens || {}), ...report } };
prev[key].mean = +(Object.values(prev[key].screens).map((r) => r.diffPct).filter((x) => x != null).reduce((s, x, _, a) => s + x / a.length, 0)).toFixed(2); prev[key].over8 = Object.entries(prev[key].screens).filter(([, r]) => r.diffPct > 8).map(([k]) => k);
fs.writeFileSync(outFile, JSON.stringify(prev, null, 2)); await browser.close();
