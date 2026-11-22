// Generates components/la/retail-mapping-inbox/ (component.html, states/*.html, slots.json, texts.json, component.json). Deterministic.
import fs from 'fs'; import { ROOT } from './lib.mjs';
const D = ROOT + 'components/la/retail-mapping-inbox/'; const P = 'la-retail-mapping-inbox';
const ico = {
  cal: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>',
  chev: '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>' };
const tabs = (n) => `<div class="la-tabs" data-ui="${P}.tabs" data-state="active-3" role="tablist">${[1,2,3,4].map(i => `<a class="la-tab" data-ui="${P}.tab-${i}" role="tab">{{tab${i}}}</a>`).join('')}</div>`;
const seg = (st) => `<div class="la-segmented" data-ui="${P}.status" data-state="${st}" role="tablist"><span class="la-seg-opt" data-ui="${P}.status-open" role="tab">{{segOpen}}<span class="la-seg-count" data-ui="${P}.status-count">{{count}}</span></span><span class="la-seg-opt" data-ui="${P}.status-mapped" role="tab">{{segMapped}}</span><span class="la-seg-opt" data-ui="${P}.status-aside" role="tab">{{segAside}}</span></div>`;
const reason = `<div class="la-inbox-reason" data-ui="${P}.reason"><span class="la-fx-label">{{reasonLabel}}</span><span class="la-field-value" data-ui="${P}.reason-value">{{reasonValue}}</span></div>`;
const head = (st, extra = '') => `<div class="la-inbox" data-ui="${P}" data-state="{{state}}">
  <p class="la-inbox-desc" data-ui="${P}.desc">{{desc}}</p>
  ${tabs()}
  <div class="la-inbox-filters" data-ui="${P}.filters">${seg(st)}${reason}</div>
${extra}</div>`;
const th = `<thead><tr data-ui="${P}.head"><th data-ui="${P}.col-sku">{{colSku}}</th><th data-ui="${P}.col-why">{{colWhy}}</th><th class="la-num" data-ui="${P}.col-bills">{{colBills}}</th><th data-ui="${P}.col-seen">{{colSeen}}</th><th data-ui="${P}.col-category">{{colCategory}}</th></tr></thead>`;
const row = (n, o = {}) => `<tr class="la-tr${o.hit ? ' is-hit' : ''}" data-ui="${P}.row-${n}"><td data-ui="${P}.r${n}-sku">{{r${n}_sku}}</td><td><div data-ui="${P}.r${n}-why">{{r${n}_why}}</div><div class="la-inbox-why-hint" data-ui="${P}.r${n}-hint">{{r${n}_hint}}</div></td><td class="la-num la-ibills" data-ui="${P}.r${n}-bills">{{r${n}_bills}}</td><td class="la-iseen" data-ui="${P}.r${n}-seen">{{r${n}_seen}}</td><td><div class="la-inbox-cell"><div class="la-inbox-selwrap"><div class="la-inbox-sel${o.open ? ' is-open' : ''}" data-ui="${P}.r${n}-category"><span>{{chooseCategory}}</span>${ico.chev}</div>${o.open ? `<div class="la-inbox-menu" data-ui="${P}.r${n}-menu"><span class="is-hi" data-ui="${P}.r${n}-opt-1">{{cat1}}</span><span data-ui="${P}.r${n}-opt-2">{{cat2}}</span><span data-ui="${P}.r${n}-opt-3">{{cat3}}</span><span data-ui="${P}.r${n}-opt-4">{{cat4}}</span></div>` : ''}</div><div class="la-inbox-date" data-ui="${P}.r${n}-date"><span>{{datePh}}</span>${ico.cal}</div><div class="la-inbox-acts"><span class="la-btn is-primary" data-ui="${P}.r${n}-map">{{btnMap}}</span><span class="la-btn" data-ui="${P}.r${n}-aside">{{btnAside}}</span></div></div></td></tr>`;
const table = (rows) => `  <div class="la-tablewrap" data-ui="${P}.table"><table class="la-table la-inbox-table">${th}<tbody>${rows}</tbody></table></div>\n`;
const empty = `  <div class="la-inbox-empty" data-ui="${P}.empty"><div class="la-inbox-empty-title" data-ui="${P}.empty-title">{{emptyTitle}}</div><div class="la-inbox-empty-body" data-ui="${P}.empty-body">{{emptyBody}}</div></div>\n`;
const R = (ns, o) => ns.map(n => row(n, o?.[n])).join('');
const files = {
  'component.html': head('with-count', table(R([1,2,3,4]))),
  'states/category-open.html': head('with-count', table(R([1,2,3,4], { 1: { open: true, hit: true } }))),
  'states/row-mapped.html': head('with-count', table(R([2,3,4]))).replace('data-ui="la-retail-mapping-inbox.r2-', 'data-ui="la-retail-mapping-inbox.r2-'),
  'states/empty.html': head('active-2', empty),
  'states/zero.html': head('with-count', empty),
};
for (const [f, h] of Object.entries(files)) fs.writeFileSync(D + f, h);
const T = (sample, maxLength, type = 'text') => ({ type, sample, maxLength, where: 'text' });
const slots = { desc: T('Product catalogue, categories and the rules that earn on them.', 80), tab1: T('Catalogue', 24), tab2: T('Categories', 24), tab3: T('Mapping inbox', 24), tab4: T('Retail settings', 24),
  segOpen: T('Open', 12), segMapped: T('Mapped', 12), segAside: T('Set aside', 12), count: T('4', 4, 'number'), reasonLabel: T('Reason', 16), reasonValue: T('Any', 24),
  colSku: T('SKU', 12), colWhy: T('Why it is here', 24), colBills: T('Bills', 12), colSeen: T('Last seen', 16), colCategory: T('Category', 16),
  chooseCategory: T('Choose a category', 24), datePh: T('dd/mm/yyyy', 12), btnMap: T('Map', 12), btnAside: T('Set aside', 14), cat1: T('Staples', 16), cat2: T('Dairy', 16), cat3: T('Bakery', 16), cat4: T('Beverages', 16),
  emptyTitle: T('Nothing to map', 32), emptyBody: T('Every item the till has seen is mapped to a category.', 80) };
