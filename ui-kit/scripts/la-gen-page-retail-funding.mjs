// Composes page retail-funding (loyal-arrow-desk) from loyal-arrow/data/retail-funding.json (made by loyal-arrow/data/gen_funding.py). Deterministic.
//   node scripts/la-gen-page-retail-funding.mjs   -> pages/la/retail-funding[.variant].html + retail-funding.page.json
// Variants: base (reference, KWD) .dark .ar-AED .en-INR .kw-KWD .en-AED  state flip: .state-open .state-near .state-full (+ .dark)  .open .near-limit .full .no-cap  .zero .empty (+ .dark)
import fs from 'fs'; import { ROOT } from './lib.mjs'; import { renderLa } from '../tools/render-la.mjs';
const D = JSON.parse(fs.readFileSync(ROOT + '../loyal-arrow/data/retail-funding.json', 'utf8'));
const AR = { 'Funding': 'التمويل', 'Placements': 'المواضع', 'Store groups': 'مجموعات المتاجر', 'Experiments': 'التجارب', 'Change review': 'مراجعة التغييرات', 'Agreements': 'الاتفاقيات', 'In this programme': 'في هذا البرنامج',
  'Near the limit': 'قرب الحد', 'Close to the cap': 'قريب من السقف', 'Full': 'مكتمل', 'Cap reached': 'تم بلوغ السقف', 'Claim month': 'شهر المطالبة', 'Agreement': 'الاتفاقية', 'Supplier': 'المورّد', 'Used': 'المستخدم', 'Cap': 'السقف', 'Meter': 'المؤشر', 'State': 'الحالة', 'Claim': 'المطالبة',
  'Open': 'مفتوح', 'No cap': 'بلا سقف', 'Active': 'نشط', 'Paused': 'متوقف', 'Export claim': 'تصدير المطالبة', 'Ledger check': 'فحص السجل', 'From': 'من', 'To': 'إلى', 'Check the ledger': 'افحص السجل',
  'Compares the points charged to suppliers with the points issued on matching bill lines, net of returns.': 'يقارن النقاط المحمّلة على الموردين بالنقاط الصادرة على بنود الفواتير المطابقة، بعد خصم المرتجعات.',
  'No funding agreements yet': 'لا اتفاقيات تمويل بعد',
  'Dairy launch': 'إطلاق الألبان', 'Breakfast cereal': 'حبوب الإفطار', 'Summer bundle': 'حزمة الصيف', 'Local bakery, no cap': 'مخبز محلي، بلا سقف', 'Dalia Dairies': 'مصنع داليا للألبان', 'Nordic Cereal Co': 'شركة نورديك للحبوب', 'Fizzo Beverages': 'فيزو للمشروبات', 'Hearth Bakers': 'مخابز الموقد' };
const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const MON_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const CUR_AR = { AED: 'د.إ', SAR: 'ر.س', QAR: 'ر.ق', KWD: 'د.ك', INR: '₹' };
const AD = '٠١٢٣٤٥٦٧٨٩'; const SLOTS = {}; let LANG = 'en', CUR = 'KWD', LOC = 'en-US';
const dg = (s) => LANG === 'ar' ? String(s).replace(/\d/g, d => AD[d]) : String(s);
const slot = (key, en, type = 'text') => { const ar = AR[en]; if (LANG === 'ar' && type === 'text' && ar === undefined) throw new Error('no ar for ' + en); const v = LANG === 'ar' && type === 'text' ? ar : en;
  const s = SLOTS[key] ||= { type, sample: en, maxLength: 0, where: 'text' }; s.maxLength = Math.max(s.maxLength, Math.ceil(Math.max(en.length, (ar || '').length) * 1.4) + 2); return v; };
