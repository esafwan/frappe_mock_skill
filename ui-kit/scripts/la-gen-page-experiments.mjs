// Composes page retail-experiments (loyal-arrow-desk) from loyal-arrow/data/retail-experiments.json (gen_experiments.py). Deterministic: no clock/random/network.
//   node scripts/la-gen-page-experiments.mjs  -> pages/la/retail-experiments[.variant].html + retail-experiments.page.json
// Variants: base(All, 3 rows, Result expanded; matches reference) .dark .ar-AED .ar-AED.dark .en-INR .kw-KWD .full .collapsed .draft .running .completed .cancelled .empty .empty.dark .zero .count-mid
import fs from 'fs'; import { ROOT } from './lib.mjs'; import { renderLa } from '../tools/render-la.mjs';
const D = JSON.parse(fs.readFileSync(ROOT + '../loyal-arrow/data/retail-experiments.json', 'utf8'));
const AR = { 'Product catalogue, categories and the rules that earn on them.': 'الكتالوج والفئات والقواعد التي تُكسب النقاط عليها.', Funding: 'التمويل', Placements: 'المواضع', 'Store groups': 'مجموعات المتاجر', Experiments: 'التجارب', 'Change review': 'مراجعة التغييرات',
  All: 'الكل', Draft: 'مسودة', Running: 'قيد التشغيل', Completed: 'مكتمل', Cancelled: 'ملغى', 'New experiment': 'تجربة جديدة', Name: 'الاسم', Design: 'التصميم', Measure: 'القياس', Dates: 'التواريخ', Status: 'الحالة',
  'Front shelf dates': 'تواريخ الرف الأمامي', 'Dairy chiller refresh': 'تجديد ثلاجة الألبان', 'Points holdout': 'استثناء النقاط', 'Checkout bonus points': 'نقاط مكافأة الدفع', 'Cereal gondola test': 'اختبار رف الحبوب', 'Weekend bundle': 'عرض نهاية الأسبوع',
  'Matched stores': 'متاجر مطابقة', 'Member holdout': 'استثناء الأعضاء', 'Net sales': 'صافي المبيعات', Bills: 'الفواتير', Result: 'النتيجة', Complete: 'إكمال', Cancel: 'إلغاء', Change: 'تعديل', 'Pair stores': 'ربط المتاجر', Start: 'بدء', Delete: 'حذف',
  'Effect per day': 'الأثر اليومي', Lift: 'الارتفاع', Compared: 'المقارنة', 'Changed / comparison': 'متغير / مقارنة', 'The change is lifting this measure.': 'التغيير يرفع هذا القياس.', 'No clear change on this measure.': 'لا تغيّر واضح في هذا القياس.',
  'Final result, kept when the experiment was completed.': 'النتيجة النهائية، حُفظت عند إكمال التجربة.', 'Not final yet, still counting.': 'ليست نهائية بعد، ما زال الحساب جاريًا.',
  'There is not enough data to measure a result yet.': 'لا توجد بيانات كافية لقياس نتيجة بعد.', 'No experiments yet': 'لا توجد تجارب بعد', 'Create an experiment to compare changed stores with comparison stores.': 'أنشئ تجربة لمقارنة المتاجر المتغيرة بمتاجر المقارنة.', Retail: 'التجزئة' };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], MON_AR = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const AD = '٠١٢٣٤٥٦٧٨٩'; const SLOTS = {}; let LANG = 'en', LOC = 'en-US', CUR = null;
const arD = (s) => s.replace(/\d/g, d => AD[d]).replace(/\./g, '٫').replace(/,/g, '٬');
const slot = (key, en, type = 'text') => { const ar = AR[en]; if (LANG === 'ar' && type === 'text' && ar === undefined) throw new Error('no ar for ' + en); const v = LANG === 'ar' && type === 'text' ? ar : en;
  const s = SLOTS[key] ||= { type, sample: en, maxLength: 0, where: 'text' }; s.maxLength = Math.max(s.maxLength, Math.ceil(Math.max(en.length, (ar || '').length) * 1.4) + 2); return v; };
