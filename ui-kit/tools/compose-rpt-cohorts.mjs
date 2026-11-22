#!/usr/bin/env node
// Composes pages/la/rpt-cohorts*.html (system loyal-arrow-desk) from deterministic synthetic cohort data.
//   node tools/compose-rpt-cohorts.mjs        -> writes all variants + loyal-arrow/data/<ds>/cohorts.json
import fs from 'fs'; import path from 'path';
import { renderLa } from './render-la.mjs';
const ROOT = new URL('..', import.meta.url).pathname; const OUT = ROOT + 'pages/la/';
// ---- deterministic data (mulberry32, fixed seed) ----
function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const MON = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; const MON_AR = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
export function cohorts() {
  const r = rng(20261122); const rows = [];
  const fixed = [[56,[67.85,78.57,67.85,71.42,66.07,71.42]],[110,[68.18,82.72,71.81,72.72,70,72.72]],[117,[77.77,73.5,78.63,68.37,71.79,71.79]],[140,[65,67.85,60.71,59.28,60.71,55.35]]];   // first four mirror the reference
  for (let i = 0; i < 14; i++) {
    const y = 2025 + Math.floor((4 + i) / 12), m = (4 + i) % 12; const monthsAvail = Math.max(0, 5 - i + 0);   // cohorts after Aug 2025 have fewer matured months (as-of 2026-11-22 table is clipped to M+1..M+6)
    let size, pct;
    if (i < 4) [size, pct] = fixed[i]; else { size = 40 + Math.floor(r() * 120); let p = 62 + r() * 10; pct = []; for (let k = 0; k < 6; k++) { p = Math.max(38, p + 4 - r() * 8); pct.push(Math.round(p * 100) / 100); } if (i === 9) pct[0] = 79.3; }
    if (i >= 10) pct = pct.map((v, k) => (k < 13 - i ? v : null)); else if (i >= 4) pct = pct.map((v, k) => (k < 12 - i + 1 ? v : null));
    rows.push({ key: `${y}-${String(m + 1).padStart(2, '0')}`, y, m, size, pct, count: pct.map(v => v == null ? null : Math.round(v * size / 100)) });
  }
  return rows;
}
const rows = cohorts();
const cohortLabel = (c, ar) => `${(ar ? MON_AR : MON)[c.m]} ${c.y}`;
const fmtPct = (v) => v == null ? '-' : String(Number(v.toFixed(2))) + '%';
const heatInt = (v) => v == null ? 0 : v >= 67 ? 4 : 2;   // reference shows two blues: >=~67% mid, below it light
rows[13].size += 1454 - rows.reduce((a, c) => a + c.size, 0); rows.forEach(c => { c.count = c.pct.map(v => v == null ? null : Math.round(v * c.size / 100)); });
const totalMembers = 1454;
const wret = [100, 67, 63.5, 55, 48.5, 44, 39.5];   // chart series: weighted retention by month index (matches reference shape)
const best = rows.filter(c => c.pct[0] != null).sort((a, b) => b.pct[0] - a.pct[0])[0];
fs.mkdirSync(ROOT + '../loyal-arrow/data/uae-dubai-supermarket', { recursive: true });
for (const ds of ['uae-dubai-supermarket', 'india-departmental-store']) { const d = ROOT + '../loyal-arrow/data/' + ds; if (fs.existsSync(d)) fs.writeFileSync(d + '/cohorts.json', JSON.stringify({ is_synthetic: 1, as_of: '2026-11-22', cohorts: rows.map(c => ({ cohort_month: c.key, members: c.size, retained_pct: c.pct, retained_count: c.count })), weighted_retention_pct: wret }, null, 1) + '\n'); }
// ---- i18n ----
const T = { en: { title: 'Cohorts', actions: 'Actions', note: 'Live query as of 2026-11-22 23:59 (Asia/Dubai).', about: 'About this report +', chart: 'Weighted retention % by cohort month', program: 'Program', asof: 'As of', heat: 'Heatmap shows', percent: 'Percent', count: 'Count', more: 'More filters', members: 'Members', cohorts: 'Cohorts', m1: 'M+1 retention', m6: 'M+6 retention', best: 'Best M+1 cohort', under: 'Cohorts under 20 members', head: ['#', 'Cohort month', 'Members'], col: (k) => `M+${k} retained`, x: (k) => `M+${k}`, empty: 'No cohorts for this period', emptyRow: 'No cohorts yet', prog: 'Hyper Rewards' },
  ar: { title: 'المجموعات', actions: 'إجراءات', note: 'استعلام مباشر حتى 2026-11-22 23:59 (آسيا/دبي).', about: 'عن هذا التقرير +', chart: 'نسبة الاحتفاظ المرجحة حسب شهر المجموعة', program: 'البرنامج', asof: 'حتى تاريخ', heat: 'تعرض الخريطة', percent: 'نسبة', count: 'عدد', more: 'مزيد من عوامل التصفية', members: 'الأعضاء', cohorts: 'المجموعات', m1: 'الاحتفاظ بعد شهر', m6: 'الاحتفاظ بعد 6 أشهر', best: 'أفضل مجموعة بعد شهر', under: 'مجموعات أقل من 20 عضوًا', head: ['#', 'شهر المجموعة', 'الأعضاء'], col: (k) => `M+${k} محتفظ`, x: (k) => `M+${k}`, empty: 'لا توجد مجموعات لهذه الفترة', emptyRow: 'لا توجد مجموعات بعد', prog: 'هايبر ريواردز' } };
