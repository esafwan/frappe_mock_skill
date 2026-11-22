// Composes the Program ROI report page (rpt-program-roi) for loyal-arrow-desk from components/la/{report-intro,report-filters,report-notice,roi-kpis,measure-table}
// inside la/shell, filled from loyal-arrow/data/uae-dubai-supermarket (synthetic). Deterministic. Writes pages/la/rpt-program-roi[.variant].html.
//   node scripts/la-page-roi.mjs
import fs from 'fs'; import path from 'path'; import { fill } from './engine.mjs'; import { ROOT } from './lib.mjs';
import { renderLa, laSlotValues } from '../tools/render-la.mjs'; import { formatMoney } from '../tools/render.mjs'; import { MEASURES } from './la-gen-roi.mjs';
const D = path.resolve(ROOT, '../loyal-arrow/data/uae-dubai-supermarket/'); const J = f => JSON.parse(fs.readFileSync(path.join(D, f), 'utf8'));
const bills = J('bills.json'), cfg = J('cfg.json'); const RATE = { AED: 1, SAR: 1.02, QAR: 1.01, KWD: 0.0836, INR: 22.6 };   // synthetic display rates
const dig = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const PRESET = { '7d': 7, '30d': 30, '90d': 90, qtd: 42, custom: 90 };

/* ---- metrics from the dataset (member side real; non-member + reward cost are documented synthetic overlays) ---- */
function metrics(preset) {
  const from = -(PRESET[preset] - 1); const idx = bills.map((b, i) => [b, i]).filter(([b]) => b.day_offset >= from);
  const mb = idx.length, sales = idx.reduce((a, [b]) => a + b.total, 0), buyers = new Set(idx.map(([b]) => b.member_id)).size;
  const redeemedPts = idx.reduce((a, [, i]) => a + (i % 3 === 0 ? cfg.min_redeem_pts : 0), 0);   // synthetic overlay: every 3rd bill redeems min_redeem_pts (data pack has no redemptions)
  const redeemVal = redeemedPts * cfg.redeem_value_per_pt, reward = Math.round(redeemVal * 0.6 * 100) / 100;   // overlay: reward item cost = 60% of redeemed value
  const avg = mb ? sales / mb : 0, nmBills = Math.round(mb * 0.6), nmAvg = avg * 0.92, nmSales = nmBills * nmAvg;   // overlay: non-member capture on, 0.6x bills, 0.92x basket
  const extra = avg - nmAvg, extraPct = nmAvg ? extra / nmAvg * 100 : 0, extraSales = extra * mb, cost = redeemVal + reward, net = extraSales - cost, roi = cost ? net / cost * 100 : 0;
  return { buyers, mb, sales, avg, redeemedPts, redeemVal, reward, nmBills, nmSales, nmAvg, extra, extraPct, extraSales, cost, net, roi };
}
const NOTE = { en: { ok: '', own: 'Purchases of in-scope members; each bill is counted once.', anon: 'Anonymous purchase events, scoped by the program stores.', nomem: 'no member bills', cap: 'non-member bill capture is off (the non-member measures need it).', pv: 'points valued at current point value', rc: 'reward cost not captured (Loyalty Settings must enable it).', cmp: 'Compared against non-member baseline.', roi: '(extra sales - program cost) / program cost' },
  ar: { ok: '', own: 'مشتريات الأعضاء ضمن النطاق؛ تُحتسب كل فاتورة مرة واحدة.', anon: 'عمليات شراء مجهولة ضمن متاجر البرنامج.', nomem: 'لا توجد فواتير أعضاء', cap: 'تسجيل فواتير غير الأعضاء متوقف (مقاييس غير الأعضاء تحتاجه).', pv: 'نقطة بقيمة النقطة الحالية', rc: 'لم تُسجَّل تكلفة المكافآت (يجب تفعيلها من إعدادات الولاء).', cmp: 'مقارنة بخط أساس غير الأعضاء.', roi: '(المبيعات الإضافية - تكلفة البرنامج) / تكلفة البرنامج' } };

