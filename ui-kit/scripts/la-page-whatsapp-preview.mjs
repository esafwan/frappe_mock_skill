#!/usr/bin/env node
// Composes pages/la/whatsapp-preview[.variant].html (Loyal Arrow WhatsApp message thread, 430x932) from loyal-arrow/copy/whatsapp_templates.json
// and loyal-arrow/data/*/{cfg,members,whatsapp_previews}.json. Deterministic: no clock/random/network.
// Writes pages/la/whatsapp-preview.page.json (pixel boxes per variant) and registers manifest.pages["la-whatsapp-preview"].
//   node scripts/la-page-whatsapp-preview.mjs
import fs from 'fs'; import { chromium } from 'playwright'; import { formatMoney } from '../tools/render.mjs'; import { ROOT } from './lib.mjs';
const OUT = ROOT + 'pages/la/', NAME = 'whatsapp-preview', DATA = ROOT + '../loyal-arrow/data/';
const J = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const TPL = J(ROOT + '../loyal-arrow/copy/whatsapp_templates.json').templates; const tpl = n => TPL.find(t => t.name === n);
const uae = { cfg: J(DATA + 'uae-dubai-supermarket/cfg.json'), mem: J(DATA + 'uae-dubai-supermarket/members.json').find(m => m.names.en === 'Omar Nair') };
const ind = { cfg: J(DATA + 'india-departmental-store/cfg.json'), prev: J(DATA + 'india-departmental-store/whatsapp_previews.json') };
const indEarn = ind.prev.find(p => p.template === 'loyal_arrow_points_earned').text.match(/earned (\d+) points.*?(\d[\d,.]*) bill.*?balance is (\d+)/);
// per-dataset facts. AED-base amounts are scaled for other currencies (AED 170.62 -> KWD 17.062, SAR same 1:1 ratio is not used: only KWD/INR are requested).
const FACT = {
  uae: { biz: uae.cfg.store, bizAr: uae.cfg.store_ar, name: 'Omar', full: uae.mem.names.en, fullAr: uae.mem.names.ar, welcomePts: 0, earned: 162, bill: 170.62, bal: 321, mult: 2, scale: { AED: 1, SAR: 1, QAR: 1, KWD: 0.1 } },
  ind: { biz: ind.cfg.store, bizAr: null, name: 'Anjali', full: 'Anjali Nair', fullAr: null, welcomePts: 0, earned: +indEarn[1], bill: parseFloat(indEarn[2].replace(/,/g, '')), bal: +indEarn[3], mult: 2, scale: { INR: 1 } },
};
const AD = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
const T = {
  en: { c1: '26 Sep', c2: '9 Oct', c3: 'Today', t1: '6:48 pm', t2: '7:05 pm', t3: '10:30 am', date: '15 Dec 2026', msg: 'Message', check: 'Check balance', stop: 'Stop', emptyH: 'No messages yet', emptyB: 'Messages sent to this member will appear here.', pts: n => `${n} points`, status: 'online', tpl: k => k },
  ar: { c1: '٢٦ سبتمبر', c2: '٩ أكتوبر', c3: 'اليوم', t1: '٦:٤٨ م', t2: '٧:٠٥ م', t3: '١٠:٣٠ ص', date: '١٥ ديسمبر ٢٠٢٦', msg: 'رسالة', check: 'التحقق من الرصيد', stop: 'إيقاف', emptyH: 'لا توجد رسائل بعد', emptyB: 'ستظهر هنا الرسائل المرسلة إلى هذا العضو.', pts: n => `${AD(n)} نقطة` },
};
const AR = {
  welcome: (b, n, p) => `مرحبًا بك في ${b}، ${n}. عضويتك فعّالة الآن ورصيدك الأولي ${AD(p)} نقطة. أرسل رسالة أو اضغط أدناه في أي وقت للاطلاع على رصيدك.`,
  earned: (b, n, p, amt, bal) => `مرحبًا ${n}، لقد ربحت ${AD(p)} نقطة من ${b} عن فاتورتك بقيمة ${amt}. رصيدك الجديد ${AD(bal)} نقطة.`,
  winback: (b, n, pts, d, x) => (`مرحبًا ، اشتقنا لك في . لديك @@ بانتظارك. زرنا قبل  واربح x نقاط على مشترياتك القادمة.`).split("@@"),
};
const fillEn = (t, v) => t.body.replace(/\{\{(\d)\}\}/g, (_, i) => v[i]);
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const LIM = 220; const chk = (k, s) => { if (String(s).length > LIM) throw new Error(`${k} exceeds ${LIM}`); return s; };
// key = variant suffix. ds uae|ind; state sent|delivered|read|typing|empty|zero
export const V = [
  { key: '', desc: 'Thread with winback message sent (single grey tick), light, en / AED' },
  { key: 'dark', theme: 'dark', desc: 'Sent, dark (estimated tokens)' },
  { key: 'ar-AED', lang: 'ar', cur: 'AED', desc: 'Sent, RTL Arabic, AED' },
  { key: 'ar-AED.dark', lang: 'ar', cur: 'AED', theme: 'dark', desc: 'Sent, RTL Arabic, dark' },
  { key: 'en-INR', ds: 'ind', cur: 'INR', desc: 'Sent, India dataset, INR' },
  { key: 'kw-KWD', cur: 'KWD', desc: 'Sent, KWD 3-decimal bill amount' },
  { key: 'sent', state: 'sent', desc: 'Winback sent: one grey tick' },
  { key: 'sent.dark', state: 'sent', theme: 'dark', desc: 'Winback sent, dark' },
  { key: 'delivered', state: 'delivered', desc: 'Winback delivered: two grey ticks' },
  { key: 'delivered.dark', state: 'delivered', theme: 'dark', desc: 'Winback delivered, dark' },
  { key: 'read', state: 'read', desc: 'Winback read: two blue ticks' },
  { key: 'read.dark', state: 'read', theme: 'dark', desc: 'Winback read, dark' },
  { key: 'read.ar-AED', state: 'read', lang: 'ar', cur: 'AED', desc: 'Read, RTL Arabic' },
  { key: 'read.en-INR', state: 'read', ds: 'ind', cur: 'INR', desc: 'Read, INR' },
  { key: 'read.kw-KWD', state: 'read', cur: 'KWD', desc: 'Read, KWD' },
  { key: 'typing', state: 'typing', desc: 'Typing indicator, winback about to arrive (bubble hidden in place)' },
  { key: 'typing.dark', state: 'typing', theme: 'dark', desc: 'Typing indicator, dark' },
  { key: 'typing.ar-AED', state: 'typing', lang: 'ar', cur: 'AED', desc: 'Typing indicator, RTL' },
  { key: 'empty', state: 'empty', desc: 'No messages yet' },
  { key: 'empty.dark', state: 'empty', theme: 'dark', desc: 'No messages yet, dark' },
  { key: 'empty.ar-AED', state: 'empty', lang: 'ar', cur: 'AED', desc: 'No messages yet, RTL' },
  { key: 'zero', state: 'zero', desc: 'New member: welcome + winback with 0 points' },
  { key: 'zero.dark', state: 'zero', theme: 'dark', desc: 'Zero balance, dark' },
  { key: 'zero.ar-AED', state: 'zero', lang: 'ar', cur: 'AED', desc: 'Zero balance, RTL' },
];
const slug = k => (k ? '.' + k : '');
const TICK = '<svg class="la-wt-tk" viewBox="0 0 18 11" width="18" height="11"><path class="t1" d="M1 5.8l3.2 3.2L10.5 1.5"/><path class="t2" d="M7.2 8.3l.8.7L14.5 1.5"/></svg>';
const AV = '<svg viewBox="0 0 26 26"><path d="M4 18c6 0 9-4 11-11M15 7l4 .5M15 7l.5 4" fill="none" stroke="#1450C8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function compose(v) {
  const lang = v.lang || 'en', ar = lang === 'ar', theme = v.theme || 'light', cur = v.cur || 'AED', st = v.state || 'sent', F = FACT[v.ds || 'uae'], t = T[lang], base = F.scale[cur] ?? 1;
  const money = n => { const s = formatMoney(n * base, cur, { lang }); return ar ? AD(s) : s; };
  const biz = ar && F.bizAr ? F.bizAr : F.biz, first = ar && F.fullAr ? F.fullAr.split(' ')[0] : F.name, full = ar && F.fullAr ? F.fullAr : F.full;
  const bal = st === 'zero' ? 0 : F.bal, billTxt = money(F.bill), billEn = `${cur} ${(F.bill * base).toFixed(cur === 'KWD' ? 3 : 2)} bill`;
  const welcome = ar ? AR.welcome(biz, first, 0) : fillEn(tpl('loyal_arrow_enrolment_confirmation'), { 1: biz, 2: first, 3: '0' });
  const earned = ar ? AR.earned(biz, first, F.earned, billTxt, F.bal) : fillEn(tpl('loyal_arrow_points_earned'), { 1: biz, 2: first, 3: F.earned, 4: billEn, 5: F.bal });
  const ptsTxt = t.pts(bal);
  let winParts; if (ar) winParts = AR.winback(biz, first, '', t.date, F.mult); else winParts = fillEn(tpl('loyal_arrow_winback'), { 1: biz, 2: first, 3: '@@', 4: t.date, 5: F.mult }).split('@@');
  const winHtml = esc(winParts[0]) + `<span data-ui="la-whatsapp-preview.points-balance" class="la-wt-pts">${esc(ptsTxt)}</span>` + esc(winParts[1].replace(/^ points/, ''));
  for (const [k, s] of Object.entries({ welcome, earned, win: winParts.join(ptsTxt) })) chk(k, s);
  const msg = (id, txt, time, btn, extra = '') => `<div class="la-wt-msg" data-ui="la-whatsapp-preview.bubble-${id}"><div class="la-wt-bub"><div class="la-wt-bz" data-ui="la-whatsapp-preview.sender-${id}">${esc(biz)}</div><div class="la-wt-tx" data-ui="la-whatsapp-preview.text-${id}">${txt}</div><div class="la-wt-meta"><span data-ui="la-whatsapp-preview.time-${id}">${time}</span>${extra}</div></div><button class="la-wt-btn" data-ui="la-whatsapp-preview.btn-${btn[0]}">${esc(btn[1])}</button></div>`;
  const tickState = st === 'delivered' || st === 'read' ? st : 'sent';
  const ticks = `<span class="la-wt-ticks" data-ui="la-whatsapp-preview.ticks-winback" data-state="${tickState}">${TICK}</span>`;
  const slotState = st === 'typing' ? 'pending' : 'arrived';
  let body;
  if (st === 'empty') body = `<div class="la-wt-empty" data-ui="la-whatsapp-preview.empty"><b data-ui="la-whatsapp-preview.empty-title">${t.emptyH}</b><span data-ui="la-whatsapp-preview.empty-body">${t.emptyB}</span></div>`;
  else {
    const winMsg = msg('winback', winHtml, t.t3, ['stop', t.stop], ticks);
    const slot = `<div class="la-wt-slot" data-ui="la-whatsapp-preview.slot-winback" data-state="${slotState}"><div class="la-wt-typing" data-ui="la-whatsapp-preview.typing"><span></span><span></span><span></span></div>${winMsg}</div>`;
    body = `<div class="la-wt-chip" data-ui="la-whatsapp-preview.chip-1">${t.c1}</div>${msg('welcome', esc(welcome), t.t1, ['check-welcome', t.check])}`;
    if (st !== 'zero') body += `<div class="la-wt-chip" data-ui="la-whatsapp-preview.chip-2">${t.c2}</div>${msg('earned', esc(earned), t.t2, ['check-earned', t.check])}`;
    body += `<div class="la-wt-chip" data-ui="la-whatsapp-preview.chip-3">${t.c3}</div>${slot}`;
  }
  const hi = '<svg viewBox="0 0 24 24"><path d="M4 7h11v10H4zM15 11l5-3v8l-5-3"/></svg><svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a1 1 0 01-1 1C10 20 4 14 4 5a1 1 0 011-1z"/></svg>';
  const clock = ar ? AD('9:41') : '9:41';
  return `<!doctype html>
<html lang="${lang}" data-system="la" data-theme="${theme}"${ar ? ' dir="rtl"' : ''}>
<head><meta charset="utf-8"><title>WhatsApp preview${slug(v.key)}</title>
<meta name="viewport" content="width=430,initial-scale=1">
<link rel="stylesheet" href="../../tokens/css/la-desk-wa.css">
<style>html,body{margin:0;background:var(--la-wt-bg-a)}*{animation:none!important;transition:none!important;caret-color:transparent!important}#ui-kit-stage{position:absolute;left:0;top:0;width:430px;height:932px}</style></head>
<body class="la-root"><div id="ui-kit-stage">
<div class="la-wt" data-ui="la-whatsapp-preview" data-page="whatsapp-preview" data-variant="${v.key || 'default'}" data-currency="${cur}" data-state="${st}">
<div class="la-wt-status"><span>${clock}</span><span>5G<i></i></span></div>
<div class="la-wt-hdr" data-ui="la-whatsapp-preview.header"><svg class="la-wt-back" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg><div class="la-wt-av" data-ui="la-whatsapp-preview.avatar">${AV}</div><div class="la-wt-who"><div class="la-wt-nm" data-ui="la-whatsapp-preview.header-name">${esc(full)}</div><div class="la-wt-sub"><b></b>${esc(biz)}</div></div><div class="la-wt-hi">${hi}</div></div>
<div class="la-wt-body" data-ui="la-whatsapp-preview.thread">${body}</div>
<div class="la-wt-inp" data-ui="la-whatsapp-preview.composer"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg><div class="la-wt-f" data-ui="la-whatsapp-preview.input">${t.msg}</div><div class="la-wt-send" data-ui="la-whatsapp-preview.send"><svg viewBox="0 0 24 24"><path d="M3 11l18-8-8 18-2-8z"/></svg></div></div>
<div class="la-wt-home"></div>
</div>
</div></body></html>
`;
}
fs.mkdirSync(OUT, { recursive: true });
for (const v of V) fs.writeFileSync(`${OUT}${NAME}${slug(v.key)}.html`, compose(v));
const b = await chromium.launch();
const meta = { id: 'la-whatsapp-preview', title: 'WhatsApp message thread preview', system: 'loyal-arrow-desk', route: '/whatsapp-preview', reference: 'loyal-arrow/components/wa-thread/preview.html', viewport: { w: 430, h: 932 }, variants: {} };
for (const v of V) {
  const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1 }); const p = await ctx.newPage();
  await p.goto('file://' + `${OUT}${NAME}${slug(v.key)}.html`); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.key);
  await p.screenshot({ path: `${OUT}${NAME}${slug(v.key)}.png` });
  meta.variants[v.key || 'default'] = { file: `pages/la/${NAME}${slug(v.key)}.html`, screenshot: `pages/la/${NAME}${slug(v.key)}.png`, theme: v.theme || 'light', lang: v.lang || 'en', currency: v.cur || 'AED', state: v.state || 'sent', desc: v.desc, targets: boxes }; await ctx.close();
}
await b.close(); fs.writeFileSync(OUT + NAME + '.page.json', JSON.stringify(meta, null, 1));
const mp = ROOT + 'manifest.json'; const m = JSON.parse(fs.readFileSync(mp)); m.pages = m.pages || {};
m.pages['la-whatsapp-preview'] = { id: 'la-whatsapp-preview', system: 'loyal-arrow-desk', group: 'la', path: `pages/la/${NAME}.page.json`, viewport: meta.viewport, components: [], interactionTargets: { 'la-whatsapp-preview.slot-winback': 'event: message arrives (typing indicator, then bubble; compare .typing and .sent variants)', 'la-whatsapp-preview.typing': 'highlight: typing indicator before arrival', 'la-whatsapp-preview.bubble-winback': 'zoom/highlight: winback message', 'la-whatsapp-preview.ticks-winback': 'state change: sent -> delivered -> read (ticks turn blue); compare .sent/.delivered/.read variants', 'la-whatsapp-preview.points-balance': 'highlight: gold underline sweep on points (--sweep 0..100%)', 'la-whatsapp-preview.btn-stop': 'tap: Stop quick reply', 'la-whatsapp-preview.btn-check-welcome': 'tap: Check balance quick reply' }, variants: Object.fromEntries(Object.entries(meta.variants).map(([k, x]) => [k, { file: x.file, desc: x.desc }])), targets: meta.variants.default.targets.map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) };
fs.writeFileSync(mp, JSON.stringify(m, null, 2)); console.log('whatsapp-preview: ' + V.length + ' variants');
