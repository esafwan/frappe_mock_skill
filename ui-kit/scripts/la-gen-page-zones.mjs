// Composes page retail-zones (loyal-arrow-desk) from loyal-arrow/data/retail-zones.json. Deterministic: no clock/random/network.
//   node scripts/la-gen-page-zones.mjs   -> pages/la/retail-zones[.variant].html + retail-zones.page.json
// States: (base = inherited, matches reference) .populated (all explicit) .empty (no zones set) .zero (no categories) .pick (zone menu open) .saved (Home set).
// Cosmetic variants: .dark .ar-AED .en-INR .kw-KWD .ar-AED.dark
import fs from 'fs'; import { ROOT } from './lib.mjs'; import { renderLa } from '../tools/render-la.mjs';
const D = JSON.parse(fs.readFileSync(ROOT + '../loyal-arrow/data/retail-zones.json', 'utf8'));
const AR = { Funding: 'التمويل', Placements: 'المواضع', 'Store groups': 'مجموعات المتاجر', Experiments: 'التجارب', 'Change review': 'مراجعة التغييرات', Groups: 'المجموعات', 'Zone map': 'خريطة المناطق',
  'Set zones for': 'تعيين المناطق لـ', 'Template:': 'القالب:', Category: 'الفئة', Zone: 'المنطقة', Set: 'تعيين', Clear: 'مسح', 'From the category above:': 'من الفئة أعلاه:', 'No categories yet': 'لا توجد فئات بعد',
  'Not set': 'غير معيّن', Entrance: 'المدخل', 'Chilled aisle': 'ممر التبريد', 'Dry goods aisle': 'ممر المواد الجافة', 'Checkout lane': 'ممر الدفع', 'Bakery counter': 'ركن المخبوزات',
  Food: 'أغذية', Bakery: 'مخبوزات', Dairy: 'ألبان', Milk: 'حليب', Home: 'منزل',
  'Hawalli and Salmiya': 'حولي والسالمية', 'Marina and Deira': 'المارينا وديرة', 'Olaya and Malaz': 'العليا والملز', 'West Bay and Lusail': 'الخليج الغربي ولوسيل', 'Indiranagar and Koramangala': 'إنديرانغار وكورامنغالا' };
const SLOTS = {}; let LANG = 'en';
const T = (en) => { const ar = AR[en]; if (LANG === 'ar' && ar === undefined) throw new Error('no ar for ' + en); const k = 't.' + en.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 28);
  const s = SLOTS[k] ||= { type: 'text', sample: en, maxLength: 0, where: 'text' }; s.maxLength = Math.max(s.maxLength, Math.ceil(Math.max(en.length, (ar || '').length) * 1.4) + 2); return LANG === 'ar' ? ar : en; };
