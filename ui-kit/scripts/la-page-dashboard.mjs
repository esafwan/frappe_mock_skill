#!/usr/bin/env node
// Composes pages/la/loyalty-dashboard*.html for loyal-arrow-desk from loyal-arrow/data synthetic datasets (deterministic: no clock/random/network).
//   node scripts/la-page-dashboard.mjs [--measure]     --measure also writes pages/la/loyalty-dashboard.manifest.json (+ merges manifest.json pages) via Playwright
import fs from 'fs'; import { renderLa } from '../tools/render-la.mjs'; import { formatMoney } from '../tools/render.mjs'; import { ROOT } from './lib.mjs';
const DATA = ROOT + '../loyal-arrow/data/'; const J = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const RATE = { AED: 1, SAR: 1.02, QAR: 0.99, KWD: 0.0835, INR: 1 };   // synthetic display rate vs dataset currency
const T = { // en -> ar
  'Programme': 'البرنامج', 'Needs attention': 'يحتاج إلى انتباه', 'All clear': 'كل شيء على ما يرام', 'Members': 'الأعضاء', 'New this month': 'جدد هذا الشهر', 'Points issued': 'النقاط الصادرة', 'Points redeemed': 'النقاط المستبدلة', 'Redemptions': 'عمليات الاستبدال', 'Estimated liability': 'الالتزام التقديري',
  'Growth this month': 'النمو هذا الشهر', 'Redemption rate': 'معدل الاستبدال', 'Points per member': 'النقاط لكل عضو', 'Members by tier': 'الأعضاء حسب الفئة', 'Member lifecycle': 'دورة حياة العضو', 'Recent activity': 'النشاط الأخير', 'System health': 'صحة النظام',
  'All time': 'منذ البداية', 'Joined since the 1st': 'انضموا منذ اليوم الأول', 'New members as a share of all members': 'الأعضاء الجدد كنسبة من الجميع', 'Points redeemed as a share of points issued': 'النقاط المستبدلة كنسبة من الصادرة', 'Points issued divided by members': 'النقاط الصادرة مقسومة على الأعضاء',
  'No tier': 'بدون فئة', 'Not classified yet. Stages appear after the next lifecycle run; members are not guessed into a stage.': 'لم يُصنَّف بعد. تظهر المراحل بعد التشغيل التالي لدورة الحياة، ولا يتم تخمين مرحلة العضو.', 'Check the lifecycle run': 'تحقق من تشغيل دورة الحياة',
  'No points activity yet. It appears here after the first bill or adjustment.': 'لا يوجد نشاط نقاط بعد. يظهر هنا بعد أول فاتورة أو تعديل.', 'Background jobs': 'المهام الخلفية', 'Messages waiting to send': 'رسائل بانتظار الإرسال', 'Sending': 'الإرسال', 'Messages needing a check': 'رسائل تحتاج إلى مراجعة', 'On': 'مفعّل',
  'Earned': 'مكتسبة', 'Active': 'نشط', 'At risk': 'معرّض للخطر', 'Lapsing': 'يتراجع', 'Lapsed': 'منقطع', 'n/a': 'غير متاح', 'No members yet. Tiers appear after the first enrolment.': 'لا يوجد أعضاء بعد. تظهر الفئات بعد أول تسجيل.', 'No programme yet': 'لا يوجد برنامج بعد',
  'on time': 'في الوقت', 'All jobs on time': 'كل المهام في وقتها', 'active': 'نشط', 'bill': 'فاتورة', 'From': 'من', 'unexpired points': 'نقاط سارية' };
