// Builds loyal-arrow-desk PAGES (pages/la/<page>[.variant].html), measures every [data-ui] box, screenshots, merges into manifest.json.pages.
//   node scripts/la-rpt-pages.mjs [page-id ...] [--no-shots]
// Deterministic: synthetic data only (loyal-arrow/data/*/today.json), no clocks/randomness/network. Pages are JS-free.
import fs from 'fs'; import path from 'path';
import { renderLa } from '../tools/render-la.mjs'; import { formatMoney } from '../tools/render.mjs'; import { ROOT } from './lib.mjs';
const DATA = ROOT + '../loyal-arrow/data/';
const AR = (s) => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]).replace(/,/g, '٬').replace(/\./g, '٫').replace(/%/g, '٪');
const fmtNum = (n, locale, lang) => { const s = n.toLocaleString(locale === 'IN' ? 'en-IN' : 'en-US'); return lang === 'ar' ? AR(s) : s; };
const T = { // text dictionary (slot texts). ar = Arabic
  program: { en: 'Program', ar: 'البرنامج' }, programName: { en: 'Hyper Rewards', ar: 'هايبر ريوردز' }, programNone: { en: 'Select a program', ar: 'اختر برنامجا' },
  metric: { en: 'Metric', ar: 'المقياس' }, today: { en: 'Today', ar: 'اليوم' }, empty: { en: 'Select a program to see today', ar: 'اختر برنامجا لعرض اليوم' }, vs: { en: 'vs same day last week', ar: 'مقابل نفس اليوم الأسبوع الماضي' }, na: { en: 'n/a', ar: 'غير متاح' },
  title: { en: 'Loyalty Today', ar: 'ولاء اليوم' },
  bills: { en: 'Bills', ar: 'الفواتير' }, pe: { en: 'Points earned', ar: 'النقاط المكتسبة' }, pr: { en: 'Points redeemed', ar: 'النقاط المستبدلة' }, nm: { en: 'New members', ar: 'أعضاء جدد' }, vo: { en: 'Voids', ar: 'الإلغاءات' },
  billsC: { en: 'Bills (counter)', ar: 'الفواتير (الكاشير)' }, red: { en: 'Redemptions', ar: 'الاستبدالات' }, pv: { en: 'Points voided', ar: 'النقاط الملغاة' }, rr: { en: 'Redemption refunds', ar: 'استرداد الاستبدال' } };
const KEYS = ['bills', 'points_earned', 'points_redeemed', 'new_members', 'voids'], KT = ['bills', 'pe', 'pr', 'nm', 'vo'];
const ROWS = [['bills', 'billsC'], ['points_earned', 'pe'], ['points_redeemed', 'pr'], ['redemptions', 'red'], ['new_members', 'nm'], ['voids', 'vo'], ['points_voided', 'pv'], ['redemption_refunds', 'rr']];
export const PAGES = { 'rpt-loyalty-today': { title: 'title', build } };
function build(v, set) {   // v: {state, lang, locale, theme}; returns {body, slots}
  const L = v.lang, t = (k) => T[k][L], dataset = v.locale === 'IN' ? 'india-departmental-store' : 'uae-dubai-supermarket';
  const d = JSON.parse(fs.readFileSync(DATA + dataset + '/today.json')); const zero = v.state === 'zero' || v.state === 'empty';
  const val = (k) => zero ? 0 : d.today[k], prev = (k) => d.same_day_last_week[k];
  const delta = (k) => { if (zero || !prev(k)) return t('na'); const p = Math.round((val(k) - prev(k)) / prev(k) * 100); return (p > 0 ? '+' : '') + (L === 'ar' ? AR(p + '%') : p + '%'); };
  const slots = {}; const chk = (name, s, max) => { if (String(s).length > max) throw new Error(`${name} exceeds maxLength ${max}: ${s}`); slots[name] = { sample: s, maxLength: max }; return s; };
  const none = v.state === 'empty';
  let h = `<div class="la-pg-rpt" data-ui="la-rpt-loyalty-today" data-state="${v.state}" data-locale="${v.locale}" data-currency="${v.currency}">\n`;
  h += `<div class="la-pg-filter" data-ui="la-rpt-loyalty-today.filter"><span class="la-pg-filter-label" data-ui="la-rpt-loyalty-today.program-label">${chk('programLabel', t('program'), 16)}</span><span class="la-pg-chip${none ? ' is-unset' : ''}" data-ui="la-rpt-loyalty-today.program-chip">${chk('programName', none ? t('programNone') : t('programName'), 24)}</span></div>\n`;
  h += `<div class="la-pg-kpis" data-ui="la-rpt-loyalty-today.kpis">`;
  KEYS.forEach((k, i) => { const n = i + 1, label = `${t(KT[i])} (${delta(k)} ${t('vs')})`; const final = val(k);
    h += `<div class="la-pg-kpi" data-ui="la-rpt-loyalty-today.kpi-${n}" data-count-to="${final}"><div class="la-pg-kpi-label" data-ui="la-rpt-loyalty-today.kpi-${n}.label">${chk('kpi' + n + 'Label', label, 64)}</div><div class="la-pg-kpi-value la-num" data-ui="la-rpt-loyalty-today.kpi-${n}.value" data-count-to="${final}">${chk('kpi' + n + 'Value', fmtNum(final, v.locale, L), 12)}</div></div>`; });
  h += `</div>\n<div class="la-pg-card" data-ui="la-rpt-loyalty-today.table">`;
  if (none) h += `<div class="la-pg-empty" data-ui="la-rpt-loyalty-today.empty">${chk('emptyText', t('empty'), 36)}</div>`;
  else { h += `<table class="la-pg-grid"><thead><tr data-ui="la-rpt-loyalty-today.head"><th class="c-idx"></th><th class="c-metric">${chk('colMetric', t('metric'), 14)}</th><th class="c-val">${chk('colToday', t('today'), 14)}</th><th class="c-fill"></th></tr></thead><tbody>`;
    ROWS.forEach(([k, tk], i) => { const n = i + 1; h += `<tr data-ui="la-rpt-loyalty-today.row-${n}"><td class="c-idx la-num">${L === 'ar' ? AR(n) : n}</td><td class="c-metric" data-ui="la-rpt-loyalty-today.row-${n}.metric">${chk('row' + n + 'Metric', t(tk), 28)}</td><td class="c-val la-num" data-ui="la-rpt-loyalty-today.row-${n}.value" data-count-to="${val(k)}">${chk('row' + n + 'Value', fmtNum(val(k), v.locale, L), 12)}</td><td class="c-fill"></td></tr>`; });
    h += `</tbody></table>`; }
  h += `</div>\n</div>`; return { body: h, slots, title: t('title') };
}
export const VARIANTS = [   // file suffix -> options
  ['', { state: 'populated', lang: 'en', locale: 'AE', currency: 'AED', theme: 'light' }], ['.dark', { state: 'populated', lang: 'en', locale: 'AE', currency: 'AED', theme: 'dark' }],
  ['.ar-AED', { state: 'populated', lang: 'ar', locale: 'AE', currency: 'AED', theme: 'light' }], ['.en-INR', { state: 'populated', lang: 'en', locale: 'IN', currency: 'INR', theme: 'light' }],
  ['.zero', { state: 'zero', lang: 'en', locale: 'AE', currency: 'AED', theme: 'light' }], ['.zero.dark', { state: 'zero', lang: 'en', locale: 'AE', currency: 'AED', theme: 'dark' }],
  ['.empty', { state: 'empty', lang: 'en', locale: 'AE', currency: 'AED', theme: 'light' }]];
