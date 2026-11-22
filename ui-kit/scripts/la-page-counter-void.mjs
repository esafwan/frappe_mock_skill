#!/usr/bin/env node
// Composes pages/la/counter-void[.variant].html (Counter app "Undo bill": form / done / expired, 390x844) from la/void-form states.
// Reference: screenshots/s07d-void-form.png, s07d-void-done.png, s07d-void-expired.png. Deterministic; amounts/points from loyal-arrow/data bills.json.
//   node scripts/la-page-counter-void.mjs
import fs from 'fs'; import { chromium } from 'playwright';
import { renderLa } from '../tools/render-la.mjs'; import { formatMoney } from '../tools/render.mjs'; import { ROOT } from './lib.mjs';
const OUT = ROOT + 'pages/la/'; const NAME = 'counter-void';
const DATA = { AED: 'uae-dubai-supermarket', INR: 'india-departmental-store' };
const bill = (cur) => { const d = JSON.parse(fs.readFileSync(`${ROOT}../loyal-arrow/data/${DATA[cur] || DATA.AED}/bills.json`, 'utf8')); return d[0]; };
const AD = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const T = {
  en: { app: 'Counter', user: 'c@x', title: 'Undo bill', bill: 'Bill', policy: 'You can undo your own bill within 10 min. After that a manager must approve.', rl: 'Reason (required)', ph: 'Choose a reason', r: 'Wrong amount', btn: 'Undo bill',
    dTitle: 'Bill undone', dReason: 'Reason: Wrong amount', back: 'Back to counter', eTitle: 'Undo window has passed', eBody: 'Only a manager can approve this now. You can send a request with the same reason.', req: 'Request manager approval',
    taken: n => `Points taken back: ${n}`, ret: n => `Points redeemed on this bill were returned: ${n}`, short: n => `${n} points could not be taken back because the member already spent them. A manager has been notified.`, bal: n => `Balance now ${n} points` },
  ar: { app: 'الكاشير', user: 'c@x', title: 'إلغاء الفاتورة', bill: 'فاتورة', policy: 'يمكنك إلغاء فاتورتك خلال ١٠ دقائق. بعد ذلك يلزم موافقة المدير.', rl: 'السبب (مطلوب)', ph: 'اختر سببا', r: 'مبلغ خاطئ', btn: 'إلغاء الفاتورة',
    dTitle: 'تم إلغاء الفاتورة', dReason: 'السبب: مبلغ خاطئ', back: 'العودة إلى الكاشير', eTitle: 'انتهت مهلة الإلغاء', eBody: 'يمكن للمدير فقط الموافقة الآن. يمكنك إرسال طلب بنفس السبب.', req: 'طلب موافقة المدير',
    taken: n => `النقاط المسترجعة: ${AD(n)}`, ret: n => `النقاط المستبدلة على هذه الفاتورة أعيدت: ${AD(n)}`, short: n => `تعذر استرجاع ${AD(n)} نقطة لأن العضو أنفقها. تم إبلاغ المدير.`, bal: n => `الرصيد الآن ${AD(n)} نقطة` },
};
// state: form (reason chosen) | empty (no reason yet, CTA disabled look) | done (shortfall note) | zero (done, nothing short, nothing returned) | expired
const S = ['', 'empty', 'done', 'zero', 'expired'];
export const V = [];
const base = [['', {}, 'light, en, reference values'], ['dark', { theme: 'dark' }, 'dark (estimated tokens)'], ['ar-AED', { lang: 'ar', cur: 'AED' }, 'RTL Arabic, AED'], ['ar-AED.dark', { lang: 'ar', cur: 'AED', theme: 'dark' }, 'RTL Arabic dark'], ['en-INR', { cur: 'INR', money: 1 }, 'INR (shows bill amount)'], ['kw-KWD', { cur: 'KWD', money: 1 }, 'KWD 3-decimal (shows bill amount)']];
const stateDesc = { '': 'Form: reason chosen, Undo bill ready', empty: 'Form: reason not chosen yet', done: 'Done: bill undone with shortfall note', zero: 'Done: nothing to take back (zero points)', expired: 'Expired: undo window passed, request manager approval' };
for (const st of S) for (const [k, o, d] of base) { if (st === 'empty' || st === 'zero') { if (!['', 'dark', 'ar-AED'].includes(k)) continue; } V.push({ key: [st, k].filter(Boolean).join('.'), state: st || 'form', desc: `${stateDesc[st]}; ${d}`, ...o }); }
const slug = k => (k ? '.' + k : '');
const inner = h => h.match(/<div id="ui-kit-stage">\s*([\s\S]*?)\s*<\/div><\/body>/)[1];
function compose(v) {
  const lang = v.lang || 'en', t = T[lang], theme = v.theme || 'light', cur = v.cur || 'AED', st = v.state;
  const b = bill(cur === 'INR' ? 'INR' : 'AED'); const pts = st === 'zero' ? 0 : Math.round(b.points_earned / 4); const ret = st === 'zero' ? 0 : 20; const short = st === 'zero' ? 0 : 40;
  const amt = cur === 'KWD' ? +(b.total / 12).toFixed(3) : b.total; const money = v.money ? ` · ${formatMoney(amt, cur, { lang })}` : '';
  const stateName = st === 'done' || st === 'zero' ? 'done' : st === 'expired' ? 'expired' : 'default';
  const set = { appName: t.app, cashier: t.user, title: t.title, billId: `${t.bill} ⁦EVT-0042⁩${money}`, policyText: t.policy, reasonLabel: t.rl, reason: st === 'empty' ? t.ph : t.r, reasonChosen: t.r, button: t.btn, doneTitle: t.dTitle, doneReason: t.dReason, takenBack: t.taken(pts), returned: t.ret(ret), shortfall: t.short(short), balanceNow: t.bal(0), backBtn: t.back, expiredTitle: t.eTitle, expiredBody: t.eBody, requestBtn: t.req };
  let h = inner(renderLa('void-form', { lang, theme, currency: cur, state: stateName, cssBase: '../../tokens/css/', set }));
  if (stateName === 'default') h = h.replace(/<div class="la-ct-card" data-ui="la-void-form\.details">.*?<\/div><\/div>\n/s, '');
  if (stateName === 'expired') { h = h.replace(/<div class="la-ct-card" data-ui="la-void-form\.details">.*?<\/div><\/div>\n/s, '').replace('<div class="la-ct-gap"></div>', `<div class="la-ct-hint" data-ui="la-void-form.policy">${t.policy}</div><div class="la-ct-gap"></div>`); }
  if (st === 'zero') h = h.replace(/<div class="la-ct-note" data-ui="la-void-form.shortfall">.*?<\/div>/s, '').replace(/<div class="la-ct-line" data-ui="la-void-form.returned">.*?<\/div>/s, '');
  if (st === 'empty') h = h.replace('la-ct-field is-select is-sm', 'la-ct-field is-select is-sm is-ph').replace('la-ct-btn is-lg is-danger', 'la-ct-btn is-lg is-danger is-dim');
  h = h.replace(/data-ui="la-void-form(\.[a-z-]+)?"/g, (m, p) => `data-ui="la-counter-void${p || ''}"`).replace('data-ui="la-counter-void"', `data-ui="la-counter-void" data-page="counter-void" data-variant="${v.key || 'default'}" data-currency="${cur}" data-state="${st}"`);
  let html = `<!doctype html>\n<html lang="${lang}" data-system="la" data-theme="${theme}"${lang === 'ar' ? ' dir="rtl"' : ''}>\n<head><meta charset="utf-8"><title>Counter void${slug(v.key)}</title>\n` + ['fonts', 'frappe-desk', 'la-desk-vars', 'la-desk-base', 'la-counter-base', 'la-counter-void'].map(f => `<link rel="stylesheet" href="../../tokens/css/${f}.css">`).join('\n') + `\n<style>html,body{margin:0}*{animation:none!important;transition:none!important;caret-color:transparent!important}#ui-kit-stage{position:absolute;left:0;top:0;width:390px;min-height:844px}</style></head>\n<body class="la-root"><div id="ui-kit-stage">\n${h}\n</div></body></html>\n`;
  return html;
}
fs.mkdirSync(OUT, { recursive: true });
for (const v of V) fs.writeFileSync(`${OUT}${NAME}${slug(v.key)}.html`, compose(v));
const b = await chromium.launch(); const meta = { id: 'la-counter-void', title: 'Counter app Undo bill', system: 'loyal-arrow-desk', route: '/counter/bill/void', reference: 'screenshots/s07d-void-form.png (form), s07d-void-done.png, s07d-void-expired.png', viewport: { w: 390, h: 844 }, variants: {} };
for (const v of V) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.goto('file://' + `${OUT}${NAME}${slug(v.key)}.html`); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.key);
  await p.screenshot({ path: `${OUT}${NAME}${slug(v.key)}.png` });
  meta.variants[v.key || 'default'] = { file: `pages/la/${NAME}${slug(v.key)}.html`, screenshot: `pages/la/${NAME}${slug(v.key)}.png`, theme: v.theme || 'light', lang: v.lang || 'en', currency: v.cur || 'AED', state: v.state, desc: v.desc, targets: boxes }; await ctx.close();
}
await b.close(); fs.writeFileSync(OUT + NAME + '.page.json', JSON.stringify(meta, null, 1));
const mp = ROOT + 'manifest.json'; const m = JSON.parse(fs.readFileSync(mp)); m.pages = m.pages || {};
m.pages['la-counter-void'] = { id: 'la-counter-void', system: 'loyal-arrow-desk', group: 'la', path: `pages/la/${NAME}.page.json`, viewport: meta.viewport, components: ['la-void-form'], interactionTargets: { 'la-counter-void.reason': 'tap: choose reason', 'la-counter-void.submit': 'tap: Undo bill', 'la-counter-void.request': 'tap: Request manager approval (expired)', 'la-counter-void.back': 'tap: Back to counter (done)' }, variants: Object.fromEntries(Object.entries(meta.variants).map(([k, x]) => [k, { file: x.file, desc: x.desc }])), targets: meta.variants.default.targets.map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) };
fs.writeFileSync(mp, JSON.stringify(m, null, 2)); console.log('counter-void: ' + V.length + ' variants');