const dsFor = (cur) => cur === 'INR' ? 'india-departmental-store' : 'uae-dubai-supermarket';
function model(cur, state) {
  const dir = DATA + dsFor(cur) + '/'; const cfg = J(dir + 'cfg.json'), mem = J(dir + 'members.json'), bills = J(dir + 'bills.json'), tiers = J(dir + 'tiers.json');
  const rate = RATE[cur] ?? 1, N = state === 'empty' ? 0 : mem.length;
  const issued = (state === 'zero' || state === 'empty') ? 0 : bills.reduce((s, b) => s + b.points_earned, 0), redeemed = Math.round(issued * 0.18), redemptions = Math.round(redeemed / 450) || (redeemed ? 1 : 0);
  const neu = N ? Math.round(N * 0.15) : 0, liabilityBase = (issued - redeemed) * cfg.redeem_value_per_pt;
  const sorted = [...tiers].sort((a, b) => a.threshold_pts - b.threshold_pts); const names = sorted.map(t => t.tier_name);
  const counts = state === 'zero' || N === 0 ? [0, 0, 0] : names.map(n => mem.filter(m => m.tier === n).length);
  const noTier = N - counts.reduce((a, b) => a + b, 0);
  const rows = bills.filter(b => b.day_offset != null).sort((a, b) => b.day_offset - a.day_offset || (a.bill_no < b.bill_no ? 1 : -1)).slice(0, 4);
  const st = [0.62, 0.18, 0.12].map(f => Math.round(N * f)); st.push(N - st.reduce((a, b) => a + b, 0));
  return { cfg, N, issued, redeemed, redemptions, neu, active: N ? N - Math.round(N * 0.08) : 0, liability: liabilityBase * rate, names, counts, noTier, rows, st, rate };
}
const PROG = (cfg, lang) => (lang === 'ar' && cfg.store_ar ? cfg.store_ar : cfg.store) + (lang === 'ar' ? ' - بطاقة' : ' Card');
function body(o) {
  const { lang, cur, state, theme } = o; const ar = lang === 'ar'; const m = model(cur, state);
  const t = (s) => (ar ? T[s] ?? s : s); const dg = (s) => (ar ? String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]) : String(s)); const n = (x) => dg(Math.round(x).toLocaleString('en-US'));
  const money = (x) => { const s = formatMoney(x, cur, { lang }); return dg(s); };
  const pct = (a, b) => b ? Math.round(a / b * 100) : 0; const warn = state === 'zero' || state === 'warning' || state === 'empty' ? true : false; const jobs = 5;
  const issuedOk = m.issued > 0; const rate = issuedOk ? pct(m.redeemed, m.issued) + '%' : null;
  const kpi = (id, label, value, sub, extra = '') => `<div class="la-kpi la-widget" data-ui="la-dashboard.kpi-${id}"${extra}><div class="la-kpi-label" data-ui="la-dashboard.kpi-${id}.label">${t(label)}</div><div class="la-kpi-row"><span class="la-kpi-value la-num" data-ui="la-dashboard.kpi-${id}.value" data-count-to="${String(value).replace(/[^\d.]/g, '')}">${value}</span></div><div class="la-kpi-sub" data-ui="la-dashboard.kpi-${id}.sub">${sub}</div></div>`;
  const liabSub = (ar ? `من ${n(m.issued - m.redeemed)} نقطة سارية` : `From ${n(m.issued - m.redeemed)} unexpired points`);
  const tierLegend = [...m.names.map((nm, i) => [nm, m.counts[i], 's' + (i + 1)]).slice(0, 3), [t('No tier'), m.noTier, state === 'zero' ? 's2' : 's4']].filter((r, i, a) => state === 'zero' ? (i === 0 || i === a.length - 1) : true);
  const seg = tierLegend.map(([, c, cl], i) => `<i class="la-seg ${cl}" style="width:${pct(c, m.N)}%" data-ui="la-dashboard.tier-seg-${i + 1}"></i>`).join('');
  const zeroBar = m.N === 0;
  const tierRows = tierLegend.map(([nm, c, cl], i) => `<div class="la-legend-row" data-ui="la-dashboard.tier-row-${i + 1}"><i class="la-dot ${cl}"></i><span class="la-legend-label">${nm}</span><span class="la-legend-val"><span class="la-lv la-num">${n(c)}</span><span class="la-lv la-num">${dg(pct(c, m.N))}%</span></span></div>`).join('');
  const tierCard = zeroBar ? `<p>${t('No members yet. Tiers appear after the first enrolment.')}</p>` : `<div class="la-sbar" data-ui="la-dashboard.tier-bar"><div class="la-sbar-fill" data-ui="la-dashboard.tier-fill">${seg}</div></div><div class="la-legend">${tierRows}</div>`;
  const life = state === 'zero' || m.N === 0 || m.issued === 0 ? `<p>${t('Not classified yet. Stages appear after the next lifecycle run; members are not guessed into a stage.')}</p><a class="la-dash-link" data-ui="la-dashboard.lifecycle-link">${t('Check the lifecycle run')}</a>`
    : `<div class="la-sbar" data-ui="la-dashboard.life-bar"><div class="la-sbar-fill">${m.st.map((c, i) => `<i class="la-seg s${i + 1}" style="width:${pct(c, m.N)}%"></i>`).join('')}</div></div><div class="la-legend">${['Active', 'At risk', 'Lapsing', 'Lapsed'].map((l, i) => `<div class="la-legend-row" data-ui="la-dashboard.life-row-${i + 1}"><i class="la-dot s${i + 1}"></i><span class="la-legend-label">${t(l)}</span><span class="la-legend-val"><span class="la-lv la-num">${n(m.st[i])}</span><span class="la-lv la-num">${dg(pct(m.st[i], m.N))}%</span></span></div>`).join('')}</div>`;
  const act = m.issued === 0 ? `<p data-ui="la-dashboard.activity-empty">${t('No points activity yet. It appears here after the first bill or adjustment.')}</p>`
    : `<div class="la-dash-act">${m.rows.map((b, i) => `<div class="la-dash-act-row${i === 1 ? ' is-out' : ''}" data-ui="la-dashboard.activity-row-${i + 1}"><span class="la-dash-act-main"><b>${i === 1 ? (ar ? 'مستبدلة' : 'Redeemed') : t('Earned')}</b><span>${t('bill')} ${dg(b.bill_no)}</span></span><span class="la-dash-act-pts la-num">${i === 1 ? '-' : '+'}${n(b.points_earned)}</span></div>`).join('')}</div>`;
  const pill = (cl, txt, id) => `<span class="la-pill ${cl}" data-ui="${id}">${txt}</span>`;
  const jobsTxt = ar ? `${n(jobs)} مهام لا تعمل في وقتها` : `${jobs} background jobs not running on time`;
  const attn = `<div class="la-dash-attn" data-ui="la-dashboard.attention"><h2 class="la-dash-h">${t(warn ? 'Needs attention' : 'All clear')}</h2>${warn ? pill('is-amber', jobsTxt, 'la-dashboard.attention-pill') : pill('is-green', t('All jobs on time'), 'la-dashboard.attention-pill')}</div>`;
  const prog = m.N === 0 && state === 'empty' ? PROG(m.cfg, lang) : PROG(m.cfg, lang);
  const menu = state === 'menu-open' ? `<div class="la-dash-menu" data-ui="la-dashboard.programme-menu"><div class="la-menu-item is-active" data-ui="la-dashboard.programme-option-1">${prog}</div><div class="la-menu-item" data-ui="la-dashboard.programme-option-2">${ar ? 'برنامج الولاء الذهبي' : 'Gold Circle Programme'}</div><div class="la-menu-item" data-ui="la-dashboard.programme-option-3">${ar ? 'نادي المتجر' : 'Store Club'}</div></div>` : '';
  const sel = `<span class="la-dash-select" data-ui="la-dashboard.programme-switch"><span data-ui="la-dashboard.programme-name">${prog}</span><svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></span>`;
  const hrow = (i, l, v, p) => `<div class="la-dash-hrow${p ? ' is-pill' : ''}" data-ui="la-dashboard.health-row-${i}"><span class="la-hl-label">${t(l)}</span>${p || `<span class="la-num">${v}</span>`}</div>`;
  const health = `<section class="la-dash-hl"><div class="la-dcard" data-ui="la-dashboard.health"><h3 class="la-card-title">${t('System health')}</h3>${hrow(1, 'Background jobs', '', warn ? pill('is-amber', ar ? `${n(jobs)} لا تعمل في وقتها` : `${jobs} not running on time`, 'la-dashboard.health-jobs-pill') : pill('is-green', t('All jobs on time'), 'la-dashboard.health-jobs-pill'))}${hrow(2, 'Messages waiting to send', n(0))}${hrow(3, 'Sending', t('On'))}${hrow(4, 'Messages needing a check', n(0))}</div></section>`;
  const grow = m.N ? Math.round(m.neu / m.N * 100) : 0;
  return `<div class="la-dash" data-ui="la-dashboard" data-state="${state}">
<div class="la-dash-prog" data-ui="la-dashboard.programme"><span class="la-dash-prog-label">${t('Programme')}</span>${sel}${menu}</div>
${attn}
<div class="la-dash-grid6" data-ui="la-dashboard.kpis">${kpi('members', 'Members', n(m.N), `${n(m.active)} ${t('active')}`)}${kpi('new', 'New this month', n(m.neu), t('Joined since the 1st'))}${kpi('issued', 'Points issued', n(m.issued), t('All time'))}${kpi('redeemed', 'Points redeemed', n(m.redeemed), t('All time'))}${kpi('redemptions', 'Redemptions', n(m.redemptions), t('All time'))}${kpi('liability', 'Estimated liability', money(m.liability), liabSub)}</div>
<div class="la-dash-grid3" data-ui="la-dashboard.kpis-2">${kpi('growth', 'Growth this month', dg(grow) + '%', t('New members as a share of all members'))}${kpi('rate', 'Redemption rate', rate ? dg(rate) : t('n/a'), t('Points redeemed as a share of points issued'))}${kpi('ppm', 'Points per member', n(m.N ? m.issued / m.N : 0), t('Points issued divided by members'))}</div>
<div class="la-dash-cols"><div class="la-dash-col"><section class="la-dcard" data-ui="la-dashboard.tiers"><h3 class="la-card-title">${t('Members by tier')}</h3>${tierCard}</section><section class="la-dcard is-fill" data-ui="la-dashboard.lifecycle"><h3 class="la-card-title">${t('Member lifecycle')}</h3>${life}</section></div><section class="la-dcard" data-ui="la-dashboard.recent"><h3 class="la-card-title">${t('Recent activity')}</h3>${act}</section></div>
${health}
</div>`;
}
const CSS = ['tokens/css/la-desk-widgets.css', 'tokens/css/la-desk-chart.css', 'tokens/css/la-desk-dashboard.css'];
export function page(o) {
  let doc = renderLa('shell', { theme: o.theme, lang: o.lang, cssBase: '../../tokens/css/', set: { pageTitle: o.lang === 'ar' ? 'لوحة الولاء' : 'Loyalty Dashboard' } });
  doc = doc.replace('<!--la:content-->', body(o)).replace(/<title>[^<]*<\/title>/, '<title>Loyalty Dashboard</title>').replace('</head>', CSS.map(f => `<link rel="stylesheet" href="../../${f}">`).join('\n') + '\n</head>');
  return doc;
}
export const VARIANTS = [
  ['', { lang: 'en', cur: 'AED', state: 'populated' }], ['.dark', { lang: 'en', cur: 'AED', state: 'populated', theme: 'dark' }], ['.ar-AED', { lang: 'ar', cur: 'AED', state: 'populated' }], ['.en-INR', { lang: 'en', cur: 'INR', state: 'populated' }], ['.kw-KWD', { lang: 'en', cur: 'KWD', state: 'populated' }],
  ['.zero', { lang: 'en', cur: 'AED', state: 'zero' }], ['.zero.dark', { lang: 'en', cur: 'AED', state: 'zero', theme: 'dark' }], ['.zero.ar-AED', { lang: 'ar', cur: 'AED', state: 'zero' }], ['.empty', { lang: 'en', cur: 'AED', state: 'empty' }], ['.warning', { lang: 'en', cur: 'AED', state: 'warning' }], ['.menu-open', { lang: 'en', cur: 'AED', state: 'menu-open' }], ['.zero.en-INR', { lang: 'en', cur: 'INR', state: 'zero' }]];
