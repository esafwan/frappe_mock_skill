#!/usr/bin/env node
// Composes pages/la/counter-preview[.variant].html (Counter app bill -> earn preview, 390x844; reference dumps/screenshots/s07c-preview.png)
// from la/counter-shell + lcp-* primitives. Data: loyal-arrow/data/<dataset>/counter_preview.json (gen_counter_preview.py).
// Deterministic. Measures every data-ui box into pages/la/counter-preview.page.json and registers manifest.pages["la-counter-preview"].
import fs from 'fs'; import { chromium } from 'playwright';
import { renderLa } from '../tools/render-la.mjs'; import { formatMoney } from '../tools/render.mjs'; import { ROOT } from './lib.mjs';
const OUT = ROOT + 'pages/la/', NAME = 'counter-preview', DATA = ROOT + '../loyal-arrow/data/';
const J = ds => JSON.parse(fs.readFileSync(DATA + ds + '/counter_preview.json', 'utf8'));
const T = {
  en: { title: 'Counter', billFor: 'Bill for', bill: 'Bill', earn: 'Points earned', go: 'Continue without redeeming', redeem: 'Redeem points', change: 'Change amount', note: 'Tier bonus x%s' },
  ar: { title: 'الكاشير', billFor: 'فاتورة', bill: 'الفاتورة', earn: 'النقاط المكتسبة', go: 'متابعة دون استبدال', redeem: 'استبدال النقاط', change: 'تغيير المبلغ', note: 'مكافأة المستوى x%s' },
};
// state: populated | zero (bill earns 0 pts) | empty (no amount yet) | count-up (points mid-animation)
export const V = [
  { key: '' }, { key: 'dark', theme: 'dark' },
  { key: 'ar-AED', lang: 'ar', cur: 'AED' }, { key: 'ar-AED.dark', lang: 'ar', cur: 'AED', theme: 'dark' },
  { key: 'en-INR', cur: 'INR' }, { key: 'kw-KWD', cur: 'KWD' }, { key: 'en-SAR', cur: 'SAR' }, { key: 'en-QAR', cur: 'QAR' },
  { key: 'empty', state: 'empty' }, { key: 'empty.dark', state: 'empty', theme: 'dark' }, { key: 'empty.ar-AED', state: 'empty', lang: 'ar', cur: 'AED' },
  { key: 'zero', state: 'zero' }, { key: 'zero.dark', state: 'zero', theme: 'dark' }, { key: 'zero.ar-AED', state: 'zero', lang: 'ar', cur: 'AED' }, { key: 'zero.en-INR', state: 'zero', cur: 'INR' },
  { key: 'count-up', state: 'count-up' }, { key: 'count-up.dark', state: 'count-up', theme: 'dark' }, { key: 'count-up.ar-AED', state: 'count-up', lang: 'ar', cur: 'AED' }, { key: 'count-up.en-INR', state: 'count-up', cur: 'INR' },
  { key: 'count-up.kw-KWD', state: 'count-up', cur: 'KWD' },
].map(v => ({ desc: `${v.state || 'populated'}, ${v.theme || 'light'}, ${v.lang || 'en'} / ${v.cur || 'AED'}`, ...v }));
const slug = k => (k ? '.' + k : '');
const digits = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
function compose(v) {
  const lang = v.lang || 'en', t = T[lang], theme = v.theme || 'light', cur = v.cur || 'AED', st = v.state || 'populated';
  const d = J(cur === 'INR' ? 'india-departmental-store' : 'uae-dubai-supermarket'), c = d.currencies[cur];
  const name = lang === 'ar' ? (d.member.names.ar || 'عضو تجريبي') : d.member.names.en;
  const num = n => lang === 'ar' ? digits(n) : String(n);
  const money = a => formatMoney(a, cur, { lang }).replace(/[\d.,]+/g, m => lang === 'ar' ? digits(m) : m);
  const empty = st === 'empty', zero = st === 'zero', cu = st === 'count-up';
  const amt = empty ? '—' : money(zero ? c.zero_bill : c.bill);
  const pts = empty ? '—' : num(zero ? c.zero_points : cu ? d.count_up.frames[2] : c.points);
  const o = { lang, theme, currency: cur, cssBase: '../../tokens/css/' };
  const shell = renderLa('counter-shell', { ...o, state: 'default', set: { title: t.title, userBadge: '', screenTitle: '', billLabel: t.billFor, billFor: name } });
  const dis = empty ? ' data-state="disabled"' : '';
  const body = `<div class="lcp-card" data-ui="la-counter-preview.card"><div class="lcp-lbl" data-ui="la-counter-preview.bill-label">${t.bill}</div><div class="lcp-val" data-ui="la-counter-preview.bill-amount">${amt}</div><div class="lcp-lbl" data-ui="la-counter-preview.points-label">${t.earn}</div><div class="lcp-val is-lg${cu ? ' is-mid' : ''}" data-ui="la-counter-preview.points">${pts}</div></div>
<div class="lcp-stack" data-ui="la-counter-preview.actions"><div class="lc-btn" data-size="lg"${dis} data-ui="la-counter-preview.continue">${t.go}</div><div class="lc-btn" data-size="lg" data-state="secondary" data-ui="la-counter-preview.redeem">${t.redeem}</div><div class="lc-btn" data-size="lg" data-state="secondary" data-ui="la-counter-preview.change">${t.change}</div></div>`;
  let html = shell.replace('<!--la:content-->', body);
  html = html.replace('data-ui="la-counter-shell"', `data-ui="la-counter-preview" data-page="counter-preview" data-variant="${v.key || 'default'}" data-currency="${cur}" data-state="${st}"`)
    .replace(/data-ui="la-counter-shell\.(topbar|title|user-badge|body|bill-for)"/g, (m, p) => `data-ui="la-counter-preview.${p === 'bill-for' ? 'member' : p}"`)
    .replace(/<h1 class="la-cshell-screen"[^>]*>[\s\S]*?<\/h1>/, '').replace(/<span class="la-cshell-badge"[^>]*>[\s\S]*?<\/span>/, '');
  html = html.replace('</style>', '#ui-kit-stage{padding:0!important}.la-cshell-bill{line-height:20px;margin-block-end:15px}</style>').replace(/<title>[^<]*<\/title>/, `<title>Counter preview${slug(v.key)}</title>`)
    .replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-counter.css"><link rel="stylesheet" href="../../tokens/css/la-counter-preview.css"></head>');
  return html;
}
fs.mkdirSync(OUT, { recursive: true });
for (const v of V) fs.writeFileSync(`${OUT}${NAME}${slug(v.key)}.html`, compose(v));
const b = await chromium.launch(); const meta = { id: 'la-counter-preview', title: 'Counter bill earn preview', system: 'loyal-arrow-desk', route: '/counter/preview', reference: 'screenshots/s07c-preview.png', viewport: { w: 390, h: 844 }, countUp: { target: 'la-counter-preview.points', frames: J('uae-dubai-supermarket').count_up.frames }, variants: {} };
for (const v of V) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.goto('file://' + `${OUT}${NAME}${slug(v.key)}.html`); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.key);
  await p.screenshot({ path: `${OUT}${NAME}${slug(v.key)}.png` });
  meta.variants[v.key || 'default'] = { file: `pages/la/${NAME}${slug(v.key)}.html`, screenshot: `pages/la/${NAME}${slug(v.key)}.png`, theme: v.theme || 'light', lang: v.lang || 'en', currency: v.cur || 'AED', state: v.state || 'populated', desc: v.desc, targets: boxes }; await ctx.close();
}
await b.close(); fs.writeFileSync(OUT + NAME + '.page.json', JSON.stringify(meta, null, 1));
const mp = ROOT + 'manifest.json'; const m = JSON.parse(fs.readFileSync(mp)); m.pages = m.pages || {};
m.pages['la-counter-preview'] = { id: 'la-counter-preview', system: 'loyal-arrow-desk', group: 'la', path: `pages/la/${NAME}.page.json`, viewport: meta.viewport, components: ['la-counter-shell'], interactionTargets: { 'la-counter-preview.points': 'count-up: points earned animates 0 to target (frames in page.json countUp)', 'la-counter-preview.continue': 'tap: continue without redeeming', 'la-counter-preview.redeem': 'tap: open redeem', 'la-counter-preview.change': 'tap: change amount', 'la-counter-preview.bill-amount': 'highlight: bill amount' }, variants: Object.fromEntries(Object.entries(meta.variants).map(([k, x]) => [k, { file: x.file, desc: x.desc }])), targets: meta.variants.default.targets.map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) };
fs.writeFileSync(mp, JSON.stringify(m, null, 2)); console.log('counter-preview: ' + V.length + ' variants');
