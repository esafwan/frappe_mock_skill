// Composes page retail-heatmap (loyal-arrow-desk) from loyal-arrow/data/retail-heatmap.json. Deterministic: no clock/random/network.
//   node scripts/la-gen-page-heatmap.mjs         -> pages/la/retail-heatmap[.variant].html + retail-heatmap.page.json
// Variants: (base=reference with suppressed cells) .dark .ar-AED .en-INR .full(populated) .empty(zero) .hover(cell hover) .full.dark .empty.dark
import fs from 'fs'; import { ROOT } from './lib.mjs'; import { renderLa } from '../tools/render-la.mjs';
const D = JSON.parse(fs.readFileSync(ROOT + '../loyal-arrow/data/retail-heatmap.json', 'utf8'));
const AR = { 'Product catalogue, categories and the rules that earn on them.': 'الكتالوج والفئات والقواعد التي تُكسب النقاط عليها.', Catalogue: 'الكتالوج', Categories: 'الفئات', Heatmap: 'الخريطة الحرارية', 'Mapping inbox': 'صندوق الربط', 'Retail settings': 'إعدادات التجزئة',
  'Category level': 'مستوى الفئة', 'Level 1': 'المستوى ١', 'Bills with a member': 'فواتير بعضو', 'Active members': 'الأعضاء النشطون', 'Cells shown': 'الخلايا المعروضة', Stores: 'المتاجر', 'Spent in this period': 'أنفقوا في هذه الفترة', 'In this programme': 'في هذا البرنامج',
  'Category by store': 'الفئة حسب المتجر', 'Penetration and share of wallet': 'الاختراق وحصة المحفظة', 'Bills with a member, by store': 'الفواتير بعضو، حسب المتجر', Store: 'المتجر', Category: 'الفئة', Penetration: 'الاختراق', 'Share of wallet': 'حصة المحفظة', Bills: 'الفواتير', 'With a member': 'بعضو',
  'Not enough data': 'بيانات غير كافية', 'No data in this period': 'لا بيانات في هذه الفترة', Hawalli: 'حولي', Jabriya: 'الجابرية', Salmiya: 'سلمية', Bakery: 'مخبوزات', Beauty: 'تجميل', Dairy: 'ألبان', Grocery: 'بقالة', Home: 'المنزل' };
const SLOTS = {}; let LANG = 'en', LOC = 'en-US', EMPTY = false;
const AD = '٠١٢٣٤٥٦٧٨٩';
const slot = (key, en, type = 'text') => { const ar = AR[en]; if (LANG === 'ar' && type === 'text' && ar === undefined) throw new Error('no ar for ' + en); const v = LANG === 'ar' && type === 'text' ? ar : en;
  const s = SLOTS[key] ||= { type, sample: en, maxLength: 0, where: 'text' }; s.maxLength = Math.max(s.maxLength, Math.ceil(Math.max(en.length, (ar || '').length) * 1.4) + 2); return v; };
const num = (n) => { let s = new Intl.NumberFormat(LOC === 'en-IN' ? 'en-IN' : 'en-US').format(n); return LANG === 'ar' ? s.replace(/\d/g, d => AD[d]).replace(',', '٬') : s; };
const pct = (p) => { let s = p + '%'; return LANG === 'ar' ? s.replace(/\d/g, d => AD[d]).replace('.', '٫').replace('%', '٪') : s; };
const T = (en) => slot('t.' + en.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 28), en);
const dateRange = () => LANG === 'ar' ? `${D.period.from.replace(/\d/g, d => AD[d])} إلى ${D.period.to.replace(/\d/g, d => AD[d])}` : `${D.period.from} to ${D.period.to}`;
const note = () => LANG === 'ar' ? `تغطي الأرقام ${dateRange()}. تُخفى الخلايا التي فيها أقل من ١٠ فواتير.` : `Figures cover ${dateRange()}. Cells with fewer than 10 bills are hidden.`;
const ico = (p) => `<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${p}"/></svg>`;