if (process.argv[1]?.endsWith('la-page-dashboard.mjs')) {
  fs.mkdirSync(ROOT + 'pages/la', { recursive: true });
  for (const [sfx, o] of VARIANTS) fs.writeFileSync(ROOT + `pages/la/loyalty-dashboard${sfx}.html`, page(o));
  console.log('wrote', VARIANTS.length, 'variants');
  if (process.argv.includes('--measure')) {
    const { chromium } = await import('playwright'); const b = await chromium.launch(); const out = { id: 'la-loyalty-dashboard', system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, variants: {} };
    for (const [sfx] of VARIANTS) { const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }); await p.goto('file://' + ROOT + `pages/la/loyalty-dashboard${sfx}.html`); await p.evaluate(() => document.fonts.ready);
      const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }; }));
      const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + sfx);
      out.variants['loyalty-dashboard' + sfx] = boxes; await p.screenshot({ path: ROOT + `pages/la/loyalty-dashboard${sfx}.png` }); await p.close(); }
    await b.close(); fs.writeFileSync(ROOT + 'pages/la/loyalty-dashboard.manifest.json', JSON.stringify(out, null, 1));
    const mf = J(ROOT + 'manifest.json'); mf.pages['la-loyalty-dashboard'] = { id: 'la-loyalty-dashboard', title: 'Loyalty Dashboard', system: 'loyal-arrow-desk', html: 'pages/la/loyalty-dashboard.html', reference: 'ux-after-r1/loyalty-dashboard__desktop-light.png', measurements: 'pages/la/loyalty-dashboard.manifest.json',
      variants: VARIANTS.map(([s, o]) => ({ file: `pages/la/loyalty-dashboard${s}.html`, screenshot: `pages/la/loyalty-dashboard${s}.png`, state: o.state, lang: o.lang, currency: o.cur, theme: o.theme || 'light' })),
      interactionTargets: { 'programme-switch': 'la-dashboard.programme-switch', 'kpi-count-up': 'la-dashboard.kpi-*.value[data-count-to]', 'tier-bar-fill': 'la-dashboard.tier-fill (width driven by --la-progress on la-dashboard)' } };
    fs.writeFileSync(ROOT + 'manifest.json', JSON.stringify(mf, null, 2)); console.log('measured');
  }
}
