#!/usr/bin/env node
// Composes loyal-arrow-desk page rpt-rfm (RFM Segments) from la components + synthetic dataset. Deterministic: no clock/random/network.
//   node scripts/la-page-rfm.mjs            -> pages/la/rpt-rfm[.state][.variant].html
// states: populated (default), empty (= reference screenshot), grid (view switch = Grid), view-open (view dropdown open)
// variants: light (no suffix), dark, ar-AED, en-INR, kw-KWD (+ ar-AED.dark). Money screens (populated/grid) get all; empty gets light/dark/ar-AED.
import fs from 'fs'; import path from 'path';
import { renderLa, laSlotValues } from '../tools/render-la.mjs'; import { formatMoney } from '../tools/render.mjs'; import { ROOT } from './lib.mjs';
const LA = path.resolve(ROOT, '../loyal-arrow/data/uae-dubai-supermarket'); const J = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const members = J(LA + '/members.json'), bills = J(LA + '/bills.json');
const ASOF = '2026-11-22', OFFSET0 = 10;   // data day_offset 0 = 2026-11-12 => as-of is +10 days
const D = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const int = (n, ar) => { const s = n.toLocaleString('en-US'); return ar ? D(s).replace(/,/g, '٬') : s; };
// ---- RFM (deterministic, quintile by rank; tie -> member_id order) ----
const st = members.map(m => ({ id: m.member_id, last: -999, f: 0, m: 0 })); const by = Object.fromEntries(st.map(s => [s.id, s]));
for (const b of bills) { const s = by[b.member_id]; if (!s) continue; s.f++; s.m += b.total; s.last = Math.max(s.last, b.day_offset); }
const scored = st.filter(s => s.f > 0).map(s => ({ ...s, rec: OFFSET0 - s.last }));
const quint = (arr, key, asc) => { const o = [...arr].sort((a, b) => (asc ? a[key] - b[key] : b[key] - a[key]) || a.id.localeCompare(b.id)); const q = {}; o.forEach((s, i) => q[s.id] = 5 - Math.floor(i * 5 / o.length)); return q; };
const Rq = quint(scored, 'rec', true), Fq = quint(scored, 'f', false), Mq = quint(scored, 'm', false);   // 5 = best
scored.forEach(s => { s.R = Rq[s.id]; s.F = Fq[s.id]; s.M = Mq[s.id]; s.seg = s.R >= 4 && s.F >= 4 ? 'champions' : s.R >= 3 ? 'loyal' : s.R === 2 ? 'risk' : 'dormant'; });
const SEG = ['champions', 'loyal', 'risk', 'dormant'];
const agg = Object.fromEntries(SEG.map(k => { const a = scored.filter(s => s.seg === k); return [k, { n: a.length, spend: a.reduce((x, s) => x + s.m, 0), f: a.reduce((x, s) => x + s.f, 0), rec: a.reduce((x, s) => x + s.rec, 0) }]; }));
const totalSpend = scored.reduce((x, s) => x + s.m, 0);
// recency band x frequency band counts (heat grid)
const RB = [[0, 14], [15, 30], [31, 60], [61, 9999]], FB = [[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 999]];
const grid = RB.map(([a, b]) => FB.map(([c, d]) => scored.filter(s => s.rec >= a && s.rec <= b && s.f >= c && s.f <= d).length));
const heatInt = v => v === 0 ? 0 : v < 2 ? 1 : v < 4 ? 2 : v < 7 ? 3 : 4;
// ---- i18n for page text ----
const T = {
  en: { title: 'RFM Segments', actions: 'Actions', live: 'Live query as of', about: 'About this report', program: 'Program', asof: 'As of', view: 'View', more: 'More filters', reset: 'Reset',
    viewSeg: 'Segments', viewGrid: 'Grid', scored: 'Scored members', spend: 'Total spend', avg: 'Bills per member', atrisk: 'At risk', program_v: 'Hyper Rewards',
    cols: ['Segment', 'Members', 'Spend', 'Status', 'Note'], names: { champions: 'Champions', loyal: 'Loyal', risk: 'At risk', dormant: 'Hibernating' }, status: { champions: 'Thriving', loyal: 'Steady', risk: 'Slipping', dormant: 'Dormant' }, tone: { champions: 'green', loyal: 'gray', risk: 'amber', dormant: 'red' },
    note: (k, a, ar) => ({ champions: 'Recent and frequent', loyal: 'Shopped recently', risk: 'Last visit 2+ weeks ago', dormant: 'No visit for a month' })[k],
    heatMode: 'Heatmap shows', heatModeV: 'count', recHead: 'Recency', sizeHead: 'Members', fcols: ['1 bill', '2 bills', '3 bills', '4 bills', '5 bills', '6+ bills'], rrows: ['0-14 days', '15-30 days', '31-60 days', '61+ days'],
    eT: 'No purchases to score', eB: 'Segments appear once members have purchases in the selected window.', zero: '0' },
  ar: { title: 'شرائح RFM', actions: 'إجراءات', live: 'استعلام مباشر حتى', about: 'عن هذا التقرير', program: 'البرنامج', asof: 'بتاريخ', view: 'العرض', more: 'مزيد من المرشحات', reset: 'إعادة ضبط',
    viewSeg: 'الشرائح', viewGrid: 'الشبكة', scored: 'الأعضاء المقيَّمون', spend: 'إجمالي الإنفاق', avg: 'الفواتير لكل عضو', atrisk: 'معرضون للمغادرة', program_v: 'مكافآت هايبر',
    cols: ['الشريحة', 'الأعضاء', 'الإنفاق', 'الحالة', 'ملاحظة'], names: { champions: 'الأبطال', loyal: 'أوفياء', risk: 'معرضون للمغادرة', dormant: 'خاملون' }, status: { champions: 'مزدهرة', loyal: 'مستقرة', risk: 'متراجعة', dormant: 'خاملة' }, tone: { champions: 'green', loyal: 'gray', risk: 'amber', dormant: 'red' },
    note: (k) => ({ champions: 'حديثون ومتكررون', loyal: 'تسوّقوا مؤخرًا', risk: 'آخر زيارة قبل أسبوعين', dormant: 'لا زيارة منذ شهر' })[k],
    heatMode: 'تعرض الخريطة الحرارية', heatModeV: 'العدد', recHead: 'الحداثة', sizeHead: 'الأعضاء', fcols: ['فاتورة', 'فاتورتان', '٣ فواتير', '٤ فواتير', '٥ فواتير', '٦+ فواتير'], rrows: ['٠-١٤ يوم', '١٥-٣٠ يوم', '٣١-٦٠ يوم', '٦١+ يوم'],
    eT: 'لا توجد مشتريات للتقييم', eB: 'تظهر الشرائح عندما يكون لدى الأعضاء مشتريات في الفترة المحددة.', zero: '٠' } };
