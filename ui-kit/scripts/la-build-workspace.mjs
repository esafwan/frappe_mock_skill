#!/usr/bin/env node
// Composes pages/la/la-workspace*.html (Loyal Arrow workspace home) from la-* components + synthetic loyal-arrow/data. Deterministic: no clock, no random, no network.
//   node scripts/la-build-workspace.mjs        -> pages/la/la-workspace.<variant>.html + loyal-arrow/data/<dataset>/workspace.json
// Targets (data-ui + pixel boxes) are written by scripts/la-workspace-targets.mjs.
import fs from 'fs'; import path from 'path';
import { fill } from './engine.mjs'; import { universals, formatMoney } from '../tools/render.mjs'; import { laSlotValues, laMeta } from '../tools/render-la.mjs';
const ROOT = new URL('..', import.meta.url).pathname; const DATA = ROOT + '../loyal-arrow/data/';
const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8')); const rd = (id, f = 'component.html') => fs.readFileSync(`${ROOT}components/la/${id}/${f}`, 'utf8');
const AR = (s) => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const RATE = { AED: 1, SAR: 1.02, QAR: 0.99, KWD: 0.083, INR: 22.7 };   // synthetic display rates only
const T = { // page-level strings (en / ar); component slots keep their own texts.json
  title: ['Loyal Arrow', 'لويال أرو'], today: ['Today', 'اليوم'], kNew: ['New members today', 'أعضاء جدد اليوم'], kEarn: ['Points earned today', 'نقاط مكتسبة اليوم'], kRed: ['Points redeemed today', 'نقاط مستبدلة اليوم'], kBills: ['Bills today', 'فواتير اليوم'],
  qa: ['Quick actions', 'إجراءات سريعة'], qa1: ['Add member', 'إضافة عضو'], qa2: ['New reward', 'مكافأة جديدة'], qa3: ['Reward requests', 'طلبات المكافآت'], qa4: ['Points ledger', 'سجل النقاط'],
  trends: ['Trends', 'الاتجاهات'], c1: ['Earn vs Redeem Trend', 'اتجاه الكسب مقابل الاستبدال'], c2: ['New members per week', 'الأعضاء الجدد أسبوعياً'], sync: ['Last synced just now', 'آخر مزامنة الآن'], nodata: ['No data for this period', 'لا توجد بيانات لهذه الفترة'],
  legA: ['Earned', 'مكتسبة'], legB: ['Redeemed', 'مستبدلة'], range: ['Last Quarter', 'الربع الأخير'], gran: ['Weekly', 'أسبوعي'], o1: ['Last Month', 'الشهر الأخير'], o2: ['Last Quarter', 'الربع الأخير'], o3: ['Last Year', 'السنة الأخيرة'], o4: ['All Time', 'كل الوقت'],
  recent: ['Recent activity', 'النشاط الأخير'], l1: ['Latest members', 'أحدث الأعضاء'], l2: ['Open reward requests', 'طلبات المكافآت المفتوحة'], l3: ['Latest Events', 'أحدث الأحداث'], none: ['No Data...', 'لا توجد بيانات...'],
  active: ['Active', 'نشط'], processed: ['PROCESSED', 'تمت المعالجة'], txn: ['Transaction completed', 'اكتملت المعاملة'], w1: ['1 week ago', 'قبل أسبوع'], w2: ['2 weeks ago', 'قبل أسبوعين'], yest: ['yesterday', 'أمس'], billed: ['Billed ', 'المبلغ '], lw: ['Same day last week: ', 'نفس اليوم الأسبوع الماضي: '] };
const ICO = { filter: '<path d="M3 5h18l-7 8v6l-4-2v-4z"/>', refresh: '<path d="M20 11a8 8 0 0 0-14-4L4 9M4 4v5h5M4 13a8 8 0 0 0 14 4l2-2M20 20v-5h-5"/>', plus: '<path d="M12 5v14M5 12h14"/>', dots: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>', ud: '<path d="M8 9l4-4 4 4M8 15l4 4 4-4"/>', cal: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/>', chev: '<path d="M9 6l6 6-6 6"/>' };
const ico = (k, cls = '') => `<svg class="la-ico ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICO[k]}</svg>`;
const nice = (m) => { const e = 10 ** Math.floor(Math.log10(m || 1)); for (const k of [1, 2, 2.5, 3, 4, 5, 6, 8, 10]) if (k * e >= m) return k * e; return 10 * e; };
const short = (n, lang = 'en') => n >= 1e6 ? (n / 1e6) + (lang === 'ar' ? ' م' : ' M') : n >= 1e3 ? (n / 1e3) + (lang === 'ar' ? ' ألف' : ' K') : String(n);

