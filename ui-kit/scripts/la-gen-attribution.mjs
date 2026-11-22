// Generator + page builder for the Campaign Attribution report (rpt-campaign-attribution).
//   node scripts/la-gen-attribution.mjs            -> data json, component la/rpt-campaign-attribution, tokens/css/la-desk-reports.css (idempotent)
//   node scripts/la-gen-attribution.mjs pages      -> also builds pages/la/rpt-campaign-attribution*.html + .manifest.json (needs playwright for boxes)
// Deterministic: no clock, no randomness, no network. Synthetic data only.
import fs from 'fs'; import { ROOT } from './lib.mjs';
import { renderLa } from '../tools/render-la.mjs'; import { formatMoney } from '../tools/render.mjs';
const W = (p, s) => { fs.mkdirSync(ROOT + p.split('/').slice(0, -1).join('/'), { recursive: true }); fs.writeFileSync(ROOT + p, typeof s === 'string' ? s : JSON.stringify(s, null, 1)); };
const S = (type, sample, maxLength, where = 'text') => ({ type, sample, maxLength, where });
const AR = '٠١٢٣٤٥٦٧٨٩'; const digits = (s) => String(s).replace(/\d/g, d => AR[d]);
const ID = 'rpt-campaign-attribution'; const N = 5;

/* ---------- synthetic dataset (AED base; deterministic from a fixed LCG, anchored on the store config in uae-dubai-supermarket) ---------- */
let seed = 20261122; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const CAMPS = [['Weekend Double Points', 'نقاط مضاعفة نهاية الأسبوع', 4200], ['Fresh Basket Offer', 'عرض سلة الطازج', 3600], ['Win-back 60 Days', 'استرجاع بعد ٦٠ يومًا', 2800], ['Tier Upgrade Nudge', 'تحفيز الترقية', 1900], ['Dairy Supplier Boost', 'دعم المورّد للألبان', 3100]];
const PROGRAMS = [{ en: 'Hyper Rewards', ar: 'مكافآت هايبر' }, { en: 'Fresh Club', ar: 'نادي الطازج' }, { en: 'Gold Circle', ar: 'الدائرة الذهبية' }];
const rows = CAMPS.map(([en, ar, sent]) => { const redeemed = Math.round(sent * (0.06 + rnd() * 0.1)); const rev = Math.round(redeemed * (38 + rnd() * 40) * 100) / 100; const uplift = Math.round((3 + rnd() * 22) * 10) / 10; return { campaign: en, campaign_ar: ar, sent, redeemed, rate_pct: Math.round(redeemed / sent * 1000) / 10, attributed_revenue: rev, uplift_pct: uplift }; });
const zero = rows.map(r => ({ ...r, redeemed: 0, rate_pct: 0, attributed_revenue: 0, uplift_pct: 0 }));
fs.writeFileSync(ROOT + '../loyal-arrow/data/uae-dubai-supermarket/campaign_attribution.json', JSON.stringify({ synthetic: true, currency: 'AED', program: PROGRAMS[0].en, programs: PROGRAMS, populated: rows, zero, empty: [] }, null, 1));

/* ---------- component ---------- */
const slots = { about: S('text', 'About this report', 24), programLabel: S('text', 'Program', 16), programValue: S('text', 'Hyper Rewards', 24), rowsLabel: S('text', 'Rows', 12), rowsValue: S('number', '5', 4),
  opt1: S('text', 'Hyper Rewards', 24), opt2: S('text', 'Fresh Club', 24), opt3: S('text', 'Gold Circle', 24),
  emptyTitle: S('text', 'No data for this period', 32), emptyBody: S('text', 'Try a longer date range or another programme.', 56),
  col1: S('text', 'Campaign', 16), col2: S('number', 'Sent', 12), col3: S('number', 'Redeemed', 12), col4: S('text', 'Redemption rate', 18), col5: S('currency', 'Attributed revenue', 22), col6: S('text', 'Uplift', 12) };
