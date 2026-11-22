// Composes page retail-placement-lift (loyal-arrow-desk) from loyal-arrow/data/retail-placement-lift.json. Deterministic.
//   node scripts/la-gen-page-placement-lift.mjs -> pages/la/retail-placement-lift[.variant].html + .page.json
// States: populated (base), directional, empty (not-enough-data), zero. Variants add dark/ar-AED/en-INR/kw-KWD, .open (placement select open).
import fs from 'fs'; import { ROOT } from './lib.mjs'; import { renderLa } from '../tools/render-la.mjs';
const D = JSON.parse(fs.readFileSync(ROOT + '../loyal-arrow/data/retail-placement-lift.json', 'utf8'));
const AD = '٠١٢٣٤٥٦٧٨٩';
const AR = { Retail: 'التجزئة', Placement: 'الموضع', 'Placement lift': 'أثر الموضع', Basis: 'الأساس', 'Lift over the matched stores': 'الأثر مقارنة بالمتاجر المطابقة', 'Test stores, before against during': 'متاجر الاختبار، قبل مقابل أثناء',
  'Fewer than 10 bills in the period': 'أقل من ١٠ فواتير في الفترة', 'Against 6 matched stores': 'مقابل ٦ متاجر مطابقة', 'Directional: no matched control': 'اتجاهي: لا متاجر ضابطة مطابقة', 'Not enough data': 'بيانات غير كافية',
  'Confirmed placement': 'موضع مؤكد', 'Planned placement': 'موضع مخطط', 'Ramadan end-cap (end cap)': 'نهاية الممر لرمضان', 'Dairy chiller strip (chiller)': 'شريط ثلاجة الألبان', 'Front-of-store cereal (floor stack)': 'رصة الحبوب في المقدمة',
  'Few stores in the comparison: read the range, not the single number.': 'متاجر قليلة في المقارنة: اقرأ النطاق لا الرقم الواحد.',
  'The placement runs beyond the days measured here (data to yesterday, at most 90 days), so this reads the part so far.': 'يمتد الموضع بعد الأيام المقاسة هنا (البيانات حتى أمس، بحد أقصى ٩٠ يوما)، لذا يعكس الجزء حتى الآن.',
  'Planned, not confirmed. Planned is intent, not proof the display was in place.': 'مخطط وغير مؤكد. المخطط نية وليس دليلا على وجود العرض.',
  'No comparable stores without this placement, so this is directional only.': 'لا متاجر قابلة للمقارنة بدون هذا الموضع، لذا هذا اتجاه فقط.',
  'Some stores also carry another placement of the same products shortly before or during this one and are left out.': 'بعض المتاجر تعرض موضعا آخر لنفس المنتجات قبل هذا الموضع أو أثناءه وقد استُبعدت.',
  'Store': 'المتجر', Role: 'الدور', Test: 'اختبار', Matched: 'مطابق', 'Daily sales': 'المبيعات اليومية', 'Before': 'قبل', 'During': 'أثناء', 'Stores in the comparison': 'المتاجر في المقارنة',
  Hawalli: 'حولي', Salmiya: 'سلمية', Jabriya: 'الجابرية', Farwaniya: 'الفروانية', 'Retail analytics': 'تحليلات التجزئة', 'Placement lift ': 'أثر الموضع', Catalogue: 'الكتالوج', Categories: 'الفئات', Heatmap: 'الخريطة الحرارية', Missions: 'المهام' };
const SLOTS = {}; let LANG = 'en', CUR = 'AED', LOC = 'en-US';
const T = (en, key) => { const ar = AR[en]; if (LANG === 'ar' && ar === undefined) throw new Error('no ar for ' + en); const v = LANG === 'ar' ? ar : en;
  const k = key || 't.' + en.toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 28); const s = SLOTS[k] ||= { type: 'text', sample: en, maxLength: 0, where: 'text' }; s.maxLength = Math.max(s.maxLength, Math.ceil(Math.max(en.length, (ar || '').length) * 1.4) + 2); return v; };
