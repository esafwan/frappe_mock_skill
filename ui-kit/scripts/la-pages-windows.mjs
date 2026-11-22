// Composes pages/la/retail-windows*.html from components/la/retail-windows + shell + loyal-arrow/data/<region>/windows.json.
// Also writes pages/la/retail-windows.manifest.json (pixel boxes of every data-ui per variant) and screenshots to --shots <dir>.
//   node scripts/la-pages-windows.mjs [--shots dir]
import fs from 'fs'; import path from 'path'; import { chromium } from 'playwright'; import { renderLa } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const ID = 'retail-windows'; const OUT = ROOT + 'pages/la/'; const DATA = ROOT + '../loyal-arrow/data/';
const shots = process.argv.includes('--shots') ? process.argv[process.argv.indexOf('--shots') + 1] : null;
const REG = { AED: 'uae-dubai-supermarket', SAR: 'uae-dubai-supermarket', QAR: 'uae-dubai-supermarket', KWD: 'uae-dubai-supermarket', INR: 'india-departmental-store' };
const dg = (s) => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const AR_DATE = (iso) => { const [y, m, d] = iso.split('-'); return `${d}/${m}/${y}`; };
function fillData(cur, lang, state) {
  const d = JSON.parse(fs.readFileSync(DATA + REG[cur] + '/windows.json')); const ar = lang === 'ar'; const set = {};
  d.rows.forEach((r, i) => { const n = i + 1;
    set[`r${n}_name`] = ar ? r.name_ar : r.name_en; set[`r${n}_year`] = ar ? dg(r.year) : String(r.year); set[`r${n}_region`] = ar ? d.region_ar[r.region] : r.region;
    set[`r${n}_dates`] = ar ? dg(`${r.starts} إلى ${r.ends} (إعداد مسبق ${r.lead_days} أيام)`) : `${r.starts} to ${r.ends} (${r.lead_days} day lead-in)`; });
  if (state === 'editing') { const r = d.rows[0]; const [y, m, dd] = r.starts.split('-').map(Number); const lead = new Date(Date.UTC(y, m - 1, dd - r.lead_days)).toISOString().slice(0, 10);
    const f = (iso) => ar ? dg(AR_DATE(iso)) : AR_DATE(iso);
    Object.assign(set, { valKey: r.key, valYear: ar ? dg(r.year) : String(r.year), valRegion: ar ? d.region_ar[r.region] : r.region, valLead: f(lead), valStarts: f(r.starts), valEnds: f(r.ends), valNotes: ar ? 'نافذة تجريبية' : 'Sample window' }); }
  if (state === 'empty' || state === 'zero') set.listTitle = ar ? 'نوافذ التجزئة' : 'Retail windows';
  return set;
}
const V = [ // name, state, theme, lang, currency
  ['', 'populated', 'light', 'en', 'AED'], ['.dark', 'populated', 'dark', 'en', 'AED'], ['.ar-AED', 'populated', 'light', 'ar', 'AED'], ['.en-INR', 'populated', 'light', 'en', 'INR'],
  ['.confirmed', 'confirmed', 'light', 'en', 'AED'], ['.confirmed.dark', 'confirmed', 'dark', 'en', 'AED'], ['.confirmed.ar-AED', 'confirmed', 'light', 'ar', 'AED'],
  ['.editing', 'editing', 'light', 'en', 'AED'], ['.editing.dark', 'editing', 'dark', 'en', 'AED'], ['.editing.ar-AED', 'editing', 'light', 'ar', 'AED'],
  ['.empty', 'empty', 'light', 'en', 'AED'], ['.empty.dark', 'empty', 'dark', 'en', 'AED'], ['.empty.ar-AED', 'empty', 'light', 'ar', 'AED'], ['.zero', 'zero', 'light', 'en', 'AED'], ['.confirmed.en-INR', 'confirmed', 'light', 'en', 'INR'],
];
const browser = await chromium.launch(); const man = { page: ID, system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'rs-p1b-missions-ui/after_windows_1440_light.png', variants: {} };
for (const [suf, state, theme, lang, cur] of V) {
  let html = renderLa(ID, { state, theme, lang, currency: cur, in: 'shell', cssBase: '../../tokens/css/', set: fillData(cur, lang, state) });
  html = html.replace(/<title>(.*?)<\/title>/, (m, t) => `<title>Retail windows (${state})</title>`);
  if (lang === 'ar') html = html.replace('>Retail</h1>', '>التجزئة</h1>');
  const f = `${ID}${suf}.html`; fs.writeFileSync(OUT + f, html);
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); await p.goto('file://' + OUT + f); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(b => b.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + f);
  man.variants[f] = { state, theme, lang, currency: cur, targets: boxes };
  if (shots) { fs.mkdirSync(shots, { recursive: true }); await p.screenshot({ path: path.join(shots, f.replace('.html', '.png')) }); } await p.close();
}
fs.writeFileSync(OUT + `${ID}.manifest.json`, JSON.stringify(man, null, 1)); await browser.close(); console.log('wrote', V.length, 'variants');