const ar = { about: 'حول هذا التقرير', programLabel: 'البرنامج', programValue: 'مكافآت هايبر', rowsLabel: 'الصفوف', opt1: 'مكافآت هايبر', opt2: 'نادي الطازج', opt3: 'الدائرة الذهبية', emptyTitle: 'لا توجد بيانات لهذه الفترة', emptyBody: 'جرّب نطاقًا زمنيًا أطول أو برنامجًا آخر.', col1: 'الحملة', col2: 'المرسَل', col3: 'المستردّ', col4: 'نسبة الاسترداد', col5: 'الإيراد المنسوب', col6: 'الارتفاع' };
const sampleRows = rows.map((r, i) => ({ c1: r.campaign, c2: String(r.sent), c3: String(r.redeemed), c4: r.rate_pct + '%', c5: r.attributed_revenue, c6: '+' + r.uplift_pct + '%' }));
for (let i = 1; i <= N; i++) { const r = sampleRows[i - 1]; Object.assign(slots, { [`r${i}c1`]: S('text', r.c1, 26), [`r${i}c2`]: S('number', r.c2, 7), [`r${i}c3`]: S('number', r.c3, 7), [`r${i}c4`]: S('number', r.c4, 7), [`r${i}c5`]: S('currency', String(r.c5), 16), [`r${i}c6`]: S('number', r.c6, 7), [`r${i}_tone`]: S('text', 'green', 6) }); ar[`r${i}c1`] = CAMPS[i - 1][1]; }
const th = (k, cls = '') => `<th${cls ? ` class="${cls}"` : ''}>{{${k}}}</th>`;
const tr = (i) => `<tr class="la-rt-row" data-ui="${ID}.row-${i}"><td class="la-rt-c1" data-ui="${ID}.campaign-${i}">{{r${i}c1}}</td><td class="la-rt-num la-num">{{r${i}c2}}</td><td class="la-rt-num la-num">{{r${i}c3}}</td><td class="la-rt-num la-num">{{r${i}c4}}</td><td class="la-rt-num la-num">{{r${i}c5}}</td><td class="la-rt-num"><span class="la-pill is-{{r${i}_tone}} la-num" data-ui="${ID}.uplift-${i}">{{r${i}c6}}</span></td></tr>`;
const html = `<div class="la-rp is-{{state}}" data-ui="la-${ID}">
  <a class="la-rp-about" data-ui="la-${ID}.about">{{about}}<span class="la-rp-plus">+</span></a>
  <div class="la-rp-filters" data-ui="la-${ID}.filters">
    <div class="la-rp-field" data-ui="la-${ID}.field-program"><span class="la-field-label">{{programLabel}}</span><span class="la-field-value" data-ui="la-${ID}.field-program-value">{{programValue}}</span>
      <div class="la-rp-menu" data-ui="la-${ID}.program-menu"><span class="la-rp-opt is-sel" data-ui="la-${ID}.program-opt-1">{{opt1}}</span><span class="la-rp-opt" data-ui="la-${ID}.program-opt-2">{{opt2}}</span><span class="la-rp-opt" data-ui="la-${ID}.program-opt-3">{{opt3}}</span></div></div>
  </div>
  <div class="la-rp-rows" data-ui="la-${ID}.rows"><div class="la-rp-rows-label">{{rowsLabel}}</div><div class="la-rp-rows-value la-num" data-ui="la-${ID}.rows-value">{{rowsValue}}</div></div>
  <div class="la-rp-empty" data-ui="la-${ID}.empty"><span class="la-rp-eico"><svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h4l3-8 4 16 3-8h4"/></svg></span><div class="la-es-title" data-ui="la-${ID}.empty-title">{{emptyTitle}}</div><div class="la-es-body">{{emptyBody}}</div></div>
  <div class="la-rp-results" data-ui="la-${ID}.results"><table class="la-table la-rt la-rp-table" data-ui="la-${ID}.grid"><thead><tr data-ui="la-${ID}.head">${th('col1')}${th('col2', 'la-rt-num')}${th('col3', 'la-rt-num')}${th('col4', 'la-rt-num')}${th('col5', 'la-rt-num')}${th('col6', 'la-rt-num')}</tr></thead><tbody>${[1, 2, 3, 4, 5].map(tr).join('')}</tbody></table></div>
</div>
`;
const meta = { id: `la-${ID}`, name: 'Campaign Attribution report body (program filter, Rows card, attribution table / empty state)', system: 'loyal-arrow-desk', kind: 'page-body', viewport: { w: 1440, h: 900 }, shell: true, css: ['la-desk-data.css', 'la-desk-reports.css'], states: ['populated', 'empty', 'zero', 'filter-open', 'filter-changed'],
  reference: { src: 'ux-after-r1/rpt-campaign-attribution__desktop-{theme}.png', crop: [281, 48, 1159, 852], note: 'empty state is the pixel reference; populated/zero/filter states are extrapolated from the same tokens' },
  stateText: { populated: { pageTitle: 'Campaign Attribution' }, empty: { pageTitle: 'Campaign Attribution', rowsValue: '1' }, zero: { pageTitle: 'Campaign Attribution' }, 'filter-open': { pageTitle: 'Campaign Attribution' }, 'filter-changed': { pageTitle: 'Campaign Attribution', programValue: 'Fresh Club' } },
  interactions: [{ id: 'filter-change', from: 'filter-open', to: 'filter-changed', target: `la-${ID}.field-program-value`, option: `la-${ID}.program-opt-2`, note: 'click Program -> menu opens -> pick option 2 -> table refreshes' }],
  notes: 'Dynamic row values are filled by scripts/la-gen-attribution.mjs from loyal-arrow/data/uae-dubai-supermarket/campaign_attribution.json (currency + AR digits applied there). Interaction targets: field-program(-value), program-menu, program-opt-1..3, rows-value, row-N, uplift-N.' };
