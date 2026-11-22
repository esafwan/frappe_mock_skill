// ref | ours | diff for la-workspace (default variant, light and dark). Prints mismatch ratio per region.
import fs from 'fs'; import { chromium } from 'playwright'; import { PNG } from 'pngjs'; import pixelmatch from 'pixelmatch';
const ROOT = new URL('..', import.meta.url).pathname; const REF = '/Users/safwan/Code/LoyalArrow/dumps/screenshots/ux-after-r1/la-workspace__desktop-%T.png';
const b = await chromium.launch(); const regions = { shell: [0, 0, 1440, 48], sidebar: [0, 48, 281, 852], today: [429, 70, 864, 125], quick: [429, 205, 864, 75], charts: [429, 290, 864, 385], recent: [429, 685, 864, 215], all: [0, 0, 1440, 900] };
for (const th of ['light', 'dark']) { const ref = REF.replace('%T', th); if (!fs.existsSync(ref)) { console.log('no ref', ref); continue; }
  const f = ROOT + `pages/la/la-workspace${th === 'dark' ? '.dark' : ''}.html`; const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
  const ours = PNG.sync.read(await p.screenshot()); const r = PNG.sync.read(fs.readFileSync(ref)); const W = Math.min(ours.width, r.width), H = Math.min(ours.height, r.height);
  const crop = (img, x, y, w, h) => { const o = new PNG({ width: w, height: h }); PNG.bitblt(img, o, x, y, w, h, 0, 0); return o; };
  const out = []; for (const [k, [x, y, w, h]] of Object.entries(regions)) { const a = crop(r, x, y, Math.min(w, W - x), Math.min(h, H - y)), c = crop(ours, x, y, a.width, a.height), d = new PNG({ width: a.width, height: a.height }); const n = pixelmatch(a.data, c.data, d.data, a.width, a.height, { threshold: 0.2 }); out.push(`${k}:${(n / (a.width * a.height) * 100).toFixed(1)}%`); if (k === 'all') { const s = new PNG({ width: W * 3, height: H }); PNG.bitblt(a, s, 0, 0, W, H, 0, 0); PNG.bitblt(c, s, 0, 0, W, H, W, 0); PNG.bitblt(d, s, 0, 0, W, H, W * 2, 0); fs.writeFileSync(ROOT + `pages/la/shots/la-workspace.compare.${th}.png`, PNG.sync.write(s)); } }
  console.log(th, out.join('  ')); await p.close(); }
await b.close();