function build(v) {
  const lang = v.lang || 'en', cur = v.cur || 'AED', st = v.state, M = metrics(v.preset || '90d'); const N = NOTE[lang], AV = lang === 'ar' ? 'متاح' : 'Available', NED = lang === 'ar' ? 'لا توجد بيانات كافية' : 'Not enough data';
  const loc = s => lang === 'ar' ? dig(s) : s, money = x => loc(formatMoney(x * RATE[cur], cur, { lang })), num = x => loc(Math.round(x).toLocaleString('en-US')), pct = x => loc(x.toFixed(1) + '%');
  const R = Array.from({ length: 16 }, () => ['', '', NED, '']);   // [num, amt, status, note]
  const ok = (i, n, a = '', note = '') => { R[i - 1] = [n, a, AV, note]; };
  let K; // [value1..5, sub1..5, noticeState, noticeText]
  if (st === 'not-enough-data') {
    ok(1, '0'); ok(2, '0', '', N.own); ok(3, '', money(0)); R[3][3] = N.nomem; ok(5, '0', '', N.anon); [6, 7, 8, 9, 10].forEach(i => R[i - 1][3] = N.cap); ok(11, num(261000)); ok(12, '', money(2610), `${num(261000)} ${N.pv}`); R[12][3] = N.rc; ok(14, '', money(2610));
    K = [money(0), '—', '—', money(2610), '—', ['', NED, NED, '', NED], 'info'];
  } else if (st === 'zero') {
    ok(1, '0'); ok(2, '0', '', N.own); ok(3, '', money(0)); R[3][3] = N.nomem; ok(5, '0', '', N.anon); ok(6, '', money(0)); R[6][3] = N.nomem; [8, 9, 10].forEach(i => R[i - 1][3] = N.nomem); ok(11, '0'); ok(12, '', money(0)); ok(13, '', money(0)); ok(14, '', money(0)); R[14][3] = N.roi;
    K = [money(0), '—', '—', money(0), '—', ['', NED, NED, '', NED], 'info'];
  } else if (st === 'populated') {
    ok(1, num(M.buyers)); ok(2, num(M.mb), '', N.own); ok(3, '', money(M.sales)); ok(4, '', money(M.avg)); ok(5, num(M.nmBills), '', N.anon); ok(6, '', money(M.nmSales)); ok(7, '', money(M.nmAvg)); ok(8, '', money(M.extra), N.cmp); ok(9, pct(M.extraPct)); ok(10, '', money(M.extraSales));
    ok(11, num(M.redeemedPts)); ok(12, '', money(M.redeemVal), `${num(M.redeemedPts)} ${N.pv}`); ok(13, '', money(M.reward)); ok(14, '', money(M.cost)); ok(15, pct(M.roi), '', N.roi); ok(16, '', money(M.net));
    K = [money(M.sales), money(M.avg), money(M.extra), money(M.cost), pct(M.roi), ['', '', '', '', ''], 'none'];
  } else { // empty: no program data at all
    K = ['—', '—', '—', '—', '—', ['', '', '', '', ''], 'warning'];
  }
  return { R, K };
}

const pageFor = (v) => {
  const lang = v.lang || 'en', cur = v.cur || 'AED', { R, K } = build(v); const o = { lang, theme: v.theme, currency: cur };
  const part = (id, set, state) => { const meta = JSON.parse(fs.readFileSync(ROOT + `components/la/${id}/component.json`)); const vals = { ...laSlotValues(id, { ...o, state: undefined }), ...set };
    const sl = JSON.parse(fs.readFileSync(ROOT + `components/la/${id}/slots.json`)).slots; for (const [k, x] of Object.entries(vals)) if (sl[k]?.maxLength && String(x).length > sl[k].maxLength) throw new Error(`${id}.${k} exceeds maxLength ${sl[k].maxLength}: ${x}`);
    return fill(fs.readFileSync(ROOT + `components/la/${id}/component.html`, 'utf8').replaceAll('{{state}}', state), vals); };
  const kset = {}; const labels = {}; for (let i = 1; i <= 5; i++) { kset['value' + i] = K[i - 1]; kset['sub' + i] = K[5][i - 1]; }
  const tset = { }; R.forEach((r, i) => { const n = i + 1; tset['num' + n] = r[0]; tset['amt' + n] = r[1]; tset['st' + n] = r[2]; tset['note' + n] = r[3]; });
  const noticeText = { en: { info: 'Not enough data yet to say whether the program paid for itself.', zero: 'No activity in this period yet. Results appear after the first member bill.', warning: 'No loyalty program is set up for this report yet.' }, ar: { info: 'لا توجد بيانات كافية بعد لمعرفة ما إذا كان البرنامج قد غطّى تكلفته.', zero: 'لا يوجد نشاط في هذه الفترة بعد. تظهر النتائج بعد أول فاتورة عضو.', warning: 'لم يتم إعداد برنامج ولاء لهذا التقرير بعد.' } }[lang];
  const ns = K[6], nText = ns === 'none' ? '' : (v.state === 'zero' ? noticeText.zero : noticeText[ns]);
  const body = part('report-intro', {}, 'x') + part('report-filters', {}, 'active-' + (v.preset || '90d')) + part('report-notice', { text: nText }, ns) + part('roi-kpis', kset, 'x') + part('measure-table', tset, v.state === 'empty' ? 'empty' : 'populated');
  const titleAr = 'عائد البرنامج', title = lang === 'ar' ? titleAr : 'Program ROI';
  let doc = renderLa('shell', { ...o, set: { pageTitle: title }, cssBase: '../../tokens/css/' });
  doc = doc.replace('<!--la:content-->', body).replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-desk-report.css">\n</head>').replace(/<title>[^<]*<\/title>/, `<title>Program ROI (${v.name})</title>`);
  return doc;
};
export const VARIANTS = [
  { file: '', name: 'not-enough-data, en AED light', state: 'not-enough-data' }, { file: '.dark', name: 'not-enough-data, dark', state: 'not-enough-data', theme: 'dark' }, { file: '.ar-AED', name: 'not-enough-data, ar RTL AED', state: 'not-enough-data', lang: 'ar' },
  { file: '.en-INR', name: 'populated, en INR', state: 'populated', cur: 'INR' }, { file: '.kw-KWD', name: 'populated, en KWD (3 decimals)', state: 'populated', cur: 'KWD' },
  { file: '.populated', name: 'populated, en AED', state: 'populated' }, { file: '.populated.dark', name: 'populated, dark', state: 'populated', theme: 'dark' }, { file: '.populated.ar-AED', name: 'populated, ar RTL AED', state: 'populated', lang: 'ar' },
  { file: '.zero', name: 'zero activity', state: 'zero' }, { file: '.empty', name: 'empty (no program)', state: 'empty' },
  { file: '.preset-7d', name: 'populated, 7d', state: 'populated', preset: '7d' }, { file: '.preset-30d', name: 'populated, 30d', state: 'populated', preset: '30d' }, { file: '.preset-qtd', name: 'populated, QTD', state: 'populated', preset: 'qtd' }];
