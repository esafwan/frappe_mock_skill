#!/usr/bin/env node
// Composes pages/la/counter-enrol[.variant].html (Loyal Arrow Counter "Enrol member", 1706x897, ref dumps/screenshots/s07b-enrol-dev.png).
// Deterministic; synthetic data from loyal-arrow/data/<dataset>/{cfg,members}.json. Measures every data-ui box -> pages/la/counter-enrol.page.json; registers manifest.pages["la-counter-enrol"].
//   node scripts/la-page-counter-enrol.mjs
import fs from 'fs'; import { chromium } from 'playwright'; import { ROOT } from './lib.mjs';
const OUT = ROOT + 'pages/la/', NAME = 'counter-enrol', DATA = ROOT + '../loyal-arrow/data/';
const J = p => JSON.parse(fs.readFileSync(p, 'utf8'));
const ds = { AED: 'uae-dubai-supermarket', INR: 'india-departmental-store' };
const tx = {
  en: { title: 'Counter', heading: 'Enrol member', program: 'Program', name: 'Name', mobile: 'Mobile', birthday: 'Birthday (optional)', birthPh: 'dd/mm/yyyy', consent: 'Consent', loading: 'Loading notice...',
    cService: 'Allow service messages (receipts and balance updates)', cMarketing: 'Allow marketing offers on WhatsApp and SMS', enrol: 'Enrol', enrolling: 'Enrolling...', progPh: 'Select program', noProg: 'No programs available',
    errServer: 'Unexpected server response. Please retry.', errDup: 'This mobile is already enrolled. Open the member from Find.', errReq: 'Name and mobile are required.', okMsg: 'Member enrolled. Welcome card ready.', hint: 'Synthetic demo data', prog: s => s + ' Rewards' },
  ar: { title: 'الكاشير', heading: 'تسجيل عضو', program: 'البرنامج', name: 'الاسم', mobile: 'الجوال', birthday: 'تاريخ الميلاد (اختياري)', birthPh: 'يوم/شهر/سنة', consent: 'الموافقة', loading: 'جارٍ تحميل الإشعار...',
    cService: 'السماح برسائل الخدمة (الإيصالات وتحديثات الرصيد)', cMarketing: 'السماح بالعروض عبر واتساب والرسائل', enrol: 'تسجيل', enrolling: 'جارٍ التسجيل...', progPh: 'اختر البرنامج', noProg: 'لا توجد برامج متاحة',
    errServer: 'استجابة غير متوقعة من الخادم. حاول مرة أخرى.', errDup: 'هذا الجوال مسجل بالفعل. افتح العضو من البحث.', errReq: 'الاسم والجوال مطلوبان.', okMsg: 'تم تسجيل العضو. بطاقة الترحيب جاهزة.', hint: 'بيانات تجريبية', prog: s => 'مكافآت ' + s },
};
const ML = { title: 20, heading: 28, program: 24, name: 24, mobile: 24, birthday: 32, birthPh: 12, consent: 20, loading: 32, cService: 64, cMarketing: 64, enrol: 24, enrolling: 24, progPh: 32, noProg: 40, errServer: 64, errDup: 72, errReq: 48, okMsg: 48, progName: 48, nameVal: 40, mobileVal: 20, birthVal: 12 };
// state: populated | empty | error | zero | focus-name | consent-ticked | busy | success
export const V = [
  { key: '', desc: 'Populated: program, name, mobile filled, both notices loaded and ticked, Enrol enabled' },
  { key: 'dark', theme: 'dark', desc: 'Populated, dark (estimated tokens; live app is light only)' },
  { key: 'ar-AED', lang: 'ar', cur: 'AED', desc: 'Populated, RTL Arabic, AED dataset' },
  { key: 'ar-AED.dark', lang: 'ar', cur: 'AED', theme: 'dark', desc: 'RTL Arabic dark' },
  { key: 'en-INR', cur: 'INR', desc: 'Populated, INR dataset (India store)' },
  { key: 'empty', state: 'empty', desc: 'Blank form, notices loaded, Enrol disabled' },
  { key: 'empty.dark', state: 'empty', theme: 'dark', desc: 'Blank form, dark' },
  { key: 'empty.ar-AED', state: 'empty', lang: 'ar', cur: 'AED', desc: 'Blank form, RTL' },
  { key: 'error', state: 'error', desc: 'Exact reference s07b: blank form, notices still loading, server error banner, Enrol disabled' },
  { key: 'error.dark', state: 'error', theme: 'dark', desc: 'Reference state, dark' },
  { key: 'error.ar-AED', state: 'error', lang: 'ar', cur: 'AED', desc: 'Reference state, RTL' },
  { key: 'duplicate', state: 'duplicate', desc: 'Filled form, duplicate-mobile error, Enrol disabled' },
  { key: 'zero', state: 'zero', desc: 'No programs configured: Program shows empty list, Enrol disabled' },
  { key: 'focus-name', state: 'focus-name', desc: 'Program chosen, Name focused and empty (cursor target for typing)' },
  { key: 'consent-ticked', state: 'consent-ticked', desc: 'Filled form, consents unticked then service ticked (tick target)' },
  { key: 'busy', state: 'busy', desc: 'Submitting: Enrol shows Enrolling..., fields locked' },
  { key: 'success', state: 'success', desc: 'Enrolled: success banner above Enrol' },
];
const slug = k => (k ? '.' + k : '');
const chk = (k, v) => { if (v.length > ML[k]) throw new Error(`slot ${k} "${v}" exceeds ${ML[k]}`); return v; };
const CAL = '<svg class="lce-cal" viewBox="0 0 16 16"><rect x="2" y="3" width="12" height="11" rx="1"/><path d="M2 6.5h12M5 1.5v3M11 1.5v3"/></svg>';
const CHEV = '<svg class="lce-chev" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4"/></svg>';
function compose(v) {
  const lang = v.lang || 'en', t = tx[lang], theme = v.theme || 'light', cur = v.cur || 'AED', st = v.state || 'populated', rtl = lang === 'ar';
  const d = ds[cur] || ds.AED, cfg = J(DATA + d + '/cfg.json'), m = J(DATA + d + '/members.json')[2], store = lang === 'ar' && cfg.store_ar ? cfg.store_ar : cfg.store;
  const name = chk('nameVal', m.names[lang] || m.names.en), mobile = chk('mobileVal', m.mobile), prog = chk('progName', t.prog(store));
  const filled = ['populated', 'duplicate', 'consent-ticked', 'busy', 'success'].includes(st), progSel = filled || st === 'focus-name';
  const loaded = st !== 'error'; const dis = !(st === 'populated' || st === 'consent-ticked') ;
  const tick1 = st === 'populated' || st === 'busy' || st === 'success' || st === 'duplicate' || st === 'consent-ticked'; const tick2 = st === 'populated' || st === 'busy' || st === 'success' || st === 'duplicate';
  const banner = st === 'error' ? t.errServer : st === 'duplicate' ? t.errDup : '';
  const inp = (id, label, val, extra = '', ph = '') => `<div class="lce-field" data-ui="la-counter-enrol.${id}"><label class="lce-label" data-ui="la-counter-enrol.${id}-label">${chk(id, label)}</label><div class="lce-input${extra}" data-ui="la-counter-enrol.${id}-input">${val ? `<span data-ui="la-counter-enrol.${id}-value">${val}</span>` : `<span class="lce-ph" data-ui="la-counter-enrol.${id}-placeholder">${ph}</span>`}</div></div>`;
  const row = (id, on, txt) => `<div class="lce-row" data-ui="la-counter-enrol.consent-${id}"><span class="lce-box${on ? ' is-on' : ''}" data-ui="la-counter-enrol.consent-${id}-box"></span><span data-ui="la-counter-enrol.consent-${id}-text">${txt}</span></div>`;
  const progBox = `<div class="lce-field" data-ui="la-counter-enrol.program"><label class="lce-label" data-ui="la-counter-enrol.program-label">${t.program}</label><div class="lce-input is-select" data-ui="la-counter-enrol.program-input">${progSel ? `<span data-ui="la-counter-enrol.program-value">${prog}</span>` : st === 'zero' ? `<span class="lce-ph" data-ui="la-counter-enrol.program-placeholder">${chk('noProg', t.noProg)}</span>` : `<span class="lce-ph" data-ui="la-counter-enrol.program-placeholder"></span>`}${progSel || st === 'zero' ? CHEV : ''}</div></div>`;
  const btnLabel = st === 'busy' ? chk('enrolling', t.enrolling) : chk('enrol', t.enrol);
  const html = `<!doctype html>
<html lang="${lang}" data-system="la" data-theme="${theme}"${rtl ? ' dir="rtl"' : ''}>
<head><meta charset="utf-8"><title>Counter enrol member${slug(v.key)}</title>
<link rel="stylesheet" href="../../tokens/css/fonts.css">
<link rel="stylesheet" href="../../tokens/css/frappe-desk.css">
<link rel="stylesheet" href="../../tokens/css/la-desk-vars.css">
<link rel="stylesheet" href="../../tokens/css/la-desk-base.css">
<link rel="stylesheet" href="../../tokens/css/la-counter.css">
<link rel="stylesheet" href="../../tokens/css/la-counter-enrol.css">
<style>html,body{margin:0}*{animation:none!important;transition:none!important;caret-color:transparent!important}#ui-kit-stage{position:absolute;left:0;top:0;padding:0}</style></head>
<body class="la-root"><div id="ui-kit-stage" class="lce-stage" data-ui="la-counter-enrol" data-page="counter-enrol" data-variant="${v.key || 'default'}" data-currency="${cur}" data-state="${st}">
<header class="lce-bar" data-ui="la-counter-enrol.topbar"><span data-ui="la-counter-enrol.title">${chk('title', t.title)}</span></header>
<form class="lce-form" data-ui="la-counter-enrol.form">
<h1 class="lce-h" data-ui="la-counter-enrol.heading">${chk('heading', t.heading)}</h1>
${progBox}
${inp('name', t.name, filled ? name : '', st === 'focus-name' ? ' is-focus' : '')}
${inp('mobile', t.mobile, filled ? mobile : '')}
<div class="lce-field" data-ui="la-counter-enrol.birthday"><label class="lce-label" data-ui="la-counter-enrol.birthday-label">${chk('birthday', t.birthday)}</label><div class="lce-input" data-ui="la-counter-enrol.birthday-input"><span class="lce-ph" data-ui="la-counter-enrol.birthday-placeholder">${chk('birthPh', t.birthPh)}</span>${CAL}</div></div>
<fieldset class="lce-consent" data-ui="la-counter-enrol.consent" style="border:0;margin-inline:0"><legend class="lce-legend" data-ui="la-counter-enrol.consent-legend" style="all:unset"></legend><span class="lce-legend" data-ui="la-counter-enrol.consent-title">${chk('consent', t.consent)}</span>
${row('service', tick1, loaded ? chk('cService', t.cService) : chk('loading', t.loading))}
${row('marketing', tick2, loaded ? chk('cMarketing', t.cMarketing) : chk('loading', t.loading))}
</fieldset>
${banner ? `<div class="lce-err" data-ui="la-counter-enrol.error">${banner}</div>` : ''}${st === 'success' ? `<div class="lce-ok" data-ui="la-counter-enrol.success">${chk('okMsg', t.okMsg)}</div>` : ''}
<div class="lce-submit${st === 'busy' ? ' is-busy' : dis && st !== 'success' ? ' is-disabled' : ''}" data-ui="la-counter-enrol.submit" data-enabled="${!dis ? 'true' : 'false'}">${btnLabel}</div>
</form></div></body></html>
`.replace(/<legend[^>]*><\/legend>/, '').replace(/ style="border:0;margin-inline:0"/, '');
  return html;
}
fs.mkdirSync(OUT, { recursive: true });
for (const v of V) fs.writeFileSync(`${OUT}${NAME}${slug(v.key)}.html`, compose(v));
const b = await chromium.launch(); const meta = { id: 'la-counter-enrol', title: 'Counter app Enrol member', system: 'loyal-arrow-desk', route: '/counter/enrol', reference: 'dumps/screenshots/s07b-enrol-dev.png', viewport: { w: 1706, h: 897 }, variants: {} };
for (const v of V) {
  const ctx = await b.newContext({ viewport: { width: 1706, height: 897 }, deviceScaleFactor: 1 }); const p = await ctx.newPage(); await p.goto('file://' + `${OUT}${NAME}${slug(v.key)}.html`); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: +r.x.toFixed(1), y: +r.y.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }; }));
  const ids = boxes.map(x => x.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + v.key);
  await p.screenshot({ path: `${OUT}${NAME}${slug(v.key)}.png` });
  meta.variants[v.key || 'default'] = { file: `pages/la/${NAME}${slug(v.key)}.html`, screenshot: `pages/la/${NAME}${slug(v.key)}.png`, theme: v.theme || 'light', lang: v.lang || 'en', currency: v.cur || 'AED', state: v.state || 'populated', desc: v.desc, targets: boxes }; await ctx.close();
}
await b.close(); fs.writeFileSync(OUT + NAME + '.page.json', JSON.stringify(meta, null, 1));
const mp = ROOT + 'manifest.json'; const mf = JSON.parse(fs.readFileSync(mp)); mf.pages = mf.pages || {};
mf.pages['la-counter-enrol'] = { id: 'la-counter-enrol', system: 'loyal-arrow-desk', group: 'la', path: `pages/la/${NAME}.page.json`, viewport: meta.viewport, components: ['la-counter-shell', 'la-counter-field', 'la-counter-btn'], interactionTargets: { 'la-counter-enrol.program-input': 'select: choose program', 'la-counter-enrol.name-input': 'fill: member name', 'la-counter-enrol.mobile-input': 'fill: mobile', 'la-counter-enrol.birthday-input': 'fill: optional birthday', 'la-counter-enrol.consent-service-box': 'tick: service consent', 'la-counter-enrol.consent-marketing-box': 'tick: marketing consent', 'la-counter-enrol.submit': 'tap: Enrol (disabled until required fields and consents)' }, variants: Object.fromEntries(Object.entries(meta.variants).map(([k, x]) => [k, { file: x.file, desc: x.desc, state: x.state }])), targets: meta.variants.default.targets.map(x => ({ id: x.id, box: { x: x.x, y: x.y, w: x.w, h: x.h } })) };
fs.writeFileSync(mp, JSON.stringify(mf, null, 2)); console.log('counter-enrol: ' + V.length + ' variants');
