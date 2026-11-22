#!/usr/bin/env node
// Composes pages/la/counter-redeem[.variant].html (Counter app "Points to redeem", 390x844) from the la-ct (counter) primitives, mirroring components/la/approval-seg.
// Reference: dumps/screenshots/s07c-redeem.png. Deterministic: no clock/random/network, synthetic data only ("Demo Member").
//   node scripts/la-page-counter-redeem.mjs
import fs from 'fs'; import { chromium } from 'playwright';
import { formatMoney } from '../tools/render.mjs'; import { ROOT } from './lib.mjs';
const OUT = ROOT + 'pages/la/', NAME = 'counter-redeem', P = 'la-counter-redeem';
const T = {
  en: { app: 'Counter', billFor: 'Bill for', member: 'Demo Member', heading: 'Points to redeem', approved: 'Approved by', o1: 'Scan QR card', o2: 'Member OTP', o3: 'Manager PIN', qrPh: 'Card scan', otpPh: 'Member code', pinPh: 'Manager PIN', send: 'Send code', review: 'Review', skip: 'Skip redeeming', limit: n => `Up to ${n} points`, worth: (n, m) => `Up to ${n} points, worth ${m}`, zeroHint: 'No points available to redeem', over: n => `Maximum ${n} points per bill`, otpSent: 'Code sent to the member' },
  ar: { app: 'الكاونتر', billFor: 'فاتورة', member: 'عضو تجريبي', heading: 'النقاط المراد استبدالها', approved: 'تمت الموافقة بواسطة', o1: 'مسح بطاقة QR', o2: 'رمز العضو', o3: 'رمز المدير', qrPh: 'مسح البطاقة', otpPh: 'رمز العضو', pinPh: 'رمز المدير', send: 'إرسال الرمز', review: 'مراجعة', skip: 'تخطي الاستبدال', limit: n => `حتى ${n} نقطة`, worth: (n, m) => `حتى ${n} نقطة، بقيمة ${m}`, zeroHint: 'لا توجد نقاط متاحة للاستبدال', over: n => `الحد الأقصى ${n} نقطة لكل فاتورة`, otpSent: 'تم إرسال الرمز إلى العضو' },
};
const RATE = { AED: 0.1, SAR: 0.1, QAR: 0.1, KWD: 0.01, INR: 2 };   // value of 1 point (synthetic): 100 pts = AED 10.00 / KWD 1.000 / INR 200.00
const digits = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
// state: default (reference: empty points, QR) | filled | otp | pin | zero (no balance) | over (limit error)
const S = {
  default: { desc: 'Reference state: nothing typed, Scan QR card selected', method: 'qr' },
  filled: { desc: 'Points typed (50) with currency value hint', method: 'qr', pts: 50 },
  otp: { desc: 'Member OTP selected, code sent', method: 'otp', pts: 50 },
  pin: { desc: 'Manager PIN selected', method: 'pin', pts: 50 },
  zero: { desc: 'Member has no redeemable points; Review disabled', method: 'qr', pts: 0, zero: true },
  over: { desc: 'Typed amount over the 100 point limit; error + Review disabled', method: 'qr', pts: 250, over: true },
};
export const V = [];
for (const st of Object.keys(S)) {
  const sk = st === 'default' ? '' : st;
  V.push({ st, key: [sk, ''].filter(Boolean).join('') });
  V.push({ st, key: [sk, 'dark'].filter(Boolean).join('.'), theme: 'dark' });
  V.push({ st, key: [sk, 'ar-AED'].filter(Boolean).join('.'), lang: 'ar', cur: 'AED' });
  V.push({ st, key: [sk, 'en-INR'].filter(Boolean).join('.'), cur: 'INR' });
  if (st === 'filled') { V.push({ st, key: 'filled.kw-KWD', lang: 'ar', cur: 'KWD' }); V.push({ st, key: 'filled.en-KWD', cur: 'KWD' }); }
}
V.find(v => v.key === 'ar-AED').desc = 'RTL Arabic, AED';
const slug = k => (k ? '.' + k : '');
function compose(v) {
  const lang = v.lang || 'en', t = T[lang], cur = v.cur || 'AED', s = S[v.st], num = x => lang === 'ar' ? digits(x) : String(x);
  const money = formatMoney(100 * RATE[cur], cur, { lang }); const m = s.method;
  const pts = s.pts == null ? `<span class="la-ct-ph" data-ui="${P}.points-placeholder">0</span>` : `<span data-ui="${P}.points-value">${num(s.pts)}</span>`;
  const hint = s.zero ? t.zeroHint : s.over ? t.over(num(100)) : s.pts == null ? '' : t.worth(num(100), lang === 'ar' ? digits(money) : money);
  const hintCls = s.over ? ' is-err' : '';
  const dis = s.zero || s.over ? ' is-disabled' : '';
  const opt = (k, id, txt) => `<div class="la-ct-seg-opt${m === k ? ' is-on' : ''}" data-ui="${P}.approver-${id}" role="button">${txt}</div>`;
  const extra = m === 'qr' ? `<div class="la-ct-field is-ph is-mt8" data-ui="${P}.card-scan">${t.qrPh}</div>`
    : m === 'otp' ? `<div class="la-ct-btn is-strong is-mt8" data-ui="${P}.send-code">${t.send}</div><div class="la-ct-field is-ph is-mt8" data-ui="${P}.otp-input">${t.otpPh}</div>`
    : `<div class="la-ct-field is-ph is-mt8" data-ui="${P}.pin-input">${t.pinPh}</div>`;
  const html = `<div class="la-ct" data-ui="${P}" data-page="${NAME}" data-variant="${v.key || 'default'}" data-currency="${cur}" data-state="${v.st === 'default' ? 'populated' : v.st}" data-method="${m}">
<div class="la-ct-bar" data-ui="${P}.bar"><span data-ui="${P}.title">${t.app}</span></div>
<div class="la-ct-main" data-ui="${P}.main">
<div class="la-ct-sub" data-ui="${P}.member">${t.billFor} <b>${t.member}</b></div>
<div class="la-ct-label" data-ui="${P}.heading">${t.heading}</div>
<div class="la-ct-field la-num${s.over ? ' is-error' : ''}" data-ui="${P}.points">${pts}</div>
${hint ? `<div class="la-ct-hint${hintCls}" data-ui="${P}.hint">${hint}</div>` : ''}
<div class="la-ct-spacer is-sp14"></div>
<div class="la-ct-label is-sm" data-ui="${P}.approved-by">${t.approved}</div>
<div class="la-ct-seg" data-ui="${P}.approver">${opt('qr', 'qr', t.o1)}${opt('otp', 'otp', t.o2)}${opt('pin', 'pin', t.o3)}</div>
${extra}
<div class="la-ct-spacer"></div>
<div class="la-ct-stack"><div class="la-ct-btn is-primary${dis}" data-ui="${P}.review">${t.review}</div><div class="la-ct-btn is-strong" data-ui="${P}.skip">${t.skip}</div></div>
</div>
</div>`;
  const css = ['fonts', 'frappe-desk', 'la-desk-vars', 'la-desk-base', 'la-desk-components', 'la-desk-data', 'la-counter-base'].map(f => `<link rel="stylesheet" href="../../tokens/css/${f}.css">`).join('\n');
  return `<!doctype html>\n<html lang="${lang}" data-system="la" data-theme="${v.theme || 'light'}"${lang === 'ar' ? ' dir="rtl"' : ''}>\n<head><meta charset="utf-8"><title>Counter redeem${slug(v.key)}</title>\n${css}\n<style>html,body{margin:0}*{animation:none!important;transition:none!important;caret-color:transparent!important}#ui-kit-stage{position:absolute;left:0;top:0;width:390px;min-height:844px}.la-ct-ph{color:var(--la-ct-ph)}.la-ct-hint.is-err{color:var(--la-ct-danger)}.la-ct-field.is-error{border-color:var(--la-ct-danger);box-shadow:0 0 0 1px var(--la-ct-danger)}.la-ct-btn.is-disabled{opacity:.5}.la-ct-seg-opt{padding:6px 4px;min-height:58px}#ui-kit-stage .la-ct-field{height:56px}.la-ct-spacer.is-sp14{height:13px}#ui-kit-stage .la-ct-spacer:not(.is-sp14){height:46px}</style></head>\n<body class="la-root"><div id="ui-kit-stage">\n${html}\n</div></body></html>\n`;
}
fs.mkdirSync(OUT, { recursive: true });
for (const v of V) fs.writeFileSync(`${OUT}${NAME}${slug(v.key)}.html`, compose(v));
const b = await chromium.launch(); const meta = { id: P, title: 'Counter app: Points to redeem', system: 'loyal-arrow-desk', route: '/counter/redeem', reference: 'screenshots/s07c-redeem.png', viewport: { w: 390, h: 844 }, variants: {} };
for (const v of V) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.goto('file://' + `${OUT}${NAME}${slug(v.key)}.html`); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.key);
  await p.screenshot({ path: `${OUT}${NAME}${slug(v.key)}.png` });
  meta.variants[v.key || 'default'] = { file: `pages/la/${NAME}${slug(v.key)}.html`, screenshot: `pages/la/${NAME}${slug(v.key)}.png`, theme: v.theme || 'light', lang: v.lang || 'en', currency: v.cur || 'AED', state: v.st === 'default' ? 'populated' : v.st, desc: v.desc || S[v.st].desc, targets: boxes }; await ctx.close();
}
await b.close(); fs.writeFileSync(OUT + NAME + '.page.json', JSON.stringify(meta, null, 1));
const mp = ROOT + 'manifest.json'; const m = JSON.parse(fs.readFileSync(mp)); m.pages = m.pages || {};
m.pages[P] = { id: P, system: 'loyal-arrow-desk', group: 'la', path: `pages/la/${NAME}.page.json`, viewport: meta.viewport, components: ['la-approval-seg'], interactionTargets: { [P + '.approver']: 'tap: choose approver (segmented control)', [P + '.approver-qr']: 'tap: Scan QR card', [P + '.approver-otp']: 'tap: Member OTP', [P + '.approver-pin']: 'tap: Manager PIN', [P + '.points']: 'type: points to redeem', [P + '.review']: 'tap: redeem at counter (Review)', [P + '.skip']: 'tap: skip redeeming' }, variants: Object.fromEntries(Object.entries(meta.variants).map(([k, x]) => [k, { file: x.file, desc: x.desc }])), targets: meta.variants.default.targets.map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) };
fs.writeFileSync(mp, JSON.stringify(m, null, 2)); console.log(NAME + ': ' + V.length + ' variants');
