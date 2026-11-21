// ury-mosaic full screens: production dashboard, KOT board, empty board, delayed board (1440x900).
// Sources: mosaic/src/{App.vue,components/production/ProductionDashboard.vue,components/kot.vue,locales/ar.json}
import { screen } from '../lib.mjs';
import { header, productionCard, kotTicket } from './components.mjs';

const CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-mosaic-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/mosaic.css', 'ury-v16/components/mosaic-screens.css'];
const BASE = { group: 'ury-mosaic', static: true, width: 1440, height: 900, dsf: 2, canvas: 'var(--bg)', css: CSS, darkTheme: '.dark', modes: ['light', 'rtl'], props: {},
  na: { disabled: 'not applicable: this screen has no distinct disabled variant', dark: 'na: mosaic/src/index.css defines one light palette (:root only) and no dark: classes', error: 'not applicable: this screen has no distinct error variant', loading: 'not applicable: this screen has no distinct loading variant', empty: 'not applicable: this screen has no distinct empty variant' },
  naDefault: 'pointer UI: hover/focus are shown as variants where the source styles them' };
const D = (what, when) => [what, when + ' Modes: light and rtl only; dark is not applicable (mosaic defines one light palette).'];

// per-instance slot lookup: key_N when declared, else key
const PER = /^(table_name|waiter|order_no|timer|item_\d|qty_\d|type_label|prod_title|n_active|n_served|n_total)$/;
const kv = (v, n) => new Proxy({}, { get: (_, k) => (PER.test(String(k)) ? v[`${String(k)}_${n}`] ?? v[k] : v[k]) });
const rekey = (html, from, to) => html.split(`data-ui="${from}`).join(`data-ui="${to}`);

// ---- shared slots (copy from mosaic ar.json where present; fixed UI labels without an entry are translated here) ----
const hdrSlots = { logo_alt: 'Logo', user_name: 'Sara Ahmed', user_email: 'sara@example.com', switch_dashboard: 'Switch to Dashboard', logout: 'Logout',
  c_all: 'All Companies', c_1: 'Gulf Hospitality', c_2: 'Harbour Dining', c_3: 'Palm Cafe Group', c_heading: 'Select Active Company', c_sel0: 'All Companies',
  b_all: 'All Branches', b_1: 'Marina Branch', b_2: 'Downtown Branch', b_3: 'Airport Branch', b_heading: 'Select Active Branch', b_sel0: 'All Branches' };
const hdrAr = { logo_alt: 'الشعار', user_name: 'سارة أحمد', switch_dashboard: 'التبديل إلى لوحة المعلومات', logout: 'تسجيل الخروج', c_all: 'كل الشركات', c_sel0: 'كل الشركات', b_all: 'كل الفروع', b_sel0: 'كل الفروع', c_heading: 'اختر الشركة النشط', b_heading: 'اختر الفرع النشط' };

const ITEMS = [['Chicken Biryani', 'برياني دجاج'], ['Masala Dosa', 'دوسا ماسالا'], ['Fresh Lime Soda', 'عصير ليمون طازج'], ['Paneer Tikka', 'بانير تيكا'], ['Garlic Naan', 'نان بالثوم'], ['Mango Lassi', 'لاسي المانجو'], ['Mutton Curry', 'كاري لحم الضأن'], ['Veg Samosa', 'سمبوسة خضار'], ['Filter Coffee', 'قهوة مصفاة']];
const WAITERS = [['Omar', 'عمر'], ['Layla', 'ليلى'], ['Yusuf', 'يوسف'], ['Huda', 'هدى']];
const kotSlots = { table_label: 'Table', takeaway_label: 'Takeaway', order_label: 'Order', st_queued: 'Queued', st_preparing: 'Preparing', st_ready: 'Ready', st_served: 'Served',
  type_label: 'Cancelled', old_qty: 'Old Qty = 3', disp_label: 'Disposition:', return_label: 'Return to Stock', waste_label: 'Mark as Wasted', disp_done: 'Disposition: Returned to Stock',
  dup_note: 'Duplicate KOT ( CHECK WITH CAPTAIN )', kot_comment: 'No onions please', item_comment: 'Extra spicy',
  agg_label: 'Aggregator', agg_name: 'Talabat', agg_id_label: 'Aggregator ID', agg_id: '48213907', serve_label: 'Serve', confirm_label: 'Confirm' };
const kotAr = { table_label: 'طاولة', takeaway_label: 'سفري', order_label: 'طلب', st_queued: 'في الانتظار', st_preparing: 'قيد التحضير', st_ready: 'جاهز', st_served: 'قُدِّم', type_label: 'ملغى', old_qty: 'الكمية السابقة = 3', disp_label: 'المعالجة:', return_label: 'إعادة إلى المخزون', waste_label: 'تسجيل كهدر', disp_done: 'المعالجة: أُعيد إلى المخزون',
  dup_note: 'أمر مطبخ مكرر (راجع الكابتن)', kot_comment: 'بدون بصل من فضلك', item_comment: 'حار إضافي', agg_label: 'منصة التجميع', agg_name: 'طلبات', agg_id_label: 'معرّف المنصة', serve_label: 'تقديم', confirm_label: 'تأكيد' };

