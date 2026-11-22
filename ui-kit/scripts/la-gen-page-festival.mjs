// Composes page retail-festival (loyal-arrow-desk) from loyal-arrow/data/retail-festival.json. Deterministic: no clock/random/network.
//   node scripts/la-gen-page-festival.mjs  -> pages/la/retail-festival[.variant].html + retail-festival.page.json
// States: base = hidden-days (matches reference), .populated (no hidden days), .zero (0 bills this year), .empty (no data either year), .no-lead (days-before unchecked), .festival-diwali (festival changed), .race-half (line race mid-way)
import fs from 'fs'; import { ROOT } from './lib.mjs'; import { renderLa } from '../tools/render-la.mjs';
const D = JSON.parse(fs.readFileSync(ROOT + '../loyal-arrow/data/retail-festival.json', 'utf8'));
const AD = '٠١٢٣٤٥٦٧٨٩';
const AR = { 'Product catalogue, categories and the rules that earn on them.': 'الكتالوج والفئات والقواعد التي تُكسب النقاط عليها.', Catalogue: 'الكتالوج', Categories: 'الفئات', Heatmap: 'الخريطة الحرارية', Festival: 'المهرجان', 'Mapping inbox': 'صندوق الربط', Missions: 'المهام', Windows: 'النوافذ', 'Retail settings': 'إعدادات التجزئة',
  'Include the days before': 'تضمين الأيام السابقة', 'Net sales': 'صافي المبيعات', Bills: 'الفواتير', 'Average basket': 'متوسط السلة', Shoppers: 'المتسوقون', 'Came back': 'عادوا', 'Last year': 'العام الماضي', 'shopped in both years': 'تسوقوا في العامين',
  'Sales so far, this year and last year': 'المبيعات حتى الآن، هذا العام والعام الماضي', 'How the years line up': 'كيف تتوازى السنوات', Item: 'البند', Value: 'القيمة', 'Days compared': 'الأيام المقارنة', 'Pre-festival lead-in': 'الأيام السابقة للمهرجان', 'This year': 'هذا العام', 'Days with too little data': 'أيام بيانات قليلة', None: 'لا شيء',
  'Day by day': 'يوما بيوم', Day: 'اليوم', 'Not enough data': 'بيانات غير كافية', 'No data for this festival': 'لا بيانات لهذا المهرجان', 'No data yet': 'لا بيانات بعد', 'Ramadan 2026': 'رمضان ٢٠٢٦', 'Diwali 2025': 'ديوالي ٢٠٢٥', 'Eid al-Fitr 2026': 'عيد الفطر ٢٠٢٦', Festival_: 'المهرجان' };
const SLOTS = {}; let LANG = 'en', CUR = 'INR', RATE = 1, DEC = 0;
// synthetic magnitudes per currency (not an FX conversion): AED/SAR/QAR same figures as INR base, KWD scaled for 3-decimal realism
const RATES = { INR: [1, 0], AED: [1, 0], SAR: [1, 0], QAR: [1, 0], KWD: [0.09, 3] };
const slot = (key, en, type = 'text') => { const ar = AR[en]; if (LANG === 'ar' && type === 'text' && ar === undefined) throw new Error('no ar for ' + en); const v = LANG === 'ar' && type === 'text' ? ar : en;
  const s = SLOTS[key] ||= { type, sample: en, maxLength: 0, where: 'text' }; s.maxLength = Math.max(s.maxLength, Math.ceil(Math.max(en.length, (ar || '').length) * 1.4) + 2); return v; };
