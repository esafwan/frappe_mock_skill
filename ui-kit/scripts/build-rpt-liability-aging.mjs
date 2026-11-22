#!/usr/bin/env node
// Composes the Liability and Aging background-report page (system loyal-arrow-desk) from loyal-arrow/data synthetic bills.
//   node scripts/build-rpt-liability-aging.mjs [--no-shots]
// Writes pages/la/rpt-liability-aging[.<state>][.dark|.ar-AED|.en-INR|.kw-KWD].html, pages/la/rpt-liability-aging.slots.json,
// screenshots under pages/shots/la/, and merges pages["la-rpt-liability-aging"] (with pixel boxes of every data-ui) into manifest.json.
// Deterministic: no clocks, no randomness, no network.
import fs from 'fs'; import path from 'path';
import { renderLa } from '../tools/render-la.mjs'; import { universals, formatMoney } from '../tools/render.mjs';
const ROOT = new URL('..', import.meta.url).pathname; const DATA = path.join(ROOT, '../loyal-arrow/data/uae-dubai-supermarket/');
const J = p => JSON.parse(fs.readFileSync(p, 'utf8')); const bills = J(DATA + 'bills.json'), cfg = J(DATA + 'cfg.json');
const OUT = ROOT + 'pages/la/', SHOTS = ROOT + 'pages/shots/la/'; fs.mkdirSync(SHOTS, { recursive: true });
const ASOF = '2026-11-22', ASOF_OFF = 10;   // dataset day 0 (12 Nov) is 10 days before the as-of date
// ---- data: points outstanding by earn age (earned minus the documented redemption overlay: every 7th bill redeems min_redeem_pts) ----
const BUCKETS = [[0, 20], [21, 40], [41, 60], [61, 999]];
const agg = BUCKETS.map(() => ({ pts: 0, members: new Set() }));
bills.forEach((b, i) => { const age = -b.day_offset + ASOF_OFF; const k = BUCKETS.findIndex(([a, z]) => age >= a && age <= z); const net = b.points_earned - (i % 7 === 3 ? cfg.min_redeem_pts : 0); agg[k].pts += net; agg[k].members.add(b.member_id); });
const RATE = { AED: 1, SAR: 1.02, QAR: 0.99, KWD: 0.0834, INR: 22.6 };   // synthetic display rates
const EXPECTED = 40;   // expected redemption %
// ---- text (slots). ar overrides; every slot has a maxLength ----
const EN = { title: 'Liability and Aging', generate: 'Generate New Report', generating: 'Generating', fProgram: 'Program', fAsof: 'As of', fRedemption: 'Expected redemption', program: 'Hyper Rewards',
  bgTitle: 'This is a background report', bgBody: 'Set the filters and generate a new one.',
  loadTitle: 'Generating your report', loadBody: 'This runs in the background. You can leave this page.', loadPct: '{p}% complete',
  emptyTitle: 'No points outstanding', emptyBody: 'There are no unexpired points for these filters.',
  kLiab: 'Total liability', kPts: 'Points outstanding', kMem: 'Members with points', kExp: 'Expected redemption', kLiabSub: 'At the redemption value', kPtsSub: 'Unredeemed and unexpired', kMemSub: 'In this program', kExpSub: 'Of outstanding value',
  tTitle: 'Liability by age of points', cBucket: 'Age of points', cMembers: 'Members', cPoints: 'Points', cValue: 'Liability', days: '{a}-{z} days', daysPlus: '{a}+ days', total: 'Total', sTitle: 'Share of liability', note: 'Points age from the date they were earned.' };
const AR = { title: 'الالتزامات والتقادم', generate: 'إنشاء تقرير جديد', generating: 'جارٍ الإنشاء', fProgram: 'البرنامج', fAsof: 'حتى تاريخ', fRedemption: 'الاسترداد المتوقع', program: 'هايبر ريواردز',
  bgTitle: 'هذا تقرير يعمل في الخلفية', bgBody: 'حدّد المرشحات ثم أنشئ تقريرًا جديدًا.',
  loadTitle: 'جارٍ إنشاء التقرير', loadBody: 'يعمل في الخلفية ويمكنك مغادرة هذه الصفحة.', loadPct: 'اكتمل {p}٪',
  emptyTitle: 'لا توجد نقاط مستحقة', emptyBody: 'لا توجد نقاط سارية لهذه المرشحات.',
  kLiab: 'إجمالي الالتزام', kPts: 'النقاط المستحقة', kMem: 'الأعضاء أصحاب النقاط', kExp: 'الاسترداد المتوقع', kLiabSub: 'بقيمة الاسترداد', kPtsSub: 'غير مستردة وسارية', kMemSub: 'في هذا البرنامج', kExpSub: 'من القيمة المستحقة',
  tTitle: 'الالتزام حسب عمر النقاط', cBucket: 'عمر النقاط', cMembers: 'الأعضاء', cPoints: 'النقاط', cValue: 'الالتزام', days: 'من {a} إلى {z} يومًا', daysPlus: 'أكثر من {a} يومًا', total: 'الإجمالي', sTitle: 'حصة الالتزام', note: 'يُحتسب عمر النقاط من تاريخ اكتسابها.' };
