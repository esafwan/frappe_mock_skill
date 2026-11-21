// URY v16 admin Reports markup helpers.
// Sources: frontend/src/pages/Reports/{reportsRegistry.ts,TodaysSales.tsx,DailyPnl.tsx,ItemWiseSales.tsx,DaywiseInvoices.tsx},
// packages/ui/src/components/{data-table,page-header,kpi-strip,card,alert,date-picker}.tsx, frontend/src/components/common/{MultiSelect,SearchableSelect}.tsx.
import { ic, money, screen } from '../lib.mjs';
import { adminLayout, shellSlots, shellRtl, REPORT_GROUPS } from './shell.mjs';

// lucide-react 0.525 paths (ISC) for icons beyond ../icons.mjs
const EXTRA = {
  Sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  CalendarDays: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/>',
  PieChart: '<path d="M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"/><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/>',
  Ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  Package: '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>',
  UserPlus: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>',
  Repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
  UserCog: '<path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m14.305 16.53.923-.382"/><path d="m15.228 13.852-.923-.383"/><path d="m16.852 12.228-.383-.923"/><path d="m16.852 17.772-.383.924"/><path d="m19.148 12.228.383-.923"/><path d="m19.53 18.696-.382-.924"/><path d="m20.772 13.852.924-.383"/><path d="m20.772 16.148.924.383"/><circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/>',
  Factory: '<path d="M12 16h.01"/><path d="M16 16h.01"/><path d="M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"/><path d="M8 16h.01"/>',
  IndianRupee: '<path d="M6 3h12"/><path d="M6 8h12"/><path d="m6 13 8.5 8"/><path d="M6 13h3"/><path d="M9 13c6.667 0 6.667-10 0-10"/>',
  ListFilter: '<path d="M3 6h18"/><path d="M7 12h10"/><path d="M10 18h4"/>',

};
const I = (n, s = 16, c = '') => ic(n, s, c, EXTRA);
const u = (id) => `data-ui="${id}"`;