const rows = [['RICE1','No category yet','Pick the category this item belongs to.','6'],['SNAC1','More than one category fits','Pick the one category that is right for this item.','4'],['2312345012349','Weighed item barcode','Weighed items carry a price or weight in the barcode. Map the product code once.','3'],['TEA1','No category yet','Pick the category this item belongs to.','2']];
rows.forEach(([s,w,h,b], i) => { const n = i + 1; slots[`r${n}_sku`] = T(s, 16); slots[`r${n}_why`] = T(w, 32); slots[`r${n}_hint`] = T(h, 88); slots[`r${n}_bills`] = T(b, 4, 'number'); slots[`r${n}_seen`] = T('Nov 22, 2026, 10:44 AM', 26, 'date'); });
fs.writeFileSync(D + 'slots.json', JSON.stringify({ slots }, null, 1));
const ar = { desc: 'كتالوج المنتجات والفئات والقواعد التي تُكسب عليها.', tab1: 'الكتالوج', tab2: 'الفئات', tab3: 'صندوق الربط', tab4: 'إعدادات التجزئة', segOpen: 'مفتوح', segMapped: 'تم الربط', segAside: 'مستبعد', reasonLabel: 'السبب', reasonValue: 'أي', colSku: 'الرمز', colWhy: 'سبب الظهور', colBills: 'الفواتير', colSeen: 'آخر ظهور', colCategory: 'الفئة', chooseCategory: 'اختر فئة', datePh: 'يوم/شهر/سنة', btnMap: 'ربط', btnAside: 'استبعاد', cat1: 'المواد الأساسية', cat2: 'الألبان', cat3: 'المخبوزات', cat4: 'المشروبات', emptyTitle: 'لا شيء للربط', emptyBody: 'كل صنف مرّ على الكاشير مرتبط بفئة.',
  r1_why: 'لا توجد فئة بعد', r1_hint: 'اختر الفئة التي ينتمي إليها هذا الصنف.', r2_why: 'تناسبه أكثر من فئة', r2_hint: 'اختر الفئة الصحيحة لهذا الصنف.', r3_why: 'باركود صنف موزون', r3_hint: 'تحمل الأصناف الموزونة السعر أو الوزن في الباركود. اربط رمز المنتج مرة واحدة.', r4_why: 'لا توجد فئة بعد', r4_hint: 'اختر الفئة التي ينتمي إليها هذا الصنف.' };
fs.writeFileSync(D + 'texts.json', JSON.stringify(Object.fromEntries(Object.entries(ar).map(([k, v]) => [k, { ar: v }])), null, 1));
fs.writeFileSync(D + 'component.json', JSON.stringify({ id: P, name: 'Retail mapping inbox (tabs, status filter, reason, rows with category picker)', system: 'loyal-arrow-desk', kind: 'page-body', shell: true, shellState: 'section-expanded', viewport: { w: 1440, h: 900 }, css: ['la-desk-inbox.css', 'la-desk-nav.css', 'la-desk-admin.css'],
  states: ['populated', 'category-open', 'row-mapped', 'empty', 'zero'], defaultState: 'populated', stateText: { populated: {}, 'category-open': {}, 'row-mapped': { count: '3' }, empty: { count: '0' }, zero: { count: '0' } },
  reference: 'rs-p1a-admin-ui/after_retail-inbox_1440_light.png', notes: 'Interaction targets: r{n}-category (choose category select), r{n}-menu/opt-k (open list in category-open), r{n}-map (Map), r{n}-aside, row-{n} (row that leaves on Map; row-mapped drops row 1). populated=4 open; zero=Open 0 inbox clear; empty=Mapped tab nothing yet. Data from data/<region>/mapping_inbox.json via scripts/la-pages-inbox.mjs.' }, null, 1));