const MAXLEN = { title: 40, generate: 24, generating: 16, fProgram: 20, fAsof: 20, fRedemption: 28, program: 24, bgTitle: 40, bgBody: 60, loadTitle: 40, loadBody: 70, loadPct: 24, emptyTitle: 40, emptyBody: 70, kLiab: 28, kPts: 28, kMem: 28, kExp: 28, kLiabSub: 28, kPtsSub: 28, kMemSub: 28, kExpSub: 28, tTitle: 40, cBucket: 20, cMembers: 14, cPoints: 14, cValue: 14, days: 24, daysPlus: 24, total: 14, sTitle: 30, note: 60 };
const dig = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
function T(lang) { const t = lang === 'ar' ? AR : EN; for (const [k, v] of Object.entries(t)) if (v.length > MAXLEN[k]) throw new Error(`slot ${k} exceeds maxLength ${MAXLEN[k]} (${lang})`); return t; }
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
// ---- body builders ----
const ICO = { clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', chart: '<path d="M3 3v18h18"/><path d="M8 17v-5M13 17V8M18 17v-9"/>' };
const ico = n => `<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true">${ICO[n]}</svg>`;
function filters(t, lang, filled) {
  const d = s => lang === 'ar' ? dig(s) : s;
  return `<div class="la-lia-filters" data-ui="la-lia.filters">
      <div class="la-field" data-ui="la-lia.filter-program"><span class="la-field-label">${esc(t.fProgram)}</span><span class="la-field-value" data-ui="la-lia.filter-program-value">${esc(t.program)}</span></div>
      <div class="la-field" data-ui="la-lia.filter-asof"><span class="la-field-label">${esc(t.fAsof)}</span><span class="la-field-value " data-ui="la-lia.filter-asof-value">${d(ASOF)}</span></div>
      <div class="la-field" data-ui="la-lia.filter-redemption"><span class="la-field-label">${esc(t.fRedemption)}</span><span class="la-field-value " data-ui="la-lia.filter-redemption-value">${filled ? d(EXPECTED + '%') : ''}</span></div>
    </div>`;
}
function body(state, t, lang, cur) {
  const d = s => lang === 'ar' ? dig(s) : s; const int = n => d(Math.round(n).toLocaleString('en-US'));
  const money = n => { const s = formatMoney(n * RATE[cur], cur, { lang }); return d(s); };
  const f = filters(t, lang, state === 'populated' || state === 'zero');
  if (state === 'background-report') return `${f}
    <div class="la-lia-card" data-ui="la-lia.card"><div class="la-lia-empty"><span class="la-lia-ico" data-ui="la-lia.icon">${ico('clock')}</span><div class="la-lia-title" data-ui="la-lia.card-title">${esc(t.bgTitle)}</div><div class="la-lia-body" data-ui="la-lia.card-body">${esc(t.bgBody)}</div></div></div>`;
  if (state === 'loading') return `${f}
    <div class="la-lia-card" data-ui="la-lia.card"><div class="la-lia-progress" data-ui="la-lia.progress"><span class="la-lia-spin" data-ui="la-lia.spinner"></span><div class="la-lia-title" style="margin-block-start:16px" data-ui="la-lia.card-title">${esc(t.loadTitle)}</div><div class="la-lia-track" data-ui="la-lia.progress-track"><div class="la-lia-fill" data-ui="la-lia.progress-fill"></div></div><div class="la-lia-pct" data-ui="la-lia.progress-label">${esc(d(t.loadPct.replace('{p}', '45')))}</div><div class="la-lia-body" data-ui="la-lia.card-body">${esc(t.loadBody)}</div></div></div>`;
  if (state === 'empty') return `${f}
    <div class="la-lia-card" data-ui="la-lia.card"><div class="la-lia-empty"><span class="la-lia-ico" data-ui="la-lia.icon">${ico('chart')}</span><div class="la-lia-title" data-ui="la-lia.card-title">${esc(t.emptyTitle)}</div><div class="la-lia-body" data-ui="la-lia.card-body">${esc(t.emptyBody)}</div></div></div>`;
  // populated | zero (same layout, zero = all values 0)
  const z = state === 'zero'; const rows = agg.map((a, i) => ({ m: z ? 0 : a.members.size, p: z ? 0 : a.pts, v: z ? 0 : a.pts * cfg.redeem_value_per_pt }));
  const tp = rows.reduce((s, r) => s + r.p, 0), tv = rows.reduce((s, r) => s + r.v, 0), tm = z ? 0 : new Set(bills.map(b => b.member_id)).size;
  const pct = v => tv ? Math.round(v / tv * 100) : 0; const label = i => { const [a, zz] = BUCKETS[i]; return d((zz === 999 ? t.daysPlus : t.days).replace('{a}', a).replace('{z}', zz)); };
  const kpi = (n, l, v, s) => `<div class="la-kpi la-widget" data-ui="la-lia.kpi-${n}"><div class="la-kpi-label">${esc(l)}</div><div class="la-kpi-row"><span class="la-kpi-value la-num" data-ui="la-lia.kpi-${n}-value">${v}</span></div><div class="la-kpi-sub">${esc(s)}</div></div>`;
  const trs = rows.map((r, i) => `<tr data-ui="la-lia.row-${i + 1}"><td>${label(i)}</td><td class="la-rt-num la-num">${int(r.m)}</td><td class="la-rt-num la-num">${int(r.p)}</td><td class="la-rt-num la-num">${money(r.v)}</td></tr>`).join('');
  const segs = rows.map((r, i) => `<i class="s${i + 1}" style="width:${pct(r.v)}%"></i>`).join('');
  const leg = rows.map((r, i) => `<div class="la-lia-row" data-ui="la-lia.share-${i + 1}"><i class="la-dot s${i + 1}"></i><span class="la-lia-row-label">${label(i)}</span><span class="la-lia-row-val">${d(pct(r.v) + '%')}</span></div>`).join('');
  return `${f}
    <div class="la-lia-kpis" data-ui="la-lia.kpis">${kpi(1, t.kLiab, money(tv), t.kLiabSub)}${kpi(2, t.kPts, int(tp), t.kPtsSub)}${kpi(3, t.kMem, int(tm), t.kMemSub)}${kpi(4, t.kExp, money(tv * EXPECTED / 100), t.kExpSub)}</div>
    <div class="la-lia-grid" data-ui="la-lia.result">
      <section class="la-lia-panel" data-ui="la-lia.aging-panel"><h3 class="la-lia-panel-title">${esc(t.tTitle)}</h3>
        <table class="la-table" data-ui="la-lia.aging-table"><thead><tr data-ui="la-lia.aging-head"><th>${esc(t.cBucket)}</th><th class="la-rt-num">${esc(t.cMembers)}</th><th class="la-rt-num">${esc(t.cPoints)}</th><th class="la-rt-num">${esc(t.cValue)}</th></tr></thead><tbody>${trs}<tr class="la-lia-total" data-ui="la-lia.total-row"><td>${esc(t.total)}</td><td class="la-rt-num la-num">${int(tm)}</td><td class="la-rt-num la-num">${int(tp)}</td><td class="la-rt-num la-num">${money(tv)}</td></tr></tbody></table></section>
      <section class="la-lia-panel" data-ui="la-lia.share-panel"><h3 class="la-lia-panel-title">${esc(t.sTitle)}</h3><div class="la-lia-sbar" data-ui="la-lia.share-bar">${segs}</div><div class="la-lia-legend">${leg}</div><div class="la-lia-note">${esc(t.note)}</div></section>
    </div>`;
}
// ---- compose with the la-shell component ----
function page(state, { lang = 'en', cur = 'AED', theme = 'light' } = {}) {
  const t = T(lang); let h = renderLa('shell', { lang, theme, currency: cur, cssBase: '../../tokens/css/' });
  h = h.replace(/(<h1 class="la-header-title"[^>]*>)[^<]*/, `$1${esc(t.title)}`);
  // sidebar: Home collapsed, Insights expanded with Liability and aging active
  const chevDown = 'M6 9l6 6 6-6';
  const LEAVES = lang === 'ar' ? ['كل التقارير', 'تدقيق السجل', 'الالتزامات والتقادم', 'تقرير النقاط المعلّقة', 'تقرير تفصيل الاكتساب'] : ['All reports', 'Ledger audit', 'Liability and aging', 'Pending points report', 'Earn breakdown report'];
  const leaves = `<div class="la-sidebar-leaves" data-ui="la-shell.leaves-insights">${LEAVES.map((l, i) => `<div class="la-sidebar-leaf${i === 2 ? ' is-active' : ''}" data-ui="la-shell.leaf-insights-${i + 1}">${esc(l)}</div>`).join('')}</div>`;
  h = h.replace(/(<div class="la-sidebar-item") (data-ui="la-shell.item-5">[\s\S]*?<path d=")M9 6l6 6-6 6("\/><\/svg><\/div>)/, (m, a, b, c) => `${a} ${b}${chevDown}${c.replace(/^"/, '"')}\n    ${leaves}`);
  h = h.replace(/<span class="la-iconbtn"><svg class="la-ico " viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6[\s\S]*?<\/span>/, '');   // reference header has no print button
  h = h.replace('<div class="la-sidebar-item" data-ui="la-shell.item-5">', '<div class="la-sidebar-item is-open" data-ui="la-shell.item-5">');
  const busy = state === 'loading';
  const btn = `<span class="la-btn is-dark" data-ui="la-lia.generate"${busy ? ' data-state="busy"' : ''}>${esc(busy ? t.generating : t.generate)}</span>`;
  h = h.replace(/<\/div>\s*<\/header>/, `${btn}</div>\n    </header>`);
  const rpt = `<div class="la-lia" data-ui="la-lia" data-state="${state}"${busy ? ' style="--la-progress:.45"' : ''}>${body(state, t, lang, cur)}\n  </div>`;
  h = h.replace('<!--la:content-->', rpt);
  h = h.replace('</head>', ['la-desk-widgets.css', 'la-desk-chart.css', 'la-desk-lia.css'].map(f => `<link rel="stylesheet" href="../../tokens/css/${f}">`).join('\n') + '\n</head>');
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${esc(t.title)} (${state})</title>`);
  return h;
}
// ---- variants ----
const BASE = 'rpt-liability-aging';
const VARS = [['', {}], ['.dark', { theme: 'dark' }], ['.ar-AED', { lang: 'ar' }], ['.en-INR', { cur: 'INR' }], ['.kw-KWD', { cur: 'KWD' }], ['.ar-KWD', { lang: 'ar', cur: 'KWD' }]];
const STATES = ['background-report', 'loading', 'populated', 'empty', 'zero']; const MONEY = new Set(['populated', 'zero']);
const jobs = [];
for (const st of STATES) for (const [sfx, o] of VARS) {
  if (!MONEY.has(st) && /KWD|INR/.test(sfx)) { if (!(st === 'background-report' && sfx !== '.ar-KWD')) continue; }
  const file = st === 'background-report' ? `${BASE}${sfx}.html` : `${BASE}.${st}${sfx}.html`; jobs.push({ file, state: st, o, key: st + (sfx || '.en-AED') });
}
for (const j of jobs) fs.writeFileSync(OUT + j.file, page(j.state, j.o));
fs.writeFileSync(OUT + BASE + '.slots.json', JSON.stringify({ page: 'la-rpt-liability-aging', slots: Object.fromEntries(Object.entries(EN).map(([k, v]) => [k, { type: 'text', sample: v, maxLength: MAXLEN[k], ar: AR[k] }])), data: { source: 'loyal-arrow/data/uae-dubai-supermarket/bills.json', asOf: ASOF, buckets: BUCKETS, expectedRedemptionPct: EXPECTED, displayRates: RATE } }, null, 1));
console.log('pages:', jobs.length);
if (process.argv.includes('--no-shots')) process.exit(0);
// ---- screenshots + pixel boxes -> manifest ----
const { chromium } = await import('playwright'); const browser = await chromium.launch(); const variants = [];
for (const j of jobs) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.goto('file://' + OUT + j.file); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui^="la-lia"]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(b => b.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + j.file);
  const shot = j.file.replace(/\.html$/, '.png'); await p.screenshot({ path: SHOTS + shot }); await ctx.close();
  variants.push({ file: 'pages/la/' + j.file, state: j.state, screenshot: 'pages/shots/la/' + shot, targets: boxes });
}
await browser.close();
const mp = ROOT + 'manifest.json'; const m = J(mp); m.pages = m.pages || {};
m.pages['la-rpt-liability-aging'] = { id: 'la-rpt-liability-aging', title: 'Liability and Aging (background report)', system: 'loyal-arrow-desk', group: 'la', viewport: { w: 1440, h: 900 }, shell: 'la-shell', reference: 'ux-after-r1/rpt-liability-and-aging__desktop-light.png', slots: 'pages/la/rpt-liability-aging.slots.json', states: STATES,
  interactions: [{ id: 'click-generate', target: 'la-lia.generate', from: 'background-report', to: 'loading', then: 'populated', note: 'click Generate New Report; progress (--la-progress on la-lia.progress-fill) then result (la-lia.result)' }],
  variants };
fs.writeFileSync(mp, JSON.stringify(m, null, 2)); console.log('manifest updated:', variants.length, 'variants');
