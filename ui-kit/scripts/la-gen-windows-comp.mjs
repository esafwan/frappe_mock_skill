// Generates components/la/retail-windows/ (component.html, states/*.html, slots.json, texts.json, component.json). Deterministic.
import fs from 'fs'; import { ROOT } from './lib.mjs';
const D = ROOT + 'components/la/retail-windows/'; const P = 'la-retail-windows'; const N = 9;
fs.mkdirSync(D + 'states', { recursive: true });
const cal = '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/></svg>';
const chev = '<svg class="la-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const tabs = `<div class="la-tabs" data-ui="${P}.tabs" role="tablist">${[1,2,3,4,5,6,7,8].map(i => `<a class="la-tab${i === 7 ? ' is-active' : ''}" data-ui="${P}.tab-${i}" role="tab">{{tab${i}}}</a>`).join('')}</div>`;
const fld = (id, label, slot, o = {}) => `<div class="la-win-fld${o.w ? ' ' + o.w : ''}" data-ui="${P}.${id}"><span class="la-lbl">{{${label}}}</span><div class="la-fld${o.muted === false ? '' : ' is-muted'}${o.focus ? ' is-focus' : ''}" data-ui="${P}.${id}-input"><span>{{${slot}}}</span>${o.ico || ''}</div></div>`;
const form = (ed) => `<div class="la-win-form" data-ui="${P}.form"><h2 class="la-win-formtitle" data-ui="${P}.form-title">{{formTitle}}</h2>
  ${fld('f-key', 'lblKey', 'valKey', { muted: !ed, focus: false, w: 'is-key' })}
  <div class="la-win-pair">${fld('f-year', 'lblYear', 'valYear', { muted: !ed, w: 'is-year' })}${fld('f-kind', 'lblKind', 'valKind', { muted: false, w: 'is-kind' })}</div>
  ${fld('f-region', 'lblRegion', 'valRegion', { muted: false, w: 'is-region' })}
  <div class="la-win-pair">${fld('f-leadin', 'lblLead', 'valLead', { ico: cal, w: 'is-date', muted: false })}${fld('f-starts', 'lblStarts', 'valStarts', { ico: cal, w: 'is-date', muted: false })}</div>
  ${fld('f-ends', 'lblEnds', 'valEnds', { ico: cal, w: 'is-date', muted: false })}
  ${fld('f-notes', 'lblNotes', 'valNotes', { muted: false, w: 'is-notes' })}
  <p class="la-win-hint" data-ui="${P}.form-hint">{{formHint}}</p>
  <span class="la-btn is-primary la-win-save" data-ui="${P}.f-save">{{btnSave}}</span></div>`;
