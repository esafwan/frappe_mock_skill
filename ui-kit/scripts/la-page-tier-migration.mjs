// Builds pages/la/rpt-tier-migration*.html (loyal-arrow-desk). Deterministic: reads loyal-arrow/data/<ds>/tier_migration.json, no clock/random/network.
//   node scripts/la-page-tier-migration.mjs        (writes all variants + rpt-tier-migration.slots.json)
// Text only via slots (S below; maxLength enforced). Interaction targets carry data-ui ids: preset pills, every matrix cell, split-bar segments.
import fs from 'fs'; import path from 'path';
import { renderLa } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const DATA = ROOT + '../loyal-arrow/data/'; const OUT = ROOT + 'pages/la/'; const P = 'la-tmx-tier-migration';
const S = {   // slot: [en, ar, maxLength, type]
  pageTitle: ['Tier Migration Matrix', 'مصفوفة انتقال الفئات', 40], liveQuery: ['Live query as of', 'استعلام مباشر بتاريخ', 28], about: ['About this report +', 'عن هذا التقرير +', 24],
  splitTitle: ['Members by tier at start', 'الأعضاء حسب الفئة عند البداية', 36], movedUp: ['Moved up', 'ارتقوا', 16], unchanged: ['Unchanged', 'دون تغيير', 16], movedDown: ['Moved down', 'انخفضوا', 16],
  period: ['Period', 'الفترة', 16], p7: ['7d', '7 أ', 8], p30: ['30d', '30 ي', 8], p90: ['90d', '90 ي', 8], pq: ['QTD', 'الربع', 8], pc: ['Custom', 'مخصص', 10],
  program: ['Program', 'البرنامج', 16], startDate: ['Start date', 'تاريخ البدء', 16], endDate: ['End date', 'تاريخ الانتهاء', 16], reset: ['Reset', 'إعادة ضبط', 12],
  kUp: ['Upgraded', 'تمت الترقية', 20], kUpR: ['Upgraded rate', 'معدل الترقية', 20], kDn: ['Downgraded', 'تم التخفيض', 20], kDnR: ['Downgraded rate', 'معدل التخفيض', 20], kSame: ['Unchanged', 'دون تغيير', 20], kSameR: ['Unchanged rate', 'معدل الثبات', 20],
  tierAtStart: ['Tier at start', 'الفئة عند البداية', 20], toPfx: ['To', 'إلى', 6],
  t0: ['Not enrolled', 'غير مسجل', 16], t1: ['No tier', 'بدون فئة', 16], t2: ['Bronze', 'برونزي', 16], t3: ['Silver', 'فضي', 16], t4: ['Gold', 'ذهبي', 16], t5: ['Platinum', 'بلاتيني', 16],
  emptyTitle: ['No tier movement in this period', 'لا توجد حركة بين الفئات في هذه الفترة', 44], emptyBody: ['Try a longer period or another program.', 'جرّب فترة أطول أو برنامجًا آخر.', 48],
};
const AD = '٠١٢٣٤٥٦٧٨٩';
const VARIANTS = [   // [file suffix, opts]
  ['', {}], ['.dark', { theme: 'dark' }], ['.ar-AED', { lang: 'ar', loc: 'ar-AE', ds: 'uae-dubai-supermarket' }], ['.en-INR', { loc: 'en-IN', ds: 'india-departmental-store' }],
  ['.zero', { state: 'zero' }], ['.zero.dark', { state: 'zero', theme: 'dark' }], ['.empty', { state: 'empty' }], ['.empty.ar-AED', { state: 'empty', lang: 'ar', loc: 'ar-AE' }],
  ['.preset-qtd', { preset: 'qtd', state: 'preset' }], ['.cell-hl', { hl: 'r3c4', state: 'cell-hl' }], ['.grow', { progress: 0.3, state: 'grow' }],
];
const slotFile = {}; for (const [k, [en, , max]] of Object.entries(S)) slotFile[k] = { type: 'text', sample: en, maxLength: max, where: 'text' };
const intensity = (v, mx) => v <= 0 ? 0 : v / mx > .7 ? 4 : v / mx > .3 ? 2 : 1;
function build(o) {
  const lang = o.lang || 'en', ar = lang === 'ar', ds = o.ds || 'uae-dubai-supermarket'; const d = JSON.parse(fs.readFileSync(`${DATA}${ds}/tier_migration.json`, 'utf8'));
  const t = (k) => { const v = S[k][ar ? 1 : 0]; if (v.length > S[k][2]) throw new Error(`slot ${k} exceeds ${S[k][2]}`); return v; };
  const nf = new Intl.NumberFormat(o.loc === 'en-IN' ? 'en-IN' : 'en-US'); const dg = (s) => ar ? String(s).replace(/\d/g, x => AD[x]) : String(s);
  const n = (v) => dg(nf.format(v)); const pct = (v) => dg((Math.round(v * 100) / 100).toString()).replace('.', ar ? '٫' : '.') + (ar ? '٪' : '%'); const pct1 = (v) => dg(v.toFixed(1)).replace('.', ar ? '٫' : '.') + (ar ? '٪' : '%');
  const zero = o.state === 'zero' || o.state === 'empty'; const m = zero ? d.matrix.map(r => r.map(() => 0)) : d.matrix; const k = zero ? { upgraded: 0, downgraded: 0, unchanged: 0, total: 0, upgraded_rate: 0, downgraded_rate: 0, unchanged_rate: 0 } : d.kpis;
  const share = (v) => k.total ? Math.max(v * 100 / k.total, v ? 0.5 : 0) : 0; const mx = Math.max(...m.flat()) || 1;
  const preset = o.preset || 'custom'; const pr = [['7d', 'p7'], ['30d', 'p30'], ['90d', 'p90'], ['qtd', 'pq'], ['custom', 'pc']];
  const dates = preset === 'qtd' ? ['2026-10-01', '2026-11-15'] : [d.period.start, d.period.end];
  const tz = ar ? 'Asia/Dubai' : d.timezone; const prog = o.progress ?? 1;
  const cols = [171, 160, 150, 168, 168, 152, 170]; const tiers = [0, 1, 2, 3, 4, 5].map(i => t('t' + i));
  const head = `<th data-ui="${P}.col-tier">${t('tierAtStart')}</th>` + tiers.map((x, i) => `<th class="la-hc-col" data-ui="${P}.col-${i + 1}">${t('toPfx')} ${x}</th>`).join('');
  const rows = m.map((r, ri) => `<tr data-ui="${P}.row-${ri + 1}"><td class="la-hc-rowh">${tiers[ri]}</td>` + r.map((v, ci) => { const id = `r${ri + 1}c${ci + 1}`; return `<td class="la-hc la-heat-${intensity(v, mx)} la-num${o.hl === id ? ' is-hl' : ''}" data-ui="${P}.cell-${id}">${n(v)}</td>`; }).join('') + '</tr>').join('');
  const body = `<div class="la-tmx" data-ui="${P}" data-state="${o.state || 'populated'}">
  <div class="la-tmx-note" data-ui="${P}.note"><span>${t('liveQuery')} ${dg(d.as_of)} (${tz}).</span><span>·</span><span class="la-tmx-link" data-ui="${P}.about">${t('about')}</span></div>
  <section class="la-tmx-card" data-ui="${P}.split-card"><h3 class="la-tmx-card-title" data-ui="${P}.split-title">${t('splitTitle')}</h3>
    <div class="la-tmx-split" data-ui="${P}.split-bar"><div class="la-tmx-split-fill" style="--la-progress:${prog}" data-ui="${P}.split-fill"><i class="is-up" style="width:${share(k.upgraded).toFixed(2)}%" data-ui="${P}.seg-up"></i><i class="is-same" style="width:${share(k.unchanged).toFixed(2)}%" data-ui="${P}.seg-same"></i><i class="is-down" style="width:${share(k.downgraded).toFixed(2)}%" data-ui="${P}.seg-down"></i></div></div>
    <div class="la-tmx-legend">
      <div class="la-tmx-leg" data-ui="${P}.leg-up"><div class="la-tmx-leg-h"><i class="is-up"></i>${t('movedUp')}</div><div class="la-tmx-leg-v"><b class="la-num">${n(k.upgraded)}</b><span class="la-num">${pct1(k.total ? k.upgraded * 100 / k.total : 0)}</span></div></div>
      <div class="la-tmx-leg" data-ui="${P}.leg-same"><div class="la-tmx-leg-h"><i class="is-same"></i>${t('unchanged')}</div><div class="la-tmx-leg-v"><b class="la-num">${n(k.unchanged)}</b><span class="la-num">${pct1(k.total ? k.unchanged * 100 / k.total : 0)}</span></div></div>
      <div class="la-tmx-leg" data-ui="${P}.leg-down"><div class="la-tmx-leg-h"><i class="is-down"></i>${t('movedDown')}</div><div class="la-tmx-leg-v"><b class="la-num">${n(k.downgraded)}</b><span class="la-num">${pct1(k.total ? k.downgraded * 100 / k.total : 0)}</span></div></div>
    </div></section>
  <div class="la-tmx-filters" data-ui="${P}.filters">
    <div class="la-field is-presets" data-ui="${P}.field-period"><span class="la-field-label">${t('period')}</span><div class="la-tmx-toggle" data-ui="${P}.presets">${pr.map(([id, s], i) => `<span class="${id === preset ? 'is-active' : ''}" data-ui="${P}.preset-${id}">${t(s)}</span>`).join('')}</div></div>
    <div class="la-field" data-ui="${P}.field-program"><span class="la-field-label">${t('program')}</span><span class="la-field-value" data-ui="${P}.field-program-value">${d.program}</span></div>
    <div class="la-field" data-ui="${P}.field-start"><span class="la-field-label">${t('startDate')}</span><span class="la-field-value la-num" data-ui="${P}.field-start-value">${dg(dates[0])}</span></div>
    <div class="la-field" data-ui="${P}.field-end"><span class="la-field-label">${t('endDate')}</span><span class="la-field-value la-num" data-ui="${P}.field-end-value">${dg(dates[1])}</span></div>
    <div class="la-field is-reset" data-ui="${P}.reset"><span class="la-field-value">${t('reset')}</span></div>
  </div>
  <div class="la-tmx-kpis" data-ui="${P}.kpis">${[['kUp', n(k.upgraded), 'up'], ['kUpR', pct(k.upgraded_rate), 'up-rate'], ['kDn', n(k.downgraded), 'down'], ['kDnR', pct(k.downgraded_rate), 'down-rate'], ['kSame', n(k.unchanged), 'same'], ['kSameR', pct(k.unchanged_rate), 'same-rate']].map(([s, v, id]) => `<div class="la-kpi la-widget" data-ui="${P}.kpi-${id}"><div class="la-kpi-label" data-ui="${P}.kpi-${id}.label">${t(s)}</div><div class="la-kpi-row"><span class="la-kpi-value la-num" data-ui="${P}.kpi-${id}.value">${v}</span></div></div>`).join('')}</div>
  ${o.state === 'empty' ? `<div class="la-tmx-empty" data-ui="${P}.empty"><b data-ui="${P}.empty.title">${t('emptyTitle')}</b><span data-ui="${P}.empty.body">${t('emptyBody')}</span></div>` : `<div class="la-tmx-matrix" data-ui="${P}.matrix"><div class="la-heat-card"><div class="la-tmx-clip"><table class="la-heat-grid" data-ui="${P}.grid"><colgroup>${cols.map(w => `<col style="width:${w}px">`).join('')}</colgroup><thead><tr data-ui="${P}.head">${head}</tr></thead><tbody>${rows}</tbody></table></div></div></div>`}
</div>`;
  let html = renderLa('shell', { theme: o.theme, lang, set: { pageTitle: t('pageTitle') }, cssBase: '../../tokens/css/' });
  html = html.replace('<!--la:content-->', body).replace('</head>', `<link rel="stylesheet" href="../../tokens/css/la-desk-tmx.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-data.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-chart.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-widgets.css">\n</head>`).replace(/<title>[^<]*<\/title>/, `<title>${t('pageTitle')}</title>`);
  return html;
}
export const VARIANT_FILES = VARIANTS.map(([s]) => `rpt-tier-migration${s}.html`);
if (process.argv[1]?.endsWith('la-page-tier-migration.mjs')) {
fs.mkdirSync(OUT, { recursive: true });
for (const [suf, o] of VARIANTS) fs.writeFileSync(`${OUT}rpt-tier-migration${suf}.html`, build(o));
fs.writeFileSync(`${OUT}rpt-tier-migration.slots.json`, JSON.stringify({ page: P, system: 'loyal-arrow-desk', reference: 'ux-after-r1/rpt-tier-migration-matrix__desktop-light.png', slots: slotFile }, null, 1));
console.log('wrote', VARIANTS.length, 'variants'); }
