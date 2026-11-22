// Composes pages/la/retail-mapping-inbox*.html from components/la/retail-mapping-inbox + shell + loyal-arrow/data/<region>/mapping_inbox.json.
// Also writes pages/la/retail-mapping-inbox.manifest.json (pixel boxes of every data-ui per variant) and screenshots to --shots <dir>.
//   node scripts/la-pages-inbox.mjs [--shots dir]
import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright'; import { renderLa } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const ID = 'retail-mapping-inbox'; const OUT = ROOT + 'pages/la/'; const DATA = ROOT + '../loyal-arrow/data/';
const shots = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const REG = { AED: 'uae-dubai-supermarket', SAR: 'uae-dubai-supermarket', QAR: 'uae-dubai-supermarket', KWD: 'uae-dubai-supermarket', INR: 'india-departmental-store' };
const WHY = { none: ['No category yet', 'Pick the category this item belongs to.'], ambiguous: ['More than one category fits', 'Pick the one category that is right for this item.'], weighed: ['Weighed item barcode', 'Weighed items carry a price or weight in the barcode. Map the product code once.'] };
const WHY_AR = { none: ['لا توجد فئة بعد', 'اختر الفئة التي ينتمي إليها هذا الصنف.'], ambiguous: ['تناسبه أكثر من فئة', 'اختر الفئة الصحيحة لهذا الصنف.'], weighed: ['باركود صنف موزون', 'تحمل الأصناف الموزونة السعر أو الوزن في الباركود. اربط رمز المنتج مرة واحدة.'] };
const AR_CAT = { Staples: 'المواد الأساسية', Dairy: 'الألبان', Bakery: 'المخبوزات', Beverages: 'المشروبات', Snacks: 'الوجبات الخفيفة', Household: 'مستلزمات المنزل' };
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const dg = (s) => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
function fillData(cur, lang, state) {
  const d = JSON.parse(fs.readFileSync(DATA + REG[cur] + '/mapping_inbox.json')); const t = new Date(d.last_seen + 'Z'); const ar = lang === 'ar';
  let h = t.getUTCHours(), m = String(t.getUTCMinutes()).padStart(2, '0'); const ap = h >= 12 ? (ar ? 'م' : 'PM') : (ar ? 'ص' : 'AM'); h = h % 12 || 12;
  const seen = ar ? dg(`${t.getUTCDate()}/${t.getUTCMonth() + 1}/${t.getUTCFullYear()}، ${h}:${m} ${ap}`) : `${MON[t.getUTCMonth()]} ${t.getUTCDate()}, ${t.getUTCFullYear()}, ${h}:${m} ${ap}`;
  const rows = state === 'row-mapped' ? d.rows.slice(1) : d.rows; const set = {};
  rows.forEach((r, i) => { const n = state === 'row-mapped' ? i + 2 : i + 1; const w = (ar ? WHY_AR : WHY)[r.reason]; set[`r${n}_sku`] = r.sku; set[`r${n}_why`] = w[0]; set[`r${n}_hint`] = w[1]; set[`r${n}_bills`] = ar ? dg(r.bills) : String(r.bills); set[`r${n}_seen`] = seen; });
  d.categories_en.slice(0, 4).forEach((c, i) => { set[`cat${i + 1}`] = ar ? AR_CAT[c] : c; });
  set.count = ar ? dg(state === 'zero' ? 0 : rows.length) : String(state === 'zero' ? 0 : rows.length);
  if (state === 'empty') set.count = ar ? '٠' : '0';
  if (state === 'empty') { set.emptyTitle = ar ? 'لا شيء هنا بعد' : 'Nothing mapped yet'; set.emptyBody = ar ? 'تظهر هنا الأصناف بعد ربطها بفئة.' : 'Items you map to a category appear here.'; }
  return set;
}
const V = [ // name, state, theme, lang, currency
  ['', 'populated', 'light', 'en', 'AED'], ['.dark', 'populated', 'dark', 'en', 'AED'], ['.ar-AED', 'populated', 'light', 'ar', 'AED'], ['.en-INR', 'populated', 'light', 'en', 'INR'],
  ['.empty', 'empty', 'light', 'en', 'AED'], ['.zero', 'zero', 'light', 'en', 'AED'], ['.category-open', 'category-open', 'light', 'en', 'AED'], ['.row-mapped', 'row-mapped', 'light', 'en', 'AED'],
  ['.empty.dark', 'empty', 'dark', 'en', 'AED'], ['.zero.ar-AED', 'zero', 'light', 'ar', 'AED'], ['.category-open.dark', 'category-open', 'dark', 'en', 'AED'], ['.category-open.ar-AED', 'category-open', 'light', 'ar', 'AED'],
];
const browser = await chromium.launch(); const man = { page: ID, system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, variants: {} };
for (const [suf, state, theme, lang, cur] of V) {
  let html = renderLa(ID, { state, theme, lang, currency: cur, in: 'shell', cssBase: '../../tokens/css/', set: fillData(cur, lang, state) });
  html = html.replace('<title>', `<title>Retail mapping inbox (${state}) `).replace(/<title>(.*?)<\/title>/, (m, t) => `<title>${t.trim()}</title>`);
  if (lang === 'ar') html = html.replace('>Retail</h1>', '>التجزئة</h1>');   // shell title has no ar text for section-expanded state
  const f = `${ID}${suf}.html`; fs.writeFileSync(OUT + f, html);
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); await p.goto('file://' + OUT + f); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(b => b.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + f);
  man.variants[f] = { state, theme, lang, currency: cur, targets: boxes };
  if (shots) { fs.mkdirSync(shots, { recursive: true }); await p.screenshot({ path: path.join(shots, f.replace('.html', '.png')) }); } await p.close();
}
fs.writeFileSync(OUT + `${ID}.manifest.json`, JSON.stringify(man, null, 1)); await browser.close(); console.log('wrote', V.length, 'variants');