const T = (en) => slot('t.' + en.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 28), en);
const N = (n) => dg(new Intl.NumberFormat(LOC === 'en-IN' ? 'en-IN' : 'en-US').format(n));
const money = (kwd) => { const c = D.currencies[CUR]; const v = kwd * c.rate; let s = new Intl.NumberFormat(LOC === 'en-IN' ? 'en-IN' : 'en-US', { minimumFractionDigits: c.dec, maximumFractionDigits: c.dec }).format(v);
  if (LANG === 'ar') return dg(s).replace(/,/g, '٬').replace('.', '٫') + ' ' + CUR_AR[CUR]; return s + ' ' + CUR; };
const pctOf = (a) => a.cap ? Math.round(a.used / a.cap * 100) : null;
const stateOf = (a) => { const p = pctOf(a); return p === null ? 'open' : p >= 100 ? 'full' : p >= 80 ? 'near-limit' : 'open'; };
const PILL = { open: ['Open', 'is-green'], 'near-limit': ['Near the limit', 'is-amber'], full: ['Full', 'is-red'] };
const ico = (p) => `<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true">${p}</svg>`;
const CAL = ico('<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>');
const monthLabel = () => LANG === 'ar' ? `${MON_AR[D.claim_month.month - 1]} ${dg(D.claim_month.year)}` : `${MON[D.claim_month.month - 1]} ${D.claim_month.year}`;
const dmy = (iso) => dg(iso.split('-').reverse().join('/'));

