#!/usr/bin/env node
// Composes pages/la/counter-receipt[.variant].html (Counter app "Bill booked" receipt, 390x844) from la/counter-shell + la/counter-bill-card + la/counter-btn.
// Reference: screenshots/s07c-receipt.png. Numbers come from loyal-arrow/data/<dataset>/counter_receipt.json (gen_counter_receipt.py). Deterministic.
// Writes pages/la/counter-receipt.page.json and registers manifest.pages["la-counter-receipt"].   node scripts/la-page-counter-receipt.mjs
import fs from 'fs'; import { chromium } from 'playwright';
import { renderLa } from '../tools/render-la.mjs'; import { formatMoney } from '../tools/render.mjs'; import { ROOT } from './lib.mjs';
const OUT = ROOT + 'pages/la/'; const NAME = 'counter-receipt'; const DATA = ROOT + '../loyal-arrow/data/';
const DS = { INR: 'india-departmental-store' }; const dsOf = c => DS[c] || 'uae-dubai-supermarket';
const rec = c => JSON.parse(fs.readFileSync(`${DATA}${dsOf(c)}/counter_receipt.json`, 'utf8'));
const ad = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const T = {
  en: { title: 'Counter', badge: 'c@x', billFor: 'Bill for', member: 'Demo Member', heading: 'Bill booked', earned: n => `Earned ${n} points`, balance: n => `Balance ${n} points`, cta: 'New bill', emptyHead: 'Nothing booked', note: 'No bill to show. Start a new bill.', pendingHead: 'Booking bill' },
  ar: { title: 'الكاشير', badge: 'c@x', billFor: 'فاتورة لـ', member: 'عضو تجريبي', heading: 'تم تسجيل الفاتورة', earned: n => `اكتسب ${ad(n)} نقطة`, balance: n => `الرصيد ${ad(n)} نقطة`, cta: 'فاتورة جديدة', emptyHead: 'لم تُسجَّل فاتورة', note: 'لا توجد فاتورة للعرض. ابدأ فاتورة جديدة.', pendingHead: 'جارٍ تسجيل الفاتورة' },
};
// state: populated (booked) | zero (0 points earned) | empty (nothing booked) | pending (pre-reveal skeleton)
export const V = [
  { key: '', cur: 'INR', desc: 'Populated: Bill booked, light, en / INR (reference s07c-receipt)' },
  { key: 'dark', theme: 'dark', cur: 'INR', desc: 'Populated, dark (estimated tokens)' },
  { key: 'ar-AED', lang: 'ar', cur: 'AED', desc: 'Populated, RTL Arabic, AED' },
  { key: 'ar-AED.dark', lang: 'ar', cur: 'AED', theme: 'dark', desc: 'RTL Arabic dark' },
  { key: 'en-INR', cur: 'INR', desc: 'Populated, INR locale' },
  { key: 'en-AED', cur: 'AED', desc: 'Populated, AED' },
  { key: 'kw-KWD', cur: 'KWD', desc: 'Populated, KWD 3-decimal' },
  { key: 'en-SAR', cur: 'SAR', desc: 'Populated, SAR' },
  { key: 'en-QAR', cur: 'QAR', desc: 'Populated, QAR' },
  { key: 'zero', state: 'zero', cur: 'INR', desc: 'Zero points earned (bill below minimum)' },
  { key: 'zero.dark', state: 'zero', theme: 'dark', cur: 'INR', desc: 'Zero points, dark' },
  { key: 'zero.ar-AED', state: 'zero', lang: 'ar', cur: 'AED', desc: 'Zero points, RTL' },
  { key: 'zero.kw-KWD', state: 'zero', cur: 'KWD', desc: 'Zero points, KWD 3-decimal' },
  { key: 'empty', state: 'empty', cur: 'INR', desc: 'Nothing booked (no bill to show)' },
  { key: 'empty.dark', state: 'empty', theme: 'dark', cur: 'INR', desc: 'Empty, dark' },
  { key: 'empty.ar-AED', state: 'empty', lang: 'ar', cur: 'AED', desc: 'Empty, RTL' },
  { key: 'pending', state: 'pending', cur: 'INR', desc: 'Pre-reveal skeleton (start frame of the success reveal)' },
  { key: 'pending.dark', state: 'pending', theme: 'dark', cur: 'INR', desc: 'Pre-reveal skeleton, dark' },
];
const slug = k => (k ? '.' + k : '');
const inner = h => h.match(/<div id="ui-kit-stage">\s*([\s\S]*?)\s*<\/div><\/body>/)[1];
function compose(v) {
  const lang = v.lang || 'en', t = T[lang], theme = v.theme || 'light', cur = v.cur || 'AED', st = v.state || 'populated';
  const o = { lang, theme, currency: cur, cssBase: '../../tokens/css/' };
  const r = rec(cur)[st === 'zero' ? 'zero' : 'booked'][cur];
  const money = n => { const s = formatMoney(n, cur, { lang }); return lang === 'ar' ? ad(s) : s; };
  const cstate = { populated: 'booked', zero: 'zero', empty: 'empty', pending: 'pending' }[st];
  const set = { heading: st === 'empty' ? t.emptyHead : st === 'pending' ? t.pendingHead : t.heading, amount: money(r.amount), earned: t.earned(r.earned_pts), balance: t.balance(r.balance_pts), note: t.note };
  const card = inner(renderLa('counter-bill-card', { ...o, state: cstate, set }));
  const btn = inner(renderLa('counter-btn', { ...o, state: st === 'pending' ? 'disabled' : 'primary', set: { size: 'lg', label: t.cta } }));
  const rename = (h, from, to) => h.replace(new RegExp(`data-ui="${from}(\\.[a-z-]+)?"`, 'g'), (m, p) => `data-ui="la-counter-receipt.${to}${p || ''}"`);
  let content = rename(card, 'la-counter-bill-card', 'card') + '\n' + rename(btn, 'la-counter-btn', 'new');
  content = `<div class="lc-stack" data-ui="la-counter-receipt.content">${content}</div>`;
  let html = renderLa('counter-shell', { ...o, state: 'default', set: { title: t.title, userBadge: t.badge, screenTitle: t.title, billLabel: t.billFor, billFor: t.member } });
  html = html.replace('<!--la:content-->', content);
  html = html.replace('data-ui="la-counter-shell"', `data-ui="la-counter-receipt" data-page="counter-receipt" data-variant="${v.key || 'default'}" data-currency="${cur}" data-state="${st}"`)
    .replace(/data-ui="la-counter-shell\.(topbar|title|user-badge|body|bill-for)"/g, (m, p) => `data-ui="la-counter-receipt.${p}"`);
  html = html.replace(/<h1 class="la-cshell-screen"[^>]*>[\s\S]*?<\/h1>/, '');
  html = html.replace('</style>', '#ui-kit-stage{padding:0!important}.lc-stack{display:flex;flex-direction:column;gap:12px;padding-block-start:17px}</style>').replace(/<title>[^<]*<\/title>/, `<title>Counter receipt${slug(v.key)}</title>`);
  html = html.replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-counter.css"><link rel="stylesheet" href="../../tokens/css/la-counter-receipt.css"></head>');
  return html;
}
fs.mkdirSync(OUT, { recursive: true });
for (const v of V) fs.writeFileSync(`${OUT}${NAME}${slug(v.key)}.html`, compose(v));
const b = await chromium.launch(); const meta = { id: 'la-counter-receipt', title: 'Counter app Bill booked receipt', system: 'loyal-arrow-desk', route: '/counter/bill/receipt', reference: 'screenshots/s07c-receipt.png', viewport: { w: 390, h: 844 }, variants: {} };
for (const v of V) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.goto('file://' + `${OUT}${NAME}${slug(v.key)}.html`); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].filter(e => e.getBoundingClientRect().width > 0).map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.key + ': ' + ids.filter((x, i) => ids.indexOf(x) !== i));
  await p.screenshot({ path: `${OUT}${NAME}${slug(v.key)}.png` });
  meta.variants[v.key || 'default'] = { file: `pages/la/${NAME}${slug(v.key)}.html`, screenshot: `pages/la/${NAME}${slug(v.key)}.png`, theme: v.theme || 'light', lang: v.lang || 'en', currency: v.cur || 'AED', state: v.state || 'populated', desc: v.desc, targets: boxes }; await ctx.close();
}
await b.close(); fs.writeFileSync(OUT + NAME + '.page.json', JSON.stringify(meta, null, 1));
const mp = ROOT + 'manifest.json'; const m = JSON.parse(fs.readFileSync(mp)); m.pages = m.pages || {};
m.pages['la-counter-receipt'] = { id: 'la-counter-receipt', system: 'loyal-arrow-desk', group: 'la', path: `pages/la/${NAME}.page.json`, viewport: meta.viewport, components: ['la-counter-shell', 'la-counter-bill-card', 'la-counter-btn'], interactionTargets: { 'la-counter-receipt.card': 'reveal: Bill booked success card (pending -> booked)', 'la-counter-receipt.card.amount': 'highlight: bill amount', 'la-counter-receipt.card.earned': 'highlight: points earned', 'la-counter-receipt.card.balance': 'highlight: new balance', 'la-counter-receipt.new': 'tap: New bill' }, variants: Object.fromEntries(Object.entries(meta.variants).map(([k, x]) => [k, { file: x.file, desc: x.desc }])), targets: meta.variants.default.targets.map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) };
fs.writeFileSync(mp, JSON.stringify(m, null, 2)); console.log('counter-receipt: ' + V.length + ' variants');