// nine tickets mixing every variant; column assignment is the static masonry result (shortest column first)
const TICKETS = [
  { n: 1, col: 0, o: { type: 'dine', overdue: true }, timer: '+0:20' },
  { n: 2, col: 1, o: { type: 'takeaway' }, timer: '08:15' },
  { n: 3, col: 2, o: { type: 'modified' }, timer: '14:02' },
  { n: 4, col: 3, o: { type: 'cancelled' }, timer: '05:48' },
  { n: 5, col: 1, o: { type: 'dine', comments: true }, timer: '03:21' },
  { n: 6, col: 3, o: { type: 'dine', aggregator: true }, timer: '11:09' },
  { n: 7, col: 2, o: { type: 'duplicate' }, timer: '02:37' },
  { n: 8, col: 0, o: { type: 'partial', resolved: true }, timer: '09:54' },
  { n: 9, col: 0, o: { type: 'dine', flip: 'serve', struck: true }, timer: '06:30' },
];
const boardSlots = { ...hdrSlots, ...kotSlots };
const boardAr = { ...hdrAr, ...kotAr };
TICKETS.forEach((t, i) => {
  const n = t.n;
  boardSlots[`table_name_${n}`] = `T${10 + n}`; boardSlots[`waiter_${n}`] = WAITERS[i % 4][0]; boardAr[`waiter_${n}`] = WAITERS[i % 4][1];
  boardSlots[`order_no_${n}`] = String(40 + n).padStart(4, '0'); boardSlots[`timer_${n}`] = t.timer;
  for (let k = 1; k <= 3; k++) { const it = ITEMS[(i + k - 1) % ITEMS.length]; boardSlots[`item_${k}_${n}`] = it[0]; boardAr[`item_${k}_${n}`] = it[1]; boardSlots[`qty_${k}_${n}`] = String(((i + k) % 3) + 1); }
});
boardSlots.type_label_4 = 'Cancelled'; boardSlots.type_label_8 = 'Partially cancelled'; boardAr.type_label_8 = 'ملغى جزئيًا';

const boardInner = (v) => {
  const cols = [0, 1, 2, 3].map((c) => `<div class="mzs-col" data-ui="ury-mosaic-screen-board-col-${c + 1}">${TICKETS.filter((t) => t.col === c).map((t) => {
    const html = rekey(kotTicket(kv(v, t.n), t.o), 'ury-mosaic-kot-ticket', `ury-mosaic-screen-board-ticket-${t.n}`);
    return `<div class="mzs-card">${html}</div>`;
  }).join('')}</div>`).join('');
  return `<div class="mzs-board" data-ui="ury-mosaic-screen-board-grid"><div class="mzs-cols">${cols}</div></div>`;
};
const frame = (id, v, view, body, extra = '') => screen(1440, 900, `${header(v, { view })}<div class="mzs-page">${body}</div>${extra}`, id, 'mz mzs');

// ---- dashboard ----
const UNITS = [['Kitchen', 'المطبخ', 12, 38], ['Bar', 'البار', 4, 21], ['Grill', 'الشواء', 7, 16], ['Bakery', 'المخبز', 2, 9], ['Dessert', 'الحلويات', 0, 0]];
const dashSlots = { ...hdrSlots, prod_unit: 'Production Unit', l_active: 'Active', l_served: 'Served', l_total: 'Total', prod_foot: 'Click to view KOTs',
  loading_msg: 'Loading Production Dashboard...', empty_msg: 'No production units for the selected company and branch.', error_msg: 'Unable to load production units. Please reload to retry.' };
const dashAr = { ...hdrAr, prod_unit: 'وحدة الإنتاج', l_active: 'نشط', l_served: 'قُدِّم', l_total: 'الإجمالي', prod_foot: 'انقر لعرض أوامر المطبخ',
  loading_msg: 'جارٍ تحميل لوحة الإنتاج...', empty_msg: 'لا توجد وحدات إنتاج للشركة والفرع المحددين.', error_msg: 'تعذّر تحميل وحدات الإنتاج. أعد تحميل الصفحة للمحاولة مجددًا.' };
UNITS.forEach(([en, ar, a, s], i) => { const n = i + 1; dashSlots[`prod_title_${n}`] = en; dashAr[`prod_title_${n}`] = ar; dashSlots[`n_active_${n}`] = String(a); dashSlots[`n_served_${n}`] = String(s); dashSlots[`n_total_${n}`] = String(a + s); });
const dashRender = (v, p) => {
  let body;
  if (p.state === 'loading') body = `<div class="mzs-msg" data-ui="ury-mosaic-screen-dashboard-loading"><h2>${v.loading_msg}</h2></div>`;
  else if (p.state === 'empty') body = `<div class="mzs-msg is-empty" data-ui="ury-mosaic-screen-dashboard-empty">${v.empty_msg}</div>`;
  else if (p.state === 'error') body = `<div class="mzs-msg is-error" role="alert" data-ui="ury-mosaic-screen-dashboard-error">${v.error_msg}</div>`;
  else body = `<div class="mzs-grid" data-ui="ury-mosaic-screen-dashboard-grid">${UNITS.map((_, i) => rekey(productionCard(kv(v, i + 1), { disabled: i === 4 }), 'ury-mosaic-production-card', `ury-mosaic-screen-dashboard-card-${i + 1}`)).join('')}</div>`;
  return frame('ury-mosaic-screen-dashboard', v, 'home', `<div class="mzs-dash" data-ui="ury-mosaic-screen-dashboard-body">${body}</div>`);
};