const ad = (s) => LANG === 'ar' ? s.replace(/\d/g, d => AD[d]).replace('.', '٫').replace('%', '٪').replace(/,/g, '٬') : s;
const money = (kwd) => { const r = D.rates[CUR]; const n = kwd * r.rate; const s = new Intl.NumberFormat(LOC, { minimumFractionDigits: r.dec, maximumFractionDigits: r.dec }).format(n); return `${CUR} ${ad(s)}`; };
const rng = (a) => ad(`${a[0]} to ${a[1]}`).replace(' to ', LANG === 'ar' ? ' إلى ' : ' to ');
const dr = (to) => LANG === 'ar' ? ad(`${D.period.from} إلى ${to}، مقارنة بـ ${D.period.baseFrom} إلى ${D.period.baseTo}`) : `${D.period.from} to ${to}, compared with ${D.period.baseFrom} to ${D.period.baseTo}`;
const chev = '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const NOTES = { few: 'Few stores in the comparison: read the range, not the single number.', beyond: 'The placement runs beyond the days measured here (data to yesterday, at most 90 days), so this reads the part so far.',
  planned: 'Planned, not confirmed. Planned is intent, not proof the display was in place.', nocontrol: 'No comparable stores without this placement, so this is directional only.', overlap: 'Some stores also carry another placement of the same products shortly before or during this one and are left out.' };
function body(st, v) {
  const S = D.states[st];
  const lift = st === 'populated' || st === 'zero' ? S.lift : S.lift, basis = st === 'populated' || st === 'zero' ? T('Against 6 matched stores') : T(S.basis);
  const note = (n) => n === 'range' ? `${LANG === 'ar' ? 'النطاق ٩٥٪ ' : '95% range '}${rng(S.range)}${LANG === 'ar' ? ' لكل متجر في اليوم' : ' per store per day'}` : T(NOTES[n]);
  const notes = S.notes.map((n, i) => `<p class="la-pg-note" data-ui="la-retail-placement-lift.note-${i + 1}">${note(n)}</p>`).join('');
  const to = st === 'directional' || st === 'empty' ? D.period.toPlanned : D.period.to;
  const opts = D.placements.map((p, i) => `<li class="la-opt${i === 0 ? ' is-sel' : ''}" data-ui="la-retail-placement-lift.option-${i + 1}">${T(p)}</li>`).join('');
  const rows = st === 'populated' || st === 'zero' ? D.stores.map((s, i) => `<tr data-ui="la-retail-placement-lift.store-row-${i + 1}"><td>${T(s.name)}</td><td>${T(s.role)}</td><td class="la-rt-num la-num">${money(s.baseKWD)}</td><td class="la-rt-num la-num">${money(s.dailyKWD)}</td></tr>`).join('') : '';
  const table = rows ? `<section data-ui="la-retail-placement-lift.stores-section"><h2 class="la-pg-h2">${T('Stores in the comparison')}</h2><table class="la-table la-rt" data-ui="la-retail-placement-lift.stores"><thead><tr><th>${T('Store')}</th><th>${T('Role')}</th><th class="la-rt-num">${T('Before')} (${T('Daily sales')})</th><th class="la-rt-num">${T('During')} (${T('Daily sales')})</th></tr></thead><tbody>${rows}</tbody></table></section>` : '';
  const tab = (t, i) => `<a class="la-tab" data-ui="la-retail-placement-lift.tab-${i + 1}" role="tab">${T(t)}</a>`;
  return `<div class="la-pg" data-ui="la-retail-placement-lift" data-state="${st}">
<div class="la-tabs" data-state="active-4" role="tablist" data-ui="la-retail-placement-lift.tabs">${['Catalogue', 'Categories', 'Heatmap', 'Placement lift ', 'Missions'].map(tab).join('')}</div>
<div class="la-pg-level" data-ui="la-retail-placement-lift.level"><span>${T('Placement')}</span><span class="la-select${v.open ? ' is-open' : ''}" data-ui="la-retail-placement-lift.placement-switch"><span data-ui="la-retail-placement-lift.placement-value">${T(D.placements[0])}</span>${chev}</span></div>
${v.open ? `<ul class="la-pg-opts" data-ui="la-retail-placement-lift.placement-list">${opts}</ul>` : ''}
<div class="la-pg-kpis" data-ui="la-retail-placement-lift.kpis">
<div class="la-pg-kpi" data-ui="la-retail-placement-lift.kpi-lift"><div class="la-pg-kpi-label">${T('Placement lift')}</div><div class="la-pg-kpi-value la-num">${ad(lift)}</div><div class="la-pg-kpi-sub">${T(S.liftSub)}</div></div>
<div class="la-pg-kpi" data-ui="la-retail-placement-lift.kpi-basis"><div class="la-pg-kpi-label">${T('Basis')}</div><div class="la-pg-kpi-value">${basis}</div><div class="la-pg-kpi-sub">${T(S.basisSub)}</div></div></div>
<p class="la-pg-note" data-ui="la-retail-placement-lift.period">${dr(to)}</p>${notes}
${table}</div>`;
}
const SHELL_AR = { pageTitle: 'التجزئة', sectionLeaf1: 'ملخص الإعداد', sectionLeaf2: 'برامج الولاء', sectionLeaf3: 'المستويات', sectionLeaf4: 'قواعد الكسب والاستبدال', sectionLeaf5: 'الشرائح', sectionLeaf6: 'الإعدادات', sectionLeaf7: 'المواقع', sectionLeaf8: 'الموظفون', sectionLeaf9: 'فئات الخدمة', sectionLeaf10: 'الخطة والاستخدام' };
const ARV = { lang: 'ar', locale: 'ar-AE', cur: 'AED' };
const VARIANTS = [['', {}], ['.dark', { theme: 'dark' }], ['.ar-AED', ARV], ['.en-INR', { locale: 'en-IN', cur: 'INR' }], ['.kw-KWD', { cur: 'KWD' }],
  ['.directional', { st: 'directional' }], ['.directional.dark', { st: 'directional', theme: 'dark' }], ['.directional.ar-AED', { st: 'directional', ...ARV }],
  ['.empty', { st: 'empty' }], ['.empty.dark', { st: 'empty', theme: 'dark' }], ['.empty.ar-AED', { st: 'empty', ...ARV }],
  ['.zero', { st: 'zero' }], ['.zero.dark', { st: 'zero', theme: 'dark' }], ['.open', { open: 1 }], ['.open.dark', { open: 1, theme: 'dark' }]];