// v.agr: agreements override; v.focus: highlighted row index; v.empty
function body(v) {
  const A = v.empty ? [] : v.agr; const P = 'la-retail-funding';
  const near = A.filter(a => stateOf(a) === 'near-limit').length, full = A.filter(a => stateOf(a) === 'full').length;
  const kpi = (id, label, value, sub) => `<div class="la-pg-kpi" data-ui="${P}.kpi-${id}"><div class="la-pg-kpi-label">${T(label)}</div><div class="la-pg-kpi-value">${N(value)}</div><div class="la-pg-kpi-sub">${T(sub)}</div></div>`;
  const tab = (t, i) => `<a class="la-tab" data-ui="${P}.tab-${i + 1}" role="tab">${T(t)}</a>`;
  const rows = A.length ? A.map((a, i) => { const p = pctOf(a), st = stateOf(a), [pl, pc] = PILL[st], n = i + 1;
    const meter = p === null ? `<span class="la-fund-nocap" data-ui="${P}.nocap-${n}">${T('No cap')}</span>`
      : `<div class="la-fund-meter" data-ui="${P}.meter-${n}"><div class="la-cg-meter" data-ui="${P}.bar-${n}"><i class="la-cg-fill" data-ui="${P}.fill-${n}" style="--fill:${Math.min(100, p)}"></i></div><span class="la-fund-pct la-num" data-ui="${P}.pct-${n}">${dg(p)}${LANG === 'ar' ? '٪' : '%'}</span></div>`;
    return `<tr class="la-fund-tr${v.focus === i ? ' is-focus' : ''}" data-state="${st}" data-ui="${P}.row-${n}"><td class="la-fund-agr" data-ui="${P}.agr-${n}">${T(a.name)}<br>${T(a.status)}</td><td data-ui="${P}.supplier-${n}">${T(a.supplier)}</td><td class="la-rt-num la-num" data-ui="${P}.used-${n}">${money(a.used)}</td><td class="la-rt-num la-num" data-ui="${P}.cap-${n}">${a.cap ? money(a.cap) : T('No cap')}</td><td>${meter}</td><td><span class="la-pill ${pc}" data-ui="${P}.state-${n}" data-state="${st}">${T(pl)}</span></td><td><span class="la-btn" data-ui="${P}.claim-btn-${n}">${T('Export claim')}</span></td></tr>`; }).join('')
    : `<tr class="la-fund-empty"><td colspan="7" data-ui="${P}.empty">${T('No funding agreements yet')}</td></tr>`;
  const cols = ['Agreement', 'Supplier', 'Used', 'Cap', 'Meter', 'State', 'Claim'];
  return `<div class="la-pg la-fund" data-ui="${P}" data-state="${v.empty ? 'empty' : v.zero ? 'zero' : v.stateName || 'mixed'}">
<div class="la-tabs" data-state="active-1" role="tablist" data-ui="${P}.tabs">${['Funding', 'Placements', 'Store groups', 'Experiments', 'Change review'].map(tab).join('')}</div>
<div class="la-pg-kpis" data-ui="${P}.kpis">${kpi('agreements', 'Agreements', A.length, 'In this programme')}${kpi('near', 'Near the limit', near, 'Close to the cap')}${kpi('full', 'Full', full, 'Cap reached')}</div>
<section data-ui="${P}.agreements"><h2 class="la-pg-h2" data-ui="${P}.agreements-h">${T('Agreements')}</h2>
<span class="la-fund-lbl" data-ui="${P}.claim-month-label">${T('Claim month')}</span><div class="la-fund-date" data-ui="${P}.claim-month"><span>${monthLabel()}</span>${CAL}</div>
<table class="la-table la-fund-tbl" data-ui="${P}.table"><colgroup><col style="width:17.1%"><col style="width:13.7%"><col style="width:12.8%"><col style="width:12.8%"><col style="width:19.7%"><col style="width:11.8%"><col></colgroup><thead><tr data-ui="${P}.head">${cols.map((c, i) => `<th class="${i === 2 || i === 3 ? 'la-rt-num' : ''}">${T(c)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></section>
<section class="la-fund-ledger" data-ui="${P}.ledger"><h2 class="la-pg-h2" data-ui="${P}.ledger-h">${T('Ledger check')}</h2><p class="la-fund-note" data-ui="${P}.ledger-note">${T('Compares the points charged to suppliers with the points issued on matching bill lines, net of returns.')}</p>
<div class="la-fund-lrow"><div><span class="la-fund-lbl">${T('From')}</span><div class="la-fund-date is-sm" data-ui="${P}.ledger-from"><span>${dmy(D.ledger.from)}</span>${CAL}</div></div><div><span class="la-fund-lbl">${T('To')}</span><div class="la-fund-date is-sm" data-ui="${P}.ledger-to"><span>${dmy(D.ledger.to)}</span>${CAL}</div></div><span class="la-btn" data-ui="${P}.ledger-check">${T('Check the ledger')}</span></div></section>
</div>`;
}
const SHELL_AR = { pageTitle: 'التجزئة', sectionLeaf1: 'ملخص الإعداد', sectionLeaf2: 'برامج الولاء', sectionLeaf3: 'المستويات', sectionLeaf4: 'قواعد الكسب والاستبدال', sectionLeaf5: 'الشرائح', sectionLeaf6: 'الإعدادات', sectionLeaf7: 'المواقع', sectionLeaf8: 'الموظفون', sectionLeaf9: 'فئات الخدمة', sectionLeaf10: 'الخطة والاستخدام' };
const base = D.agreements; const withUsed0 = (u) => base.map((a, i) => i === 0 ? { ...a, used: u } : a);
const flip = (k) => ({ agr: withUsed0(D.flip[k]), focus: 0, stateName: 'flip-' + k });
const all = (f) => ({ agr: base.map(f), stateName: 'all' });
const AE = { lang: 'ar', locale: 'ar-AE', cur: 'AED' };
const VARIANTS = [['', {}], ['.dark', { theme: 'dark' }], ['.ar-AED', AE], ['.en-INR', { locale: 'en-IN', cur: 'INR' }], ['.kw-KWD', { cur: 'KWD' }], ['.en-AED', { cur: 'AED' }],
  ['.state-open', flip('open')], ['.state-near', flip('near')], ['.state-full', flip('full')], ['.state-open.dark', { ...flip('open'), theme: 'dark' }], ['.state-near.dark', { ...flip('near'), theme: 'dark' }], ['.state-full.dark', { ...flip('full'), theme: 'dark' }], ['.state-full.ar-AED', { ...flip('full'), ...AE }],
  ['.open', { ...all(a => a.cap ? { ...a, used: Math.round(a.cap * .25) } : a), stateName: 'all-open' }], ['.near-limit', { ...all(a => a.cap ? { ...a, used: Math.round(a.cap * .86) } : a), stateName: 'all-near-limit' }],
  ['.full', { ...all(a => a.cap ? { ...a, used: a.cap } : a), stateName: 'all-full' }], ['.no-cap', { ...all(a => ({ ...a, cap: null })), stateName: 'all-no-cap' }],
  ['.zero', { ...all(a => ({ ...a, used: 0 })), zero: 1 }], ['.zero.dark', { ...all(a => ({ ...a, used: 0 })), zero: 1, theme: 'dark' }], ['.empty', { empty: 1 }], ['.empty.dark', { empty: 1, theme: 'dark' }], ['.empty.ar-AED', { empty: 1, ...AE }]];
fs.mkdirSync(ROOT + 'pages/la', { recursive: true });
for (const [sfx, v0] of VARIANTS) {
  const v = { agr: base, ...v0 }; LANG = v.lang || 'en'; CUR = v.cur || 'KWD'; LOC = v.locale === 'en-IN' ? 'en-IN' : 'en-US';
  let doc = renderLa('shell', { state: 'section-expanded', theme: v.theme, lang: v.lang, currency: v.cur, set: v.lang === 'ar' ? SHELL_AR : undefined, cssBase: '../../tokens/css/' });
  doc = doc.replace(/<div class="la-header-actions".*<\/div>\n(\s*<\/header>)/s, '$1').replace('<!--la:content-->', body(v)).replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-desk-nav.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-page.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-pg-retail-funding.css">\n</head>').replace(/<title>[^<]*<\/title>/, '<title>Loyal Arrow Retail funding</title>');
  fs.writeFileSync(ROOT + `pages/la/retail-funding${sfx}.html`, doc);
}
fs.writeFileSync(ROOT + 'pages/la/retail-funding.page.json', JSON.stringify({ id: 'la-retail-funding', system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'rs-p2-retail-ui/funding_1440_light.png', data: 'loyal-arrow/data/retail-funding.json (gen_funding.py)', shell: 'la-shell (section-expanded, Retail active)',
  states: { mixed: 'retail-funding.html (reference: open 25%, near 86%, full 100%, no cap)', 'flip-open': 'retail-funding.state-open.html', 'flip-near': 'retail-funding.state-near.html', 'flip-full': 'retail-funding.state-full.html', 'all-open': 'retail-funding.open.html', 'all-near-limit': 'retail-funding.near-limit.html', 'all-full': 'retail-funding.full.html', 'all-no-cap': 'retail-funding.no-cap.html', zero: 'retail-funding.zero.html (0% used)', empty: 'retail-funding.empty.html (no agreements)' },
  variants: VARIANTS.map(([s]) => `retail-funding${s}.html`), slots: SLOTS,
  targets: { 'meter fill': 'la-retail-funding.fill-N (width = --fill * --la-progress; animate --la-progress 0..1 on la-retail-funding)', 'state flip': 'la-retail-funding.state-N inside row-N (data-state open|near-limit|full); sequence state-open -> state-near -> state-full flips agreement 1 and KPI counts', 'meter box': 'la-retail-funding.bar-N / meter-N', 'kpis': 'la-retail-funding.kpi-agreements|near|full', 'claim month': 'la-retail-funding.claim-month', 'export': 'la-retail-funding.claim-btn-N', 'ledger': 'la-retail-funding.ledger-from|ledger-to|ledger-check' } }, null, 1));
console.log('wrote', VARIANTS.length, 'pages');