export function renderPage(id, v) {
  const b = PAGES[id].build(v), shell = renderLa('shell', { theme: v.theme, lang: v.lang, cssBase: '../../tokens/css/', set: { pageTitle: b.title } });
  const html = shell.replace('<!--la:content-->', b.body).replace('</head>', `<link rel="stylesheet" href="../../tokens/css/la-desk-pg-loyalty-today.css">\n</head>`).replace(/<title>[^<]*<\/title>/, `<title>${b.title}</title>`);
  return { html, slots: b.slots };
}
if (process.argv[1]?.endsWith('la-rpt-pages.mjs')) {
  const args = process.argv.slice(2); const shots = !args.includes('--no-shots'); const ids = args.filter(a => !a.startsWith('--')); const run = ids.length ? ids : Object.keys(PAGES);
  const { chromium } = await import('playwright'); const browser = await chromium.launch(); const man = JSON.parse(fs.readFileSync(ROOT + 'manifest.json')); fs.mkdirSync(ROOT + 'pages/la', { recursive: true });
  for (const id of run) { const entry = { id, system: 'loyal-arrow-desk', group: 'la', viewport: { w: 1440, h: 900 }, variants: {}, slots: {} };
    for (const [suf, v] of VARIANTS) { const { html, slots } = renderPage(id, v); const name = id + suf; const f = ROOT + 'pages/la/' + name + '.html'; fs.writeFileSync(f, html); Object.assign(entry.slots, slots);
      const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, javaScriptEnabled: false }); const jc = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); const p = await jc.newPage(); await p.goto('file://' + f); await p.evaluate(() => document.fonts.ready);
      const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), tag: e.tagName.toLowerCase(), box: { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) } }; }));
      const idsx = boxes.map(b => b.id); if (new Set(idsx).size !== idsx.length) throw new Error('duplicate data-ui in ' + name); if (!idsx.includes('la-' + id)) throw new Error('root missing ' + name);
      if (shots) await p.screenshot({ path: ROOT + 'pages/la/' + name + '.png' });
      entry.variants[name] = { file: `pages/la/${name}.html`, shot: `pages/la/${name}.png`, state: v.state, lang: v.lang, theme: v.theme, currency: v.currency, targets: boxes }; await ctx.close(); await jc.close(); }
    fs.writeFileSync(ROOT + 'pages/la/' + id + '.targets.json', JSON.stringify(entry, null, 1)); man.pages = man.pages || {}; man.pages['la-' + id] = entry; console.log('built', id, Object.keys(entry.variants).length, 'variants'); }
  fs.writeFileSync(ROOT + 'manifest.json', JSON.stringify(man, null, 2)); await browser.close();
}