fs.mkdirSync(ROOT + 'pages/la', { recursive: true });
for (const [sfx, v] of VARIANTS) {
  LANG = v.lang || 'en'; CUR = v.cur || 'AED'; LOC = v.locale === 'en-IN' ? 'en-IN' : 'en-US';
  let doc = renderLa('shell', { state: 'section-expanded', theme: v.theme, lang: v.lang, currency: CUR, set: v.lang === 'ar' ? SHELL_AR : undefined, cssBase: '../../tokens/css/' });
  doc = doc.replace(/<div class="la-header-actions".*<\/div>\n(\s*<\/header>)/s, '$1').replace('<!--la:content-->', body(v.st || 'populated', v)).replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-desk-nav.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-page.css">\n</head>').replace(/<title>[^<]*<\/title>/, '<title>Loyal Arrow Placement lift</title>');
  fs.writeFileSync(ROOT + `pages/la/retail-placement-lift${sfx}.html`, doc);
}
fs.writeFileSync(ROOT + 'pages/la/retail-placement-lift.page.json', JSON.stringify({ id: 'la-retail-placement-lift', system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'rs-p2-analytics-placement-zone/placement-lift*.png', data: 'loyal-arrow/data/retail-placement-lift.json', shell: 'la-shell (section-expanded, Retail active)',
  states: { populated: 'retail-placement-lift.html', directional: 'retail-placement-lift.directional.html', 'not-enough-data': 'retail-placement-lift.empty.html', zero: 'retail-placement-lift.zero.html', 'select-open': 'retail-placement-lift.open.html' },
  variants: VARIANTS.map(([s]) => `retail-placement-lift${s}.html`), slots: SLOTS,
  targets: { 'placement change': 'la-retail-placement-lift.placement-switch', 'placement options': 'la-retail-placement-lift.option-N (in .open)', 'lift value': 'la-retail-placement-lift.kpi-lift', basis: 'la-retail-placement-lift.kpi-basis' } }, null, 1));
console.log('wrote', VARIANTS.length);