const AD = (s, ar) => ar ? String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(s);
const NS = 'la-rpt-cohorts';
function body(o) {
  const ar = o.lang === 'ar', t = T[ar ? 'ar' : 'en'], st = o.state, empty = st === 'empty' || st === 'zero', cnt = st === 'count';
  const data = empty ? [] : rows; const nums = (s) => AD(s, ar);
  const kp = (id, label, val) => `<div class="la-kpi la-widget" data-ui="${NS}.kpi-${id}"><div class="la-kpi-label" data-ui="${NS}.kpi-${id}.label">${label}</div><div class="la-kpi-row"><span class="la-kpi-value la-num" data-ui="${NS}.kpi-${id}.value">${nums(val)}</span></div></div>`;
  const X = [437, 581, 726, 870, 1015, 1160, 1304].map(v => v - 297), yOf = (v) => 256 - v * 1.7;
  const pts = wret.map((v, k) => v == null ? null : [X[k], yOf(v)]).filter(Boolean); const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
  const ys = [0, 20, 40, 60, 80, 100].map(v => `<line x1="63" x2="1087" y1="${yOf(v)}" y2="${yOf(v)}" stroke="var(--la-${v === 0 ? 'grid-base' : 'grid'})" stroke-width="1"/><text x="53" y="${yOf(v) + 4}" text-anchor="end" data-ui="${NS}.y-${v}">${nums(v)}</text>`).join('');
  const xs = X.map((x, k) => `<text x="${x}" y="276" text-anchor="middle" data-ui="${NS}.x-${k}">${t.x(k)}</text>`).join('');
  const head = `<th class="la-hc-idx">${t.head[0]}</th><th class="la-hc-rowh">${t.head[1]}</th><th class="la-hc-size la-num">${t.head[2]}</th>` + [1, 2, 3, 4, 5, 6].map(k => `<th class="la-hc-col" data-ui="${NS}.col-${k}">${t.col(k)}</th>`).join('');
  const tr = data.map((c, i) => `<tr data-ui="${NS}.row-${i + 1}"><td class="la-hc-idx la-num">${nums(i + 1)}</td><td class="la-hc-rowh">${ar ? nums(cohortLabel(c, true)) : cohortLabel(c)}</td><td class="la-hc-size la-num">${nums(c.size)}</td>` + [0, 1, 2, 3, 4, 5].map(k => `<td class="la-hc la-heat-${heatInt(c.pct[k])} la-num" data-ui="${NS}.cell-r${i + 1}c${k + 1}">${nums(cnt ? (c.count[k] ?? '-') : fmtPct(c.pct[k]))}</td>`).join('') + '</tr>').join('') || `<tr data-ui="${NS}.row-empty"><td colspan="9" class="la-rpt-emptyrow" style="text-align:center;height:66px;color:var(--la-text-faint)">${t.emptyRow}</td></tr>`;
  const under = rows.filter(c => c.size < 20).length;
  const kpis = empty ? [['members', t.members, 0], ['cohorts', t.cohorts, 0], ['m1', t.m1, '-'], ['m6', t.m6, '-'], ['best', t.best, '-'], ['under', t.under, 0]] : [['members', t.members, totalMembers.toLocaleString('en-US')], ['cohorts', t.cohorts, rows.length], ['m1', t.m1, wret[1] + '%'], ['m6', t.m6, wret[6] + '%'], ['best', t.best, best.key], ['under', t.under, under]];
  const fld = (n, l, v, extra = '') => `<div class="la-field ${extra}" data-ui="${NS}.filter-${n}"><span class="la-fx-label">${l}</span><span class="la-field-value" data-ui="${NS}.filter-${n}-value">${v}</span></div>`;
  const hv = cnt ? t.count : t.percent;
  return `<div class="la-rpt" data-ui="${NS}" data-state="${st}" data-mode="${cnt ? 'count' : 'percent'}">
<div class="la-rpt-note" data-ui="${NS}.note"><span>${t.note}</span><span>·</span><a data-ui="${NS}.about">${t.about}</a></div>
<div class="la-rpt-chart la-widget" data-ui="${NS}.chart" data-state="${empty ? 'empty' : 'populated'}"><div class="la-chart-title" data-ui="${NS}.chart.title" style="${ar ? 'left:auto;right:16px' : ''}">${t.chart}</div><svg viewBox="0 0 1127 314" aria-hidden="true">${ys}${xs}<path class="la-line" pathLength="1" d="${d}" data-ui="${NS}.chart.line" style="stroke-dasharray:1;stroke-dashoffset:calc(1 - var(--la-progress,1))"/></svg><div class="la-rpt-empty" data-ui="${NS}.chart.empty">${t.empty}</div></div>
<div class="la-rpt-filters"><div class="la-filter-bar" data-ui="${NS}.filters">${fld('program', t.program, t.prog)}${fld('asof', t.asof, nums('2026-11-22'))}${fld('heatmap', t.heat, `<span>${hv}</span><svg class="la-ico" viewBox="0 0 24 24" style="width:12px;height:12px" aria-hidden="true"><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>`, 'la-rpt-heatsel')}<span class="la-filter-more" data-ui="${NS}.filters.more">${t.more}</span></div></div>
<div class="la-rpt-kpis" data-ui="${NS}.kpis">${kpis.map(k => kp(...k)).join('')}</div>
<div class="la-rpt-table la-heat-table" data-ui="${NS}.table" data-mode="${cnt ? 'count' : 'percent'}"><div class="la-heat-card"><table class="la-heat-grid" data-ui="${NS}.grid"><thead><tr data-ui="${NS}.head">${head}</tr></thead><tbody>${tr}</tbody></table></div></div>
${st === 'tall' ? '<div class="la-rpt-tallpad"></div>' : ''}</div>`;
}
export function page(o) {
  const ar = o.lang === 'ar', t = T[ar ? 'ar' : 'en'];
  let html = renderLa('shell', { theme: o.theme, lang: o.lang, currency: o.currency, cssBase: '../../tokens/css/', set: { pageTitle: t.title, pageActions: t.actions } });
  const bd = body(o); const lk = ['la-desk-widgets.css', 'la-desk-pg-rpt-cohorts.css'].map(f => `<link rel="stylesheet" href="../../tokens/css/${f}">`).join('\n');
  html = html.replace('<!--la:content-->', () => bd).replace('</head>', () => lk + '\n</head>');
  html = html.replace(/<title>[^<]*<\/title>/, `<title>Cohorts report (${o.state || 'populated'})</title>`).replace('<html ', `<html data-page="rpt-cohorts" data-state="${o.state}" `);
  if (o.state === 'tall') html = html.replace('min-height:900px', 'min-height:900px;height:auto');
  return html;
}
const V = [['', {}], ['.dark', { theme: 'dark' }], ['.ar-AED', { lang: 'ar', currency: 'AED' }], ['.en-INR', { currency: 'INR' }], ['.count', { state: 'count' }], ['.empty', { state: 'empty' }], ['.zero', { state: 'zero' }], ['.tall', { state: 'tall' }], ['.dark.count', { theme: 'dark', state: 'count' }], ['.ar-AED.empty', { lang: 'ar', state: 'empty' }]];
if (process.argv[1]?.endsWith('compose-rpt-cohorts.mjs')) for (const [suf, o] of V) { fs.writeFileSync(OUT + `rpt-cohorts${suf}.html`, page({ state: 'populated', ...o })); console.log('rpt-cohorts' + suf); }
