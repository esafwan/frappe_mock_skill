// T27: URY desk list, form and report screens inside the T24 shell (1440x900).
// Markup is the captured Frappe v16 list-view / report-view / form-title / form-tabs / form-section / field-table anatomy with URY doctype content.
// Every field label below is the "label" of a field in ury/ury/doctype/<name>/<name>.json (URY Order, URY KOT, URY Table, URY Order Item), the
// ERPNext POS Invoice doctype json, or the column list of ury/ury/report/{today's_sales,revpash_report}. Arabic labels come from ury/translations/ar.csv;
// the few UI strings absent there (Ready For Prepare, Consolidated, Order Status, Working hours, No Of Seats, Total RevPASH, RevPASH Report) are translated by hand.
// The URY Printer Settings child table is a field of URY Production Unit and URY Room, not of URY Order or URY Table; no invented field is added to either form.
import { ic, money } from '../lib.mjs';
import { deskShell, NAV_SLOTS, NAV_RTL } from './nav.mjs';

const CSS = ['frappe-desk.css', 'theme-vars.css', 'ury-v16/components/desk-nav.css', 'ury-v16/components/desk-views.css'];
const EXTRA = {
  Funnel: '<path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/>',
  ArrowDownWideNarrow: '<path d="m3 16 4 4 4-4"/><path d="M7 20V4"/><path d="M11 4h10"/><path d="M11 8h7"/><path d="M11 12h4"/>',
  MessageCircle: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  Heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  ChevronUp: '<path d="m18 15-6-6-6 6"/>',
  ExternalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  ChevronsUpDown: '<path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/>',
  CircleHelp: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
};
const I = (n, s = 16, c = '') => ic(n, s, 'icon icon-sm' + (c ? ' ' + c : ''), { ...EXTRA });