// ---- data (deterministic, derived from the synthetic datasets) ----
function metrics(cur) {
  const ds = cur === 'INR' ? 'india-departmental-store' : 'uae-dubai-supermarket'; const D = DATA + ds + '/'; const bills = J(D + 'bills.json'), members = J(D + 'members.json');
  const base = cur === 'INR' ? 'INR' : 'AED'; const rate = RATE[cur] / RATE[base];
  const W = 13, earn = Array(W).fill(0), red = Array(W).fill(0), mem = Array(W).fill(0);
  for (const b of bills) { const w = Math.min(W - 1, Math.max(0, Math.floor((b.day_offset + 90) / 7))); earn[w] += b.points_earned; }
  members.forEach((m, i) => { mem[(i * 5 + 3 + (i % 4)) % W]++; });
  earn.forEach((e, i) => { red[i] = Math.round(e * (0.1 + 0.03 * (i % 4))); });
  let today;
  if (cur === 'INR') { const t = J(D + 'today.json').today; today = { newMembers: t.new_members, earned: t.points_earned, redeemed: t.points_redeemed, bills: t.bills, billed: Math.round(t.bills * 842.6 * 100) / 100 }; }
  else { const last = Math.max(...bills.map(b => b.day_offset)); const tb = bills.filter(b => b.day_offset === last); today = { newMembers: 3, earned: tb.reduce((s, b) => s + b.points_earned, 0), redeemed: Math.round(tb.reduce((s, b) => s + b.points_earned, 0) * 0.18), bills: tb.length, billed: +(tb.reduce((s, b) => s + b.total, 0) * rate).toFixed(3) }; }
  const latest = members.slice(-3).reverse().map(m => ({ en: m.names.en, ar: m.names.ar || m.names.en }));
  return { dataset: ds, currency: cur, today, earn, redeem: red, newMembersPerWeek: mem, latestMembers: latest, ledgerCount: bills.length, openRewardRequests: 0 };
}

// ---- component fills ----
const withState = (html, root, st) => st ? html.replace(`data-ui="${root}"`, `data-ui="${root}" data-state="${st}"`) : html;
function comp(id, { lang, state, set = {}, theme }) { const v = laSlotValues(id, { lang, state, set }); const html = rd(id).replaceAll('{{state}}', state || 'default'); return withState(fill(html, { ...v, ...set }), laMeta(id).id, state); }
const own = (html, from, to) => html.replaceAll(`data-ui="${from}`, `data-ui="${to}`);   // repeated components get unique ids: la-kpi-card.value -> la-workspace.kpi-2.value
const L = (k, lang) => T[k][lang === 'ar' ? 1 : 0];
const num = (n, lang) => { const s = Math.round(n).toLocaleString('en-US'); return lang === 'ar' ? AR(s) : s; };
const moneyTxt = (n, cur, lang) => { const s = formatMoney(n, cur, { lang }); return lang === 'ar' ? AR(s) : s; };
const dates = (lang) => ['2026-08-22', '2026-09-19', '2026-10-17', '2026-11-14'].map(d => lang === 'ar' ? AR(d) : d);