const T = (en) => slot('t.' + en.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30), en);
const dmy = (iso) => { const [y, m, d] = iso.split('-').map(Number); return LANG === 'ar' ? arD(`${d} ${MON_AR[m - 1]} ${y}`) : `${MON[m - 1]} ${d}, ${y}`; };
const dates = (e) => `${dmy(e.from)} - ${dmy(e.to)}`;
const money = (aed, signed = true) => { const dec = CUR ? D.decimals[CUR] : 2, v = aed * (CUR ? D.fx[CUR] : 1); let s = new Intl.NumberFormat(LOC === 'en-IN' ? 'en-IN' : 'en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(Math.abs(v)); s = (signed ? (v < 0 ? '-' : v > 0 ? '+' : '') : '') + s; return LANG === 'ar' ? arD(s) : s; };
const pct = (p, signed = false) => { let s = (signed && p > 0 ? '+' : '') + p.toFixed(1) + '%'; return LANG === 'ar' ? arD(s).replace('%', '٪') : s; };
const intn = (n) => LANG === 'ar' ? arD(String(n)) : String(n);
const bdi = (s) => `<bdi dir="ltr">${s}</bdi>`;
const ico = (p) => `<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${p}"/></svg>`; void ico;
const FILT = ['All', 'Draft', 'Running', 'Completed', 'Cancelled'];

function resultPanel(e, r, v) {
  const lab = (s) => T(s) + (CUR && v.cur ? ` (${CUR})` : '');   // currency named only on currency variants, so the base matches the reference
  const range = `${bdi(money(r.ci_low))} ${LANG === 'ar' ? 'إلى' : 'to'} ${bdi(money(r.ci_high))}`;
  const zero = r.effect_per_day === 0, pending = v.zero;
  const liftNote = zero ? T('No clear change on this measure.') : T('The change is lifting this measure.');
  const banner = pending ? { st: 'info', t: T('There is not enough data to measure a result yet.') } : r.overlap_pct > 0 ? { st: 'error', t: LANG === 'ar' ? `تشترك متاجر المقارنة بالأعضاء مع المتاجر المتغيرة (${pct(r.overlap_pct)}). قد تكون النتيجة أقل من الواقع.` : `Comparison stores share members with changed stores (${pct(r.overlap_pct)}). The result may be understated.` } : null;
  if (banner?.st === 'error') { const en = `Comparison stores share members with changed stores (6.4%). The result may be understated.`; (SLOTS['t.overlap_warning'] ||= { type: 'text', sample: en, maxLength: 130, where: 'text' }); }
  const heading = (LANG === 'ar' ? 'نتيجة ' : 'Result for ') + slot('t.' + e.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 30), e.name);
  SLOTS['t.result_heading'] ||= { type: 'text', sample: 'Result for Front shelf dates', maxLength: 52, where: 'text' };
  return `<div class="la-ex-result" data-ui="la-retail-experiments.result" data-state="${pending ? 'pending' : 'final'}"><div class="la-ex-h" data-ui="la-retail-experiments.result-title">${heading}</div>
<div class="la-ex-cards" data-ui="la-retail-experiments.result-cards">
<div class="la-pg-kpi" data-ui="la-retail-experiments.kpi-effect"><div class="la-pg-kpi-label">${lab('Effect per day')}</div><div class="la-pg-kpi-value la-num" data-ui="la-retail-experiments.effect-value">${bdi(money(r.effect_per_day))}</div><div class="la-pg-kpi-sub">${range}</div></div>
<div class="la-pg-kpi" data-ui="la-retail-experiments.kpi-lift"><div class="la-pg-kpi-label">${T('Lift')}</div><div class="la-pg-kpi-value la-num" data-ui="la-retail-experiments.lift-value">${bdi(pct(r.lift_pct, true))}</div><div class="la-pg-kpi-sub">${liftNote}</div></div>
<div class="la-pg-kpi" data-ui="la-retail-experiments.kpi-compared"><div class="la-pg-kpi-label">${T('Compared')}</div><div class="la-pg-kpi-value la-num" data-ui="la-retail-experiments.compared-value">${bdi(`${intn(r.changed)} / ${intn(r.comparison)}`)}</div><div class="la-pg-kpi-sub">${T('Changed / comparison')}</div></div>
</div>
${banner ? `<div class="la-banner" data-state="${banner.st === 'info' ? 'info' : 'error'}" role="status" data-ui="la-retail-experiments.warning"><span class="la-banner-text">${banner.t}</span></div>` : ''}
<p class="la-ex-note" data-ui="la-retail-experiments.result-note">${pending ? T('Not final yet, still counting.') : T('Final result, kept when the experiment was completed.')}</p></div>`;
}

function body(v) {
  const all = v.empty ? [] : (v.full || v.filter) ? D.experiments : D.experiments.filter(e => ['exp-1', 'exp-3', 'exp-5'].includes(e.id));
  const rows = v.filter ? all.filter(e => e.status === v.filter) : all;
  const act = FILT.indexOf(v.filter || 'All') + 1;
  const open = v.collapsed ? null : rows.find(e => e.result);   // first experiment that has a result is expanded
  const st = (s) => `<span class="la-status-pill" data-state="${s.toLowerCase()}" data-ui="__ID__">${T(s)}</span>`;
  const resFor = open ? (v.zero ? D.resultZero : v.mid ? D.resultMid : open.result) : null;
  let n = 0; const tr = rows.map((e) => { n++; const i = n; const isOpen = open && e.id === open.id;
    const btn = (a, k) => `<span class="la-btn" data-ui="la-retail-experiments.row-${i}.${a === 'Pair stores' ? 'pair' : a.toLowerCase()}-btn">${T(a)}</span>`;
    return `<tr data-ui="la-retail-experiments.row-${i}" data-status="${e.status.toLowerCase()}"><td class="la-ex-name" data-ui="la-retail-experiments.row-${i}.name">${T(e.name)}</td><td>${T(e.design)}</td><td>${T(e.measure)}</td><td class="la-num">${dates(e)}</td><td>${st(e.status).replace('__ID__', `la-retail-experiments.row-${i}.status`)}</td><td><div class="la-ex-acts">${D.actions[e.status].map(btn).join('')}</div></td></tr>` +
      (isOpen ? `<tr class="la-ex-detail"><td class="la-ex-result" colspan="6">${resultPanel(e, resFor, v)}</td></tr>` : ''); }).join('');
  const empty = `<div class="la-ex-empty" data-ui="la-retail-experiments.empty"><div class="la-ex-empty-t">${T('No experiments yet')}</div><div class="la-ex-empty-b">${T('Create an experiment to compare changed stores with comparison stores.')}</div></div>`;
  const state = v.empty ? 'empty' : v.zero ? 'result-zero' : v.mid ? 'result-count-mid' : v.collapsed ? 'collapsed' : v.filter ? 'filter-' + v.filter.toLowerCase() : v.full ? 'all-six' : 'result-open';
  return `<div class="la-pg la-ex" data-ui="la-retail-experiments" data-state="${state}">
<p class="la-pg-sub" data-ui="la-retail-experiments.subtitle">${T('Product catalogue, categories and the rules that earn on them.')}</p>
<div class="la-tabs" data-state="active-4" role="tablist" data-ui="la-retail-experiments.tabs">${['Funding', 'Placements', 'Store groups', 'Experiments', 'Change review'].map((t, i) => `<a class="la-tab" data-ui="la-retail-experiments.tab-${i + 1}" role="tab">${T(t)}</a>`).join('')}</div>
<div class="la-ex-bar" data-ui="la-retail-experiments.bar"><div class="la-segmented" data-state="active-${act}" role="tablist" data-ui="la-retail-experiments.filter">${FILT.map((f, i) => `<span class="la-seg-opt" role="tab" data-ui="la-retail-experiments.filter-${f.toLowerCase()}">${T(f)}</span>`).join('')}</div><span class="la-ex-new" data-ui="la-retail-experiments.new-btn">${T('New experiment')}</span></div>
<div class="la-ex-wrap" data-ui="la-retail-experiments.table"><table class="la-ex-t"><colgroup><col style="width:167px"><col style="width:141px"><col style="width:96px"><col style="width:212px"><col style="width:118px"><col></colgroup><thead><tr data-ui="la-retail-experiments.head"><th>${T('Name')}</th><th>${T('Design')}</th><th>${T('Measure')}</th><th>${T('Dates')}</th><th>${T('Status')}</th><th></th></tr></thead><tbody>${v.empty ? `<tr><td colspan="6" class="la-ex-emptycell">${empty}</td></tr>` : tr}</tbody></table></div>
</div>`;
}
const SHELL_AR = { pageTitle: 'التجزئة', sectionLeaf1: 'ملخص الإعداد', sectionLeaf2: 'برامج الولاء', sectionLeaf3: 'المستويات', sectionLeaf4: 'قواعد الكسب والاستبدال', sectionLeaf5: 'الشرائح', sectionLeaf6: 'الإعدادات', sectionLeaf7: 'المواقع', sectionLeaf8: 'الموظفون', sectionLeaf9: 'فئات الخدمة', sectionLeaf10: 'الخطة والاستخدام' };
const AE = { lang: 'ar', locale: 'ar-AE', cur: 'AED' };
const VARIANTS = [['', {}], ['.dark', { theme: 'dark' }], ['.ar-AED', AE], ['.ar-AED.dark', { ...AE, theme: 'dark' }], ['.en-INR', { locale: 'en-IN', cur: 'INR' }], ['.kw-KWD', { cur: 'KWD' }], ['.full', { full: 1 }], ['.collapsed', { collapsed: 1 }],
  ['.draft', { filter: 'Draft' }], ['.running', { filter: 'Running' }], ['.completed', { filter: 'Completed' }], ['.cancelled', { filter: 'Cancelled' }], ['.empty', { empty: 1 }], ['.empty.dark', { empty: 1, theme: 'dark' }], ['.zero', { zero: 1 }], ['.count-mid', { mid: 1 }], ['.zero.ar-AED', { ...AE, zero: 1 }]];
fs.mkdirSync(ROOT + 'pages/la', { recursive: true });
for (const [sfx, v] of VARIANTS) {
  LANG = v.lang || 'en'; LOC = v.locale === 'en-IN' ? 'en-IN' : 'en-US'; CUR = v.cur && !(v.cur === 'AED' && LANG === 'en') ? v.cur : null;
  let doc = renderLa('shell', { state: 'section-expanded', theme: v.theme, lang: v.lang, currency: v.cur, set: v.lang === 'ar' ? SHELL_AR : undefined, cssBase: '../../tokens/css/' });
  doc = doc.replace(/<div class="la-header-actions".*<\/div>\n(\s*<\/header>)/s, '$1').replace('<!--la:content-->', body(v)).replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-desk-nav.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-page.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-pg-retail-experiments.css">\n</head>').replace(/<title>[^<]*<\/title>/, '<title>Loyal Arrow Retail experiments</title>');
  fs.writeFileSync(ROOT + `pages/la/retail-experiments${sfx}.html`, doc);
}
fs.writeFileSync(ROOT + 'pages/la/retail-experiments.page.json', JSON.stringify({ id: 'la-retail-experiments', system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'rs-p2-retail-ui/experiments_1440_light.png (also _dark, _rtl)', data: 'loyal-arrow/data/retail-experiments.json', shell: 'la-shell (section-expanded, Retail active)',
  states: { 'result-open': 'retail-experiments.html (matches reference: All, 3 rows, completed row expanded)', 'all-six': 'retail-experiments.full.html', collapsed: 'retail-experiments.collapsed.html (Result closed; cross-fade to base for the expand interaction)', 'filter-draft': 'retail-experiments.draft.html', 'filter-running': 'retail-experiments.running.html', 'filter-completed': 'retail-experiments.completed.html', 'filter-cancelled': 'retail-experiments.cancelled.html', empty: 'retail-experiments.empty.html', 'result-zero': 'retail-experiments.zero.html (0.00 / 0.0% / 0 / 0, info banner)', 'result-count-mid': 'retail-experiments.count-mid.html (lift count-up halfway, +6.3%)' },
  variants: VARIANTS.map(([s]) => `retail-experiments${s}.html`), slots: SLOTS,
  targets: { 'Result button (expand)': 'la-retail-experiments.row-1.result-btn', 'result panel': 'la-retail-experiments.result', 'lift count-up': 'la-retail-experiments.lift-value (swap text zero -> final, or cross-fade .zero / .count-mid / base)', 'effect count-up': 'la-retail-experiments.effect-value', 'compared': 'la-retail-experiments.compared-value', 'warning banner': 'la-retail-experiments.warning', 'status filter': 'la-retail-experiments.filter + filter-{all,draft,running,completed,cancelled}', 'new experiment': 'la-retail-experiments.new-btn', 'row actions': 'la-retail-experiments.row-N.{result,complete,cancel,change,pair,start,delete}-btn', 'status pill': 'la-retail-experiments.row-N.status' } }, null, 1));
console.log('wrote', VARIANTS.length, 'pages');