// ---- slot registry -------------------------------------------------------------------------------------------------------------------------
const REG = {}; let USED = new Set();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const put = (k, e) => { let n = 1, kk = k; while (REG[kk] && !same(REG[kk], e)) kk = `${k}_v${++n}`; REG[kk] = e; USED.add(kk); return `{{${kk}}}`; };
const T = (k, en, ar) => put(k, { en, ar: ar === undefined ? en : ar });
const M = (k, amount, ar, cur = 'AED') => put(k, { money: money(amount, cur), ar });
const NAVUSED = new Set();
const navV = new Proxy({}, { get: (_, k) => (NAVUSED.add(String(k).replace(/_initials$/, '')), `{{${String(k)}}}`) });
const collect = (render, variants) => {
  USED = new Set(); NAVUSED.clear(); render({}, {}); for (const x of Object.values(variants)) render({}, x.props); const slots = {}; const rtl = {};
  for (const k of USED) { slots[k] = REG[k].money || REG[k].en; rtl[k] = REG[k].ar; }
  for (const k of NAVUSED) if (k in NAV_SLOTS && k !== 'nav_crumb') { slots[k] = NAV_SLOTS[k]; rtl[k] = NAV_RTL[k]; }
  return { slots, rtl };
};
const esc = (s) => String(s).replace(/"/g, '&quot;');
const lbl = (f, en, ar) => T('l_' + f, en, ar);

// ---- page head (replaces the shell's empty head) ---------------------------------------------------------------------------------------------
const btn = (cls, label, o = {}) => `<button class="es-button ${cls}" type="button"${o.variant ? ` data-variant="${o.variant}"` : ''}><span class="es-spinner" aria-hidden="true"></span>${o.icon ? I(o.icon) : ''}<span class="es-button__label">${label}</span>${o.caret ? I('ChevronDown') : ''}</button>`;
const iconBtn = (name) => `<button class="es-button icon-btn menu-more-button" type="button" data-icon-button="true">${I(name)}</button>`;
const headActions = (kind) => {
  if (kind === 'list') return `<div class="align-center flex standard-items-section"><div class="flex col page-actions justify-content-end"><div class="standard-actions flex"><span class="page-icon-group"><button class="text-muted btn btn-default icon-btn">${I('RotateCcw')}</button></span><div class="menu-btn-group">${iconBtn('MoreVertical')}</div>${btn('primary-action', T('h_add', 'Add POS Invoice', 'إضافة فاتورة نقطة بيع'), { variant: 'solid', icon: 'Plus' })}</div></div></div>`;
  if (kind === 'report') return `<div class="align-center flex standard-items-section"><div class="flex col page-actions justify-content-end"><div class="standard-actions flex"><div class="menu-btn-group">${btn('', T('h_menu', 'Menu', 'القائمة'), { caret: true })}</div>${btn('primary-action', T('h_refresh', 'Refresh', 'تحديث'), { variant: 'solid' })}</div></div></div>`;
  return `<div class="align-center flex standard-items-section"><div class="flex col page-actions justify-content-end"><div class="standard-actions flex"><span class="page-icon-group"><button class="text-muted btn btn-default prev-doc icon-btn">${I('ChevronLeft')}</button><button class="text-muted btn btn-default next-doc icon-btn">${I('ChevronRight')}</button></span><div class="menu-btn-group">${iconBtn('MoreVertical')}</div>${btn('primary-action', T('h_save', 'Save', 'حفظ'), { variant: 'solid' })}</div></div></div>`;
};
const crumbs = (items, status) => `<ol>${items.map((c, i) => (i < items.length - 1 ? `<li><a class="es-breadcrumbs__item" href="#"><span class="es-breadcrumbs__label">${c}</span></a></li>` : `<li><span class="es-breadcrumbs__item" aria-current="page"><span class="es-breadcrumbs__label">${c}</span></span></li>`)).join('')}</ol>`;
const badge = (theme, text, cls = '') => `<span class="es-badge${cls ? ' ' + cls : ''}" data-theme="${theme}"><span class="es-badge__label">${text}</span></span>`;
let CURID = '';
const page = (active, kind, crumbList, mainHtml, pill) => {
  let h = deskShell(active, `<div class="container page-body"><div class="page-wrapper"><div class="page-content"><div class="layout-main">${mainHtml}</div></div></div></div>`, navV, { id: CURID });
  h = h.replace(/<ol>.*?<\/ol>/, crumbs(crumbList));
  if (pill) h = h.replace('</nav></div></div></div>', `</nav>${badge(pill[0], pill[1], 'page-indicator-pill')}</div></div></div>`);
  return h.replace('<div class="align-center flex standard-items-section"></div>', headActions(kind));
};

// ---- list view ---------------------------------------------------------------------------------------------------------------------------------
const filterInput = (f, ph, ar, type = 'Data') => {
  const p = T('f_' + f, ph, ar);
  if (type === 'Select') return `<div class="form-group frappe-control input-max-width col-md-2" data-fieldtype="Select" data-fieldname="${f}"><select class="input-with-feedback form-control input-xs ellipsis" data-fieldtype="Select" data-fieldname="${f}"><option>${p}</option></select><div class="select-icon">${I('ChevronDown')}</div></div>`;
  if (type === 'Link') return `<div class="form-group frappe-control input-max-width col-md-2" data-fieldtype="Link" data-fieldname="${f}"><div class="link-field ui-front"><div class="awesomplete"><input type="text" class="input-with-feedback form-control input-xs" maxlength="140" data-fieldtype="Link" data-fieldname="${f}" placeholder="${p}" autocomplete="off"></div></div></div>`;
  return `<div class="form-group frappe-control input-max-width col-md-2" data-fieldtype="${type}" data-fieldname="${f}"><div class="input-group"><input type="text" autocomplete="off" class="input-with-feedback form-control input-xs" maxlength="140" data-fieldtype="${type}" data-fieldname="${f}" placeholder="${p}"><div class="input-group-btn mr-0"><button type="button" class="btn btn-default match-type-dropdown-btn">${I('ChevronDown')}</button></div></div></div>`;
};
const sortBar = (sortLabel) => `<div class="filter-section flex"><div class="filter-selector"><div class="btn-group"><button class="btn btn-default btn-sm filter-button"><span class="filter-icon button-icon">${I('Funnel')}</span><span class="button-label hidden-xs">${T('s_filter', 'Filter', 'تصفية')}</span></button><button class="btn btn-default btn-sm filter-x-button"><span class="filter-icon button-icon">${I('X')}</span></button></div></div><div class="sort-selector"><div class="btn-group"><button class="btn btn-default btn-sm btn-order"><span class="sort-order">${I('ArrowDownWideNarrow')}</span></button><button type="button" class="btn btn-default btn-sm sort-selector-button text-nowrap"><span class="dropdown-text hidden-sm">${sortLabel}</span><span>${I('ChevronDown')}</span></button></div></div></div>`;
const rowCell = (c, v, i) => {
  if (c.badge) return `<div class="list-row-col hidden-xs ellipsis" data-fieldname="${c.f}">${badge(v.theme, T(`${c.key}_${i}`, v.en, v.ar), 'filterable ellipsis')}</div>`;
  const val = c.money ? M(`${c.key}_${i}`, v.amount, v.ar) : T(`${c.key}_${i}`, v.en, v.ar);
  return `<div class="list-row-col ellipsis hidden-xs${c.right ? ' text-right' : ''}" data-fieldname="${c.f}"><span class="ellipsis"><a class="filterable ellipsis">${val}</a></span></div>`;
};
// def: {doctype, cols:[{f,key,label,ar,badge,money,right}], subject:{f,key,label,ar}, rows:[{subject:{en,ar}, cells:[...], mod, comments}], count}
const listBody = (def, filters, sortLabel) => {
  const head = `<header class="level list-row-head text-muted"><div class="level-left list-header-subject"><div class="list-row-col ellipsis list-subject level" data-fieldname="${def.subject.f}"><span class="level-item select-like"><input class="list-header-checkbox list-check-all" type="checkbox"></span><span class="level-item" data-sort-by="${def.subject.f}">${lbl(def.subject.f, def.subject.label, def.subject.ar)}</span></div>${def.cols.map((c) => `<div class="list-row-col ellipsis hidden-xs${c.right ? ' text-right' : ''}" data-fieldname="${c.f}"><span>${lbl(c.f, c.label, c.ar)}</span></div>`).join('')}</div><div class="level-right"><span class="list-count"><span>${T('list_count', def.count.en, def.count.ar)}</span></span><span class="level-item list-liked-by-me hidden-xs"><span>${I('Heart')}</span></span></div></header>`;
  const rows = def.rows.map((r, i) => `<div class="list-row-container" tabindex="1"><div class="level list-row"><div class="level-left ellipsis"><div class="list-row-col ellipsis list-subject level" data-fieldname="${def.subject.f}"><span class="level-item select-like"><input class="list-row-checkbox" type="checkbox"></span><span class="level-item bold ellipsis"><a class="ellipsis" href="#">${T(`${def.subject.key}_${i}`, r.subject.en, r.subject.ar)}</a></span></div>${def.cols.map((c, j) => rowCell(c, r.cells[j], i)).join('')}</div><div class="level-right text-muted ellipsis border-0"><div class="level-item list-row-activity hidden-xs"><span class="modified">${T(`mod_${i}`, r.mod.en, r.mod.ar)}</span><span class="comment-count d-flex align-items-center">${I('MessageCircle')}<span class="count">${T(`cc_${i}`, r.cc || '0')}</span></span><span class="list-row-like hidden-xs"><span class="like-action not-liked">${I('Heart')}</span></span></div></div></div></div>`).join('');
  const paging = `<div class="list-paging-area level"><div class="level-left"><div class="es-tab-buttons" role="radiogroup">${['20', '100', '500', '2500'].map((n, i) => `<button type="button" class="es-pill" role="radio" data-state="${i ? 'inactive' : 'active'}">${T('pg_' + n, n)}</button>`).join('')}</div></div></div>`;
  return `<div class="layout-main-section-wrapper list-view"><div class="layout-main-section layout-main-list" data-ui="ury-desk-screen-list"><div class="page-form flex list-page-form"><div class="standard-filter-section flex">${filters}</div>${sortBar(sortLabel)}</div><div class="frappe-list"><div class="result-container"><div class="result no-assign-to"><div class="list-row-container">${head}</div>${rows}</div></div>${paging}</div></div></div>`;
};
const A = (en, ar, theme) => ({ en, ar, theme });
const posInvoiceList = () => listBody({
  subject: { f: 'customer_name', key: 'sub', label: 'Customer Name', ar: 'اسم العميل' },
  cols: [{ f: 'status', key: 'st', label: 'Status', ar: 'الحالة', badge: true }, { f: 'customer', key: 'cu', label: 'Customer', ar: 'العميل' }, { f: 'company', key: 'co', label: 'Company', ar: 'شركة' },
    { f: 'grand_total', key: 'gt', label: 'Grand Total', ar: 'المجموع الإجمالي', money: true, right: true }, { f: 'name', key: 'id', label: 'ID', ar: 'المعرف' }],
  count: { en: '6 of 142', ar: '6 من 142' },
  rows: [
    ['Walk-in Customer', 'عميل مباشر', 'Paid', 'مدفوع', 'green', 128.5, 'د.إ 128.50', 'ACC-PSINV-2026-00142', '2 minutes ago', 'قبل دقيقتين'],
    ['Rashid K.', 'راشد ك.', 'Consolidated', 'مدمجة', 'green', 86, 'د.إ 86.00', 'ACC-PSINV-2026-00141', '9 minutes ago', 'قبل 9 دقائق'],
    ['Walk-in Customer', 'عميل مباشر', 'Draft', 'مسودة', 'red', 54.25, 'د.إ 54.25', 'ACC-PSINV-2026-00140', '21 minutes ago', 'قبل 21 دقيقة'],
    ['Layla M.', 'ليلى م.', 'Unpaid', 'غير مدفوع', 'orange', 210, 'د.إ 210.00', 'ACC-PSINV-2026-00139', '1 hour ago', 'قبل ساعة'],
    ['Walk-in Customer', 'عميل مباشر', 'Paid', 'مدفوع', 'green', 47.75, 'د.إ 47.75', 'ACC-PSINV-2026-00138', '1 hour ago', 'قبل ساعة'],
    ['Omar S.', 'عمر س.', 'Partly Paid', 'مدفوع جزئياً', 'yellow', 164, 'د.إ 164.00', 'ACC-PSINV-2026-00137', '2 hours ago', 'قبل ساعتين'],
  ].map((r, i) => ({ subject: { en: r[0], ar: r[1] }, cells: [A(r[2], r[3], r[4]), { en: r[0], ar: r[1] }, { en: 'Spice Garden', ar: 'سبايس غاردن' }, { amount: r[5], ar: r[6] }, { en: r[7], ar: r[7] }], mod: { en: r[8], ar: r[9] }, cc: String(i % 2) })),
}, filterInput('name', 'ID', 'المعرف') + filterInput('customer', 'Customer', 'العميل', 'Link') + filterInput('company', 'Company', 'شركة', 'Link') + filterInput('status', 'Status', 'الحالة', 'Select') + filterInput('posting_date', 'Date', 'تاريخ', 'Date'), T('sort_mod', 'Last Modified', 'آخر تعديل'));
const uryOrderList = () => listBody({
  subject: { f: 'name', key: 'sub', label: 'ID', ar: 'المعرف' },
  cols: [{ f: 'customer_name', key: 'cn', label: 'Customer Name', ar: 'اسم العميل' }, { f: 'no_of_pax', key: 'px', label: 'Pax', ar: 'عدد الأفراد', right: true }],
  count: { en: '5 of 38', ar: '5 من 38' },
  rows: [['URY-ORD-0038', 'Rashid K.', 'راشد ك.', '4'], ['URY-ORD-0037', 'Layla M.', 'ليلى م.', '2'], ['URY-ORD-0036', 'Omar S.', 'عمر س.', '6'], ['URY-ORD-0035', 'Walk-in Customer', 'عميل مباشر', '1'], ['URY-ORD-0034', 'Huda A.', 'هدى أ.', '3']]
    .map((r, i) => ({ subject: { en: r[0], ar: r[0] }, cells: [{ en: r[1], ar: r[2] }, { en: r[3], ar: r[3] }], mod: { en: ['3 minutes ago', '14 minutes ago', '32 minutes ago', '1 hour ago', '2 hours ago'][i], ar: ['قبل 3 دقائق', 'قبل 14 دقيقة', 'قبل 32 دقيقة', 'قبل ساعة', 'قبل ساعتين'][i] }, cc: '0' })),
}, filterInput('name', 'ID', 'المعرف') + filterInput('customer_name', 'Customer Name', 'اسم العميل', 'Link'), T('sort_mod', 'Last Modified', 'آخر تعديل'));
const kotList = (served) => listBody({
  subject: { f: 'name', key: 'sub', label: 'ID', ar: 'المعرف' },
  cols: [{ f: 'order_status', key: 'os', label: 'Order Status', ar: 'حالة الطلب', badge: true }, { f: 'invoice', key: 'iv', label: 'Invoice', ar: 'الفاتورة' }, { f: 'date', key: 'dt', label: 'Date', ar: 'تاريخ' }],
  count: { en: served ? '4 of 4' : '6 of 57', ar: served ? '4 من 4' : '6 من 57' },
  rows: [['URY-KOT-0057', 'Ready For Prepare', 'جاهز للتحضير', 'orange', 'ACC-PSINV-2026-00142'], ['URY-KOT-0056', 'Ready For Prepare', 'جاهز للتحضير', 'orange', 'ACC-PSINV-2026-00141'], ['URY-KOT-0055', 'Served', 'قُدِّم', 'green', 'ACC-PSINV-2026-00140'], ['URY-KOT-0054', 'Served', 'قُدِّم', 'green', 'ACC-PSINV-2026-00139'], ['URY-KOT-0053', 'Served', 'قُدِّم', 'green', 'ACC-PSINV-2026-00138'], ['URY-KOT-0052', 'Served', 'قُدِّم', 'green', 'ACC-PSINV-2026-00137']]
    .filter((r) => !served || r[1] === 'Served')
    .map((r, i) => ({ subject: { en: r[0], ar: r[0] }, cells: [A(r[1], r[2], r[3]), { en: r[4], ar: r[4] }, { en: '2026-11-21', ar: '21-11-2026' }], mod: { en: `${(i + 1) * 4} minutes ago`, ar: `قبل ${(i + 1) * 4} دقائق` }, cc: '0' })),
}, filterInput('name', 'ID', 'المعرف') + filterInput('order_status', 'Order Status', 'حالة الطلب'), T('sort_mod', 'Last Modified', 'آخر تعديل'));

// ---- form --------------------------------------------------------------------------------------------------------------------------------------
const wrapCtl = (type, f, labelHtml, inputHtml, ro, valueHtml, reqd) => `<div class="frappe-control input-max-width" data-fieldtype="${type}" data-fieldname="${f}"><div class="form-group horizontal"><div class="clearfix"><label class="control-label${reqd ? ' reqd' : ''}" style="padding-right: 5px;">${labelHtml}</label><span class="help"></span></div><div class="control-input-wrapper"><div class="control-input"${ro ? ' style="display: none;"' : ''}>${inputHtml}</div><div class="control-value like-disabled-input${ro ? '' : ' hide'}">${valueHtml || ''}</div><div class="help-box small text-extra-muted hide"></div></div></div></div>`;
// field: {t, f, label, ar, reqd, ro, v:{en,ar}|{money}}
const ctl = (x) => {
  const L = lbl(x.f, x.label, x.ar); const val = x.v ? (x.v.amount !== undefined ? M('v_' + x.f, x.v.amount, x.v.ar) : T('v_' + x.f, x.v.en, x.v.ar)) : '';
  if (x.t === 'Check') return `<div class="frappe-control" data-fieldtype="Check" data-fieldname="${x.f}"><div class="form-group"><div class="checkbox"><label><span class="input-area"><input type="checkbox" autocomplete="off" class="input-with-feedback"${x.checked ? ' checked' : ''}${x.ro ? ' disabled' : ''} data-fieldtype="Check"></span><span class="label-area">${L}</span></label><p class="help-box small text-extra-muted"></p></div></div></div>`;
  if (x.t === 'Select') return wrapCtl('Select', x.f, L, `<div class="flex align-center"><select class="input-with-feedback form-control ellipsis" data-fieldtype="Select" data-fieldname="${x.f}"><option selected>${val}</option></select><div class="select-icon">${I('ChevronDown')}</div></div>`, false, '', x.reqd);
  if (x.t === 'Link') return wrapCtl('Link', x.f, L, `<div class="link-field ui-front" style="position: relative;"><div class="awesomplete"><input type="text" class="input-with-feedback form-control" maxlength="140" data-fieldtype="Link" data-fieldname="${x.f}" autocomplete="off" role="combobox" value="${val}"></div><span class="link-btn"><a class="btn-open" style="display: inline-flex;">${I('ExternalLink')}</a></span></div>`, x.ro, val, x.reqd);
  const ph = x.t === 'Currency' || x.t === 'Int' || x.t === 'Float' ? ' text-right' : '';
  return wrapCtl(x.t, x.f, L, `<input type="text" autocomplete="off" class="input-with-feedback form-control${ph}" maxlength="140" data-fieldtype="${x.t}" data-fieldname="${x.f}" value="${val}">`, x.ro, val, x.reqd);
};
const column = (fields) => `<div class="form-column col-sm-6"><form>${fields.map(ctl).join('')}</form></div>`;
const section = (label, cols) => `<div class="form-section card-section visible-section">${label ? `<div class="section-head collapsible">${label}<span class="ml-2 collapse-indicator mb-1">${I('ChevronUp')}</span></div>` : ''}<div class="section-body">${cols.map(column).join('')}</div></div>`;
const wideSection = (label, html) => `<div class="form-section card-section visible-section">${label ? `<div class="section-head collapsible">${label}<span class="ml-2 collapse-indicator mb-1">${I('ChevronUp')}</span></div>` : ''}<div class="section-body"><div class="form-column col-sm-12"><form>${html}</form></div></div></div>`;
const tabs = (list, active) => `<div class="form-tabs-list"><ul class="nav form-tabs" role="tablist">${list.map((t) => `<li class="nav-item show"><button class="nav-link${t.f === active ? ' active' : ''}" data-fieldname="${t.f}" type="button" role="tab">${lbl(t.f, t.label, t.ar)}</button></li>`).join('')}</ul></div>`;
const formLayout = (tabHtml, body) => `<div class="layout-main-section-wrapper"><div class="layout-main-section" data-ui="ury-desk-screen-form"><div><div class="std-form-layout"><div class="form-layout"><div class="form-page">${tabHtml}<div class="form-tab-content tab-content"><div class="tab-pane fade show active">${body}</div></div></div></div></div></div></div></div>`;
// field-table (URY Order Item: item, item_name, rate columns are in_list_view; qty is a field of the same doctype)
const fieldTable = (f, label, ar, cols, rows) => {
  const w = (c) => `flex: 1 0 ${c.w}px; width: ${c.w}px;`;
  const head = `<div class="grid-heading-row"><div class="grid-row"><div class="data-row row m-0"><div class="row-check sortable-handle col"><input type="checkbox" class="grid-row-check" tabindex="-1" disabled></div><div class="row-index sortable-handle grid-static-col col"><span>${T('no_col', 'No.', 'م')}</span></div>${cols.map((c) => `<div class="col grid-static-col${c.right ? ' text-right' : ''}" style="${w(c)}" data-fieldname="${c.f}"><div class="static-area ellipsis${c.reqd ? ' reqd' : ''}">${lbl(c.f, c.label, c.ar)}</div></div>`).join('')}<div class="col grid-static-col pointer"><a>${I('Pencil')}</a></div></div></div></div>`;
  const body = rows.map((r, i) => `<div class="grid-row" data-idx="${i + 1}"><div class="data-row row m-0"><div class="row-check sortable-handle col"><input type="checkbox" class="grid-row-check" tabindex="-1" disabled></div><div class="row-index sortable-handle grid-static-col col"><span>${T('gi_' + i, String(i + 1))}</span></div>${cols.map((c, j) => `<div class="col grid-static-col${c.right ? ' text-right' : ''}" style="${w(c)}" data-fieldname="${c.f}"><div class="static-area ellipsis">${c.money ? M(`g_${c.f}_${i}`, r[j].amount, r[j].ar) : T(`g_${c.f}_${i}`, r[j].en, r[j].ar)}</div></div>`).join('')}<div class="col"><div class="btn-open-row"><a>${I('ExternalLink')}</a></div></div></div></div>`).join('');
  return `<div class="frappe-control form-group" data-fieldtype="Table" data-fieldname="${f}" data-ui="ury-desk-screen-form.table"><div class="grid-field"><label class="control-label">${lbl(f, label, ar)}</label><div class="form-grid-container"><div class="form-grid">${head}<div class="grid-body"><div class="rows">${body}</div></div></div></div><div class="grid-footer"><div class="grid-buttons"><button class="es-button grid-add-row" type="button"><span class="es-button__label">${T('add_row', 'Add Row', 'إضافة صف')}</span></button></div></div></div></div>`;
};

const orderTabs = [{ f: 'table_tab', label: 'Table', ar: 'جدول' }, { f: 'menu_tab', label: 'Menu', ar: 'القائمة' }, { f: 'customer_tab', label: 'Customer', ar: 'العميل' }, { f: 'order_tab', label: 'Order', ar: 'طلب' }];
const orderForm = (tab) => {
  let body;
  if (tab === 'customer_tab') {
    body = section('', [[{ t: 'Link', f: 'customer_name', label: 'Customer Name', ar: 'اسم العميل', reqd: 1, v: { en: 'Rashid K.', ar: 'راشد ك.' } }], [{ t: 'Int', f: 'no_of_pax', label: 'Pax', ar: 'عدد الأفراد', reqd: 1, v: { en: '4', ar: '4' } }]])
      + section(lbl('favorite_item_section', 'Favorite Item', 'الصنف المفضل'), [[], []]);
  } else {
    body = section('', [[{ t: 'Link', f: 'add_item', label: 'Add Item', ar: 'إضافة صنف', v: { en: 'Chicken Biryani', ar: 'برياني دجاج' } }], [{ t: 'Currency', f: 'grand_total', label: 'Grand Total', ar: 'المجموع الإجمالي', ro: 1, v: { amount: 86, ar: 'د.إ 86.00' } }]])
      + section(lbl('additional_details', 'Additional Details', 'تفاصيل إضافية'), [[]])
      + wideSection('', fieldTable('items', 'Items', 'الاصناف',
        [{ f: 'item', label: 'Item', ar: 'الصنف', w: 200 }, { f: 'item_name', label: 'Item Name', ar: 'اسم السلعة', w: 200 }, { f: 'qty', label: 'Qty', ar: 'الكمية', w: 100, right: true }, { f: 'rate', label: 'Rate', ar: 'سعر السلعة المفردة', w: 120, right: true, money: true }, { f: 'comments', label: 'Comments', ar: 'تعليقات', w: 160 }],
        [[{ en: 'Chicken Biryani', ar: 'برياني دجاج' }, { en: 'Chicken Biryani', ar: 'برياني دجاج' }, { en: '2', ar: '2' }, { amount: 28, ar: 'د.إ 28.00' }, { en: 'Less spicy', ar: 'أقل حدة' }],
          [{ en: 'Mint Lemonade', ar: 'ليمون بالنعناع' }, { en: 'Mint Lemonade', ar: 'ليمون بالنعناع' }, { en: '3', ar: '3' }, { amount: 10, ar: 'د.إ 10.00' }, { en: '', ar: '' }]]))
      + section('', [[{ t: 'Link', f: 'waiter', label: 'Waiter', ar: 'النادل', ro: 1, v: { en: 'rashid@example.com', ar: 'rashid@example.com' } }, { t: 'Link', f: 'pos_profile', label: 'POS Profile', ar: 'الملف الشخصي لنقطة البيع', ro: 1, v: { en: 'Spice Garden POS', ar: 'سبايس غاردن POS' } }],
        [{ t: 'Link', f: 'cashier', label: 'Cashier', ar: 'أمين الصندوق', ro: 1, v: { en: 'cashier@example.com', ar: 'cashier@example.com' } }, { t: 'Data', f: 'comments_h', label: 'Comments', ar: 'تعليقات' }]]);
  }
  return formLayout(tabs(orderTabs, tab), body);
};
const tableTabs = [{ f: 'table_info_tab', label: 'Table Info', ar: 'معلومات الطاولة' }, { f: 'active_info_tab', label: 'Active Info', ar: 'معلومات نشطة' }];
const tableForm = (tab) => {
  const body = tab === 'active_info_tab'
    ? section('', [[{ t: 'Check', f: 'occupied', label: 'Occupied', ar: 'مشغولة', ro: 1, checked: 1 }, { t: 'Select', f: 'table_shape', label: 'Table Shape', ar: 'شكل الطاولة', v: { en: 'Rectangle', ar: 'مستطيل' } }, { t: 'Data', f: 'merged_with', label: 'Merged With', ar: 'مدمجة مع', ro: 1, v: { en: 'T2', ar: 'T2' } }], [{ t: 'Time', f: 'latest_invoice_time', label: 'Latest Invoice Time', ar: 'وقت آخر فاتورة', ro: 1, v: { en: '19:42:10', ar: '19:42:10' } }]])
      + section(lbl('layout_position_section', 'Layout Position', 'موضع التخطيط'), [[{ t: 'Float', f: 'layout_x', label: 'Layout X', ar: 'التخطيط X', v: { en: '120', ar: '120' } }, { t: 'Float', f: 'layout_width', label: 'Layout Width', ar: 'عرض التخطيط', v: { en: '96', ar: '96' } }], [{ t: 'Float', f: 'layout_y', label: 'Layout Y', ar: 'التخطيط Y', v: { en: '80', ar: '80' } }, { t: 'Float', f: 'layout_height', label: 'Layout Height', ar: 'ارتفاع التخطيط', v: { en: '64', ar: '64' } }]])
    : section('', [[{ t: 'Int', f: 'no_of_seats', label: 'No of Seats', ar: 'عدد المقاعد', v: { en: '4', ar: '4' } }, { t: 'Int', f: 'minimum_seating', label: 'Minimum Seating', ar: 'الحد الأدنى للمقاعد', v: { en: '2', ar: '2' } }, { t: 'Select', f: 'table_shape', label: 'Table Shape', ar: 'شكل الطاولة', v: { en: 'Rectangle', ar: 'مستطيل' } }],
      [{ t: 'Link', f: 'restaurant', label: 'Restaurant', ar: 'المطعم', reqd: 1, v: { en: 'Spice Garden', ar: 'سبايس غاردن' } }, { t: 'Link', f: 'restaurant_room', label: 'Restaurant Room', ar: 'قاعة المطعم', reqd: 1, v: { en: 'Main Hall', ar: 'القاعة الرئيسية' } }, { t: 'Link', f: 'branch', label: 'Branch', ar: 'فرع', reqd: 1, ro: 1, v: { en: 'Downtown', ar: 'وسط المدينة' } }]])
      + section('', [[{ t: 'Check', f: 'is_take_away', label: 'Is Take Away', ar: 'سفري' }]])
      + section(lbl('layout_position_section', 'Layout Position', 'موضع التخطيط'), [[{ t: 'Float', f: 'layout_x', label: 'Layout X', ar: 'التخطيط X', v: { en: '120', ar: '120' } }, { t: 'Float', f: 'layout_width', label: 'Layout Width', ar: 'عرض التخطيط', v: { en: '96', ar: '96' } }], [{ t: 'Float', f: 'layout_y', label: 'Layout Y', ar: 'التخطيط Y', v: { en: '80', ar: '80' } }, { t: 'Float', f: 'layout_height', label: 'Layout Height', ar: 'ارتفاع التخطيط', v: { en: '64', ar: '64' } }]]);
  return formLayout(tabs(tableTabs, tab), body);
};

// ---- report (Frappe datatable) ----------------------------------------------------------------------------------------------------------------
const repFilter = (f, label, ar, type, value) => {
  const L = lbl('rf_' + f, label, ar); const v = value ? T('rfv_' + f, value.en, value.ar) : '';
  const inner = type === 'Link' ? `<div class="link-field ui-front"><div class="awesomplete"><input type="text" class="input-with-feedback form-control input-xs" data-fieldtype="Link" data-fieldname="${f}" placeholder="${L}" value="${v}" autocomplete="off"></div></div>` : `<input type="text" class="input-with-feedback form-control input-xs" data-fieldtype="${type}" data-fieldname="${f}" placeholder="${L}" value="${v}" autocomplete="off">`;
  return `<div class="form-group frappe-control input-max-width col-md-2" data-fieldtype="${type}" data-fieldname="${f}">${inner}</div>`;
};
// cols: [{f,label,ar,w,right,money}] rows: [[{en,ar}|{amount,ar}]]
const datatable = (cols, rows) => {
  const hdr = `<div class="dt-row dt-row-header" data-is-header="1"><div class="dt-cell dt-cell--col-0 dt-cell--header dt-cell--sticky dt-cell--sticky-top"><div class="dt-cell__content" style="width: 32px;"><input type="checkbox"></div></div><div class="dt-cell dt-cell--col-1 dt-cell--header dt-cell--sticky dt-cell--sticky-top dt-cell--sticky-last"><div class="dt-cell__content" style="width: 40px;"><span class="sort-indicator"> </span></div></div>${cols.map((c, i) => `<div class="dt-cell dt-cell--col-${i + 2} dt-cell--header"><div class="dt-cell__content" style="width: ${c.w}px;${c.right ? ' text-align: right;' : ''}">${lbl('c_' + c.f, c.label, c.ar)}<span class="sort-indicator"> </span><span class="dt-cell__resize-handle"></span><div class="dt-dropdown"><div class="dt-dropdown__toggle">${I('ChevronDown')}</div></div></div></div>`).join('')}</div>`;
  const body = rows.map((r, ri) => `<div class="dt-row dt-row-${ri} vrow"><div class="dt-cell dt-cell--col-0 dt-cell--sticky"><div class="dt-cell__content" style="width: 32px;"><input type="checkbox"></div></div><div class="dt-cell dt-cell--col-1 dt-cell--sticky dt-cell--sticky-last"><div class="dt-cell__content" style="width: 40px;">${T('ri_' + ri, String(ri + 1))}</div></div>${cols.map((c, i) => `<div class="dt-cell dt-cell--col-${i + 2}"><div class="dt-cell__content" style="width: ${c.w}px;">${r[i] === null ? '' : c.money ? `<div style="text-align: right">${M(`rv_${c.f}_${ri}`, r[i].amount, r[i].ar)}</div>` : c.right ? `<div style="text-align: right">${T(`rv_${c.f}_${ri}`, r[i].en, r[i].ar)}</div>` : T(`rv_${c.f}_${ri}`, r[i].en, r[i].ar)}</div></div>`).join('')}</div>`).join('');
  return `<div class="layout-main-section-wrapper report-view"><div class="layout-main-section layout-main-list" data-ui="ury-desk-screen-report-body"><div class="frappe-list"><div class="result"><div class="datatable-wrapper"><div class="datatable" dir="ltr"><div class="dt-header"><div>${hdr}</div></div><div class="dt-scrollable">${body}</div><div class="dt-footer"></div></div></div></div></div></div></div>`;
};
const reportPage = (r) => {
  const filters = r === 'todays-sales'
    ? repFilter('branch', 'Branch', 'فرع', 'Link', { en: 'Downtown', ar: 'وسط المدينة' })
    : repFilter('branch', 'Branch', 'فرع', 'Link', { en: 'Downtown', ar: 'وسط المدينة' }) + repFilter('start_date', 'From Date', 'من تاريخ', 'Date', { en: '2026-11-15', ar: '15-11-2026' }) + repFilter('end_date', 'To Date', 'إلى تاريخ', 'Date', { en: '2026-11-21', ar: '21-11-2026' });
  const bar = `<div class="page-form flex list-page-form report-filters"><div class="standard-filter-section flex">${filters}</div></div>`;
  let table;
  if (r === 'todays-sales') {
    const c = [{ f: 'today', label: 'Today', ar: 'اليوم', w: 120 }, { f: 'total_invoices', label: 'Total Invoices', ar: 'عدد الفواتير', w: 130, right: true }, { f: 'item_total', label: 'Item Total', ar: 'إجمالي الأصناف', w: 140, money: true }, { f: 'taxes', label: 'Total Taxes and Charges', ar: 'إجمالي الضرائب والرسوم', w: 190, money: true }, { f: 'grand_total', label: 'Grand Total', ar: 'المجموع الإجمالي', w: 150, money: true }, { f: 'round_off', label: 'Round Off', ar: 'تقريب', w: 110, money: true }, { f: 'cash_discounts', label: 'Cash Discounts', ar: 'خصومات نقدية', w: 150, money: true }];
    table = datatable(c, [[{ en: 'Saturday', ar: 'السبت' }, { en: '42', ar: '42' }, { amount: 4812.5, ar: 'د.إ 4,812.50' }, { amount: 240.63, ar: 'د.إ 240.63' }, { amount: 5053.13, ar: 'د.إ 5,053.13' }, { amount: 0.13, ar: 'د.إ 0.13' }, { amount: 0, ar: 'د.إ 0.00' }]]);
  } else {
    const c = [{ f: 'Date', label: 'Date', ar: 'تاريخ', w: 110 }, { f: 'Total Revenue', label: 'Total Revenue', ar: 'إجمالي الإيرادات', w: 150, money: true }, { f: 'No Of Seats', label: 'No Of Seats', ar: 'عدد المقاعد', w: 110, right: true }, { f: 'Working hours', label: 'Working hours', ar: 'ساعات العمل', w: 150 }, { f: 'RevPASH', label: 'RevPASH', ar: 'RevPASH', w: 120, money: true }, { f: 'Total RevPASH', label: 'Total RevPASH', ar: 'إجمالي RevPASH', w: 150, money: true }];
    const d = [['2026-11-21', '21-11-2026'], ['2026-11-20', '20-11-2026'], ['2026-11-19', '19-11-2026'], ['2026-11-18', '18-11-2026'], ['2026-11-17', '17-11-2026'], ['2026-11-16', '16-11-2026'], ['2026-11-15', '15-11-2026']];
    const rev = [[5053.13, 'د.إ 5,053.13', '11.5', 10.97, 'د.إ 10.97'], [6120, 'د.إ 6,120.00', '12', 12.75, 'د.إ 12.75'], [5480.25, 'د.إ 5,480.25', '11', 12.46, 'د.إ 12.46'], [4390, 'د.إ 4,390.00', '10.5', 10.45, 'د.إ 10.45'], [4875.5, 'د.إ 4,875.50', '11', 11.08, 'د.إ 11.08'], [5210, 'د.إ 5,210.00', '11.5', 11.33, 'د.إ 11.33'], [7015.75, 'د.إ 7,015.75', '12.5', 14.03, 'د.إ 14.03']];
    table = datatable(c, d.map((x, i) => [{ en: x[0], ar: x[1] }, { amount: rev[i][0], ar: rev[i][1] }, { en: '40', ar: '40' }, { en: rev[i][2], ar: rev[i][2] }, { amount: rev[i][3], ar: rev[i][4] }, i === 6 ? { amount: 11.78, ar: 'د.إ 11.78' } : null]));
  }
  return `<div class="layout-main-section-wrapper report-view">${bar}</div>${table}`;
};

// ---- specs -------------------------------------------------------------------------------------------------------------------------------------
const ctxCrumb = (a, b) => [T('c_' + a, a, b.ar)];
const base = { group: 'ury-desk', static: true, dsf: 2, width: 1440, height: 900, css: CSS, darkTheme: 'dark', modes: ['light', 'dark', 'rtl'], canvas: 'var(--bg-color)',
  naDefault: 'pointer UI: hover/focus are shown as variants where the source styles them',
  na: { disabled: 'not applicable: the screen composes captured list/form/report markup, read-only fields are shown inside the form', error: 'not applicable: no validation message is captured on this screen', loading: 'not applicable: the mock shows loaded data', empty: 'not applicable: the mock shows loaded data' } };
const mk = (id, name, render, variants, describe) => {
  const R = (v, p) => { CURID = id; return render(v, p); };
  const { slots, rtl } = collect(R, variants);
  return { ...base, id, name, slots, rtlValues: rtl, props: {}, render: R, variants, describe };
};
const wrapRender = (fn) => (v, p) => fn(p || {});

export const specs = [
  mk('ury-desk-screen-order-list', 'URY desk order list', wrapRender((p) => {
    if (p.doctype === 'URY Order') return page('Orders', 'list', [T('crumb_uo', 'URY Order', 'طلب')], uryOrderList());
    return page('Orders', 'list', [T('crumb_pi', 'POS Invoice', 'فاتورة نقطة البيع')], posInvoiceList());
  }), {
    'ury-order': { props: { doctype: 'URY Order' }, describe: 'URY Order list: ID subject with Customer Name and Pax (in_list_view) and the ID and Customer Name quick filters.' },
  }, ['URY desk Orders page as the POS Invoice list: 30px rows, status indicator badges from pos_invoice_list.js (Paid, Consolidated, Draft, Unpaid, Partly Paid), Customer / Company / Grand Total columns, quick filters from the doctype json.',
    'Starting frame for order screens in the URY v16 desk; the variant shows the URY Order doctype list.']),
  mk('ury-desk-screen-kot-list', 'URY desk Kitchen Orders list', wrapRender((p) => page('Kitchen Orders', 'list', [T('crumb_kot', 'URY KOT', 'أمر المطبخ')], kotList(p.served))), {
    served: { props: { served: true }, describe: 'Order Status filter on Served: only served KOTs remain.' },
  }, ['URY KOT list (workspace shortcut "Kitchen Orders"): ID subject, Order Status badge (Ready For Prepare, Served), Invoice and Date columns, Order Status quick filter.',
    'Use for kitchen-order oversight scenes in the desk.']),
  mk('ury-desk-screen-order-form', 'URY desk order form', wrapRender((p) => page('Orders', 'form', [T('crumb_uo', 'URY Order', 'طلب'), T('crumb_ord', 'URY-ORD-0038', 'URY-ORD-0038')], orderForm(p.tab || 'order_tab'), p.unsaved ? ['red', T('pill_ns', 'Not Saved', 'لم يتم الحفظ')] : null)), {
    customer: { props: { tab: 'customer_tab' }, describe: 'Customer tab: Customer Name and Pax (both required) and the Favorite Item section.' },
    unsaved: { props: { unsaved: true }, describe: 'Unsaved edits: the red Not Saved indicator pill after the breadcrumb.' },
  }, ['URY Order form on the Order tab: Add Item, Grand Total (read only), Additional Details, the Items field-table (URY Order Item: Item, Item Name, Qty, Rate, Comments) and the Waiter / POS Profile / Cashier read-only links.',
    'The URY Printer Settings child table is a field of URY Production Unit and URY Room, not of URY Order, so it is not drawn here.']),
  mk('ury-desk-screen-table-form', 'URY desk table form', wrapRender((p) => page('Tables', 'form', [T('crumb_ut', 'URY Table', 'طاولة'), T('crumb_t1', 'T1', 'T1')], tableForm(p.tab || 'table_info_tab'), p.unsaved ? ['red', T('pill_ns', 'Not Saved', 'لم يتم الحفظ')] : null)), {
    'active-info': { props: { tab: 'active_info_tab' }, describe: 'Active Info tab: Occupied, Latest Invoice Time, Table Shape, Merged With and the Layout Position section.' },
    unsaved: { props: { unsaved: true }, describe: 'Unsaved edits: the red Not Saved indicator pill after the breadcrumb.' },
  }, ['URY Table form on the Table Info tab: No of Seats, Minimum Seating, Table Shape, Restaurant, Restaurant Room, Branch, Is Take Away and the Layout Position section.',
    'Use for floor-setup scenes (Setup > Tables).']),
  mk('ury-desk-screen-report', 'URY desk report', wrapRender((p) => {
    const r = p.report || 'todays-sales';
    return page(r === 'todays-sales' ? "Today's Sales" : 'RevPASH Report', 'report', [T('crumb_' + r, r === 'todays-sales' ? "Today's Sales" : 'RevPASH Report', r === 'todays-sales' ? 'مبيعات اليوم' : 'تقرير RevPASH')], reportPage(r));
  }), {
    revpash: { props: { report: 'revpash' }, describe: 'RevPASH Report: Branch, From Date and To Date filters; Date, Total Revenue, No Of Seats, Working hours, RevPASH and Total RevPASH columns from revpash_report.py.' },
  }, ["Today's Sales query report (ury/report/today's_sales): Branch filter and the seven query columns (Today, Total Invoices, Item Total, Total Taxes and Charges, Grand Total, Round Off, Cash Discounts) in the Frappe datatable.",
    'Use for sales-reporting scenes; the variant shows the script report RevPASH.']),
];