function lineChart(m, o) {
  const { lang } = o; const empty = o.zero; const mx = nice(Math.max(...m.earn, 1)); const step = mx / 3; const y = (v) => +(297 - v / mx * 170).toFixed(1); const x = (i) => +(102 + i * 304 / 12).toFixed(1);
  const set = { title: L('c1', lang), subtitle: L('sync', lang), empty_text: L('nodata', lang), xLabels_1: dates(lang)[0], xLabels_2: dates(lang)[1], xLabels_3: dates(lang)[2], xLabels_4: dates(lang)[3], legend_a: '', legend_b: '' };
  [0, 1, 2, 3].forEach(i => set['yLabels_' + (i + 1)] = lang === 'ar' ? AR(i ? short(step * i, lang) : '0') : (i ? short(step * i, lang) : '0'));
  set.path_a = empty ? '' : 'M' + m.earn.map((v, i) => `${x(i)} ${y(v)}`).join(' L'); set.path_b = '';
  return withToolbar(comp('chart-line', { lang, state: empty ? 'empty' : 'populated', set }), 'la-chart-line', o, 1);
}
function barChart(m, o) {
  const { lang } = o; const empty = o.zero; const step = Math.max(1, nice(Math.max(...m.newMembersPerWeek, 1) / 4)); const mx = step * 4;
  const set = { title: L('c2', lang), subtitle: L('sync', lang), empty_text: L('nodata', lang), xLabels_1: dates(lang)[0], xLabels_2: dates(lang)[1], xLabels_3: dates(lang)[2], xLabels_4: dates(lang)[3] };
  [0, 1, 2, 3, 4].forEach(i => set['yLabels_' + (i + 1)] = lang === 'ar' ? AR(String(+(step * i).toFixed(1))) : String(+(step * i).toFixed(1)));
  m.newMembersPerWeek.forEach((v, i) => set['bar_' + (i + 1)] = String(+(v / mx * 80).toFixed(1)));
  return withToolbar(comp('chart-bar', { lang, state: empty ? 'empty' : 'populated', set }), 'la-chart-bar', o, 2);
}
function withToolbar(html, root, o, n) {   // filter button + range dropdown + granularity dropdown + overflow, inside the chart's toolbar slot
  const { lang } = o; const id = `la-workspace.chart-${n}`; const open = o.rangeOpen && n === 1;
  const menu = open ? `<div class="la-menu" data-ui="${id}.menu">${['o1', 'o2', 'o3', 'o4'].map((k, i) => `<div class="la-menu-item${i === 1 ? ' is-active' : ''}" data-ui="${id}.opt-${i + 1}">${esc(L(k, lang))}</div>`).join('')}</div>` : '';
  const tb = `<span class="la-iconbtn" data-ui="${id}.filter">${ico('filter')}</span><span class="la-ws-dd"><span class="la-btn la-btn-subtle${open ? ' is-open' : ''}" data-ui="${id}.range">${esc(L('range', lang))}${ico('ud')}</span>${menu}</span><span class="la-btn la-btn-subtle" data-ui="${id}.granularity">${ico('cal')}${esc(L('gran', lang))}${ico('ud')}</span><span class="la-iconbtn" data-ui="${id}.more">${ico('dots')}</span>`;
  return html.replace(`data-ui="${root}.toolbar"></div>`, `data-ui="${root}.toolbar">${tb}</div>`).replace(`data-ui="${root}"`, `data-ui="${root}" data-ws="${id}"`);
}
function list(n, title, rows, o, add) {
  const { lang } = o; const id = `la-workspace.list-${n}`;
  const body = rows.length ? rows.map((r, i) => `<div class="la-ws-row" data-ui="${id}.row-${i + 1}"><div class="la-ws-main"><span class="la-ws-name">${esc(r.name)}</span><span class="la-ws-sub">${esc(r.sub)}</span></div><span class="la-pill ${r.cls}" data-ui="${id}.pill-${i + 1}">${esc(r.pill)}</span>${ico('chev', 'la-chev')}</div>`).join('') : `<div class="la-ws-none" data-ui="${id}.empty">${esc(L('none', lang))}</div>`;
  return `<section class="la-ws-list" data-ui="${id}"><div class="la-ws-lhead"><h3 class="la-ws-ltitle" data-ui="${id}.title">${esc(title)}</h3><span class="la-ws-lbtns"><span class="la-iconbtn" data-ui="${id}.filter">${ico('filter')}</span><span class="la-iconbtn" data-ui="${id}.refresh">${ico('refresh')}</span>${add ? `<span class="la-iconbtn" data-ui="${id}.add">${ico('plus')}</span>` : ''}</span></div>${body}</section>`;
}