const row = (n, conf) => `<tr class="la-tr" data-ui="${P}.row-${n}"><td data-ui="${P}.r${n}-name">{{r${n}_name}}</td><td class="la-num" data-ui="${P}.r${n}-year">{{r${n}_year}}</td><td data-ui="${P}.r${n}-region">{{r${n}_region}}</td><td data-ui="${P}.r${n}-dates">{{r${n}_dates}}</td><td><span class="la-pill ${conf ? 'is-green' : 'is-amber'}" data-ui="${P}.r${n}-status" data-state="${conf ? 'confirmed' : 'not-confirmed'}">{{${conf ? 'pillConfirmed' : 'pillNot'}}}</span></td><td><div class="la-win-acts">${conf ? '' : `<span class="la-btn" data-ui="${P}.r${n}-confirm">{{btnConfirm}}</span>`}<span class="la-btn" data-ui="${P}.r${n}-edit">{{btnEdit}}</span></div></td></tr>`;
const table = (rows) => `<div class="la-tablewrap" data-ui="${P}.table"><table class="la-table la-win-table"><thead><tr data-ui="${P}.head"><th data-ui="${P}.col-window">{{colWindow}}</th><th data-ui="${P}.col-year">{{colYear}}</th><th data-ui="${P}.col-region">{{colRegion}}</th><th data-ui="${P}.col-dates">{{colDates}}</th><th data-ui="${P}.col-status">{{colStatus}}</th><th data-ui="${P}.col-change">{{colChange}}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
const empty = `<div class="la-win-empty" data-ui="${P}.empty"><div class="la-win-empty-title" data-ui="${P}.empty-title">{{emptyTitle}}</div><div class="la-win-empty-body" data-ui="${P}.empty-body">{{emptyBody}}</div></div>`;
const page = (st, ed, inner) => `<div class="la-win" data-ui="${P}" data-state="{{state}}">
  <p class="la-win-desc" data-ui="${P}.desc">{{desc}}</p>
  ${tabs}
  <div class="la-win-split">${form(ed)}<div class="la-win-list"><h2 class="la-win-title" data-ui="${P}.title">{{listTitle}}</h2>${inner}</div></div></div>\n`;
const R = (c1) => Array.from({ length: N }, (_, i) => row(i + 1, c1 && i === 0)).join('');
const files = { 'component.html': page('populated', false, table(R(false))), 'states/confirmed.html': page('confirmed', false, table(R(true))), 'states/editing.html': page('editing', true, table(R(false))), 'states/empty.html': page('empty', false, empty), 'states/zero.html': page('zero', false, empty) };
for (const [f, h] of Object.entries(files)) fs.writeFileSync(D + f, h);
const T = (sample, maxLength, type = 'text') => ({ type, sample, maxLength, where: 'text' });
const S = { desc: T('Product catalogue, categories and the rules that earn on them.', 80),
  tab1: T('Catalogue', 24), tab2: T('Categories', 24), tab3: T('Heatmap', 24), tab4: T('Festival', 24), tab5: T('Mapping inbox', 24), tab6: T('Missions', 24), tab7: T('Windows', 24), tab8: T('Retail settings', 24),
  formTitle: T('Add or edit a window', 28), lblKey: T('Festival key', 20), lblYear: T('Year', 12), lblKind: T('Kind', 12), lblRegion: T('Region', 12), lblLead: T('Lead-in starts', 20), lblStarts: T('Starts', 12), lblEnds: T('Ends', 12), lblNotes: T('Notes', 12),
  valKey: T('ramadan', 20), valYear: T('2026', 4, 'number'), valKind: T('Festival', 16), valRegion: T('', 16), valLead: T('dd/mm/yyyy', 12, 'date'), valStarts: T('dd/mm/yyyy', 12, 'date'), valEnds: T('dd/mm/yyyy', 12, 'date'), valNotes: T('', 40),
  formHint: T('A new window starts unconfirmed. Changing the dates of a confirmed window takes the confirmation back.', 120), btnSave: T('Save window', 16),
  listTitle: T('Retail windows', 24), colWindow: T('Window', 12), colYear: T('Year', 8), colRegion: T('Region', 12), colDates: T('Dates', 12), colStatus: T('Status', 12), colChange: T('Change', 12),
  pillNot: T('Not confirmed', 16), pillConfirmed: T('Confirmed', 16), btnConfirm: T('Confirm', 12), btnEdit: T('Edit', 8), emptyTitle: T('No windows yet', 32), emptyBody: T('Add a festival window to start planning retail campaigns.', 80) };
const rows = [['Diwali','2027','India','2027-10-27 to 2027-10-31 (14 day lead-in)'],['Onam','2027','India','2027-09-03 to 2027-09-13 (10 day lead-in)'],['Back To School','2027','GCC','2027-08-15 to 2027-09-15 (10 day lead-in)'],['Eid Al Adha','2027','GCC','2027-05-16 to 2027-05-19 (7 day lead-in)'],['Eid Al Fitr','2027','GCC','2027-03-09 to 2027-03-11 (7 day lead-in)'],['Ramadan','2027','GCC','2027-02-08 to 2027-03-08 (10 day lead-in)'],['Pongal','2027','India','2027-01-13 to 2027-01-16 (7 day lead-in)'],['Dsf','2026','GCC','2026-12-04 to 2027-01-10 (10 day lead-in)'],['Diwali','2026','India','2026-11-06 to 2026-11-10 (14 day lead-in)']];
rows.forEach(([a, y, r, d], i) => { const n = i + 1; S[`r${n}_name`] = T(a, 24); S[`r${n}_year`] = T(y, 4, 'number'); S[`r${n}_region`] = T(r, 12); S[`r${n}_dates`] = T(d, 60, 'date'); });
fs.writeFileSync(D + 'slots.json', JSON.stringify({ slots: S }, null, 1));
const ar = { desc: 'كتالوج المنتجات والفئات والقواعد التي تُكسب عليها.', tab1: 'الكتالوج', tab2: 'الفئات', tab3: 'الخريطة الحرارية', tab4: 'المهرجان', tab5: 'صندوق الربط', tab6: 'المهمات', tab7: 'النوافذ', tab8: 'إعدادات التجزئة',
  formTitle: 'إضافة نافذة أو تعديلها', lblKey: 'مفتاح المهرجان', lblYear: 'السنة', lblKind: 'النوع', lblRegion: 'المنطقة', lblLead: 'بداية الإعداد المسبق', lblStarts: 'البداية', lblEnds: 'النهاية', lblNotes: 'ملاحظات', valKind: 'مهرجان', valLead: 'يوم/شهر/سنة', valStarts: 'يوم/شهر/سنة', valEnds: 'يوم/شهر/سنة',
  formHint: 'تبدأ النافذة الجديدة غير مؤكدة. تغيير تواريخ نافذة مؤكدة يلغي تأكيدها.', btnSave: 'حفظ النافذة', listTitle: 'نوافذ التجزئة', colWindow: 'النافذة', colYear: 'السنة', colRegion: 'المنطقة', colDates: 'التواريخ', colStatus: 'الحالة', colChange: 'تغيير', pillNot: 'غير مؤكدة', pillConfirmed: 'مؤكدة', btnConfirm: 'تأكيد', btnEdit: 'تعديل', emptyTitle: 'لا توجد نوافذ بعد', emptyBody: 'أضف نافذة مهرجان لبدء تخطيط حملات التجزئة.' };
fs.writeFileSync(D + 'texts.json', JSON.stringify(Object.fromEntries(Object.entries(ar).map(([k, v]) => [k, { ar: v }])), null, 1));
fs.writeFileSync(D + 'component.json', JSON.stringify({ id: P, name: 'Retail windows (festival window editor card + windows table with Confirm/Edit)', system: 'loyal-arrow-desk', kind: 'page-body', shell: true, shellState: 'section-expanded', viewport: { w: 1440, h: 900 }, css: ['la-desk-inbox.css', 'la-desk-nav.css', 'la-desk-admin.css', 'la-desk-windows.css'],
  states: ['populated', 'confirmed', 'editing', 'empty', 'zero'], defaultState: 'populated', stateText: { populated: {}, confirmed: {}, editing: {}, empty: {}, zero: {} },
  reference: 'rs-p1b-missions-ui/after_windows_1440_light.png', notes: 'Interaction targets: r{n}-confirm (Confirm flips r{n}-status pill amber to green; confirmed state shows row 1 flipped, Confirm button gone), r{n}-edit (loads row into form: editing state), f-key/f-year/f-kind/f-region/f-leadin/f-starts/f-ends/f-notes inputs (-input suffix = the box), f-save, row-{n}. Data via data/<region>/windows.json (gen_windows.py) and scripts/la-pages-windows.mjs. Not in reference: confirmed/editing/empty look (inferred).' }, null, 1));