if (process.argv[1]?.endsWith('la-page-roi.mjs')) { fs.mkdirSync(ROOT + 'pages/la', { recursive: true }); for (const v of VARIANTS) fs.writeFileSync(ROOT + `pages/la/rpt-program-roi${v.file}.html`, pageFor(v)); console.log('wrote', VARIANTS.length, 'pages');
  if (process.argv.includes('--measure')) {   // pixel boxes of every [data-ui] per variant -> pages/la/rpt-program-roi.manifest.json + screenshots + manifest.json entry
    const { chromium } = await import('playwright'); const b = await chromium.launch(); const out = { id: 'la-rpt-program-roi', system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, variants: {} };
    for (const v of VARIANTS) { const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 }); await p.goto('file://' + ROOT + `pages/la/rpt-program-roi${v.file}.html`); await p.evaluate(() => document.fonts.ready);
      const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) }; }));
      const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.file);
      out.variants['rpt-program-roi' + v.file] = boxes; await p.screenshot({ path: ROOT + `pages/la/shots/rpt-program-roi${v.file}.png` }); await p.close(); }
    await b.close(); fs.writeFileSync(ROOT + 'pages/la/rpt-program-roi.manifest.json', JSON.stringify(out, null, 1));
    const mf = JSON.parse(fs.readFileSync(ROOT + 'manifest.json', 'utf8')); mf.pages['la-rpt-program-roi'] = { id: 'la-rpt-program-roi', title: 'Program ROI report', system: 'loyal-arrow-desk', html: 'pages/la/rpt-program-roi.html', reference: 'ux-after-r1/rpt-program-roi__desktop-light.png', measurements: 'pages/la/rpt-program-roi.manifest.json',
      components: ['la-shell', 'la-report-intro', 'la-report-filters', 'la-report-notice', 'la-roi-kpis', 'la-measure-table'],
      variants: VARIANTS.map(v => ({ file: `pages/la/rpt-program-roi${v.file}.html`, screenshot: `pages/la/shots/rpt-program-roi${v.file}.png`, state: v.state, lang: v.lang || 'en', currency: v.cur || 'AED', theme: v.theme || 'light', preset: v.preset || '90d' })),
      interactionTargets: { 'preset-pill-7d..90d': 'la-report-filters.pill-1..3 (QTD pill-4, Custom pill-5); active pill via data-state=active-<preset> (re-render variants .preset-7d/.preset-30d/default 90d)', 'kpi-to-value': 'la-roi-kpis.kpi-N.value (tile la-roi-kpis.kpi-N; label .label; sub .sub)', notice: 'la-report-notice (.text)', 'measure-rows': 'la-measure-table.row-N / .num-N / .amt-N / .status-N / .note-N', program: 'la-report-filters.program-value', 'reset': 'la-report-filters.reset' } };
    fs.writeFileSync(ROOT + 'manifest.json', JSON.stringify(mf, null, 2)); console.log('measured'); } }
