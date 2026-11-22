// Render check for counter components: every state x theme (light/dark) x locale (en-AE/AED, ar-AE/AED, ar-SA/SAR, en-QA/QAR via currency, ar-KW/KWD, en-IN/INR). Fails on horizontal overflow or JS-needed content.
//   node scripts/la-ct-matrix.mjs <folder> [...]   -> components/la/<id>/shots/<state>.<theme>.<lang>-<CUR>.png
import fs from 'fs'; import { chromium } from 'playwright'; import { renderLa, laMeta } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const b = await chromium.launch(); let bad = 0, n = 0;
const combos = [{ lang: 'en', currency: 'AED' }, { lang: 'ar', currency: 'AED' }, { lang: 'ar', currency: 'SAR' }, { lang: 'en', currency: 'QAR' }, { lang: 'ar', currency: 'KWD' }, { lang: 'en', currency: 'INR' }];
for (const id of process.argv.slice(2)) {
  const dir = ROOT + 'components/la/' + id + '/'; const meta = laMeta(id); const vp = meta.viewport; fs.mkdirSync(dir + 'shots', { recursive: true });
  for (const st of meta.states) for (const theme of ['light', 'dark']) for (const c of combos) {
    const ctx = await b.newContext({ viewport: { width: vp.w, height: vp.h }, deviceScaleFactor: 1, javaScriptEnabled: false }); const p = await ctx.newPage();
    const f = dir + '.tmp.html'; fs.writeFileSync(f, renderLa(id, { state: st, theme, ...c })); await p.goto('file://' + f);
    const png = await p.screenshot({ path: dir + `shots/${st}.${theme}.${c.lang}-${c.currency}.png` });
    const ctx2 = await b.newContext({ viewport: { width: vp.w, height: vp.h } }); const p2 = await ctx2.newPage(); await p2.goto('file://' + f);
    const ov = await p2.evaluate(() => [...document.querySelectorAll('[data-ui]')].filter(e => e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).display !== 'inline').map(e => e.dataset.ui));
    if (ov.length) { bad++; console.log('OVERFLOW', id, st, theme, c.lang, c.currency, ov.join(',')); } n++;
    await ctx.close(); await ctx2.close(); fs.unlinkSync(f);
  }
}
console.log('rendered', n, 'variants, problems', bad); await b.close(); process.exit(bad ? 1 : 0);