const dir = `components/la/${ID}/`; W(dir + 'component.html', html); W(dir + 'slots.json', { slots }); W(dir + 'component.json', meta); W(dir + 'texts.json', Object.fromEntries(Object.entries(ar).map(([k, v]) => [k, { ar: v }])));
const css = `/* la-rpt-campaign-attribution: report body for the Campaign Attribution screen. Tokens only (--la-*); logical properties. Sampled from ux-after-r1/rpt-campaign-attribution (1440x900). */
.la-rp{display:flex;flex-direction:column;width:1127px;font-size:var(--la-text-sm)}
.la-rp-about{align-self:flex-start;margin:1px 0 0;margin-inline-start:4px;height:20px;line-height:20px;color:var(--la-primary);font-size:var(--la-text-sm);cursor:pointer}
.la-rp-plus{margin-inline-start:4px;color:var(--la-text-muted)}
.la-rp-filters{margin-block-start:42px;padding-block-end:12px;border-block-end:1px solid var(--la-border);display:flex}
.la-rp-field{position:relative;width:160px;display:flex;flex-direction:column;gap:6px;color:var(--la-text-muted)}
.la-rp-field .la-field-label{font-size:12px;line-height:14px}
.la-rp-field .la-field-value{width:160px;height:28px;cursor:pointer}
.la-rp-menu{display:none;position:absolute;inset-block-start:46px;inset-inline-start:0;width:200px;padding:4px;background:var(--la-bg);border:1px solid var(--la-border);border-radius:var(--la-radius-lg);box-shadow:0 4px 16px rgba(0,0,0,.12);z-index:2}
.la-rp-opt{display:flex;align-items:center;height:28px;padding-inline:8px;border-radius:var(--la-radius);color:var(--la-text);font-weight:500}
.la-rp-opt.is-sel{background:var(--la-subtle)}
.is-filter-open .la-rp-menu{display:block}
.is-filter-open .la-rp-field .la-field-value{background:var(--la-bg);border-color:var(--la-primary);box-shadow:0 0 0 2px var(--la-focus-ring)}
.is-filter-changed .la-rp-field .la-field-value{border-color:var(--la-pill-amber-fg)}
.la-rp-rows{margin-block-start:24px;height:95px;padding:12px 16px;border:1px solid var(--la-border);border-radius:12px;background:var(--la-bg)}
.la-rp-rows-label{font-size:var(--la-text-sm);line-height:20px;color:var(--la-text-muted)}
.la-rp-rows-value{margin-block-start:12px;font-size:24px;line-height:32px;font-weight:600;color:var(--la-text);font-variant-numeric:tabular-nums}
.la-rp-empty{display:none;margin-block-start:41px;height:229px;border:1px solid var(--la-border);border-radius:12px;flex-direction:column;align-items:center;justify-content:flex-start;text-align:center;padding-block-start:48px}
.la-rp-eico{width:48px;height:48px;margin-block-end:22px;border-radius:50%;background:var(--la-subtle);display:flex;align-items:center;justify-content:center;color:var(--la-text)}
.la-rp-eico .la-ico{width:16px;height:16px}
.la-rp-empty .la-es-title{font-size:var(--la-text-sm);line-height:20px;font-weight:600;color:var(--la-text)}
.la-rp-empty .la-es-body{margin-block-start:6px}
.la-rp-results{margin-block-start:24px;border:1px solid var(--la-border);border-radius:12px;overflow:hidden}
.la-rp-table{width:100%}
.la-rp-table thead th{background:var(--la-subtle);text-align:start}
.la-rp-table thead th{white-space:nowrap}.la-rp-table th.la-rt-num{text-align:end;width:160px}.la-rp-table td.la-rt-num{width:160px}.la-rp-table .la-rt-c1{width:auto}
.la-rp-table tbody tr:first-child td{border-block-start:0}
.la-rp.is-empty .la-rp-results{display:none}.la-rp.is-empty .la-rp-empty{display:flex}
.la-rp.is-zero .la-rp-table td.la-rt-num.la-num{color:var(--la-text-muted)}
`;
W('tokens/css/la-desk-reports.css', css);

