#!/usr/bin/env node
// Composes pages/la/counter-amount[.variant].html (Counter app "Bill amount" step, 390x844) from la/counter-shell + la/counter-field + la/counter-btn.
// Reference: screenshots/s07c-amount.png. Deterministic. Writes pages/la/counter-amount.page.json and registers manifest.pages["la-counter-amount"].
//   node scripts/la-page-counter-amount.mjs
import fs from 'fs'; import { chromium } from 'playwright';
import { renderLa } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const OUT = ROOT + 'pages/la/'; const NAME = 'counter-amount';
const CUR = { AED: 'AED', SAR: 'SAR', QAR: 'QAR', KWD: 'KWD', INR: 'rupees' };
const T = {
  en: { title: 'Counter', badge: 'c@x', billFor: 'Bill for', member: 'Demo Member', label: c => `Bill amount (${CUR[c]})`, ph: 'Enter bill amount', cta: 'Preview points', err: 'Enter an amount greater than zero' },
  ar: { title: 'الكاشير', badge: 'c@x', billFor: 'فاتورة لـ', member: 'عضو تجريبي', label: c => `مبلغ الفاتورة (${c === 'INR' ? 'روبية' : c})`, ph: 'أدخل مبلغ الفاتورة', cta: 'معاينة النقاط', err: 'أدخل مبلغاً أكبر من الصفر' },
};
const AMT = { AED: '250', SAR: '250', QAR: '250', KWD: '25.500', INR: '250' };
// state: populated (typing, focused) | empty | zero | error
export const V = [
  { key: '', desc: 'Populated: amount typed, field focused, light, en / INR reference' , cur: 'INR'},
  { key: 'dark', theme: 'dark', cur: 'INR', desc: 'Populated, dark (estimated tokens)' },
  { key: 'ar-AED', lang: 'ar', cur: 'AED', desc: 'Populated, RTL Arabic, AED' },
  { key: 'ar-AED.dark', lang: 'ar', cur: 'AED', theme: 'dark', desc: 'RTL Arabic dark' },
  { key: 'en-INR', cur: 'INR', desc: 'Populated, INR locale' },
  { key: 'en-AED', cur: 'AED', desc: 'Populated, AED' },
  { key: 'kw-KWD', cur: 'KWD', desc: 'Populated, KWD 3-decimal' },
  { key: 'en-SAR', cur: 'SAR', desc: 'Populated, SAR' },
  { key: 'en-QAR', cur: 'QAR', desc: 'Populated, QAR' },
  { key: 'empty', state: 'empty', cur: 'INR', desc: 'Empty field with placeholder, CTA disabled' },
  { key: 'empty.dark', state: 'empty', theme: 'dark', cur: 'INR', desc: 'Empty, dark' },
  { key: 'empty.ar-AED', state: 'empty', lang: 'ar', cur: 'AED', desc: 'Empty, RTL' },
  { key: 'zero', state: 'zero', cur: 'INR', desc: 'Zero amount entered, CTA disabled' },
  { key: 'zero.dark', state: 'zero', theme: 'dark', cur: 'INR', desc: 'Zero, dark' },
  { key: 'error', state: 'error', cur: 'INR', desc: 'Validation error after Preview with zero' },
  { key: 'error.ar-AED', state: 'error', lang: 'ar', cur: 'AED', desc: 'Validation error, RTL' },
];
const slug = k => (k ? '.' + k : '');
const inner = h => h.match(/<div id="ui-kit-stage">\s*([\s\S]*?)\s*<\/div><\/body>/)[1];
function compose(v) {
  const lang = v.lang || 'en', t = T[lang], theme = v.theme || 'light', cur = v.cur || 'AED', st = v.state || 'populated';
  const o = { lang, theme, currency: cur, cssBase: '../../tokens/css/' };
  const fieldState = { populated: 'typing', empty: 'empty', zero: 'typing', error: 'error' }[st];
  const value = st === 'zero' || st === 'error' ? '0' : AMT[cur];
  const field = inner(renderLa('counter-field', { ...o, state: fieldState, set: { label: t.label(cur), value, placeholder: t.ph, error: t.err } }));
  const btn = inner(renderLa('counter-btn', { ...o, state: st === 'empty' || st === 'zero' ? 'disabled' : 'primary', set: { size: 'lg', label: t.cta } }));
  const rename = (h, from, to) => h.replace(new RegExp(`data-ui="${from}(\\.[a-z-]+)?"`, 'g'), (m, p) => `data-ui="la-counter-amount.${to}${p || ''}"`);
  let content = rename(field, 'la-counter-field', 'amount') + rename(btn, 'la-counter-btn', 'preview');
  content = content.replace('data-ui="la-counter-amount.amount"', 'data-ui="la-counter-amount.amount"').replace('data-ui="la-counter-amount.preview"', 'data-ui="la-counter-amount.preview"');
  content = `<div class="lc-stack lc-amt" data-ui="la-counter-amount.form">${content}</div>`;
  let html = renderLa('counter-shell', { ...o, state: 'default', set: { title: t.title, userBadge: t.badge, screenTitle: t.title, billLabel: t.billFor, billFor: t.member } });
  html = html.replace('<!--la:content-->', content);
  html = html.replace('data-ui="la-counter-shell"', `data-ui="la-counter-amount" data-page="counter-amount" data-variant="${v.key || 'default'}" data-currency="${cur}" data-state="${st}"`)
    .replace(/data-ui="la-counter-shell\.(topbar|title|user-badge|body|bill-for)"/g, (m, p) => `data-ui="la-counter-amount.${p}"`);
  html = html.replace(/<h1 class="la-cshell-screen"[^>]*>[\s\S]*?<\/h1>/, '');
  html = html.replace('</style>', '#ui-kit-stage{padding:0!important}.lc-stack{display:flex;flex-direction:column;gap:12px}.la-cshell-screen{display:block!important}</style>').replace(/<title>[^<]*<\/title>/, `<title>Counter amount${slug(v.key)}</title>`);
  html = html.replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-counter.css"></head>');
  return html;
}
fs.mkdirSync(OUT, { recursive: true });
for (const v of V) fs.writeFileSync(`${OUT}${NAME}${slug(v.key)}.html`, compose(v));
const b = await chromium.launch(); const meta = { id: 'la-counter-amount', title: 'Counter app Bill amount', system: 'loyal-arrow-desk', route: '/counter/bill/amount', reference: 'screenshots/s07c-amount.png', viewport: { w: 390, h: 844 }, variants: {} };
for (const v of V) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.goto('file://' + `${OUT}${NAME}${slug(v.key)}.html`); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.key + ': ' + ids.filter((x, i) => ids.indexOf(x) !== i));
  await p.screenshot({ path: `${OUT}${NAME}${slug(v.key)}.png` });
  meta.variants[v.key || 'default'] = { file: `pages/la/${NAME}${slug(v.key)}.html`, screenshot: `pages/la/${NAME}${slug(v.key)}.png`, theme: v.theme || 'light', lang: v.lang || 'en', currency: v.cur || 'AED', state: v.state || 'populated', desc: v.desc, targets: boxes }; await ctx.close();
}
await b.close(); fs.writeFileSync(OUT + NAME + '.page.json', JSON.stringify(meta, null, 1));
const mp = ROOT + 'manifest.json'; const m = JSON.parse(fs.readFileSync(mp)); m.pages = m.pages || {};
m.pages['la-counter-amount'] = { id: 'la-counter-amount', system: 'loyal-arrow-desk', group: 'la', path: `pages/la/${NAME}.page.json`, viewport: meta.viewport, components: ['la-counter-shell', 'la-counter-field', 'la-counter-btn'], interactionTargets: { 'la-counter-amount.amount.input': 'type: bill amount', 'la-counter-amount.preview': 'tap: Preview points' }, variants: Object.fromEntries(Object.entries(meta.variants).map(([k, x]) => [k, { file: x.file, desc: x.desc }])), targets: meta.variants.default.targets.map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) };
fs.writeFileSync(mp, JSON.stringify(m, null, 2)); console.log('counter-amount: ' + V.length + ' variants');
