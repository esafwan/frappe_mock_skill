// Composes pages/la/retail-missions*.html from components/la/retail-missions + shell + loyal-arrow/data/<region>/missions.json.
// Also writes pages/la/retail-missions.manifest.json (pixel boxes of every data-ui per variant) and screenshots to --shots <dir>.
//   node scripts/la-pages-missions.mjs [--shots dir]
import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright'; import { renderLa } from '../tools/render-la.mjs'; import { formatMoney } from '../tools/render.mjs'; import { ROOT } from './lib.mjs';
const ID = 'retail-missions'; const OUT = ROOT + 'pages/la/'; const DATA = ROOT + '../loyal-arrow/data/';
const shots = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const REG = { AED: 'uae-dubai-supermarket', SAR: 'uae-dubai-supermarket', QAR: 'uae-dubai-supermarket', KWD: 'uae-dubai-supermarket', INR: 'india-departmental-store' };
const FX = { AED: 1, SAR: 1.02, QAR: 0.99, KWD: 0.0836 };   // synthetic display conversion of the AED dataset
const dg = (s) => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]).replace(/\./g, '٫');
const grp = (n, ar) => { const s = Number(n).toLocaleString('en-US'); return ar ? dg(s).replace(/,/g, '٬') : s; };
function fillData(cur, lang, state) {
  const d = JSON.parse(fs.readFileSync(DATA + REG[cur] + '/missions.json')); const ar = lang === 'ar'; const fx = FX[cur] ?? 1; const c = d.check; const z = state === 'zero'; const N = (n) => ar ? dg(n) : String(n);
  const money = (n) => formatMoney(Math.round(n * fx * 1000) / 1000, cur, { lang });
  const set = { k1_value: N(z ? 0 : c.would_qualify), k2_value: N(z ? 0 : c.completions), k3_value: z ? money(0) : money(c.est_cost), k4_value: z ? money(0) : money(c.supplier_funded),
    k1_sub: ar ? `${dg(z ? 0 : c.pct_of_shoppers)}% من متسوقي العام الماضي` : `${z ? 0 : c.pct_of_shoppers}% of last year's shoppers`,
    k3_sub: ar ? `${grp(z ? 0 : c.points_cost, true)} نقطة بقيمة الاستبدال` : `${grp(z ? 0 : c.points_cost)} points at redeem value`, k4_sub: ar ? `${N(c.supplier_share_pct)}% من تكلفة النقاط` : `${c.supplier_share_pct}% of the points cost`,
    current: N(d.progress.current), target: N(d.progress.target) };
  return { set, fill: Math.round(d.progress.current / d.progress.target * 100) };
}
const V = [ // suffix, state, theme, lang, currency
  ['', 'populated', 'light', 'en', 'AED'], ['.dark', 'populated', 'dark', 'en', 'AED'], ['.ar-AED', 'populated', 'light', 'ar', 'AED'], ['.en-INR', 'populated', 'light', 'en', 'INR'], ['.kw-KWD', 'populated', 'light', 'en', 'KWD'],
  ['.empty', 'empty', 'light', 'en', 'AED'], ['.zero', 'zero', 'light', 'en', 'AED'], ['.typing', 'typing', 'light', 'en', 'AED'], ['.draft', 'draft', 'light', 'en', 'AED'], ['.active', 'active', 'light', 'en', 'AED'], ['.paused', 'paused', 'light', 'en', 'AED'],
  ['.empty.dark', 'empty', 'dark', 'en', 'AED'], ['.active.dark', 'active', 'dark', 'en', 'AED'], ['.active.ar-AED', 'active', 'light', 'ar', 'AED'], ['.zero.ar-AED', 'zero', 'light', 'ar', 'AED'], ['.draft.dark', 'draft', 'dark', 'en', 'AED'], ['.empty.ar-AED', 'empty', 'light', 'ar', 'AED'], ['.typing.dark', 'typing', 'dark', 'en', 'AED'],
];
const browser = await chromium.launch(); const man = { page: ID, system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'rs-p1b-missions-ui/after_missions_1440_light.png', variants: {} };
for (const [suf, state, theme, lang, cur] of V) {
  const { set, fill } = fillData(cur, lang, state);
  let html = renderLa(ID, { state, theme, lang, currency: cur, in: 'shell', cssBase: '../../tokens/css/', set });
  html = html.replace(/data-fill="[^"{]*"( data-ui="la-retail-missions\.progress-bar")/, `data-fill="${fill}"$1`);
  if (lang === 'ar') html = html.replace('>Retail</h1>', '>التجزئة</h1>');
  const f = `${ID}${suf}.html`; fs.writeFileSync(OUT + f, html);
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); await p.goto('file://' + OUT + f); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(b => b.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + f);
  if (html.includes('{{')) throw new Error('unfilled slot in ' + f);
  man.variants[f] = { state, theme, lang, currency: cur, targets: boxes };
  if (shots) { fs.mkdirSync(shots, { recursive: true }); await p.screenshot({ path: path.join(shots, f.replace('.html', '.png')) }); } await p.close();
}
fs.writeFileSync(OUT + `${ID}.manifest.json`, JSON.stringify(man, null, 1)); await browser.close(); console.log('wrote', V.length, 'variants');