/* ---------- page variants ---------- */
const LOC = { 'en-AED': { locale: 'en-AE/AED', cur: 'AED', k: 1, lang: 'en' }, 'ar-AED': { locale: 'ar-AE/AED', cur: 'AED', k: 1, lang: 'ar' }, 'en-INR': { locale: 'en-IN/INR', cur: 'INR', k: 22.5, lang: 'en' }, 'kw-KWD': { locale: 'ar-KW/KWD', cur: 'KWD', k: 0.0835, lang: 'en' } };
const VARIANTS = [['', 'populated', 'en-AED', 'light'], ['.dark', 'populated', 'en-AED', 'dark'], ['.ar-AED', 'populated', 'ar-AED', 'light'], ['.en-INR', 'populated', 'en-INR', 'light'], ['.kw-KWD', 'populated', 'kw-KWD', 'light'],
  ['.empty', 'empty', 'en-AED', 'light'], ['.empty.dark', 'empty', 'en-AED', 'dark'], ['.empty.ar-AED', 'empty', 'ar-AED', 'light'], ['.zero', 'zero', 'en-AED', 'light'], ['.zero.dark', 'zero', 'en-AED', 'dark'],
  ['.filter-open', 'filter-open', 'en-AED', 'light'], ['.filter-changed', 'filter-changed', 'en-AED', 'light'], ['.filter-open.dark', 'filter-open', 'en-AED', 'dark'], ['.filter-changed.ar-AED', 'filter-changed', 'ar-AED', 'light']];