// ---- delayed ----
const delSlots = { ...boardSlots, banner_title: 'Order Delayed', banner_inv: 'Order #: 0041', banner_table: 'Table: T11', banner_time: 'Time: 12:40:05', toast_offline: 'You are Offline' };
const delAr = { ...boardAr, banner_title: 'الطلب متأخر', banner_inv: 'رقم الطلب: 0041', banner_table: 'الطاولة: T11', banner_time: 'الوقت: 12:40:05', toast_offline: 'أنت غير متصل بالإنترنت' };

const specs = [
  { ...BASE, id: 'ury-mosaic-screen-dashboard', name: 'Mosaic Screen: Production Dashboard', slots: dashSlots, rtlValues: dashAr, props: { state: 'ready' },
    render: (v, p) => dashRender(v, p),
    variants: {
      ready: { props: { state: 'ready' }, describe: 'Header with Company/Branch scope selectors above a p24, three-column gap-16 grid of five production cards: Kitchen, Bar, Grill, Bakery and a disabled Dessert (opacity .5, blur 1px).' },
      loading: { props: { state: 'loading' }, state: 'loading', describe: 'Loading Production Dashboard... centred 18/600 --t3 heading with py40.' },
      empty: { props: { state: 'empty' }, state: 'empty', describe: 'No production units for the selected scope: centred --t3 message.' },
      error: { props: { state: 'error' }, state: 'error', describe: 'Load failure: centred --rd alert text.' },
    },
    describe: D('mosaic production dashboard route: header with scopes and a grid of production unit cards.', 'Home route of the KDS after sign-in. Unit names are sample data; Arabic unit names are translated here, the fixed UI strings come from mosaic/src/locales/ar.json.') },
  { ...BASE, id: 'ury-mosaic-screen-board', name: 'Mosaic Screen: KOT Board', slots: boardSlots, rtlValues: boardAr,
    render: (v) => frame('ury-mosaic-screen-board', v, 'board', boardInner(v)),
    variants: { default: { props: {}, describe: 'Nine tickets across four 284px columns (28px top margin per card): overdue dine-in, takeaway, modified, cancelled, partially cancelled with resolved disposition, duplicate, aggregator, comments, and one flipped card with the Serve overlay. In rtl the columns run from the right.' } },
    describe: D('mosaic KOT board for one production unit, masonry result pre-computed statically as 4 columns of 256+24 cards.', 'Opened from a production card. masonry-layout positions are computed in JS in the source; this mock fixes the column pitch at 284px (282px card + 2px). Arabic item and waiter names are sample translations.') },
  { ...BASE, id: 'ury-mosaic-screen-board-empty', name: 'Mosaic Screen: KOT Board Empty', slots: { ...hdrSlots, empty_msg: 'No active orders for Kitchen' }, rtlValues: { ...hdrAr, empty_msg: 'لا توجد طلبات نشطة في المطبخ' },
    render: (v) => frame('ury-mosaic-screen-board-empty', v, 'board', `<div class="mzs-board"><div class="mzs-empty" data-ui="ury-mosaic-screen-board-empty-msg">${v.empty_msg}</div></div>`),
    variants: { default: { props: {}, describe: 'No active orders for the unit: centred 20px --t3 message.' } },
    describe: D('mosaic KOT board with no tickets.', 'The unit has no active KOTs in the time window.') },
  { ...BASE, id: 'ury-mosaic-screen-delayed', name: 'Mosaic Screen: Delayed Order', slots: delSlots, rtlValues: delAr,
    render: (v) => frame('ury-mosaic-screen-delayed', v, 'board', boardInner(v), `<div class="mz-banner" data-ui="ury-mosaic-screen-delayed-banner"><div class="mz-banner-l"><div class="mz-banner-ico">⚠️</div><div><p class="mz-banner-t">${v.banner_title}</p><p class="mz-banner-s"><span>${v.banner_inv}</span> | ${v.banner_table} | ${v.banner_time}</p></div></div><button type="button" class="mz-banner-x">✕</button></div><div class="mz-toast is-offline" data-ui="ury-mosaic-screen-delayed-toast">${v.toast_offline}</div>`),
    variants: { default: { props: {}, describe: 'KOT board with the Order Delayed banner (z-40, --rd-t, 3px --rd bottom border) over the header and the You are Offline toast at bottom end 40.' } },
    describe: D('mosaic KOT board while an order is overdue and the connection is lost.', 'Banner appears when a KOT passes kot_alert_time; the offline toast on connectivity loss.') },
];
export { specs };