const ico = (p) => `<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${p}"/></svg>`;
const P = 'la-retail-zones';
function body(v) {
  const cats = v.zero ? [] : D.categories;
  // resolve each row: explicit zone / inherited zone / none
  const z = cats.map(c => v.empty ? null : v.populated ? (c.populatedZone ?? c.zone) : (v.saved && c.id === 'home') ? 'Dry goods aisle' : c.zone);
  const rows = cats.map((c, i) => { let own = z[i], inh = null; if (!own) { for (let j = i - 1; j >= 0; j--) if (cats[j].level < c.level && z[j]) { inh = z[j]; break; } /* nearest shallower ancestor */ if (inh == null) for (let j = i - 1; j >= 0; j--) if (cats[j].level < c.level) { inh = z[j] || null; break; } } return { c, i: i + 1, own, inh }; });
  const tr = rows.map(({ c, i, own, inh }) => {
    const menuOpen = v.pick && c.id === 'home';
    const field = own ? `<div class="la-fld${menuOpen ? ' is-focus' : ''}" data-ui="${P}.zone-${i}">${T(own)}</div>` : inh ? `<div class="la-fld is-muted" data-ui="${P}.zone-${i}">${T(inh)}</div><div class="la-fhint" data-ui="${P}.hint-${i}">${T('From the category above:')} ${T(inh)}</div>` : `<div class="la-fld${menuOpen ? ' is-focus' : ''}" data-ui="${P}.zone-${i}"></div>`;
    const menu = menuOpen ? `<div class="la-menu la-zn-menu is-open" data-ui="${P}.zone-${i}.menu">${D.zones.slice(0, 4).map((n, k) => `<div class="la-menu-item${k === 2 ? ' is-active' : ''}" data-ui="${P}.zone-${i}.opt-${k + 1}">${T(n)}</div>`).join('')}</div>` : '';
    return `<tr class="la-tr" data-ui="${P}.row-${i}"><th class="la-tt-cat la-indent-${c.level}" scope="row" data-ui="${P}.cat-${i}" data-level="${c.level}">${T(c.name)}</th><td class="la-tt-zone la-zn-cell">${field}${menu}</td><td class="la-tt-act"><span class="la-acts"><span class="la-btn" data-ui="${P}.btn-set-${i}">${T('Set')}</span>${own ? `<span class="la-btn" data-ui="${P}.btn-clear-${i}">${T('Clear')}</span>` : ''}</span></td></tr>`; }).join('');
  const none = v.zero ? `<tr class="la-tr la-zn-none" data-ui="${P}.none"><td colspan="3">${T('No categories yet')}</td></tr>` : '';
  const tabs = ['Funding', 'Placements', 'Store groups', 'Experiments', 'Change review'].map((t, i) => `<a class="la-tab" data-ui="${P}.tab-${i + 1}" role="tab">${T(t)}</a>`).join('');
  const seg = ['Groups', 'Zone map'].map((t, i) => `<span class="la-seg-opt" data-ui="${P}.seg-${i + 1}" role="tab">${T(t)}</span>`).join('');
  const tpl = D.templates[v.cur || 'KWD'];
  const state = v.zero ? 'zero' : v.empty ? 'empty' : v.populated ? 'populated' : v.pick ? 'pick' : v.saved ? 'saved' : 'inherited';
  return `<div class="la-pg la-zn" data-ui="${P}" data-state="${state}">
<div class="la-tabs" data-state="active-3" role="tablist" data-ui="${P}.tabs">${tabs}</div>
<div class="la-segmented la-zn-seg" data-state="active-2" role="tablist" data-ui="${P}.segmented">${seg}</div>
<section class="la-tree-table" data-ui="${P}.tree"><div class="la-tt-top"><div class="la-lbl" data-ui="${P}.set-for">${T('Set zones for')}</div><div class="la-fld la-fld-template" data-ui="${P}.template">${T('Template:')} ${T(tpl)}</div></div>
<table class="la-table la-tt" data-ui="${P}.table"><thead><tr data-ui="${P}.head"><th class="la-tt-cat" data-ui="${P}.col-category">${T('Category')}</th><th colspan="2" data-ui="${P}.col-zone">${T('Zone')}</th></tr></thead><tbody>${tr}${none}</tbody></table></section>
</div>`;
}
const SHELL_AR = { pageTitle: 'التجزئة', sectionLeaf1: 'ملخص الإعداد', sectionLeaf2: 'برامج الولاء', sectionLeaf3: 'المستويات', sectionLeaf4: 'قواعد الكسب والاستبدال', sectionLeaf5: 'الشرائح', sectionLeaf6: 'الإعدادات', sectionLeaf7: 'المواقع', sectionLeaf8: 'الموظفون', sectionLeaf9: 'فئات الخدمة', sectionLeaf10: 'الخطة والاستخدام' };
const VARIANTS = [['', {}], ['.dark', { theme: 'dark' }], ['.ar-AED', { lang: 'ar', locale: 'ar-AE', cur: 'AED' }], ['.ar-AED.dark', { lang: 'ar', locale: 'ar-AE', cur: 'AED', theme: 'dark' }], ['.en-INR', { locale: 'en-IN', cur: 'INR' }], ['.kw-KWD', { cur: 'KWD' }],
  ['.populated', { populated: 1 }], ['.populated.dark', { populated: 1, theme: 'dark' }], ['.empty', { empty: 1 }], ['.zero', { zero: 1 }], ['.pick', { pick: 1 }], ['.pick.dark', { pick: 1, theme: 'dark' }], ['.saved', { saved: 1 }]];
fs.mkdirSync(ROOT + 'pages/la', { recursive: true });
for (const [sfx, v] of VARIANTS) {
  LANG = v.lang || 'en';
  let doc = renderLa('shell', { state: 'section-expanded', theme: v.theme, lang: v.lang, currency: v.cur, set: v.lang === 'ar' ? SHELL_AR : undefined, cssBase: '../../tokens/css/' });
  doc = doc.replace(/<div class="la-header-actions".*<\/div>\n(\s*<\/header>)/s, '$1').replace('<!--la:content-->', body(v)).replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-desk-nav.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-admin.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-chart.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-list.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-page.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-pg-zones.css">\n</head>').replace(/<title>[^<]*<\/title>/, '<title>Loyal Arrow Retail zone map</title>');
  fs.writeFileSync(ROOT + `pages/la/retail-zones${sfx}.html`, doc);
}
fs.writeFileSync(ROOT + 'pages/la/retail-zones.page.json', JSON.stringify({ id: P, system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'rs-p2-retail-ui/zones_1440_light.png', data: 'loyal-arrow/data/retail-zones.json',
  states: { inherited: 'retail-zones.html (matches reference)', populated: 'retail-zones.populated.html', empty: 'retail-zones.empty.html', zero: 'retail-zones.zero.html (no categories)', pick: 'retail-zones.pick.html (zone menu open on Home)', saved: 'retail-zones.saved.html (Home set, Clear shown)' },
  variants: VARIANTS.map(([s]) => `retail-zones${s}.html`), slots: SLOTS,
  targets: { 'pick zone': 'la-retail-zones.zone-N (open: .zone-N.menu, .zone-N.opt-M)', Set: 'la-retail-zones.btn-set-N', Clear: 'la-retail-zones.btn-clear-N', template: 'la-retail-zones.template', 'sub-tab Groups/Zone map': 'la-retail-zones.seg-1/2', tabs: 'la-retail-zones.tab-1..5' } }, null, 1));
console.log('wrote', VARIANTS.length, 'pages');
