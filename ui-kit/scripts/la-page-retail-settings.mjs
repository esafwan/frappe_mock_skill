// Composes pages/la/retail-settings*.html from components/la/retail-settings + shell + loyal-arrow/data/<region>/retail_settings.json.
// Writes pages/la/retail-settings.boxes.json (pixel boxes of every data-ui per variant, read by manifest-la) and pages/la/shots/*.png.
//   node scripts/la-page-retail-settings.mjs [--no-shots]
import fs from 'fs'; import { chromium } from 'playwright'; import { renderLa } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const ID = 'retail-settings', OUT = ROOT + 'pages/la/', DATA = ROOT + '../loyal-arrow/data/';
const REG = { AED: 'uae-dubai-supermarket', SAR: 'uae-dubai-supermarket', QAR: 'uae-dubai-supermarket', KWD: 'uae-dubai-supermarket', INR: 'india-departmental-store' };
const KEYS = ['record', 'rules', 'missions', 'funding', 'reports', 'experiments', 'household', 'assistant'];
const BASIS = { before_tax: ['basisOpt1', 'Amount before tax', 'المبلغ قبل الضريبة'], after_tax: ['basisOpt2', 'Amount after tax', 'المبلغ بعد الضريبة'], quantity: ['basisOpt3', 'Item quantity', 'كمية الأصناف'] };
const LEAF_AR = [['Setup summary', 'ملخص الإعداد'], ['Loyalty programs', 'برامج الولاء'], ['Tiers', 'المستويات'], ['Earning &amp; Redemption Rules', 'قواعد الكسب والاستبدال'], ['Earning & Redemption Rules', 'قواعد الكسب والاستبدال'], ['Segments', 'الشرائح'], ['Locations', 'المواقع'], ['Staff', 'الموظفون'], ['Service categories', 'فئات الخدمات'], ['Plan and usage', 'الخطة والاستخدام']];
const V = [ // suffix, state, theme, lang, currency
  ['', 'populated', 'light', 'en', 'AED'], ['.dark', 'populated', 'dark', 'en', 'AED'], ['.ar-AED', 'populated', 'light', 'ar', 'AED'], ['.ar-AED.dark', 'populated', 'dark', 'ar', 'AED'], ['.en-INR', 'populated', 'light', 'en', 'INR'],
  ['.dirty', 'dirty', 'light', 'en', 'AED'], ['.dirty.dark', 'dirty', 'dark', 'en', 'AED'], ['.dirty.ar-AED', 'dirty', 'light', 'ar', 'AED'], ['.dirty.en-INR', 'dirty', 'light', 'en', 'INR'],
  ['.empty', 'empty', 'light', 'en', 'AED'], ['.empty.dark', 'empty', 'dark', 'en', 'AED'], ['.empty.ar-AED', 'empty', 'light', 'ar', 'AED'],
  ['.all-on', 'all-on', 'light', 'en', 'AED'], ['.basis-open', 'basis-open', 'light', 'en', 'AED'], ['.basis-open.dark', 'basis-open', 'dark', 'en', 'AED'],
];
function data(cur, lang, state) {
  const d = JSON.parse(fs.readFileSync(DATA + REG[cur] + '/retail_settings.json')); const on = new Set(state === 'empty' ? [] : state === 'all-on' ? KEYS : d.features_on); if (state === 'dirty') on.add(d.dirty_tick);
  const set = { saveCls: state === 'dirty' ? 'is-primary' : 'is-disabled', basisCls: state === 'basis-open' ? 'is-open' : 'is-idle', menuCls: state === 'basis-open' ? 'is-shown' : 'is-hidden' };
  KEYS.forEach((k, i) => { set[`f${i + 1}_chk`] = on.has(k) ? 'is-checked' : 'is-off'; });
  set.basisValue = BASIS[d.basis][lang === 'ar' ? 2 : 1]; return set;
}
const browser = await chromium.launch(); const man = { page: ID, title: 'Loyal Arrow retail settings (reference rs-p1a-admin-ui/after_retail-settings_1440_light.png)', system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, variants: {} };
fs.mkdirSync(OUT + 'shots', { recursive: true });
for (const [suf, state, theme, lang, cur] of V) {
  let html = renderLa('retail-settings', { state, theme, lang, currency: cur, in: 'shell', cssBase: '../../tokens/css/', set: data(cur, lang, state) });
  html = html.replace(/<title>.*?<\/title>/, `<title>Retail settings (${state}${suf})</title>`).replace('<html ', `<html data-currency="${cur}" data-page="la-${ID}" `);
  html = html.replace('data-ui="la-shell.avatar">S<', 'data-ui="la-shell.avatar">L<');
  if (lang === 'ar') { html = html.replace('>Retail</h1>', '>التجزئة</h1>'); for (const [e, a] of LEAF_AR) html = html.replace(`>${e}</div>`, `>${a}</div>`); }
  const f = `${ID}${suf}.html`; fs.writeFileSync(OUT + f, html);
  const p = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); await p.goto('file://' + OUT + f); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }).filter(b => b.w > 0 && b.h > 0));
  const ids = boxes.map(b => b.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + f);
  man.variants[`${ID}${suf}`] = boxes; if (!process.argv.includes('--no-shots')) await p.screenshot({ path: OUT + `shots/${ID}${suf}.png` }); await p.close();
}
fs.writeFileSync(OUT + `${ID}.boxes.json`, JSON.stringify(man, null, 1)); await browser.close(); console.log('wrote', V.length, 'variants');
