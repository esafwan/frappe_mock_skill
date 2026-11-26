// usage: node shot-doctype.mjs out/a.html out/a.png [--full]  (file:// screenshot at 1440x900)
// default: first viewport. --full: grows the viewport to the page's scroll height so the whole form is captured.
import { chromium } from 'playwright';
import path from 'node:path';
const args = process.argv.slice(2);
const full = args.includes('--full');
const [html, png] = args.filter((x) => !x.startsWith('--'));
let b; try { b = await chromium.launch(); } catch { b = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }); }
const p = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage();
await p.goto('file://' + path.resolve(html)); await p.waitForTimeout(500);
if (full) {
  // the form scrolls inside a desk-shell container: find the tallest scrollable element and size the viewport to fit it
  const h = await p.evaluate(() => {
    let max = document.documentElement.scrollHeight;
    for (const el of document.querySelectorAll('*')) {
      const cs = getComputedStyle(el);
      if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 1) max = Math.max(max, el.scrollHeight + (window.innerHeight - el.clientHeight));
    }
    return max;
  });
  await p.setViewportSize({ width: 1440, height: Math.min(Math.max(900, Math.ceil(h)), 16000) });
  await p.waitForTimeout(300);
  await p.screenshot({ path: png });
} else await p.screenshot({ path: png });
await b.close();
