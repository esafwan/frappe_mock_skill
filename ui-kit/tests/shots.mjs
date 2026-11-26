// Screenshot rendered HTML files: node tests/shots.mjs out/slice3/*.html   -> <file>.png next to each (1440x900; 375x812 for *mobile*).
// Needs playwright (same launch fallback as doctype/shot-doctype.mjs). Not part of the determinism gate.
import { chromium } from 'playwright';
import path from 'node:path';
const args = process.argv.slice(2);
const H = Number((args.find((a) => a.startsWith('--h=')) || '').slice(4)) || 900;
const files = args.filter((f) => f.endsWith('.html'));
let b;
try { b = await chromium.launch(); } catch { b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); }
for (const f of files) {
  const mobile = /mobile/.test(f);
  const p = await (await b.newContext({ viewport: mobile ? { width: 375, height: 812 } : { width: 1440, height: H } })).newPage();
  await p.goto('file://' + path.resolve(f));
  await p.waitForTimeout(250);
  await p.screenshot({ path: f.replace(/\.html$/, H > 900 ? `.h${H}.png` : '.png') });
  await p.close();
}
await b.close();
console.log(`shots: ${files.length}`);