const tone = (u) => u >= 15 ? 'green' : u >= 8 ? 'blue' : u > 0 ? 'amber' : 'gray';
export function pageValues(state, locKey) {
  const L = LOC[locKey]; const ar = L.lang === 'ar'; const nf = (n, d = 0) => { const s = n.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); return ar ? digits(s) : s; };
  const data = JSON.parse(fs.readFileSync(ROOT + '../loyal-arrow/data/uae-dubai-supermarket/campaign_attribution.json')); const src = state === 'zero' ? data.zero : data.populated; const v = {};
  const shifted = state === 'filter-changed' ? src.map((r, i) => ({ ...r, sent: Math.round(r.sent * 0.8), redeemed: Math.round(r.redeemed * 0.85), attributed_revenue: Math.round(r.attributed_revenue * 0.7 * 100) / 100, rate_pct: Math.round(r.redeemed * 0.85 / (r.sent * 0.8) * 1000) / 10 })) : src;
  shifted.forEach((r, i) => { const n = i + 1; v[`r${n}c1`] = ar ? r.campaign_ar : r.campaign; v[`r${n}c2`] = nf(r.sent); v[`r${n}c3`] = nf(r.redeemed); v[`r${n}c4`] = nf(r.rate_pct, 1) + (ar ? '٪' : '%');
    const m = formatMoney(r.attributed_revenue * L.k, L.cur, { lang: L.lang }); v[`r${n}c5`] = ar ? digits(m) : m; v[`r${n}c6`] = (r.uplift_pct ? '+' : '') + nf(r.uplift_pct, 1) + (ar ? '٪' : '%'); v[`r${n}_tone`] = tone(r.uplift_pct); });
  v.rowsValue = state === 'empty' ? nf(1) : nf(shifted.length); if (state === 'filter-changed') v.programValue = ar ? data.programs[1].ar : data.programs[1].en;
  v.pageTitle = ar ? 'إسناد الحملات' : 'Campaign Attribution'; return v;
}
if (process.argv[2] === 'pages') {
  const { chromium } = await import('playwright'); const browser = await chromium.launch(); const manifest = { id: ID, system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'ux-after-r1/rpt-campaign-attribution__desktop-{theme}.png', variants: {} };
  const sl = JSON.parse(fs.readFileSync(ROOT + dir + 'slots.json')).slots;
  for (const [sfx, state, locKey, theme] of VARIANTS) {
    const L = LOC[locKey]; const set = pageValues(state, locKey);
    for (const [k, x] of Object.entries(set)) if (sl[k]?.maxLength && String(x).length > sl[k].maxLength) throw new Error(`${k}="${x}" exceeds maxLength ${sl[k].maxLength}`);
    const doc = renderLa('rpt-campaign-attribution', { state, theme, locale: L.locale, lang: L.lang === 'ar' ? 'ar' : 'en', currency: L.cur, in: 'shell', set, cssBase: '../../tokens/css/' });
    const f = `pages/la/${ID}${sfx}.html`; fs.writeFileSync(ROOT + f, doc.replace(/(data-ui="la-shell\.title">)[^<]*</, `$1${set.pageTitle}<`));
    const p = await browser.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto('file://' + ROOT + f); await p.evaluate(() => document.fonts.ready);
    const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: Math.round(r.x * 10) / 10, y: Math.round(r.y * 10) / 10, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, visible: r.width > 0 && r.height > 0 }; }).filter(b => b.visible));
    const dup = boxes.map(b => b.id).filter((x, i, a) => a.indexOf(x) !== i); if (dup.length) throw new Error('duplicate data-ui ' + dup);
    manifest.variants[ID + sfx] = { file: f, state, locale: L.locale, currency: L.cur, theme, targets: boxes };
    if (process.argv.includes('--shots')) await p.screenshot({ path: ROOT + `pages/la/shots/${ID}${sfx}.png` }); await p.close();
  }
  await browser.close(); fs.writeFileSync(ROOT + `pages/la/${ID}.manifest.json`, JSON.stringify(manifest, null, 1)); console.log('built', VARIANTS.length, 'variants');
}
