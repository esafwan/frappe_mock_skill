#!/usr/bin/env node
// Builds the Expiry Forecast report page (loyal-arrow-desk) from loyal-arrow/data/uae-dubai-supermarket/expiry_lots.json.
//   node scripts/la-page-expiry.mjs            -> components/la/expiry-forecast/{component.html,slots.json,component.json,states.json,texts.json}
//                                                 pages/la/rpt-expiry-forecast[.variant].html
// Deterministic: no clocks, randomness or network. Text only reaches the DOM through slots.
import fs from 'fs'; import path from 'path';
import { renderLa } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const DATA = path.resolve(ROOT, '../loyal-arrow/data/uae-dubai-supermarket/expiry_lots.json');
const ds = JSON.parse(fs.readFileSync(DATA, 'utf8'));
const CDIR = ROOT + 'components/la/expiry-forecast/'; fs.mkdirSync(CDIR, { recursive: true });
const NB = 90, NX = 14, NR = 8;
const MON = { en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], ar: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'] };
const TIER = { ar: { Silver: 'فضي', Gold: 'ذهبي', Platinum: 'بلاتيني' } };
const T = {   // static copy, en + ar
  title: ['Expiring points by day', 'النقاط المنتهية حسب اليوم'], pageTitle: ['Expiry Forecast', 'توقعات الانتهاء'],
  program: ['Program', 'البرنامج'], asOf: ['As of', 'بتاريخ'], horizon: ['Horizon (days)', 'المدة (أيام)'], tier: ['Tier', 'الفئة'], location: ['Location', 'الموقع'],
  k1: ['Expiring points', 'النقاط المنتهية'], k2: ['Members', 'الأعضاء'], k3: ['Lots', 'الدفعات'], k4: ['Average expiring per day', 'متوسط الانتهاء يوميا'],
  c1: ['', ''], c2: ['Expires on', 'تاريخ الانتهاء'], c3: ['Tier', 'الفئة'], c4: ['Lots', 'الدفعات'], c5: ['Members', 'الأعضاء'], c6: ['Expiring points', 'النقاط المنتهية'],
  points: ['points', 'نقطة'], programName: ['Hyper Rewards', 'هايبر ريواردز'],
  emptyChart: ['Set the filters and refresh to see the forecast', 'حدد عوامل التصفية ثم حدّث لعرض التوقعات'], zeroChart: ['Nothing expires in this period', 'لا توجد نقاط تنتهي في هذه الفترة'],
  emptyTable: ['No data to show', 'لا توجد بيانات للعرض'], zeroTable: ['No lots expire in this period', 'لا توجد دفعات تنتهي في هذه الفترة'],
};
const L = (k, lang) => T[k][lang === 'ar' ? 1 : 0];
const ISO = (s, lang) => lang === 'ar' ? `\u2066${AD(s, lang)}\u2069` : String(s);   // keep ISO dates left-to-right inside RTL text
const AD = (s, lang) => lang === 'ar' ? String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(s);
const asOf = new Date(ds.as_of + 'T00:00:00Z');
const addDays = (d, n) => new Date(d.getTime() + n * 864e5);
const iso = (d) => d.toISOString().slice(0, 10);
const fmtDay = (d, lang) => AD(`${d.getUTCDate()} ${MON[lang === 'ar' ? 'ar' : 'en'][d.getUTCMonth()]}`, lang);
const fmtFull = (d, lang) => AD(`${d.getUTCDate()} ${MON[lang === 'ar' ? 'ar' : 'en'][d.getUTCMonth()]} ${d.getUTCFullYear()}`, lang);
const niceStep = (max) => { const raw = Math.max(max, 4) / 4; for (const s of [1, 2, 5, 10, 20, 25, 50, 100, 200, 250, 500, 1000, 2000, 2500, 5000, 10000, 20000, 50000]) if (s >= raw) return s; return 100000; };