export function page(o) {   // o: {theme, lang, cur, today:'zero'|'populated', zero, emptyLists, rangeOpen}
  const { lang, cur } = o; const m = metrics(cur); const t = m.today; const sc = RATE[cur] / RATE[cur === 'INR' ? 'INR' : 'AED'];
  const z = !!o.zero, tz = z || o.today === 'zero'; const val = (v) => tz ? 0 : v;
  const k = (key, v, sub) => comp('kpi-card', { lang, state: tz ? 'zero' : 'count-up', set: { label: L(key, lang), value: num(val(v), lang), sub: sub || '', delta: '' } });
  const kpis = [['kNew', t.newMembers], ['kEarn', t.earned], ['kRed', t.redeemed], ['kBills', t.bills]].map(([key, v], i) => `<div class="la-ws-cell">${own(k(key, v, !tz && o.money ? (i === 3 ? L('billed', lang) + moneyTxt(t.billed, cur, lang) : L('lw', lang) + num(Math.round(v * 0.92), lang)) : ''), 'la-kpi-card', 'la-workspace.kpi-' + (i + 1))}</div>`).join('');
  const qa = [['qa1', ''], ['qa2', ''], ['qa3', ''], ['qa4', num(m.ledgerCount, lang)]].map(([key, b], i) => `<div class="la-ws-cell">${own(comp('quick-action', { lang, state: b ? 'with-badge' : 'default', set: { label: L(key, lang), badge: b } }), 'la-quick-action', 'la-workspace.qa-' + (i + 1))}</div>`).join('');
  const mrows = m.latestMembers.map((x, i) => ({ name: lang === 'ar' ? x.ar : x.en, sub: L(i < 2 ? 'w1' : 'w2', lang), pill: L('active', lang), cls: 'is-green' }));
  const erows = [0, 1, 2].map(() => ({ name: L('txn', lang), sub: L('yest', lang), pill: L('processed', lang), cls: '' }));
  const none = o.emptyLists || z;
  void sc;
  const lists = list(1, L('l1', lang), none ? [] : mrows, o, true) + list(2, L('l2', lang), [], o, false) + list(3, L('l3', lang), none ? [] : erows, o, false);
  const sec = (key, id, inner, cls) => `<section class="la-ws-sec" data-ui="la-workspace.${id}"><h2 class="la-ws-h" data-ui="la-workspace.${id}.heading">${esc(L(key, lang))}</h2><div class="${cls}">${inner}</div></section>`;
  const body = `<div class="la-ws">${sec('today', 'today', kpis, 'la-ws-grid4')}${sec('qa', 'quick-actions', qa, 'la-ws-grid4')}${sec('trends', 'trends', lineChart(m, { ...o, zero: z }) + barChart(m, { ...o, zero: z }), 'la-ws-charts')}${sec('recent', 'recent', lists, 'la-ws-lists')}</div>`;
  const shell = fill(rd('shell'), { ...laSlotValues('shell', { lang }), pageTitle: L('title', lang), pageActions: lang === 'ar' ? 'إجراءات' : 'Actions' }).replace('<!--la:content-->', body).replace('<div class="la-sidebar-leaf" data-ui="la-shell.leaf-home">', '<div class="la-sidebar-leaf is-active" data-ui="la-shell.leaf-home">').replace(/<span class="la-btn la-btn-subtle" data-ui="la-shell.actions-menu">.*?<\/span><span class="la-iconbtn">.*?<\/span><span class="la-iconbtn">.*?<\/span>(<span class="la-iconbtn">)/s, '$1');
  const sys = J(ROOT + 'systems/loyal-arrow-desk/system.json'); const css = [...sys.tokens.css, 'tokens/css/la-desk-widgets.css', 'tokens/css/la-desk-chart.css', 'tokens/css/la-desk-pages.css'].map(f => `<link rel="stylesheet" href="../../tokens/css/${path.basename(f)}">`).join('\n');
  const rtl = lang === 'ar'; const title = `Loyal Arrow workspace (${o.variant})`;
  return `<!doctype html>\n<html lang="${lang}" data-system="la" data-theme="${o.theme || 'light'}"${rtl ? ' dir="rtl"' : ''}>\n<head><meta charset="utf-8"><title>${title}</title>\n${css}\n<style>html,body{margin:0}*{animation:none!important;transition:none!important;caret-color:transparent!important}#ui-kit-stage{position:absolute;left:0;top:0;width:1440px;min-height:900px}</style></head>\n<body class="la-root la-page"><div id="ui-kit-stage" data-ui="la-workspace" class="la-pg-workspace" data-page="la-workspace" data-variant="${o.variant}" data-currency="${cur}">\n${shell}\n</div></body></html>\n`;
}
export const VARIANTS = {
  '': { cur: 'AED', lang: 'en', today: 'zero' },   // matches the reference screenshot: zero today, populated trends, one empty list
  dark: { cur: 'AED', lang: 'en', today: 'zero', theme: 'dark' },
  populated: { cur: 'AED', lang: 'en', today: 'populated', money: true },
  zero: { cur: 'AED', lang: 'en', zero: true },
  empty: { cur: 'AED', lang: 'en', today: 'populated', emptyLists: true, money: true },
  'range-open': { cur: 'AED', lang: 'en', today: 'zero', rangeOpen: true },
  'ar-AED': { cur: 'AED', lang: 'ar', today: 'populated', money: true },
  'ar-AED.dark': { cur: 'AED', lang: 'ar', today: 'populated', money: true, theme: 'dark' },
  'en-INR': { cur: 'INR', lang: 'en', today: 'populated', money: true },
  'kw-KWD': { cur: 'KWD', lang: 'en', today: 'populated', money: true },
  'en-SAR': { cur: 'SAR', lang: 'en', today: 'populated', money: true },
  'en-QAR': { cur: 'QAR', lang: 'en', today: 'populated', money: true } };
if (process.argv[1]?.endsWith('la-build-workspace.mjs')) {
  fs.mkdirSync(ROOT + 'pages/la', { recursive: true });
  for (const [v, o] of Object.entries(VARIANTS)) { const f = `pages/la/la-workspace${v ? '.' + v : ''}.html`; fs.writeFileSync(ROOT + f, page({ ...o, variant: v || 'default' })); console.log('wrote', f); }
  for (const cur of ['AED', 'INR']) { const m = metrics(cur); fs.writeFileSync(`${DATA}${m.dataset}/workspace.json`, JSON.stringify({ synthetic: true, note: 'Derived deterministically from bills.json/members.json (redeem series and KWD/SAR/QAR/INR display rates are synthetic).', ...m }, null, 1) + '\n'); }
}
