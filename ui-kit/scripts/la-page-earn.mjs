#!/usr/bin/env node
// Composes pages/la/scheme-form-earn-preview[.variant].html (Loyalty Scheme > Earning tab with the earn-preview trace) from la/shell + synthetic datasets in loyal-arrow/data.
// Deterministic: no clock/random/network. Then measures every data-ui box per variant into pages/la/scheme-form-earn-preview.page.json (page-level targets live in the .page.json; manifest.json is not touched).
//   node scripts/la-page-earn.mjs [--shots]
import fs from 'fs'; import path from 'path';
import { chromium } from 'playwright';
import { fill } from './engine.mjs'; import { renderLa } from '../tools/render-la.mjs'; import { formatMoney, universals } from '../tools/render.mjs'; import { ROOT } from './lib.mjs';
const OUT = ROOT + 'pages/la/'; const NAME = 'scheme-form-earn-preview';
const DATA = ROOT + '../loyal-arrow/data/';
const cfgOf = d => JSON.parse(fs.readFileSync(DATA + d + '/cfg.json', 'utf8'));
// per-currency scenario: spend needed for 1 point, sample bill, tier-bonus multiplier (Milk bonus 300%); worth/pt from cfg.redeem_value_per_pt where a dataset exists
const uae = cfgOf('uae-dubai-supermarket'), ind = cfgOf('india-departmental-store');
const SCN = {
  INR: { spend: 10, bill: 1000, worth: 0.5, ds: 'india-departmental-store' },
  AED: { spend: 1, bill: 100, worth: uae.redeem_value_per_pt, ds: 'uae-dubai-supermarket' },
  SAR: { spend: 1, bill: 100, worth: 0.1, ds: 'uae-dubai-supermarket (SAR-scaled)' },
  QAR: { spend: 1, bill: 100, worth: 0.1, ds: 'uae-dubai-supermarket (QAR-scaled)' },
  KWD: { spend: 0.1, bill: 25, worth: 0.01, ds: 'uae-dubai-supermarket (KWD-scaled, 3 dp)' },
};
const T = { // en / ar strings; money and counts are interpolated
  en: { crumb: 'Loyalty Scheme', name: 'Program RSUI', status: 'Active', pause: 'Pause', save: 'Save',
    tabs: ['Overview', 'Earning', 'Spending and expiry', 'Members and messages', 'Where it applies', 'Advanced'],
    bill: 'Sample bill amount', item: 'Sample item code (optional)', hint: 'Updating the preview...', phItem: 'Optional', phBill: 'Enter an amount',
    earns: n => `This bill earns ${n} points`, worth: m => `Worth ${m} when spent`, l3: 'Usable straight away', l4: 'Matched at the category level: Milk bonus.', l5: 'Outranked by the more specific match: Dairy double.', l6: 'Earns 300% of the standard rate.', zero: 'No points on this bill', zero2: 'Nothing to spend yet',
    sec: 'Earn rate', sub: 'How much a member earns per bill.', cur: 'Currency', curHelp: 'Bills and point values use this currency.', basis: 'Points are earned on', basisV: 'Amount before tax', basisHelp: 'Sales lines are recorded before tax; this sets the basis the programme reports against.', spend: 'Spend needed for 1 point', spendHelp: m => `Members earn 1 point for every ${m} spent. Pause the programme to change this.`, counted: 'Points counted on', countedV: 'Bill total after discounts', countedHelp: 'Count points on the bill total after discounts, or before them.',
    assign: 'Assign', attach: 'Attachments', tags: 'Tags', share: 'Share', edited: 'Last Edited By Administrator', created: 'Created By Administrator', ago: '1 minute ago', code: 'RSUI' },
  ar: { crumb: 'نظام الولاء', name: 'برنامج RSUI', status: 'نشط', pause: 'إيقاف مؤقت', save: 'حفظ',
    tabs: ['نظرة عامة', 'الكسب', 'الإنفاق والانتهاء', 'الأعضاء والرسائل', 'أين ينطبق', 'متقدم'],
    bill: 'مبلغ الفاتورة التجريبي', item: 'رمز الصنف التجريبي (اختياري)', hint: 'جارٍ تحديث المعاينة...', phItem: 'اختياري', phBill: 'أدخل مبلغاً',
    earns: n => `تكسب هذه الفاتورة ${n} نقطة`, worth: m => `بقيمة ${m} عند الإنفاق`, l3: 'قابلة للاستخدام فوراً', l4: 'مطابقة على مستوى الفئة: مكافأة الحليب.', l5: 'تفوقت عليها مطابقة أدق: ضعف الألبان.', l6: 'تكسب 300% من المعدل القياسي.', zero: 'لا نقاط على هذه الفاتورة', zero2: 'لا شيء للإنفاق بعد',
    sec: 'معدل الكسب', sub: 'كم يكسب العضو عن كل فاتورة.', cur: 'العملة', curHelp: 'تستخدم الفواتير وقيم النقاط هذه العملة.', basis: 'تُكسب النقاط على', basisV: 'المبلغ قبل الضريبة', basisHelp: 'تُسجَّل بنود المبيعات قبل الضريبة؛ وهذا يحدد الأساس الذي يُقاس عليه البرنامج.', spend: 'الإنفاق المطلوب لنقطة واحدة', spendHelp: m => `يكسب الأعضاء نقطة واحدة عن كل ${m} ينفقونها. أوقف البرنامج مؤقتاً لتغيير هذا.`, counted: 'تُحتسب النقاط على', countedV: 'إجمالي الفاتورة بعد الخصومات', countedHelp: 'احتسب النقاط على إجمالي الفاتورة بعد الخصومات أو قبلها.',
    assign: 'تعيين', attach: 'المرفقات', tags: 'الوسوم', share: 'مشاركة', edited: 'آخر تعديل بواسطة المسؤول', created: 'أنشئ بواسطة المسؤول', ago: 'قبل دقيقة', code: 'RSUI' },
};
const AD = d => d.replace(/\d/g, x => '٠١٢٣٤٥٦٧٨٩'[x]);
const ICO = { chev: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 9l4-4 4 4M8 15l4 4 4-4"/></svg>', plus: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  l: '<svg class="la-ico la-flip" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>', r: '<svg class="la-ico la-flip" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  edit: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16zM13 7l4 4"/></svg>', print: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/></svg>', heart: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/></svg>',
  dots: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
  user: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/></svg>', clip: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11l-8 8a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"/></svg>', tag: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1"/></svg>', share: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 11l7.6-4M8.2 13l7.6 4"/></svg>' };
export function pageHtml({ lang = 'en', cur = 'INR', theme = 'light', state = 'populated' }) {
  const t = T[lang], sc = SCN[cur], dp = cur === 'KWD' ? 3 : 2, ar = lang === 'ar';
  const fm = n => { const s = ar ? formatMoney(n, cur, { lang }) : cur + ' ' + n.toFixed(dp); return ar ? AD(s) : s; }, num = n => ar ? AD(String(n)) : String(n);
  const amt = n => n.toFixed(dp);
  const bill = state === 'zero' ? 0 : sc.bill, pts = Math.floor(bill / sc.spend + 1e-9) * 3, worth = pts * sc.worth;
  const billTxt = state === 'empty' ? t.phBill : ar ? AD(amt(bill)) : amt(bill), itemTxt = state === 'empty' ? t.phItem : 'MILK1';
  const reveal = state === 'typing' ? 0 : 6;
  const lines = state === 'zero' ? [t.earns(0), t.zero2, '', '', '', ''] : [t.earns(num(pts)), t.worth(fm(worth)), t.l3, t.l4, t.l5, t.l6];
  const shell = renderLa('shell', { state: 'section-expanded', lang, theme, set: { ...(ar ? { sectionLeaf1: 'ملخص الإعداد', sectionLeaf2: 'برامج الولاء', sectionLeaf3: 'المستويات', sectionLeaf4: 'قواعد الكسب والاستبدال', sectionLeaf5: 'الشرائح', sectionLeaf6: 'الإعدادات', sectionLeaf7: 'المواقع', sectionLeaf8: 'الموظفون', sectionLeaf9: 'فئات الخدمة', sectionLeaf10: 'الخطة والاستخدام' } : {}), avatarInitial: ar ? 'ل' : 'L', pageTitle: '', activeLeaf: ar ? 'التجزئة' : 'Retail' }, cssBase: '../../tokens/css/' });
  const body = (state === 'empty' ? '' : '') + `
<div class="la-sform" data-ui="la-scheme-earn.page">
 <div class="la-sform-main" data-ui="la-scheme-earn.main">
  <div class="la-sform-tabs" data-ui="la-scheme-earn.tabs" role="tablist">${t.tabs.map((x, i) => `<a class="la-tab${i === 1 ? ' is-active' : ''}" role="tab" data-ui="la-scheme-earn.tab-${['overview', 'earning', 'spending', 'members', 'applies', 'advanced'][i]}">${x}</a>`).join('')}</div>
  <div class="la-sform-cards">
   <div class="la-earn" data-ui="la-scheme-earn.preview" data-state="${state}">
    <div class="la-earn-in is-wide${state === 'typing' || state === 'empty' ? ' is-focus' : ''}" data-ui="la-scheme-earn.bill"><span class="la-fx-label">${t.bill}</span><span class="la-fx-input${state === 'empty' ? ' is-ph' : ''}" data-ui="la-scheme-earn.bill-input"><span class="la-fx-val la-num" data-ui="la-scheme-earn.bill-value">${billTxt}</span></span></div>
    <div class="la-earn-in is-narrow" data-ui="la-scheme-earn.item"><span class="la-fx-label">${t.item}</span><span class="la-fx-input${state === 'empty' ? ' is-ph' : ''}" data-ui="la-scheme-earn.item-input"><span class="la-fx-val" data-ui="la-scheme-earn.item-value">${itemTxt}</span></span></div>
    <div class="la-earn-hint" data-ui="la-scheme-earn.hint">${t.hint}</div>
    <div class="la-earn-out" data-ui="la-scheme-earn.result" data-reveal="${reveal}">${lines.map((l, i) => l ? `<span data-n="${i + 1}" data-ui="la-scheme-earn.line-${i + 1}">${l}</span>` : '').join('')}</div>
   </div>
   <section class="la-sec" data-ui="la-scheme-earn.earn-rate">
    <div class="la-sec-title" data-ui="la-scheme-earn.rate-title">${t.sec}</div><div class="la-sec-sub">${t.sub}</div>
    <div class="la-sec-col">
     <div class="la-sec-field"><span class="la-fx-label">${t.cur}<span class="la-sec-req">*</span></span><span class="la-sec-input is-bold" data-ui="la-scheme-earn.currency">${cur}</span><span class="la-fx-help">${t.curHelp}</span></div>
     <div class="la-sec-field"><span class="la-fx-label">${t.basis}</span><span class="la-sec-input" data-ui="la-scheme-earn.basis"><span>${t.basisV}</span>${ICO.chev}</span><span class="la-fx-help">${t.basisHelp}</span></div>
     <div class="la-sec-field"><span class="la-fx-label">${t.spend}<span class="la-sec-req">*</span></span><div class="la-sec-prefix"><span>${cur}</span><span class="la-sec-input is-num la-num" data-ui="la-scheme-earn.spend">${ar ? AD(amt(sc.spend)) : amt(sc.spend)}</span></div><span class="la-fx-help">${t.spendHelp(fm(sc.spend))}</span></div>
     <div class="la-sec-field"><span class="la-fx-label">${t.counted}</span><span class="la-sec-input" data-ui="la-scheme-earn.counted"><span>${t.countedV}</span>${ICO.chev}</span><span class="la-fx-help">${t.countedHelp}</span></div>
    </div>
   </section>
  </div>
 </div>
 <aside class="la-rail" data-ui="la-scheme-earn.rail">
  <div class="la-rail-head"><div class="la-rail-title"><span>${t.name}</span><span style="display:flex;gap:6px"><span class="la-iconbtn">${ICO.edit}</span><span class="la-iconbtn">${ICO.print}</span><span class="la-iconbtn">${ICO.heart}</span></span></div><div class="la-rail-code">${t.code}</div></div>
  <div class="la-rail-list">${[['user', t.assign], ['clip', t.attach], ['tag', t.tags], ['share', t.share]].map(([i, x]) => `<div class="la-rail-row">${ICO[i]}<span>${x}</span>${ICO.plus}</div>`).join('')}</div>
  <div class="la-rail-meta"><div><b>${t.edited}</b><span class="t">${t.ago}</span></div><div><b>${t.created}</b><span class="t">${t.ago}</span></div></div>
 </aside>
</div>`;
  const header = `<header class="la-header" data-ui="la-scheme-earn.header"><div class="la-hd-crumb" data-ui="la-scheme-earn.crumb"><span class="la-hd-parent">${t.crumb}</span><span class="la-hd-sep">/</span><span class="la-hd-cur">${t.name}</span><span class="la-pill is-green" data-ui="la-scheme-earn.status">${t.status}</span></div><div class="la-header-actions"><span class="la-btn la-btn-subtle" data-ui="la-scheme-earn.pause" style="gap:0">${t.pause}</span><span class="la-iconbtn is-bordered">${ICO.l}</span><span class="la-iconbtn is-bordered">${ICO.r}</span><span class="la-iconbtn">${ICO.dots}</span><span class="la-btn is-dark" data-ui="la-scheme-earn.save">${t.save}</span></div></header>`;
  let h = shell.replace(/<header class="la-header"[\s\S]*?<\/header>/, header).replace('<!--la:content-->', body);
  h = h.replace('data-ui="la-shell.leaf-active"', 'data-ui="la-shell.leaf-active"').replace(/class="la-sidebar-leaf is-active"( data-ui="la-shell.leaf-active")/, 'class="la-sidebar-leaf"$1').replace(/class="la-sidebar-leaf"( data-ui="la-shell.leaf-2")/, 'class="la-sidebar-leaf is-active"$1');
  h = h.replace(/(<aside class="la-sidebar"[\s\S]*?<\/aside>)/, m => m.replace('<div class="la-sidebar-leaves" data-ui="la-shell.leaves">', '<div class="la-sidebar-leaves" data-ui="la-shell.leaves">'));
  h = h.replace('<main class="la-main" data-ui="la-shell.main">', '<main class="la-main" data-ui="la-shell.main" style="min-height:0">').replace('<div class="la-body" data-ui="la-shell.body">', '<div class="la-body" data-ui="la-shell.body" style="padding:0;display:flex">');
  h = h.replace('<link rel="stylesheet" href="../../tokens/css/la-desk-data.css">', '<link rel="stylesheet" href="../../tokens/css/la-desk-data.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-feedform.css">\n<link rel="stylesheet" href="../../tokens/css/la-desk-schemeform.css">');
  return h.replace(/<title>[^<]*<\/title>/, `<title>Loyalty Scheme earning (${cur}, ${lang}${theme === 'dark' ? ', dark' : ''}${state !== 'populated' ? ', ' + state : ''})</title>`).replace('<html ', `<html data-page="${NAME}" `);
}
const VARIANTS = [ // [suffix, opts]
  ['', {}], ['.dark', { theme: 'dark' }], ['.en-INR', {}], ['.ar-AED', { lang: 'ar', cur: 'AED' }], ['.en-AED', { cur: 'AED' }], ['.kw-KWD', { lang: 'ar', cur: 'KWD' }], ['.en-KWD', { cur: 'KWD' }], ['.ar-SAR', { lang: 'ar', cur: 'SAR' }], ['.en-QAR', { cur: 'QAR' }],
  ['.empty', { state: 'empty' }], ['.zero', { state: 'zero' }], ['.typing', { state: 'typing' }], ['.dark.empty', { theme: 'dark', state: 'empty' }], ['.dark.zero', { theme: 'dark', state: 'zero' }], ['.dark.typing', { theme: 'dark', state: 'typing' }], ['.ar-AED.empty', { lang: 'ar', cur: 'AED', state: 'empty' }], ['.ar-AED.zero', { lang: 'ar', cur: 'AED', state: 'zero' }], ['.ar-AED.typing', { lang: 'ar', cur: 'AED', state: 'typing' }]];
const B = await chromium.launch(); const page = {}; const shots = process.argv.includes('--shots');
fs.mkdirSync(OUT + 'shots', { recursive: true });
for (const [sfx, o] of VARIANTS) {
  const f = `${NAME}${sfx}.html`; fs.writeFileSync(OUT + f, pageHtml(o));
  const p = await B.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }); await p.goto('file://' + OUT + f); await p.evaluate(() => document.fonts.ready);
  const boxes = await p.evaluate(() => [...document.querySelectorAll('[data-ui]')].map(e => { const r = e.getBoundingClientRect(); return { id: e.getAttribute('data-ui'), x: Math.round(r.x * 10) / 10, y: Math.round(r.y * 10) / 10, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 }; }));
  const ids = boxes.map(b => b.id); if (new Set(ids).size !== ids.length) throw new Error('duplicate data-ui in ' + f);
  page[f] = { theme: o.theme || 'light', lang: o.lang || 'en', currency: o.cur || 'INR', state: o.state || 'populated', screenshot: `pages/la/shots/${NAME}${sfx}.png`, targets: boxes };
  await p.screenshot({ path: OUT + `shots/${NAME}${sfx}.png` }); await p.close();
}
await B.close();
const interactions = [
  { id: 'type-sample-amount', target: 'la-scheme-earn.bill-input', value: 'la-scheme-earn.bill-value', action: 'click, then type the sample bill amount (use .empty -> .typing -> populated as keyframes)' },
  { id: 'trace-lines-appear', target: 'la-scheme-earn.result', lines: ['la-scheme-earn.line-1', 'la-scheme-earn.line-2', 'la-scheme-earn.line-3', 'la-scheme-earn.line-4', 'la-scheme-earn.line-5', 'la-scheme-earn.line-6'], action: 'set data-reveal 0..6 on the result element (CSS-only) to reveal lines one by one; .typing = reveal 0 + dimmed + hint' },
  { id: 'item-code', target: 'la-scheme-earn.item-input' }, { id: 'save', target: 'la-scheme-earn.save' }, { id: 'tab-earning', target: 'la-scheme-earn.tab-earning' }];
fs.writeFileSync(OUT + `${NAME}.page.json`, JSON.stringify({ id: 'la-' + NAME, title: 'Loyalty Scheme form, Earning tab with earn preview trace', system: 'loyal-arrow-desk', viewport: { w: 1440, h: 900 }, reference: 'dumps/screenshots/rs-p1a-admin-ui/after_earn-preview-trace_1440_light.png', data: { source: 'loyal-arrow/data/{uae-dubai-supermarket,india-departmental-store}/cfg.json', note: 'spend-per-point, bill and 300% milk bonus are derived deterministically in scripts/la-page-earn.mjs; worth/pt from cfg.redeem_value_per_pt' }, interactions, variants: page }, null, 1));
console.log('wrote', VARIANTS.length, 'variants');