// model(horizonDays, mode, lang, locale) -> { slot: value }
export function model(H = 90, mode = 'populated', lang = 'en', loc = 'en-US') {
  const num = (n) => AD(Number(n).toLocaleString(loc), lang);
  const lots = (mode === 'populated' ? ds.lots : []).filter(l => { const d = (new Date(l.expires_on + 'T00:00:00Z') - asOf) / 864e5; return d >= 1 && d <= H; });
  const byDay = new Map(); for (const l of lots) byDay.set(l.expires_on, (byDay.get(l.expires_on) || 0) + l.points);
  const days = [...byDay.keys()].sort(); const vals = days.map(d => byDay.get(d)); const n = days.length;
  const total = vals.reduce((a, b) => a + b, 0), max = Math.max(0, ...vals); const peakI = vals.indexOf(max);
  const step = niceStep(max), axis = step * 4;
  const v = {}; const dash = '–';
  v.pageTitle = L('pageTitle', lang); v.title = L('title', lang);
  v.subtitle = lang === 'ar' ? `استعلام مباشر حتى ${ISO(ds.as_of, lang)} ${ISO('23:59', lang)} (آسيا/دبي)` : `Live query as of ${ds.as_of} 23:59 (Asia/Dubai)`;
  v.f1l = L('program', lang); v.f1v = mode === 'empty' ? '' : L('programName', lang); v.f2l = L('asOf', lang); v.f2v = mode === 'empty' ? '' : ISO(ds.as_of, lang);
  v.f3l = L('horizon', lang); v.f3v = AD(H, lang); v.f4l = L('tier', lang); v.f4v = ''; v.f5l = L('location', lang); v.f5v = '';
  v.optA = AD(30, lang); v.optB = AD(60, lang); v.optC = AD(90, lang); v.horizon = String(H);
  for (let i = 1; i <= 5; i++) v['y' + i] = mode === 'empty' ? '' : num(step * (i - 1));   // y1 = 0 ... y5 = axis max (builder order bottom-up; template prints top-down)
  v.count = String(Math.max(n, 1));
  for (let i = 1; i <= NB; i++) v['bar_' + i] = i <= n ? String(+(vals[i - 1] / axis * 100).toFixed(2)) : '0';
  for (let k = 1; k <= NX; k++) { const idx = k === NX ? n - 1 : (k - 1) * 7; v['x_' + k] = idx >= 0 && idx < n && (k === NX ? n - 1 > (NX - 2) * 7 + 3 : true) ? fmtDay(new Date(days[idx] + 'T00:00:00Z'), lang) : ''; v['xi_' + k] = String(idx >= 0 && idx < n ? idx + 1 : 1); }
  v.peakIdx = String(peakI >= 0 ? peakI + 1 : 1); v.peakPct = String(max ? +(max / axis * 100).toFixed(2) : 0);
  v.peakDate = peakI >= 0 ? fmtFull(new Date(days[peakI] + 'T00:00:00Z'), lang) : dash; v.peakValue = peakI >= 0 ? `${num(max)} ${L('points', lang)}` : dash;
  v.emptyText = L(mode === 'empty' ? 'emptyChart' : 'zeroChart', lang);
  v.k1l = L('k1', lang); v.k2l = L('k2', lang); v.k3l = L('k3', lang); v.k4l = L('k4', lang);
  v.k5l = (lang === 'ar' ? 'أثقل يوم: ' : 'Heaviest day: ') + (peakI >= 0 ? ISO(days[peakI], lang) : '');
  v.k1v = mode === 'empty' ? dash : num(total); v.k2v = mode === 'empty' ? dash : num(new Set(lots.map(l => l.member_id)).size); v.k3v = mode === 'empty' ? dash : num(lots.length);
  v.k4v = mode === 'empty' ? dash : num(Math.round(total / H)); v.k5v = mode === 'empty' ? dash : num(max);
  for (const [i, k] of ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'].entries()) v['h' + (i + 1)] = L(k, lang);
  const rows = []; const g = new Map(); for (const l of lots) { const key = l.expires_on + '|' + l.tier; const r = g.get(key) || { d: l.expires_on, t: l.tier, lots: 0, m: new Set(), p: 0 }; r.lots++; r.m.add(l.member_id); r.p += l.points; g.set(key, r); }
  const tr = [...g.values()].sort((a, b) => a.d < b.d ? -1 : a.d > b.d ? 1 : a.t < b.t ? -1 : 1);
  for (let i = 1; i <= NR; i++) { const r = tr[i - 1]; v[`r${i}_n`] = r ? AD(i, lang) : ''; v[`r${i}_d`] = r ? fmtFull(new Date(r.d + 'T00:00:00Z'), lang) : ''; v[`r${i}_t`] = r ? (lang === 'ar' ? TIER.ar[r.t] : r.t) : ''; v[`r${i}_l`] = r ? num(r.lots) : ''; v[`r${i}_m`] = r ? num(r.m.size) : ''; v[`r${i}_p`] = r ? num(r.p) : ''; }
  v.tableNote = L(mode === 'empty' ? 'emptyTable' : 'zeroTable', lang);
  return v;
}

// ---- component files ----
const sample = model(90, 'populated', 'en');
const slotType = (k) => /^bar_|^count$|^horizon$|^peakIdx$|^peakPct$|^xi_/.test(k) ? 'number' : /^(y\d|k[1-5]v|opt|r\d+_[nlmp]|x_)/.test(k) ? (/^x_/.test(k) ? 'date' : 'number') : /^(f2v|r\d+_d|peakDate)$/.test(k) ? 'date' : 'text';
const slots = {}; for (const [k, val] of Object.entries(sample)) slots[k] = { type: slotType(k), sample: val, maxLength: /^bar_|^count|^xi_|^peak(Idx|Pct)|^horizon$/.test(k) ? 6 : k === 'subtitle' ? 60 : k === 'emptyText' || k === 'tableNote' ? 48 : k === 'peakValue' ? 24 : /^(title|pageTitle)$/.test(k) ? 40 : 28, where: /^bar_|^count$|^xi_|^peak(Idx|Pct)$|^horizon$/.test(k) ? 'css-var' : 'text' };
const bars = Array.from({ length: NB }, (_, i) => `<i class="la-exp-bar" data-ui="la-expiry.bar-${i + 1}" style="--i:${i + 1};--v:{{bar_${i + 1}__raw}}"></i>`).join('');
const xs = Array.from({ length: NX }, (_, i) => `<span data-ui="la-expiry.x-${i + 1}" style="--i:{{xi_${i + 1}__raw}}">{{x_${i + 1}}}</span>`).join('');
const rowsHtml = Array.from({ length: NR }, (_, i) => `<div class="la-exp-trow" data-ui="la-expiry.row-${i + 1}"><span>{{r${i + 1}_n}}</span><span>{{r${i + 1}_d}}</span><span>{{r${i + 1}_t}}</span><span class="is-num la-num">{{r${i + 1}_l}}</span><span class="is-num la-num">{{r${i + 1}_m}}</span><span class="is-num la-num" data-ui="la-expiry.row-${i + 1}-points">{{r${i + 1}_p}}</span></div>`).join('\n      ');
const fld = (n, cls, ui) => `<div class="la-exp-field${cls}" data-ui="la-expiry.filter-${ui}"><span class="la-exp-flabel">{{f${n}l}}</span><span class="la-exp-fval" data-ui="la-expiry.filter-${ui}-value">{{f${n}v}}</span></div>`;
const kpi = (n) => `<div class="la-exp-kpi" data-ui="la-expiry.kpi-${n}"><div class="la-exp-kpi-label">{{k${n}l}}</div><div class="la-exp-kpi-value la-num" data-ui="la-expiry.kpi-${n}-value">{{k${n}v}}</div></div>`;
const html = `<div class="la-exp la-widget" style="--n:{{count__raw}};--pi:{{peakIdx__raw}};--pv:{{peakPct__raw}}" data-ui="la-expiry" data-h="{{horizon__raw}}">
  <div class="la-exp-sub" data-ui="la-expiry.subtitle">{{subtitle}}</div>
  <section class="la-exp-chart" data-ui="la-expiry.chart">
    <div class="la-exp-chart-title" data-ui="la-expiry.chart-title">{{title}}</div>
    <div class="la-exp-plot" data-ui="la-expiry.plot">
      <div class="la-exp-grid"><i></i><i></i><i></i><i></i><i></i></div>
      <div class="la-exp-ys" data-ui="la-expiry.y-axis"><span data-ui="la-expiry.y-1">{{y5}}</span><span data-ui="la-expiry.y-2">{{y4}}</span><span data-ui="la-expiry.y-3">{{y3}}</span><span data-ui="la-expiry.y-4">{{y2}}</span><span data-ui="la-expiry.y-5">{{y1}}</span></div>
      <div class="la-exp-empty" data-ui="la-expiry.empty"><span>{{emptyText}}</span></div>
      <div class="la-exp-cats" data-ui="la-expiry.bars">${bars}</div>
      <div class="la-exp-xs" data-ui="la-expiry.x-axis">${xs}</div>
      <div class="la-exp-peak-marker" data-ui="la-expiry.peak-marker"></div>
      <div class="la-exp-peak-callout" data-ui="la-expiry.peak-callout"><div class="la-exp-peak-date" data-ui="la-expiry.peak-date">{{peakDate}}</div><div class="la-exp-peak-val la-num" data-ui="la-expiry.peak-value">{{peakValue}}</div></div>
    </div>
  </section>
  <div class="la-exp-filters" data-ui="la-expiry.filters">
    ${fld(1, '', 'program')}${fld(2, '', 'asof')}${fld(3, ' is-horizon', 'horizon')}${fld(4, '', 'tier')}${fld(5, '', 'location')}
    <div class="la-exp-menu" data-ui="la-expiry.horizon-menu"><div class="la-exp-opt" data-ui="la-expiry.horizon-opt-30">{{optA}}</div><div class="la-exp-opt" data-ui="la-expiry.horizon-opt-60">{{optB}}</div><div class="la-exp-opt" data-ui="la-expiry.horizon-opt-90">{{optC}}</div></div>
  </div>
  <div class="la-exp-kpis" data-ui="la-expiry.kpis">${[1, 2, 3, 4, 5].map(kpi).join('')}</div>
  <section class="la-exp-table" data-ui="la-expiry.table">
    <div class="la-exp-trow la-exp-thead" data-ui="la-expiry.table-head"><span>{{h1}}</span><span>{{h2}}</span><span>{{h3}}</span><span class="is-num">{{h4}}</span><span class="is-num">{{h5}}</span><span class="is-num">{{h6}}</span></div>
      ${rowsHtml}
    <div class="la-exp-tnote" data-ui="la-expiry.table-note">{{tableNote}}</div>
  </section>
</div>
`;
const w = (f, s) => fs.writeFileSync(CDIR + f, typeof s === 'string' ? s : JSON.stringify(s, null, 1));
w('component.html', html); w('slots.json', { slots });
w('component.json', { id: 'la-expiry', name: 'Expiry Forecast report body (subtitle, expiring-points bar chart, filters, KPI row, grid table)', system: 'loyal-arrow-desk', kind: 'page-body', shell: true, viewport: { w: 1440, h: 900 }, css: ['la-desk-expiry.css', 'la-desk-widgets.css'],
  states: ['populated', 'empty', 'zero', 'peak', 'horizon-open', 'grow'],
  notes: 'Targets for the video engine: la-expiry.filter-horizon (+ .horizon-menu, .horizon-opt-30/60/90), la-expiry.bars / .bar-N (grow via --la-progress 0..1), la-expiry.peak-marker + .peak-callout (opacity via --la-peak, state peak), kpi-1..5, rows. Page variants built by scripts/la-page-expiry.mjs.',
  reference: { src: 'ux-after-r1/rpt-expiry-forecast__desktop-{theme}.png' }, animation: { grow: '--la-progress 0..1 scales bar heights', peak: '--la-peak 0..1 fades callout + marker', menu: '--la-menu 0..1 horizon dropdown' } });
w('states.json', { states: { populated: { set: {} }, empty: { set: {} }, zero: { set: {} }, peak: { set: {} }, 'horizon-open': { set: {} }, grow: { set: {}, progress: 0.4 } } });
const texts = {}; const ar = model(90, 'populated', 'ar', 'en-US'); for (const k of Object.keys(sample)) if (ar[k] !== sample[k]) texts[k] = { ar: ar[k] }; w('texts.json', texts);

// ---- pages ----
const OUT = ROOT + 'pages/la/'; fs.mkdirSync(OUT, { recursive: true });
const V = [   // [suffix, {H, mode, lang, loc, theme, state, progress}]
  ['', {}], ['.dark', { theme: 'dark' }], ['.ar-AED', { lang: 'ar', locale: 'ar-AE/AED' }], ['.en-INR', { locale: 'en-IN/INR', loc: 'en-IN' }],
  ['.ar-AED.dark', { lang: 'ar', locale: 'ar-AE/AED', theme: 'dark' }],
  ['.empty', { mode: 'empty', state: 'empty' }], ['.zero', { mode: 'zero', state: 'zero' }], ['.peak', { state: 'peak' }], ['.horizon-open', { state: 'horizon-open' }],
  ['.h30', { H: 30 }], ['.h60', { H: 60 }], ['.grow', { state: 'grow', progress: 0.4 }],
];
const written = [];
for (const [sfx, o] of V) {
  const lang = o.lang || 'en'; const set = model(o.H || 90, o.mode || 'populated', lang, o.loc || 'en-US'); const state = o.state || 'populated';
  let doc = renderLa('expiry-forecast', { in: 'shell', state, set, theme: o.theme, lang, locale: o.locale, progress: o.progress, cssBase: '../../tokens/css/' });
  doc = doc.replace(/(data-ui="la-shell\.title">)[^<]*</, `$1${set.pageTitle}<`);   // renderLa strips set for the shell, so the page title is patched in (slot value, already localized)
  doc = doc.replace(/<title>[^<]*<\/title>/, `<title>Expiry Forecast${sfx ? ' (' + sfx.slice(1) + ')' : ''}</title>`);
  const f = `rpt-expiry-forecast${sfx}.html`; fs.writeFileSync(OUT + f, doc); written.push(f);
}
console.log('built component + ' + written.length + ' pages:', written.join(' '));

// ---- screenshots + manifest (pages.la-rpt-expiry-forecast, components.la-expiry) ----
if (process.argv.includes('--shots')) {
  const { chromium } = await import('playwright'); const b = await chromium.launch(); const shots = ROOT + 'pages/la/shots/'; fs.mkdirSync(shots, { recursive: true });
  const m = JSON.parse(fs.readFileSync(ROOT + 'manifest.json')); const variants = [];
  const DESC = { '': 'populated, 90-day horizon, light, EN (AED program)', '.dark': 'populated, dark', '.ar-AED': 'populated, Arabic RTL', '.en-INR': 'populated, en-IN number grouping (points are currency-neutral)', '.ar-AED.dark': 'Arabic RTL, dark', '.empty': 'report not run yet: filters blank, dashes, chart/table placeholder', '.zero': 'program has lots but nothing expires in the horizon (zeros, message)', '.peak': 'heaviest-day bar outlined with hover callout (la-expiry.peak-marker/peak-callout visible)', '.horizon-open': 'Horizon (days) field focused with 30/60/90 dropdown open', '.h30': 'Horizon changed to 30 days (fewer bars, rescaled axis)', '.h60': 'Horizon changed to 60 days', '.grow': 'bars mid-grow (--la-progress 0.4) for the draw-in animation' };
  for (const [sfx, o] of V) { const f = `rpt-expiry-forecast${sfx}`; const p = await b.newPage({ viewport: { width: 1440, height: 900 } }); await p.goto('file://' + OUT + f + '.html'); await p.evaluate(() => document.fonts.ready);
    const targets = await p.evaluate(() => [...document.querySelectorAll('[data-ui^="la-expiry"]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), box: { x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) } }; }));
    const ids = targets.map(t => t.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + f);
    await p.screenshot({ path: shots + f + '.png' }); await p.close();
    variants.push({ file: `pages/la/${f}.html`, state: o.state || 'populated', variant: (o.lang === 'ar' ? 'ar-AED' : o.locale === 'en-IN/INR' ? 'en-INR' : 'en-AED') + '.' + (o.theme || 'light') + (o.H ? '.h' + o.H : ''), desc: DESC[sfx], screenshot: `pages/la/shots/${f}.png`, targets }); }
  await b.close();
  m.pages['la-rpt-expiry-forecast'] = { id: 'la-rpt-expiry-forecast', system: 'loyal-arrow-desk', group: 'la', html: 'pages/la/rpt-expiry-forecast.html', title: 'Expiry Forecast report (Loyal Arrow desk)', reference: 'ux-after-r1/rpt-expiry-forecast__desktop-{light,dark}.png', viewport: { w: 1440, h: 900 },
    states: ['populated', 'empty', 'zero', 'peak', 'horizon-open', 'grow'], components: ['la-shell', 'la-expiry'], data: 'loyal-arrow/data/uae-dubai-supermarket/expiry_lots.json (gen_expiry.py)',
    interactionTargets: { 'horizon-change': 'la-expiry.filter-horizon (+ .horizon-menu, .horizon-opt-30/60/90); h30/h60 variants show the result', 'bars-grow': 'la-expiry.bars / la-expiry.bar-N, driven by --la-progress 0..1 on la-expiry (.grow variant)', 'peak-callout': 'la-expiry.peak-marker + la-expiry.peak-callout, driven by --la-peak 0..1 (.peak variant)', kpis: 'la-expiry.kpi-1..5 (+ -value)', table: 'la-expiry.table, la-expiry.row-N' }, variants };
    fs.writeFileSync(ROOT + 'manifest.json', JSON.stringify(m, null, 2)); console.log('manifest: pages.la-rpt-expiry-forecast with', variants.length, 'variants');
}