const T = (en) => slot('t.' + en.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 28), en);
const ad = (s) => LANG === 'ar' ? String(s).replace(/\d/g, d => AD[d]).replace(/,/g, '٬').replace(/\./g, '٫').replace(/%/g, '٪') : String(s);
const num = (n, dec = 0) => ad(new Intl.NumberFormat(LANG === 'en' && CUR === 'INR' ? 'en-IN' : 'en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n));
const money = (inr) => num(inr * RATE, DEC);
const pct = (n) => ad((n > 0 ? '+' : '') + n.toFixed(1) + '%');
const dateS = (s) => ad(s);
const ico = (p) => `<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${p}"/></svg>`;
const TRI = 'M12 5l8 13H4z';
const delta = (a, b) => b === 0 ? (a === 0 ? 0 : 100) : (a / b - 1) * 100;
const dayLabel = (d) => d.kind === 'before' ? (LANG === 'ar' ? `قبل ${num(d.n)} ${d.n === 1 ? 'يوم' : 'أيام'}` : `${d.n} days before`) : (LANG === 'ar' ? `اليوم ${num(d.n)}` : `Day ${d.n}`);

function view(v) {   // derive the shown festival data for a variant
  let f = JSON.parse(JSON.stringify(D.festivals.find(x => x.id === (v.festival || 'ramadan-2026'))));
  if (v.populated) f.days.forEach(d => { d.hidden = d.ly_hidden = false; });
  if (v.zero || v.empty) f.days.forEach(d => { d.bills = d.sales = 0; d.hidden = true; if (v.empty) { d.ly_bills = d.ly_sales = 0; d.ly_hidden = true; } });
  if (v.noLead) { f.days = f.days.filter(d => d.kind === 'day'); f.lead = 0; }
  const sum = (k) => f.days.reduce((a, d) => a + d[k], 0); const k = { sales: sum('sales'), ly_sales: sum('ly_sales'), bills: sum('bills'), ly_bills: sum('ly_bills') };
  Object.assign(k, { basket: k.bills ? k.sales / k.bills : 0, ly_basket: k.ly_bills ? k.ly_sales / k.ly_bills : 0 });
  if (v.zero || v.empty) Object.assign(k, { shoppers: 0, ly_shoppers: v.empty ? 0 : f.kpi.ly_shoppers, both: 0, cameBack: 0 }); else if (v.noLead) Object.assign(k, { shoppers: f.kpi.shoppers - 3, ly_shoppers: f.kpi.ly_shoppers - 2, both: f.kpi.both - 2, cameBack: +(100 * (f.kpi.both - 2) / (f.kpi.ly_shoppers - 2)).toFixed(1) }); else Object.assign(k, { shoppers: f.kpi.shoppers, ly_shoppers: f.kpi.ly_shoppers, both: f.kpi.both, cameBack: f.kpi.cameBack });
  let acc = 0, accL = 0; f.cum = f.days.map(d => (acc += d.sales)); f.cumL = f.days.map(d => (accL += d.ly_sales)); f.k = k; return f;
}
function niceStep(max) { const raw = max / 3; const p = Math.pow(10, Math.floor(Math.log10(raw || 1))); return [1, 2, 5, 10].map(m => m * p).find(x => x >= raw) || p; }
const kfmt = (n, step) => step >= 1000 ? ad(n / 1000) + (LANG === 'ar' ? ' ألف' : ' K') : num(n, step < 1 ? 2 : 0);

function body(v) {
  const f = view(v), k = f.k, n = f.days.length, empty = !!v.empty, id = 'la-retail-festival';
  const kpi = (key, label, valHtml, lyHtml, dl, plain) => `<div class="la-fest-kpi${plain ? ' is-plain' : ''}" data-ui="${id}.kpi-${key}"><div class="la-fest-kpi-label">${T(label)}</div><div class="la-fest-kpi-value" data-ui="${id}.kpi-${key}-value">${valHtml}</div><div class="la-fest-kpi-sub">${lyHtml}</div>${plain ? '' : dl}</div>`;
  const dl = (key, a, b) => { const d = delta(a, b); const cls = d > 0.05 ? '' : d < -0.05 ? ' is-down' : ' is-flat'; return `<div class="la-fest-delta${cls}" data-ui="${id}.delta-${key}">${ico(TRI)}<span>${pct(d)}</span></div>`; };
  const cur = `<span class="la-fest-kpi-cur">${CUR}</span>`;
  const ly = (x) => `${T('Last year')}: ${x}`;
  const kpis = [kpi('sales', 'Net sales', money(k.sales) + cur, ly(money(k.ly_sales)), dl('sales', k.sales, k.ly_sales)),
    kpi('bills', 'Bills', num(k.bills), ly(num(k.ly_bills)), dl('bills', k.bills, k.ly_bills)),
    kpi('basket', 'Average basket', money(k.basket) + cur, ly(money(k.ly_basket)), dl('basket', k.basket, k.ly_basket)),
    kpi('shoppers', 'Shoppers', num(k.shoppers), ly(num(k.ly_shoppers)), dl('shoppers', k.shoppers, k.ly_shoppers)),
    kpi('cameback', 'Came back', ad(k.cameBack.toFixed(1) + '%'), `${num(k.both)} ${T('shopped in both years')}`, '', true)].join('');
  const note = LANG === 'ar' ? `${f.label === 'Ramadan 2026' ? 'رمضان ٢٠٢٦' : T(f.label)} مقابل ${(AR[f.label] || '').replace(/٢٠٢٦|٢٠٢٥/, m => m === '٢٠٢٦' ? '٢٠٢٥' : '٢٠٢٤')}، يوما بيوم. تُخفى الأيام التي فيها أقل من ١٠ فواتير.` : `${f.label} against ${f.label.replace(/(\d{4})/, (m) => String(+m - 1))}, day for day. Days with fewer than 10 bills are hidden.`;
  // chart geometry (relative to chart box): plot x 91..738, baseline y 191, top y 41
  const max = Math.max(...f.cum, ...f.cumL, 1) * RATE, step = niceStep(empty ? 3 : max), X = (i) => 91 + i * (647 / Math.max(n - 1, 1)), Y = (val) => 191 - (val * RATE / (step * 3)) * 150;
  const path = (c) => c.map((x, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)} ${Y(x).toFixed(1)}`).join('');
  const ys = [0, 1, 2, 3].map(i => `<span style="inset-block-start:${183 - i * 50}px" data-ui="${id}.y-${i + 1}">${i === 0 ? '0' : kfmt(step * i, step)}</span>`).join('');
  const xi = [0]; if (f.lead) xi.push(f.lead - 1); for (let d = 6; d < f.length; d += 6) xi.push(f.lead + d - 1);
  const xs = xi.map((i, j) => `<span style="inset-inline-start:${X(i).toFixed(1)}px" data-ui="${id}.x-${j + 1}">${dayLabel(f.days[i])}</span>`).join('');
  const chart = `<div class="la-fest-chart${empty ? ' is-empty' : ''}" data-ui="${id}.chart"${v.race ? ` style="--la-race-this:${v.race[0]};--la-race-last:${v.race[1]}"` : ''}>
<div class="la-fest-grid"><i></i><i></i><i></i><i></i></div><div class="la-fest-ys">${ys}</div><div class="la-fest-xs">${xs}</div>
<div class="la-fest-empty" data-ui="${id}.chart-empty">${T('No data for this festival')}</div>
<svg class="la-fest-svg" viewBox="0 0 753 250" aria-hidden="true"><path class="la-fest-line is-last" pathLength="1" d="${path(f.cumL)}" data-ui="${id}.line-last"/><path class="la-fest-line is-this" pathLength="1" d="${path(f.cum)}" data-ui="${id}.line-this"/></svg>
<div class="la-fest-legend" data-ui="${id}.legend"><span data-ui="${id}.legend-this"><i></i>${T('This year')}</span><span data-ui="${id}.legend-last"><i></i>${T('Last year')}</span></div></div>`;
  const hid = f.days.filter(d => d.hidden).length, hidL = f.days.filter(d => d.ly_hidden).length;
  const tooLittle = (!hid && !hidL) ? T('None') : LANG === 'ar' ? `${num(hid)} هذا العام، ${num(hidL)} العام الماضي` : `${hid} this year, ${hidL} last year`;
  const dayWord = (c) => LANG === 'ar' ? `${num(c)} أيام` : `${c} days`;
  const yr = (key, a, b, two) => `<tr data-ui="${id}.years-${key}"><td>${T(a)}</td><td class="${two ? 'is-two' : ''}">${b}</td></tr>`;
  const range = (a, b) => LANG === 'ar' ? `${dateS(a)} إلى ${dateS(b)}` : `${a} to ${b}`;
  const years = `<table class="la-fest-years" data-ui="${id}.years"><thead><tr><th>${T('Item')}</th><th>${T('Value')}</th></tr></thead><tbody>${yr('compared', 'Days compared', num(n))}${yr('lead', 'Pre-festival lead-in', dayWord(f.lead))}${yr('this', 'This year', range(n ? f.thisFrom : '', f.thisTo), 1)}${yr('last', 'Last year', range(f.lastFrom, f.lastTo), 1)}${yr('little', 'Days with too little data', tooLittle, 1)}</tbody></table>`;
  const nh = T('Not enough data');
  const rows = empty ? `<tr class="la-fest-empty-row"><td colspan="7">${T('No data for this festival')}</td></tr>` : f.days.map((d, i) => `<tr data-ui="${id}.day-${i + 1}"><td>${dayLabel(d)}</td><td>${dateS(d.date)}</td>` + (d.hidden ? `<td class="c-hid" data-ui="${id}.day-${i + 1}-hidden">${nh}</td><td></td>` : `<td class="c-num">${num(d.bills)}</td><td class="c-num">${money(d.sales)}</td>`) + `<td>${dateS(d.ly_date)}</td>` + (d.ly_hidden ? `<td class="c-hid" data-ui="${id}.day-${i + 1}-ly-hidden">${nh}</td><td></td>` : `<td class="c-num">${num(d.ly_bills)}</td><td class="c-num">${money(d.ly_sales)}</td>`) + '</tr>').join('');
  const dayTbl = `<table class="la-fest-day" data-ui="${id}.days"><colgroup><col style="width:166px"><col style="width:200px"><col style="width:151px"><col style="width:130px"><col style="width:186px"><col style="width:162px"><col style="width:130px"></colgroup><thead><tr data-ui="${id}.days-head"><th>${T('Day')}</th><th>${T('This year')}</th><th class="c-num">${T('Bills')}</th><th class="c-num">${T('Net sales')}</th><th>${T('Last year')}</th><th class="c-num">${T('Bills')}</th><th class="c-num">${T('Net sales')}</th></tr></thead><tbody>${rows}</tbody></table>`;
  const tab = (t, i) => `<a class="la-tab" data-ui="${id}.tab-${i + 1}" role="tab">${T(t)}</a>`;
  const festName = (LANG === 'ar' ? AR[f.label] : f.label); slot('t.' + f.label.toLowerCase().replace(/[^a-z0-9]+/g, '_'), f.label);
  const chev = '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
  const tick = '<svg class="la-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg>';
  return `<div class="la-pg la-fest" data-ui="${id}" data-state="${v.state}">
<p class="la-pg-sub" data-ui="${id}.subtitle">${T('Product catalogue, categories and the rules that earn on them.')}</p>
<div class="la-tabs" data-state="active-4" role="tablist" data-ui="${id}.tabs">${['Catalogue', 'Categories', 'Heatmap', 'Festival', 'Mapping inbox', 'Missions', 'Windows', 'Retail settings'].map(tab).join('')}</div>
<div class="la-fest-pick" data-ui="${id}.pick"><span>${T('Festival')}</span><span class="la-fest-select" data-ui="${id}.festival-select"><span data-ui="${id}.festival-value">${festName}</span>${chev}</span><span class="la-fest-check${v.noLead ? ' is-off' : ''}" data-ui="${id}.include-days"><span class="la-fest-box" data-ui="${id}.include-days-box">${tick}</span><span>${T('Include the days before')}</span></span></div>
<div class="la-fest-kpis" data-ui="${id}.kpis">${kpis}</div>
<p class="la-fest-note" data-ui="${id}.note">${note}</p>
<div class="la-fest-cols"><section data-ui="${id}.chart-section"><h2 class="la-fest-h2">${T('Sales so far, this year and last year')}</h2>${chart}</section>
<section data-ui="${id}.years-section"><h2 class="la-fest-h2">${T('How the years line up')}</h2>${years}</section></div>
<section data-ui="${id}.days-section"><h2 class="la-fest-h2">${T('Day by day')}</h2>${dayTbl}</section>
</div>`;
}
const SHELL_AR = { pageTitle: 'التجزئة', sectionLeaf1: 'ملخص الإعداد', sectionLeaf2: 'برامج الولاء', sectionLeaf3: 'المستويات', sectionLeaf4: 'قواعد الكسب والاستبدال', sectionLeaf5: 'الشرائح', sectionLeaf6: 'الإعدادات', sectionLeaf7: 'المواقع', sectionLeaf8: 'الموظفون', sectionLeaf9: 'فئات الخدمة', sectionLeaf10: 'الخطة والاستخدام' };
const ar = { lang: 'ar', locale: 'ar-AE', cur: 'AED' };
const VARIANTS = [['', { state: 'hidden-days' }], ['.dark', { state: 'hidden-days', theme: 'dark' }], ['.ar-AED', { state: 'hidden-days', ...ar }], ['.ar-AED.dark', { state: 'hidden-days', theme: 'dark', ...ar }], ['.en-INR', { state: 'hidden-days', cur: 'INR' }], ['.kw-KWD', { state: 'hidden-days', cur: 'KWD' }], ['.en-AED', { state: 'hidden-days', cur: 'AED' }],
  ['.populated', { state: 'populated', populated: 1 }], ['.populated.dark', { state: 'populated', populated: 1, theme: 'dark' }], ['.populated.ar-AED', { state: 'populated', populated: 1, ...ar }],
  ['.zero', { state: 'zero', zero: 1 }], ['.zero.dark', { state: 'zero', zero: 1, theme: 'dark' }], ['.empty', { state: 'empty', empty: 1 }], ['.empty.dark', { state: 'empty', empty: 1, theme: 'dark' }], ['.empty.ar-AED', { state: 'empty', empty: 1, ...ar }],
  ['.no-lead', { state: 'populated', noLead: 1, populated: 1 }], ['.festival-diwali', { state: 'populated', festival: 'diwali-2025', populated: 1 }], ['.festival-eid', { state: 'hidden-days', festival: 'eid-2026', populated: 1 }], ['.race-half', { state: 'hidden-days', race: [0.5, 0.35] }], ['.race-start', { state: 'hidden-days', race: [0, 0] }]];
fs.mkdirSync(ROOT + 'pages/la', { recursive: true });
for (const [sfx, v] of VARIANTS) {
  LANG = v.lang || 'en'; CUR = v.cur || 'INR'; [RATE, DEC] = RATES[CUR];
  let doc = renderLa('shell', { state: 'section-expanded', theme: v.theme, lang: v.lang, currency: v.cur, set: v.lang === 'ar' ? SHELL_AR : undefined, cssBase: '../../tokens/css/' });
  doc = doc.replace(/<div class="la-header-actions".*<\/div>\n(\s*<\/header>)/s, '$1').replace('<!--la:content-->', body(v)).replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-desk-nav.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-page.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-pg-festival.css">\n</head>').replace(/<title>[^<]*<\/title>/, '<title>Loyal Arrow Retail festival</title>');
  fs.writeFileSync(ROOT + `pages/la/retail-festival${sfx}.html`, doc);
}
fs.writeFileSync(ROOT + 'pages/la/retail-festival.page.json', JSON.stringify({ id: 'la-retail-festival', system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'rs-p1b-festival/after_festival-cohort_1440_light.png', data: 'loyal-arrow/data/retail-festival.json', shell: 'la-shell (section-expanded, Retail active)',
  states: { 'hidden-days': 'retail-festival.html (matches reference; 1 hidden day each year)', populated: 'retail-festival.populated.html (no hidden days)', zero: 'retail-festival.zero.html (0 bills this year)', empty: 'retail-festival.empty.html (no data either year)', 'no-lead': 'retail-festival.no-lead.html (days before unchecked)', 'festival-changed': 'retail-festival.festival-diwali.html / .festival-eid.html', 'race-half': 'line race mid-way via --la-race-this/--la-race-last on chart' },
  variants: VARIANTS.map(([s]) => `retail-festival${s}.html`), slots: SLOTS,
  targets: { 'festival change': 'la-retail-festival.festival-select', 'include days checkbox': 'la-retail-festival.include-days', 'line race this year': 'la-retail-festival.line-this', 'line race last year': 'la-retail-festival.line-last', 'delta badges': 'la-retail-festival.delta-sales|bills|basket|shoppers', 'day rows': 'la-retail-festival.day-N', 'hidden cells': 'la-retail-festival.day-N-hidden' } }, null, 1));
console.log('wrote', VARIANTS.length, 'pages');
