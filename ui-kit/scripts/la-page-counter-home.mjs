#!/usr/bin/env node
// Composes pages/la/counter-home[.variant].html (Loyal Arrow Counter app Home, 390x844) from la/counter-shell + la/counter-card.
// Deterministic: no clock/random/network. Measures every data-ui box per variant into pages/la/counter-home.page.json and registers manifest.pages["la-counter-home"].
//   node scripts/la-page-counter-home.mjs
import fs from 'fs'; import { chromium } from 'playwright';
import { renderLa } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const OUT = ROOT + 'pages/la/'; const NAME = 'counter-home';
const T = {
  en: { cards: [['find', 'Find / enrol member', 'Mobile, card code, name or ID'], ['scan', 'Scan card', 'Read the member QR'], ['bill', 'New bill', 'Pick the member, then Continue to bill']], title: 'Counter', badge: 'c@x', emptyTitle: 'No counter actions', emptyBody: 'Your role has no counter permissions. Ask an admin to grant access.' },
  ar: { cards: [['find', 'بحث / تسجيل عضو', 'الجوال أو رمز البطاقة أو الاسم أو الرقم'], ['scan', 'مسح البطاقة', 'اقرأ رمز QR الخاص بالعضو'], ['bill', 'فاتورة جديدة', 'اختر العضو ثم تابع إلى الفاتورة']], title: 'الكاشير', badge: 'c@x', emptyTitle: 'لا توجد إجراءات للكاشير', emptyBody: 'دورك لا يملك صلاحيات الكاشير. اطلب من المسؤول منح الوصول.' },
};
// key = variant suffix; state = populated | pressed | empty
export const V = [
  { key: '', desc: 'Populated, light, en / AED' },
  { key: 'dark', theme: 'dark', desc: 'Populated, dark (estimated tokens)' },
  { key: 'ar-AED', lang: 'ar', cur: 'AED', desc: 'Populated, RTL Arabic, AED' },
  { key: 'ar-AED.dark', lang: 'ar', cur: 'AED', theme: 'dark', desc: 'RTL Arabic dark' },
  { key: 'en-INR', cur: 'INR', desc: 'Populated, INR locale' },
  { key: 'pressed', state: 'pressed', desc: 'Find card pressed (tap feedback)' },
  { key: 'pressed.dark', state: 'pressed', theme: 'dark', desc: 'Find card pressed, dark' },
  { key: 'pressed.ar-AED', state: 'pressed', lang: 'ar', cur: 'AED', desc: 'Find card pressed, RTL' },
  { key: 'empty', state: 'empty', desc: 'No counter permissions' },
  { key: 'empty.dark', state: 'empty', theme: 'dark', desc: 'No counter permissions, dark' },
  { key: 'empty.ar-AED', state: 'empty', lang: 'ar', cur: 'AED', desc: 'No counter permissions, RTL' },
];
const slug = k => (k ? '.' + k : '');
function compose(v) {
  const lang = v.lang || 'en', t = T[lang], theme = v.theme || 'light', cur = v.cur || 'AED';
  const o = { lang, theme, currency: cur, cssBase: '../../tokens/css/' };
  const shell = renderLa('counter-shell', { ...o, state: 'dark-topbar', set: { title: t.title, userBadge: t.badge, screenTitle: t.title } });
  const card = (id, i, ti, su) => renderLa('counter-card', { ...o, state: v.state === 'pressed' && id === 'find' ? 'pressed' : 'default', set: { title: ti, subtitle: su } })
    .match(/<div id="ui-kit-stage">\s*([\s\S]*?)\s*<\/div><\/body>/)[1]
    .replace('data-ui="la-counter-card"', `data-ui="la-counter-home.card-${id}"`).replace('data-ui="la-counter-card.title"', `data-ui="la-counter-home.card-${id}-title"`).replace('data-ui="la-counter-card.subtitle"', `data-ui="la-counter-home.card-${id}-subtitle"`);
  const empty = `<div class="lc-card lc-empty" data-ui="la-counter-home.empty"><div class="lc-card-title" data-ui="la-counter-home.empty-title">${t.emptyTitle}</div><div class="lc-card-sub" data-ui="la-counter-home.empty-body">${t.emptyBody}</div></div>`;
  const list = `<div class="lc-stack" data-ui="la-counter-home.list">${v.state === 'empty' ? empty : t.cards.map(([id, ti, su], i) => card(id, i, ti, su)).join('\n')}</div>`;
  let html = shell.replace(/<div class="la-cshell-bill"[^>]*>[\s\S]*?<\/div>/, '').replace('<!--la:content-->', list);
  html = html.replace('data-ui="la-counter-shell"', `data-ui="la-counter-home" data-page="counter-home" data-variant="${v.key || 'default'}" data-currency="${cur}" data-state="${v.state || 'populated'}"`)
    .replace(/data-ui="la-counter-shell\.(topbar|title|user-badge|body|screen-title)"/g, (m, p) => `data-ui="la-counter-home.${p}"`);
  html = html.replace('</style>', '#ui-kit-stage{padding:0!important}.lc-stack{display:flex;flex-direction:column;gap:12px}.lc-empty{background:var(--lc-surface)}.la-cshell-screen{display:block!important}</style>').replace(/<title>[^<]*<\/title>/, `<title>Counter home${slug(v.key)}</title>`);
  html = html.replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-counter.css"></head>') ;
  return html;
}
fs.mkdirSync(OUT, { recursive: true });
for (const v of V) fs.writeFileSync(`${OUT}${NAME}${slug(v.key)}.html`, compose(v));
const b = await chromium.launch(); const meta = { id: 'la-counter-home', title: 'Counter app Home', system: 'loyal-arrow-desk', route: '/counter', reference: 'screenshots/s07-int-home.png', viewport: { w: 390, h: 844 }, variants: {} };
for (const v of V) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.goto('file://' + `${OUT}${NAME}${slug(v.key)}.html`); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.key);
  await p.screenshot({ path: `${OUT}${NAME}${slug(v.key)}.png` });
  meta.variants[v.key || 'default'] = { file: `pages/la/${NAME}${slug(v.key)}.html`, screenshot: `pages/la/${NAME}${slug(v.key)}.png`, theme: v.theme || 'light', lang: v.lang || 'en', currency: v.cur || 'AED', state: v.state || 'populated', desc: v.desc, targets: boxes }; await ctx.close();
}
await b.close(); fs.writeFileSync(OUT + NAME + '.page.json', JSON.stringify(meta, null, 1));
const mp = ROOT + 'manifest.json'; const m = JSON.parse(fs.readFileSync(mp)); m.pages = m.pages || {};
m.pages['la-counter-home'] = { id: 'la-counter-home', system: 'loyal-arrow-desk', group: 'la', path: `pages/la/${NAME}.page.json`, viewport: meta.viewport, components: ['la-counter-shell', 'la-counter-card'], interactionTargets: { 'la-counter-home.card-find': 'tap: opens Find / enrol member', 'la-counter-home.card-scan': 'tap: opens Scan card', 'la-counter-home.card-bill': 'tap: opens New bill' }, variants: Object.fromEntries(Object.entries(meta.variants).map(([k, x]) => [k, { file: x.file, desc: x.desc }])), targets: meta.variants.default.targets.map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) };
fs.writeFileSync(mp, JSON.stringify(m, null, 2)); console.log('counter-home: ' + V.length + ' variants');