function body(v) {
  const sup = new Set(v.full || EMPTY ? [] : D.suppressed.map(x => x.join())), miss = new Set(v.full || EMPTY ? [] : D.missing.map(x => x.join()));
  const shown = EMPTY ? 0 : v.full ? 12 : D.totals.cellsShown, hidden = EMPTY ? 12 : v.full ? 0 : D.totals.cellsHidden;
  const kpi = (id, label, value, sub) => `<div class="la-pg-kpi" data-ui="la-retail-heatmap.kpi-${id}"><div class="la-pg-kpi-label">${T(label)}</div><div class="la-pg-kpi-value">${value}</div><div class="la-pg-kpi-sub">${sub}</div></div>`;
  const subBills = EMPTY ? `0 ${LANG === 'ar' ? 'من' : 'of'} 0` : LANG === 'ar' ? `${num(D.totals.withMember)} من ${num(D.totals.bills)} فاتورة` : `${num(D.totals.withMember)} of ${num(D.totals.bills)} bills`;
  const subCells = LANG === 'ar' ? `${num(hidden)} مخفية، أقل من ١٠ فواتير` : `${num(hidden)} hidden, fewer than 10 bills`;
  const grid = D.stores.map((s, r) => `<tr data-ui="la-retail-heatmap.row-${r + 1}"><th class="la-cg-store">${T(s)}</th>` + D.categories.map((c, k) => {
    const x = D.cells[r][k], key = [r, k].join(), isS = EMPTY || sup.has(key), isM = !EMPTY && miss.has(key);
    const cls = 'la-cg-cell' + (isS ? ' is-sup' : '') + (isM ? ' is-miss' : '') + (v.hover && r === 0 && k === 2 ? ' is-hover' : '');
    return `<td class="${cls}" data-ui="la-retail-heatmap.cell-r${r + 1}c${k + 1}"><div class="la-cg-body"><div class="la-cg-val la-num">${num(x.v)}</div><div class="la-cg-pct la-num">${pct(x.p)}</div><div class="la-cg-meter" data-ui="la-retail-heatmap.bar-r${r + 1}c${k + 1}"><i class="la-cg-fill" style="--fill:${x.m}"></i></div></div><div class="la-cg-sup">${isM ? '' : T('Not enough data')}</div></td>`; }).join('') + '</tr>').join('');
  const empty = (n) => `<tr class="la-rt-empty"><td colspan="${n}">${T('No data in this period')}</td></tr>`;
  const wallet = EMPTY ? empty(3) : D.wallet.map((w, i) => `<tr data-ui="la-retail-heatmap.wallet-row-${i + 1}"><td>${T(w.cat)}</td><td class="la-rt-num la-num">${pct(w.pen)}</td><td class="la-rt-num la-num">${pct(w.sow)}</td></tr>`).join('');
  const bills = EMPTY ? empty(3) : D.stores.map((s, i) => `<tr data-ui="la-retail-heatmap.bills-row-${i + 1}"><td>${T(s)}</td><td class="la-rt-num la-num">${num(D.storeBills[i].bills)}</td><td class="la-rt-num la-num">${pct(D.storeBills[i].pct)}</td></tr>`).join('');
  const tab = (t, i) => `<a class="la-tab" data-ui="la-retail-heatmap.tab-${i + 1}" role="tab">${T(t)}</a>`;
  const chev = ico('M6 9l6 6 6-6');
  return `<div class="la-pg" data-ui="la-retail-heatmap" data-state="${EMPTY ? 'empty' : v.full ? 'populated' : 'suppressed-cells'}">
<p class="la-pg-sub" data-ui="la-retail-heatmap.subtitle">${T('Product catalogue, categories and the rules that earn on them.')}</p>
<div class="la-tabs" data-state="active-3" role="tablist" data-ui="la-retail-heatmap.tabs">${['Catalogue', 'Categories', 'Heatmap', 'Mapping inbox', 'Retail settings'].map(tab).join('')}</div>
<div class="la-pg-level" data-ui="la-retail-heatmap.level"><span>${T('Category level')}</span><span class="la-select" data-ui="la-retail-heatmap.level-switch"><span data-ui="la-retail-heatmap.level-value">${T('Level 1')}</span>${chev}</span></div>
<div class="la-pg-kpis" data-ui="la-retail-heatmap.kpis">${kpi('bills', 'Bills with a member', EMPTY ? pct('0') : pct(D.totals.pct), subBills)}${kpi('members', 'Active members', num(EMPTY ? 0 : D.totals.activeMembers), T('Spent in this period'))}${kpi('cells', 'Cells shown', num(shown), subCells)}${kpi('stores', 'Stores', num(D.totals.stores), T('In this programme'))}</div>
<p class="la-pg-note" data-ui="la-retail-heatmap.note">${note()}</p>
<div class="la-pg-cols">
<section data-ui="la-retail-heatmap.grid-section"><h2 class="la-pg-h2">${T('Category by store')}</h2><div class="la-cat-heat-grid"><table class="la-cg" data-ui="la-retail-heatmap.grid"><thead><tr data-ui="la-retail-heatmap.grid-head"><th class="la-cg-store">${T('Store')}</th>${D.categories.map(c => `<th class="la-cg-cat">${T(c)}</th>`).join('')}</tr></thead><tbody>${grid}</tbody></table></div></section>
<section data-ui="la-retail-heatmap.wallet-section"><h2 class="la-pg-h2">${T('Penetration and share of wallet')}</h2><table class="la-table la-rt" data-ui="la-retail-heatmap.wallet"><thead><tr><th>${T('Category')}</th><th class="la-rt-num">${T('Penetration')}</th><th class="la-rt-num">${T('Share of wallet')}</th></tr></thead><tbody>${wallet}</tbody></table></section>
</div>
<section data-ui="la-retail-heatmap.bills-section"><h2 class="la-pg-h2">${T('Bills with a member, by store')}</h2><table class="la-table la-rt" data-ui="la-retail-heatmap.bills"><thead><tr><th>${T('Store')}</th><th class="la-rt-num">${T('Bills')}</th><th class="la-rt-num">${T('With a member')}</th></tr></thead><tbody>${bills}</tbody></table></section>
</div>`;
}
const SHELL_AR = { pageTitle: 'التجزئة', sectionLeaf1: 'ملخص الإعداد', sectionLeaf2: 'برامج الولاء', sectionLeaf3: 'المستويات', sectionLeaf4: 'قواعد الكسب والاستبدال', sectionLeaf5: 'الشرائح', sectionLeaf6: 'الإعدادات', sectionLeaf7: 'المواقع', sectionLeaf8: 'الموظفون', sectionLeaf9: 'فئات الخدمة', sectionLeaf10: 'الخطة والاستخدام' };
const VARIANTS = [['', {}], ['.dark', { theme: 'dark' }], ['.ar-AED', { lang: 'ar', locale: 'ar-AE', cur: 'AED' }], ['.en-INR', { locale: 'en-IN', cur: 'INR' }], ['.full', { full: 1 }], ['.full.dark', { full: 1, theme: 'dark' }], ['.empty', { empty: 1 }], ['.empty.dark', { empty: 1, theme: 'dark' }], ['.hover', { hover: 1 }], ['.full.ar-AED', { full: 1, lang: 'ar', locale: 'ar-AE', cur: 'AED' }]];
fs.mkdirSync(ROOT + 'pages/la', { recursive: true });
for (const [sfx, v] of VARIANTS) {
  LANG = v.lang || 'en'; LOC = v.locale === 'en-IN' ? 'en-IN' : 'en-US'; EMPTY = !!v.empty;
  let doc = renderLa('shell', { state: 'section-expanded', theme: v.theme, lang: v.lang, currency: v.cur, set: v.lang === 'ar' ? SHELL_AR : undefined, cssBase: '../../tokens/css/' });
  doc = doc.replace(/<div class="la-header-actions".*<\/div>\n(\s*<\/header>)/s, '$1').replace('<!--la:content-->', body(v)).replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-desk-nav.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-page.css">\n</head>').replace(/<title>[^<]*<\/title>/, '<title>Loyal Arrow Retail heatmap</title>');
  fs.writeFileSync(ROOT + `pages/la/retail-heatmap${sfx}.html`, doc);
}
fs.writeFileSync(ROOT + 'pages/la/retail-heatmap.page.json', JSON.stringify({ id: 'la-retail-heatmap', system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'rs-p1a-heatmap/after_heatmap_1440_light.png', data: 'loyal-arrow/data/retail-heatmap.json', shell: 'la-shell (section-expanded, Retail active)',
  states: { 'suppressed-cells': 'retail-heatmap.html (matches reference)', populated: 'retail-heatmap.full.html', empty: 'retail-heatmap.empty.html (zero)', hover: 'retail-heatmap.hover.html (cell r1c3)' },
  variants: VARIANTS.map(([s]) => `retail-heatmap${s}.html`), slots: SLOTS,
  targets: { 'level switch': 'la-retail-heatmap.level-switch', 'bars fill': 'la-retail-heatmap.bar-rNcM (inner .la-cg-fill width = --fill * --la-progress)', 'cell hover': 'la-retail-heatmap.cell-rNcM' } }, null, 1));
console.log('wrote', VARIANTS.length, 'pages');