// ---------- slot registry: key -> [English/sample slot value, Arabic/rtl slot value] ----------
const RS = {};
export const t = (k, en, ar = en) => { RS[k] = [en, ar]; return `{{${k}}}`; };
const f2 = (n) => Math.abs(Number(n)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const enMoney = (n) => `${n < 0 ? '-' : ''}AED ${f2(n)}`;
const arMoney = (n) => `${n < 0 ? '-' : ''}${f2(n)} د.إ`;
export const m = (k, n) => { RS[k] = [{ ...money(Math.abs(n)), amount: n, sample: enMoney(n) }, { ...money(Math.abs(n)), amount: n, sample: arMoney(n) }]; return `{{${k}}}`; };
const keysIn = (html) => [...new Set([...String(html).matchAll(/\{\{([A-Za-z0-9_]+)\}\}/g)].map((x) => x[1]))].filter((k) => k in RS);
/** slots / rtlValues for exactly the {{keys}} in the rendered html strings (own copy plus the shell's). */
export const slotsOf = (...h) => ({ ...Object.fromEntries(keysIn(h.join('')).map((k) => [k, RS[k][0]])), ...shellSlots(h.join('')) });
export const rtlOf = (...h) => ({ ...Object.fromEntries(keysIn(h.join('')).map((k) => [k, RS[k][1]])), ...shellRtl(h.join('')) });
const num = (k, en, ar = en) => `<span class="u-num">${t(k, en, ar)}</span>`;
const cur = (k, n) => `<span class="u-num">${m(k, n)}</span>`;

// ---------- DataTable (packages/ui data-table.tsx) ----------
/** cols: [{h:[en,ar], end?, kind:'text'|'num'|'money'}]; rows: arrays of cells (text/num: [en,ar] | string, money: number); footer: same shape as a row. */
export function dataTable(o) {
  const { p, id = 'ury-admin-data-table', cols, rows = [], footer, state, hover, tones = [] } = o;
  const head = cols.map((c, i) => `<th class="uar-th${c.end ? ' is-end' : ''}" ${u(id + '.th-' + i)}>${t(`${p}_h${i}`, ...c.h)}</th>`).join('');
  const cell = (c, key, v) => {
    const e = c.end ? ' is-end' : '';
    const [en, ar] = Array.isArray(v) ? v : [v, v];
    const inner = c.kind === 'money' ? cur(key, v) : c.kind === 'num' ? num(key, en, ar) : t(key, en, ar);
    return `<td class="uar-td${e}">${inner}</td>`;
  };
  let body;
  if (state === 'loading') body = `<tr><td colspan="${cols.length}" class="uar-td-msg" ${u(id + '.loading')}>${t(p + '_loading', 'Loading…')}</td></tr>`;
  else if (state === 'empty') body = `<tr><td colspan="${cols.length}" class="uar-td-msg" ${u(id + '.empty')}>${t(p + '_empty', 'No results found.')}</td></tr>`;
  else body = rows.map((r, ri) => `<tr class="uar-tr${tones[ri] ? ' is-' + tones[ri] : ''}${hover === ri ? ' is-hover' : ''}" ${u(id + '.row-' + ri)}>${r.map((v, ci) => cell(cols[ci], `${p}_${ri}_${ci}`, v)).join('')}</tr>`).join('');
  const foot = footer && !state ? `<tfoot><tr class="uar-tf" ${u(id + '.footer')}>${footer.map((v, ci) => cell(cols[ci], `${p}_f${ci}`, v)).join('')}</tr></tfoot>` : '';
  return `<div class="uar-dt" ${u(id)}><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody>${foot}</table></div>`;
}

// ---------- sample data ----------
export const SERVICE_COLS = [
  { h: ['Order Type', 'نوع الطلب'], kind: 'text' },
  { h: ['# Orders', '# Orders'], kind: 'num', end: true },
  { h: ['Revenue', 'الإيرادات'], kind: 'money', end: true },
  { h: ['% of Total', '% of Total'], kind: 'num', end: true },
];
const SVC = [[['Dine In', 'في المطعم'], 150, 10140.5], [['Take Away', 'سفري'], 98, 5760], [['Delivery', 'تسليم'], 64, 2621.5]];
const GRAND_TOTAL = 18522; // = ITEM_TOTAL + TAXES + ROUND_OFF
const ITEM_TOTAL = 17640, TAXES = 882, ROUND_OFF = 0;
const DAY_TOTAL = GRAND_TOTAL;
export const serviceRows = () => SVC.map(([n, c, r]) => [n, String(c), r, `${(r / DAY_TOTAL * 100).toFixed(1)}%`]);
export const serviceFooter = () => [['Total', 'الإجمالي'], String(SVC.reduce((a, x) => a + x[1], 0)), SVC.reduce((a, x) => a + x[2], 0), '100.0%'];

export const ITEM_COLS = [
  { h: ['Item', 'الصنف'], kind: 'text' }, { h: ['Group', 'المجموعة'], kind: 'text' },
  { h: ['Qty', 'الكمية'], kind: 'num', end: true }, { h: ['Amount', 'المبلغ'], kind: 'money', end: true },
  { h: ['Avg Price', 'متوسط السعر'], kind: 'money', end: true }, { h: ['% of Total', '% of Total'], kind: 'num', end: true },
];
const ITEMS = [
  [['Chicken Shawarma', 'Chicken Shawarma'], ['Mains', 'الأطباق الرئيسية'], 64, 30], [['Caesar Salad', 'Caesar Salad'], ['Salads', 'السلطات'], 41, 34],
  [['Cappuccino', 'Cappuccino'], ['Beverages', 'المشروبات'], 86, 16], [['Falafel Wrap', 'Falafel Wrap'], ['Mains', 'الأطباق الرئيسية'], 58, 22],
  [['Hummus Plate', 'Hummus Plate'], ['Starters', 'المقبلات'], 37, 26], [['Kunafa', 'Kunafa'], ['Desserts', 'الحلويات'], 29, 28],
  [['Mint Lemonade', 'Mint Lemonade'], ['Beverages', 'المشروبات'], 52, 14], [['Karak Tea', 'Karak Tea'], ['Beverages', 'المشروبات'], 74, 8],
];
export const itemRows = () => ITEMS.map(([n, g, q, pr]) => [n, g, String(q), q * pr, pr, `${(q * pr / ITEM_TOTAL * 100).toFixed(1)}%`]);
export const itemFooter = () => {
  const q = ITEMS.reduce((a, x) => a + x[2], 0), a = ITEMS.reduce((s, x) => s + x[2] * x[3], 0);
  return [['Page total', 'إجمالي الصفحة'], ['—', '—'], String(q), a, a / q, `${(a / ITEM_TOTAL * 100).toFixed(1)}%`];
};

// ---------- PageHeader (page-header.tsx) ----------
export const pageHeader = (id, title, desc, actions = '') => `<div class="uar-ph" ${u(id)}><div class="uar-ph__row"><div class="uar-ph__t"><h1 class="uar-ph__h" ${u(id + '.title')}>${title}</h1><p class="uar-ph__d" ${u(id + '.desc')}>${desc}</p></div>${actions ? `<div class="uar-ph__a" ${u(id + '.actions')}>${actions}</div>` : ''}</div></div>`;

// ---------- KpiStrip (kpi-strip.tsx) ----------
export const kpiStrip = (id, items) => `<div class="u-kpi-strip" ${u(id)}>${items.map((x, i) => `<div class="u-kpi" ${u(id + '.kpi-' + i)}><div class="u-kpi-label">${x.label}</div><div class="u-kpi-value${x.tone ? ' u-kpi-value--' + x.tone : ''}">${x.value}</div>${x.hint ? `<div class="u-kpi-hint">${x.hint}</div>` : ''}</div>`).join('')}</div>`;

// ---------- Filter bar: UryDateRangePicker trigger + SearchableSelect + MultiSelect ----------
const chev = (c = '') => I('ChevronDown', 16, 'uar-chev' + (c ? ' ' + c : ''));
export const dateTrigger = (id, label, hover) => `<button type="button" class="uar-trig${hover ? ' is-hover' : ''}" ${u(id)}><span>${label}</span>${chev()}</button>`;
export const selectBox = (id, w, label, hover) => `<div class="uar-sel" style="width:${w}px" ${u(id)}><div class="uar-inp${hover ? ' is-hover' : ''}">${label}</div><span class="uar-sel__ch">${chev()}</span></div>`;
export const multiSelect = (id, chips, placeholder) => `<div class="uar-ms" ${u(id)}><div class="uar-ms__v">${chips.length ? chips.map((c, i) => `<span class="uar-chip" ${u(id + '.chip-' + i)}><span>${c}</span><span class="uar-chip__x">${I('X', 12)}</span></span>`).join('') : `<span class="uar-ms__ph">${placeholder}</span>`}</div>${I('ChevronDown', 16, 'uar-ms__ch')}</div>`;
export function filterBar(o = {}) {
  const id = o.id || 'ury-admin-filter-bar';
  const range = t('fb_range', 'Nov 21, 2026 - Nov 21, 2026', '21 نوفمبر 2026 - 21 نوفمبر 2026');
  const branch = o.branchAll ? '{{sm_all_branches}}' : '{{branch}}';
  const chips = o.multiEmpty ? [] : [t('fb_chip0', 'Dine In', 'في المطعم'), t('fb_chip1', 'Take Away', 'سفري')];
  return `<div class="uar-fbar" ${u(id)}><div class="uar-fbar__l">${dateTrigger(id + '.date', range, o.hover === 'date')}${selectBox(id + '.branch', 192, branch, o.hover === 'branch')}${multiSelect(id + '.multi', chips, t('fb_ph', 'Select', 'حدد'))}</div></div>`;
}

// ---------- pagination (DaywiseInvoices.tsx / ItemWiseSales.tsx) ----------
export const pagination = (id) => `<div class="uar-pg" ${u(id)}><span class="uar-pg__t">${t('pg_page', 'Page 1 of 3', 'صفحة 1 من 3')}</span><div class="uar-pg__b"><button type="button" class="u-btn u-btn--outline is-disabled" ${u(id + '.prev')}>${I('ChevronLeft', 16, 'uar-flipx')}<span>${t('pg_prev', 'Prev', 'السابق')}</span></button><button type="button" class="u-btn u-btn--outline" ${u(id + '.next')}><span>${t('pg_next', 'Next', 'التالي')}</span>${I('ChevronRight', 16, 'uar-flipx')}</button></div></div>`;

// ---------- screens ----------
const HOME_CRUMB = `<div class="ua-crumbs" ${u('ury-admin-header.breadcrumbs')}><span class="ua-crumbs__l">{{g_reports}}</span></div>`;
const reportsLayout = (id, route, main) => {
  let html = adminLayout(route, `<div class="uar uar-page">${main}</div>`, { sidebar: { reports: true, route } });
  // /reports itself has no leaf label, so the shell draws no crumb; add the group crumb for consistency with the report screens
  if (route === '/reports') html = html.replace(/(<div class="ua-divider"[^>]*><\/div>)/, `$1${HOME_CRUMB}`);
  return screen(1440, 900, html, id);
};

export function reportsHome(p = {}) {
  const groups = REPORT_GROUPS.map((g) => {
    const cards = g.items.map(([path, key, icon], i) => `<a class="uar-lc${p.hover === path ? ' is-hover' : ''}" ${u('ury-admin-screen-reports-home.card-' + path)}><span class="uar-lc__ic">${I(icon, 16)}</span><span class="uar-lc__t">{{${key}}}</span>${I('ChevronRight', 16, 'uar-lc__go uar-flipx')}</a>`).join('');
    return `<section class="uar-sec" ${u('ury-admin-screen-reports-home.group-' + g.key)}><h2 class="uar-sec__h"><span>{{${g.key}}}</span><span class="uar-sec__n">${num('rh_n_' + g.key, String(g.items.length))}</span></h2><div class="uar-lcs">${cards}</div></section>`;
  }).join('');
  return reportsLayout('ury-admin-screen-reports-home', '/reports', pageHeader('ury-admin-screen-reports-home.header', '{{g_reports}}', t('rh_desc', 'Select a report from the sidebar.', 'اختر تقريراً من الشريط الجانبي.')) + groups);
}

export function todaysSales(p = {}) {
  const id = 'ury-admin-screen-report';
  const upd = `<span class="uar-upd" ${u(id + '.updated')}>${t('ts_updated', 'Updated', 'تم التحديث')} ${num('ts_time', '10:42:08 AM', '10:42:08 ص')}</span>`;
  const head = pageHeader(id + '.header', '{{r_today}}', t('ts_desc', 'Friday, 2026-11-21', 'الجمعة، 2026-11-21'), upd);
  const fbar = filterBar({ id: id + '.filter-bar', hover: p.hover });
  const kpis = kpiStrip(id + '.kpis', [
    { label: t('k_inv', 'Total Invoices', 'عدد الفواتير'), value: num('k_inv_v', '312') },
    { label: t('k_item', 'Item Total', 'إجمالي الأصناف'), value: cur('k_item_v', ITEM_TOTAL) },
    { label: t('k_tax', 'Total Taxes & Charges', 'إجمالي الضرائب والرسوم'), value: cur('k_tax_v', TAXES) },
    { label: t('k_grand', 'Grand Total', 'المجموع الإجمالي'), value: cur('k_grand_v', GRAND_TOTAL), tone: 'success' },
    { label: t('k_round', 'Round Off', 'تقريب'), value: cur('k_round_v', ROUND_OFF) },
    { label: t('k_disc', 'Cash Discounts', 'خصومات نقدية'), value: cur('k_disc_v', -215.5), hint: t('k_disc_h', 'given away') },
  ]);
  let body;
  if (p.state === 'loading') body = `<div class="uar-load" ${u(id + '.loading')}>${t('ts_loading', 'Loading…', 'جارٍ التحميل…')}</div>`;
  else {
    const empty = p.state === 'empty';
    const tbl = dataTable({ p: 'ti', id: id + '.table', cols: ITEM_COLS, rows: empty ? [] : itemRows(), footer: empty ? undefined : itemFooter(), state: empty ? 'empty' : undefined, hover: p.rowHover });
    body = kpis + `<div><h2 class="uar-h2" ${u(id + '.section')}>${t('ts_top', 'Top Selling Items Today', 'الأصناف الأكثر مبيعاً اليوم')}</h2>${tbl}</div>` + (empty ? '' : pagination(id + '.pagination'));
  }
  return reportsLayout(id, '/reports/today-sales', head + fbar + body);
}

// ---------- Daily P&L (DailyPnl.tsx WaterfallRow) ----------
const PCT = (a, g) => `(${(a / g * 100).toFixed(1)}%)`;
function pnlData(ds) {
  if (ds === 'L') return { gross: 9860, disc: 140, tax: 460, cogs: 5980, disp: 360, direct: [['Gas & Fuel', 'الغاز والوقود', 1100], ['Packaging', 'التغليف', 2000]], emp: [['Kitchen Staff', 'طاقم المطبخ', 2100], ['Service Staff', 'طاقم الخدمة', 1800]], ind: [['Rent', 'الإيجار', 3200], ['Utilities', 'المرافق', 1150]], dep: 640, other: 580 };
  return { gross: GRAND_TOTAL, disc: 215.5, tax: TAXES, cogs: 6420, disp: 310, direct: [['Gas & Fuel', 'الغاز والوقود', 620], ['Packaging', 'التغليف', 860]], emp: [['Kitchen Staff', 'طاقم المطبخ', 2100], ['Service Staff', 'طاقم الخدمة', 1800]], ind: [['Rent', 'الإيجار', 3200], ['Utilities', 'المرافق', 1150]], dep: 640, other: 580 };
}
export function dailyPnl(p = {}) {
  const id = 'ury-admin-screen-daily-pnl';
  const ds = p.profit ? '' : 'L';
  const d = pnlData(ds), G = d.gross;
  const net = G - d.disc - d.tax, sumD = d.direct.reduce((a, x) => a + x[2], 0), sumE = d.emp.reduce((a, x) => a + x[2], 0);
  const gp = net - d.cogs - d.disp - sumD, ti = d.ind.reduce((a, x) => a + x[2], 0) + d.dep + d.other, np = gp - sumE - ti;
  const sel = (sid, w, label) => selectBox(id + '.' + sid, w, label);
  const actions = sel('branch', 192, '{{branch}}') + sel('date', 160, `<span class="u-num">${t('pl_date', '2026-11-21')}</span>`);
  const head = pageHeader(id + '.header', '{{r_pnl}}', t('pl_desc', 'Full daily profit & loss breakdown', 'تفصيل كامل للأرباح والخسائر اليومية'), actions);
  if (p.state === 'loading') return reportsLayout(id, '/reports/daily-pnl', head + `<div class="uar-load" ${u(id + '.loading')}>${t('ts_loading', 'Loading…', 'جارٍ التحميل…')}</div>`);
  if (p.state === 'empty') return reportsLayout(id, '/reports/daily-pnl', head + `<div class="uar-alert" role="alert" ${u(id + '.alert')}>${I('AlertTriangle', 20)}<div class="uar-alert__b"><p class="uar-alert__t">${t('pl_none', 'No submitted Daily P&L exists for this branch/date. It must be created and submitted in Desk first.', 'لا توجد أرباح وخسائر يومية معتمدة لهذا الفرع والتاريخ. يجب إنشاؤها واعتمادها من سطح المكتب أولاً.')}</p></div></div>`);
  const k = ds; // dataset prefix so the loss day carries its own sample numbers
  const tone = (v) => (v >= 0 ? 'success' : 'danger');
  const kv = (key, v) => `<span class="uar-kv">${cur(key, v)}<span class="u-num uar-kv__p">${t(key + 'p', PCT(v, G))}</span></span>`;
  const kpis = kpiStrip(id + '.kpis', [
    { label: t('pl_k_gs', 'Gross Sales', 'إجمالي المبيعات'), value: cur(`pl${k}_kgs`, G) },
    { label: t('pl_k_ns', 'Net Sales', 'صافي المبيعات'), value: cur(`pl${k}_kns`, net) },
    { label: t('pl_k_gp', 'Gross Profit', 'إجمالي الربح'), value: kv(`pl${k}_kgp`, gp), tone: tone(gp) },
    { label: t('pl_k_np', 'Net Profit', 'صافي الربح'), value: kv(`pl${k}_knp`, np), tone: tone(np) },
  ]);
  let n = 0;
  const row = (lKey, lEn, lAr, amt, variant = 'line', signed = false) => {
    n += 1;
    const i = n;
    const lab = typeof lKey === 'string' && lEn ? t(lKey, lEn, lAr) : lKey;
    const sub = variant === 'subtotal' || variant === 'highlight';
    const tn = signed ? (amt < 0 ? 'neg' : 'pos') : '';
    const sign = signed ? `<span class="uar-sign" aria-hidden="true">${amt < 0 ? '−' : '+'}</span>` : '';
    return `<div class="uar-wf is-${variant}${tn ? ' is-' + tn : ''}" ${u(id + '.row-' + i)}><span class="uar-wf__l${sub ? ' is-sub' : ''}">${lab}</span><span class="uar-wf__v${sub ? ' is-sub' : ''}">${sign}${cur(`pl${k}_a${i}`, signed ? Math.abs(amt) : amt)}<span class="uar-wf__p u-num">${t(`pl${k}_p${i}`, PCT(amt, G))}</span></span></div>`;
  };
  const nested = (arr) => arr.map(([en, ar, a]) => { n += 1; const i = n; return `<div class="uar-wf is-nested" ${u(id + '.row-' + i)}><span class="uar-wf__l">${t(`pl${k}_nl${i}`, en, ar)}</span><span class="uar-wf__v">${cur(`pl${k}_a${i}`, a)}<span class="uar-wf__p u-num">${t(`pl${k}_p${i}`, PCT(a, G))}</span></span></div>`; }).join('');
  const rows = [
    row('pl_l_gs', 'Gross Sales', 'إجمالي المبيعات', G),
    row('pl_l_disc', 'Discounts & Round Offs', 'الخصومات والتقريب', d.disc),
    row('pl_l_tax', 'Tax', 'ضريبة', d.tax),
    row('pl_l_ns', 'Net Sales', 'صافي المبيعات', net, 'highlight'),
    row('pl_l_cogs', 'Cost of Goods Sold', 'تكلفة البضاعة المباعة', d.cogs),
    row('pl_l_disp', 'Disposables', 'المستهلكات', d.disp),
    row('pl_l_dir', 'Direct Expenses', 'النفقات المباشرة', sumD, 'subtotal'),
    nested(d.direct),
    row('pl_l_gp', 'Gross Profit/Loss', 'إجمالي الربح/الخسارة', gp, 'highlight', true),
    row('pl_l_emp', 'Employee Cost', 'تكلفة الموظفين', sumE, 'subtotal'),
    nested(d.emp),
    d.ind.map(([en, ar, a]) => row(`pl${k}_il${n + 1}`, en, ar, a)).join(''),
    row('pl_l_dep', 'Depreciation', 'إهلاك', d.dep),
    row('pl_l_oth', 'Other Expenses', 'مصروفات أخرى', d.other),
    row('pl_l_ti', 'Total Indirect Expenses', 'إجمالي المصروفات غير المباشرة', ti, 'highlight'),
    row('pl_l_np', 'Net Profit/Loss', 'صافي الربح (الخسارة)', np, 'highlight', true),
  ].join('');
  const card = `<div class="uar-card" ${u(id + '.statement')}><div class="uar-card__h"><h3 class="uar-card__t">${t('pl_card_t', 'P&L Statement', 'بيان الأرباح والخسائر')}</h3><p class="uar-card__d">${t('pl_card_d', 'Read top to bottom — each subtotal is a running reduction of the one above it.', 'يُقرأ من الأعلى إلى الأسفل، وكل مجموع فرعي يخصم من الذي قبله.')}</p></div><div class="uar-card__c">${rows}</div></div>`;
  return reportsLayout(id, '/reports/daily-pnl', head + kpis + card);
}
