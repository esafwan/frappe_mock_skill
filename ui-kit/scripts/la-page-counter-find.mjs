#!/usr/bin/env node
// Composes pages/la/counter-find[.variant].html (Loyal Arrow Counter app "Find member", 390x844; reference dumps/screenshots/s07-int-find.png)
// from la/counter-shell + la/counter-field + la/counter-btn + la/member-result. Deterministic: no clock/random/network.
// Data: loyal-arrow/data/<dataset>/counter_find.json (loyal-arrow/data/gen_counter_find.py, synthetic). Boxes -> pages/la/counter-find.page.json (manifest.json is NOT touched).
//   node scripts/la-page-counter-find.mjs
import fs from 'fs'; import { chromium } from 'playwright';
import { renderLa } from '../tools/render-la.mjs'; import { ROOT } from './lib.mjs';
const OUT = ROOT + 'pages/la/'; const NAME = 'counter-find'; const DATA = ROOT + '../loyal-arrow/data/';
const AD = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const T = {   // [text, maxLength] pairs are enforced below
  en: { title: 'Counter', badge: 'c@x', h1: 'Find member', lookup: 'Look up by', auto: 'Auto', label: 'Mobile, card code, name or ID', ph: 'Enter mobile or card code', err: 'Enter a mobile, card code, name or ID', find: 'Find', cont: 'Continue to bill', bal: 'Balance', none: 'No member found', pending: n => `${n} pending`, expiring: n => `${n} expiring` },
  ar: { title: 'الكاشير', badge: 'c@x', h1: 'البحث عن عضو', lookup: 'البحث بواسطة', auto: 'تلقائي', label: 'الجوال أو رمز البطاقة أو الاسم أو الرقم', ph: 'أدخل الجوال أو رمز البطاقة', err: 'أدخل الجوال أو رمز البطاقة أو الاسم أو الرقم', find: 'بحث', cont: 'متابعة إلى الفاتورة', bal: 'الرصيد', none: 'لم يتم العثور على عضو', pending: n => `${n} معلّقة`, expiring: n => `${n} تنتهي` },
};
const TIER_AR = { Bronze: 'برونزي', Silver: 'فضي', Gold: 'ذهبي', Platinum: 'بلاتيني' };
const MAX = { title: 20, badge: 10, h1: 28, lookup: 24, auto: 12, label: 48, ph: 32, err: 48, find: 32, cont: 24, bal: 16, none: 32 };
// field: empty|focus|filled|error ; result: none|found|zero|not-found|loading|sliding ; btn: primary|busy ; q: query source
export const V = [
  { key: '', field: 'filled', result: 'found', desc: 'Found: query typed, Find pressed, member card shown (the s07-int-find reference state)' },
  { key: 'dark', theme: 'dark', field: 'filled', result: 'found', desc: 'Found, dark (estimated tokens)' },
  { key: 'ar-AED', lang: 'ar', field: 'filled', result: 'found', desc: 'Found, Arabic RTL' },
  { key: 'ar-AED.dark', lang: 'ar', theme: 'dark', field: 'filled', result: 'found', desc: 'Found, Arabic RTL, dark' },
  { key: 'en-INR', ds: 'india-departmental-store', field: 'filled', result: 'found', desc: 'Found, India dataset (no money on this screen; points only)' },
  { key: 'empty', field: 'empty', result: 'none', desc: 'Empty: nothing typed, placeholder shown, no result (start of the video)' },
  { key: 'empty.dark', theme: 'dark', field: 'empty', result: 'none', desc: 'Empty, dark' },
  { key: 'empty.ar-AED', lang: 'ar', field: 'empty', result: 'none', desc: 'Empty, Arabic RTL' },
  { key: 'focus', field: 'focus', result: 'none', desc: 'Query field focused with caret (cursor click on the input)' },
  { key: 'typing', field: 'filled', result: 'none', desc: 'Query typed, Find not pressed yet (cursor target: Find)' },
  { key: 'loading', field: 'filled', result: 'loading', btn: 'busy', desc: 'Find pressed: button busy, result skeleton' },
  { key: 'sliding', field: 'filled', result: 'found', progress: 0.5, desc: 'Result card mid slide-in (--la-progress 0.5 on find.result-slot; 0..1 driver)' },
  { key: 'zero', field: 'filled', result: 'zero', desc: 'Found member with 0 points balance (fresh programme)' },
  { key: 'not-found', field: 'filled', q: 'miss', result: 'not-found', desc: 'Error: query matches no member' },
  { key: 'not-found.ar-AED', lang: 'ar', field: 'filled', q: 'miss', result: 'not-found', desc: 'Error: no member, Arabic RTL' },
  { key: 'error', field: 'error', result: 'none', desc: 'Error: Find pressed with an empty query (field validation message)' },
  { key: 'error.dark', theme: 'dark', field: 'error', result: 'none', desc: 'Empty-query error, dark' },
];
const slug = k => (k ? '.' + k : '');
const inner = h => h.match(/<div id="ui-kit-stage">\s*([\s\S]*?)\s*<\/div><\/body>/)[1];
const rename = (h, from, to) => h.replace(new RegExp(`data-ui="${from}(\\.[a-z-]+)?"`, 'g'), (m, p) => `data-ui="la-counter-find.${to}${p ? p.replace('.', '-') : ''}"`);
function compose(v) {
  const lang = v.lang || 'en', t = T[lang], theme = v.theme || 'light'; const o = { lang, theme, cssBase: '../../tokens/css/' };
  for (const [k, m] of Object.entries(MAX)) { if (t[k].length > m) throw new Error(`${k} exceeds ${m}`); }
  const d = JSON.parse(fs.readFileSync(DATA + (v.ds || 'uae-dubai-supermarket') + '/counter_find.json', 'utf8')); const mem = v.result === 'zero' ? d.zero : d.found;
  const nm = n => (lang === 'ar' ? AD(new Intl.NumberFormat('en-US').format(n)) : new Intl.NumberFormat(v.ds ? 'en-IN' : 'en-US').format(n));
  const name = mem.names[lang] || mem.names.en; const query = v.q === 'miss' ? d.not_found_query : name; if (name.length > 28) throw new Error('name too long');
  const shell = renderLa('counter-shell', { ...o, state: 'dark-topbar', set: { title: t.title, userBadge: t.badge, screenTitle: t.h1 } });
  const field = rename(inner(renderLa('counter-field', { ...o, state: v.field, set: { label: t.label, value: query, placeholder: t.ph, error: t.err } })), 'la-counter-field', 'query');
  const btn = rename(inner(renderLa('counter-btn', { ...o, state: v.btn || 'primary', set: { size: 'md', label: t.find } })), 'la-counter-btn', 'find-btn');
  let result = '';
  if (v.result !== 'none') {
    const rs = v.result === 'not-found' ? 'not-found' : v.result === 'loading' ? 'loading' : 'found';
    result = inner(renderLa('member-result', { ...o, state: rs, set: { name, maskedMobile: mem.mobile_masked, balanceLabel: t.bal, balance: nm(mem.balance_pts), tierChip: lang === 'ar' ? TIER_AR[mem.tier] : mem.tier, pendingChip: t.pending(nm(mem.pending_pts)), expiringChip: t.expiring(nm(mem.expiring_pts)), continueButton: t.cont, notFoundText: t.none } }));
    result = rename(result, 'la-member-result', 'result');
    result = `<div class="lc-slide" data-ui="la-counter-find.result-slot"${v.progress != null ? ` style="--la-progress:${v.progress}"` : ''}>${result}</div>`;
  }
  const lookup = `<div class="lc-label" data-ui="la-counter-find.lookup-label">${t.lookup}</div><div class="lc-sel" data-ui="la-counter-find.lookup"><span data-ui="la-counter-find.lookup-value">${t.auto}</span></div>`;
  const body = `<div class="lc-page-stack" data-ui="la-counter-find.form">${lookup}${field}${btn}${result}</div>`;
  let html = shell.replace(/<div class="la-cshell-bill"[^>]*>[\s\S]*?<\/div>/, '').replace('<!--la:content-->', body);
  html = html.replace('data-ui="la-counter-shell"', `data-ui="la-counter-find" data-page="counter-find" data-variant="${v.key || 'default'}" data-state="${v.result === 'none' ? v.field : v.result}"`)
    .replace(/data-ui="la-counter-shell\.(topbar|title|user-badge|body|screen-title)"/g, (m, p) => `data-ui="la-counter-find.${p}"`);
  html = html.replace('</style>', '#ui-kit-stage{padding:0!important}.la-cshell-screen{display:block!important}</style>').replace(/<title>[^<]*<\/title>/, `<title>Counter find member${slug(v.key)}</title>`);
  return html.replace('</head>', '<link rel="stylesheet" href="../../tokens/css/la-counter.css"><link rel="stylesheet" href="../../tokens/css/la-counter-pages.css"></head>');
}
if (process.argv[1]?.endsWith('la-page-counter-find.mjs')) {
  fs.mkdirSync(OUT, { recursive: true });
  for (const v of V) fs.writeFileSync(`${OUT}${NAME}${slug(v.key)}.html`, compose(v));
  const b = await chromium.launch(); const meta = { id: 'la-counter-find', title: 'Counter app Find member', system: 'loyal-arrow-desk', route: '/counter/find', reference: 'screenshots/s07-int-find.png', viewport: { w: 390, h: 844 }, components: ['la-counter-shell', 'la-counter-field', 'la-counter-btn', 'la-member-result'],
    interactionTargets: { 'la-counter-find.lookup': 'tap: lookup-by select', 'la-counter-find.query-input': 'click + type the query', 'la-counter-find.find-btn': 'tap: Find', 'la-counter-find.result-slot': 'result slides in (--la-progress 0..1)', 'la-counter-find.result': 'result card', 'la-counter-find.result-continue': 'tap: Continue to bill' }, variants: {} };
  for (const v of V) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.goto('file://' + `${OUT}${NAME}${slug(v.key)}.html`); await p.evaluate(() => document.fonts.ready);
    const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
    const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.key + ': ' + ids.filter((x, i) => ids.indexOf(x) !== i));
    await p.screenshot({ path: `${OUT}${NAME}${slug(v.key)}.png` });
    meta.variants[v.key || 'default'] = { file: `pages/la/${NAME}${slug(v.key)}.html`, screenshot: `pages/la/${NAME}${slug(v.key)}.png`, theme: v.theme || 'light', lang: v.lang || 'en', state: v.result === 'none' ? v.field : v.result, desc: v.desc, targets: boxes }; await ctx.close();
  }
  await b.close(); fs.writeFileSync(OUT + NAME + '.page.json', JSON.stringify(meta, null, 1)); console.log('counter-find: ' + V.length + ' variants');
}