const ICON_CHEV = '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>';
const frag = (id, o) => { const h = renderLa(id, o); return h.slice(h.indexOf('<div id="ui-kit-stage">') + 24, h.lastIndexOf('</div></body>')).trim(); };
const chk = (id, set) => { const sl = J(ROOT + `components/la/${id}/slots.json`).slots; for (const [k, v] of Object.entries(set)) if (sl[k]?.maxLength && String(v).length > sl[k].maxLength) throw new Error(`${id}.${k} "${v}" > ${sl[k].maxLength}`); return set; };
export function buildRfm({ state = 'populated', theme = 'light', lang = 'en', cur = 'AED' }) {
  const t = T[lang], ar = lang === 'ar', money = n => { const s = formatMoney(n, cur, { lang }); return ar ? D(s) : s; };
  const gridView = state === 'grid' || state === 'view-open-grid'; const viewOpen = state.startsWith('view-open'); const empty = state === 'empty';
  const o = { theme, lang, currency: cur, cssBase: '../../tokens/css/' };
  const shell = renderLa('shell', { ...o, set: chk('shell', { pageTitle: t.title, pageActions: t.actions }) });
  const head = shell.slice(0, shell.indexOf('<body')), tail = '</div></body></html>\n';
  const [sa0, sb] = shell.slice(shell.indexOf('<div id="ui-kit-stage">') + 24, shell.lastIndexOf('</div></body>')).split('<!--la:content-->');
  const sa = sa0.replace(/<span class="la-iconbtn"><svg[^>]*><path d="M7 9V3[^>]*\/><\/svg><\/span>/, '');
  const asof = ar ? D(ASOF) : ASOF, time = ar ? D('23:59') : '23:59';
  const info = `<div class="la-rfm-info" data-ui="la-rfm.info"><span data-ui="la-rfm.live">${t.live} ${asof} ${time} (Asia/Dubai).</span><span class="la-dot">·</span><a class="la-link" data-ui="la-rfm.about">${t.about} +</a></div>`;
  let fb = frag('filter-bar', { ...o, set: chk('filter-bar', { field1Label: t.program, field1Value: t.program_v, field2Label: t.asof, field2Value: asof, field3Label: t.view, field3Value: '@@VIEW@@', moreFilters: t.more, reset: '' }) });
  const viewTxt = gridView ? t.viewGrid : t.viewSeg;
  fb = fb.replace('data-ui="la-filter-bar.field-3-value">@@VIEW@@</span>', `data-ui="la-rfm.view-switch"><span data-ui="la-rfm.view-value">${viewTxt}</span>${ICON_CHEV}<span class="la-rfm-menu" data-ui="la-rfm.view-menu"><span class="la-rfm-menu-item${gridView ? '' : ' is-active'}" data-ui="la-rfm.view-option-segments">${t.viewSeg}</span><span class="la-rfm-menu-item${gridView ? ' is-active' : ''}" data-ui="la-rfm.view-option-grid">${t.viewGrid}</span></span></span>`).replace('class="la-field-value" data-ui="la-rfm.view-switch"', 'class="la-field-value la-rfm-select" data-ui="la-rfm.view-switch"').replace('<div class="la-field" data-ui="la-filter-bar.field-3"', `<div class="la-field" data-menu="${viewOpen ? 'open' : 'closed'}" data-ui="la-filter-bar.field-3"`).replace(/<span class="la-filter-reset"[^>]*>.*?<\/span>/, '');
  let kpis, body;
  let kn = 0; const kcard = (label, value, sub, st = 'populated') => { const i = ++kn; return frag('kpi-card', { ...o, state: st, set: chk('kpi-card', { label, value, sub, delta: '' }) }).replaceAll('data-ui="la-kpi-card', `data-ui="la-rfm.kpi-${i}`); };
  if (empty) { kpis = `<div class="la-rfm-kpis" data-cols="1" data-ui="la-rfm.kpis">${kcard(t.scored, t.zero, '', 'zero').replace(/<div class="la-kpi-sub"[^>]*><\/div>/, '')}</div>`; body = `<div class="la-rfm-section la-rfm-empty" data-ui="la-rfm.empty">${frag('empty-state', { ...o, state: 'no-purchases', set: chk('empty-state', { icon: 'chart', title: t.eT, body: t.eB, action: '' }) }).replace(/<a class="la-es-action"[^>]*><\/a>/, '')}</div>`; }
  else {
    const n = scored.length, risk = agg.risk.n + agg.dormant.n;
    kpis = `<div class="la-rfm-kpis" data-cols="4" style="--la-kpi-cols:4" data-ui="la-rfm.kpis">${[
      kcard(t.scored, int(n, ar), ar ? D(String(bills.length)) + ' فاتورة' : `${bills.length} bills`), kcard(t.spend, money(totalSpend), ar ? 'كل الفترة' : 'All time'),
      kcard(t.avg, ar ? D((bills.length / n).toFixed(1)) : (bills.length / n).toFixed(1), ar ? 'متوسط' : 'Average'), kcard(t.atrisk, int(risk, ar), ar ? 'لم يزوروا منذ أسبوعين' : 'No visit in 2 weeks', risk ? 'populated' : 'zero')].join('')}</div>`;
    if (!gridView) {
      const set = { empty_text: '—' }; t.cols.forEach((c, i) => set['col_' + (i + 1)] = c);
      SEG.forEach((k, i) => { const a = agg[k], r = 'r' + (i + 1); set[r + 'c1'] = t.names[k]; set[r + 'c2'] = int(a.n, ar); set[r + 'c3'] = money(a.spend); set[r + '_status'] = t.status[k]; set[r + '_tone'] = t.tone[k]; set[r + '_note'] = t.note(k); });
      body = `<div class="la-rfm-section" data-ui="la-rfm.segments">${frag('report-table', { ...o, state: 'populated', set: chk('report-table', set) })}</div>`;
    } else {
      const set = { mode: t.heatModeV, mode_label: t.heatMode, idx_head: '#', row_head: t.recHead, size_head: t.sizeHead }; t.fcols.forEach((c, i) => set['col_' + (i + 1)] = c);
      RB.forEach((_, r) => { set['row_' + (r + 1)] = t.rrows[r]; set['size_' + (r + 1)] = int(grid[r].reduce((a, b) => a + b, 0), ar); grid[r].forEach((v, c) => { set[`val_r${r + 1}c${c + 1}`] = int(v, ar); set[`int_r${r + 1}c${c + 1}`] = String(heatInt(v)); }); });
      body = `<div class="la-rfm-section" data-ui="la-rfm.grid">${frag('heat-table', { ...o, state: 'count', set: chk('heat-table', set) })}</div>`;
    }
  }
  const css = `<link rel="stylesheet" href="../../tokens/css/la-desk-widgets.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-rfm.css">`;
  const content = `<div class="la-rfm-stack" data-ui="la-rfm">${info}<div class="la-rfm-filters" data-ui="la-rfm.filters">${fb}</div>${kpis}${body}</div>`;
  return (head.replace('</head>', css + '\n</head>') + '<body class="la-root"><div id="ui-kit-stage">\n' + sa + content + sb + '\n' + tail).replace(/<title>[^<]*<\/title>/, `<title>${t.title} (${state}, ${lang}-${cur}, ${theme})</title>`);
}
export const VARIANTS = [['', { theme: 'light', lang: 'en', cur: 'AED' }], ['dark', { theme: 'dark' }], ['ar-AED', { lang: 'ar', cur: 'AED' }], ['ar-AED.dark', { lang: 'ar', cur: 'AED', theme: 'dark' }], ['en-INR', { cur: 'INR' }], ['kw-KWD', { cur: 'KWD' }]];
export const STATES = ['populated', 'empty', 'grid', 'view-open'];
export const pageName = (state, v) => `rpt-rfm${state === 'populated' ? '' : '.' + state}${v ? '.' + v : ''}.html`;
if (process.argv[1]?.endsWith('la-page-rfm.mjs')) {
  const out = ROOT + 'pages/la/'; fs.mkdirSync(out, { recursive: true }); let n = 0;
  for (const s of STATES) for (const [v, o] of VARIANTS) { if (s === 'empty' && /INR|KWD/.test(v)) continue; fs.writeFileSync(out + pageName(s, v), buildRfm({ state: s, ...o })); n++; }
  console.log('rpt-rfm pages:', n);
}
