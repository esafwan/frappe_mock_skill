// ury-mosaic components: Header, ScopeSelector, ProductionCard, kot ticket, item status pill, alerts.
// Sources: mosaic/src/{index.css,components/Header.vue,components/ScopeSelector.vue,components/production/ProductionCard.vue,components/kot.vue,locales/ar.json}
import { header, scopeSelector, productionCard, kotTicket, pills, pillOne, alerts } from './components.mjs';

const CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-mosaic-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/mosaic.css'];
const BASE = { group: 'ury-mosaic', static: true, dsf: 2, canvas: 'var(--bg)', css: CSS, darkTheme: '.dark', modes: ['light', 'rtl'], props: {},
  na: { disabled: 'not applicable: this component has no distinct disabled variant', error: 'not applicable: this component has no distinct error variant', loading: 'not applicable: this component has no distinct loading variant', empty: 'not applicable: this component has no distinct empty variant', dark: 'na: mosaic/src/index.css defines one light palette (:root only) and no dark: classes or .dark overrides, so the KDS has no dark theme' },
  naDefault: 'pointer UI: hover/focus are shown as variants where the source styles them' };
const dk = (reason) => reason;
// Arabic: strings from mosaic/src/locales/ar.json; fixed UI labels that have no entry are translated here (noted per spec describe).
const AR = {
  company: 'الشركة', branch: 'الفرع', allCompanies: 'كل الشركات', allBranches: 'كل الفروع',
  user: 'سارة أحمد', switchDash: 'التبديل إلى لوحة المعلومات', logout: 'تسجيل الخروج', logo: 'الشعار',
};
const D = (what, when) => [what, when];

// ---------------- header ----------------
const headerSlots = { logo_alt: 'Logo', user_name: 'Sara Ahmed', user_email: 'sara@example.com', switch_dashboard: 'Switch to Dashboard', logout: 'Logout',
  c_all: 'All Companies', c_1: 'Gulf Hospitality', c_2: 'Harbour Dining', c_3: 'Palm Cafe Group', c_heading: 'Select Active Company', c_sel0: 'All Companies', c_sel1: 'Gulf Hospitality', c_sel2: 'Harbour Dining', c_sel3: 'Palm Cafe Group',
  b_all: 'All Branches', b_1: 'Marina Branch', b_2: 'Downtown Branch', b_3: 'Airport Branch', b_heading: 'Select Active Branch', b_sel0: 'All Branches', b_sel1: 'Marina Branch', b_sel2: 'Downtown Branch', b_sel3: 'Airport Branch' };
const headerAr = { logo_alt: AR.logo, user_name: AR.user, switch_dashboard: AR.switchDash, logout: AR.logout, c_all: AR.allCompanies, c_sel0: AR.allCompanies, b_all: AR.allBranches, b_sel0: AR.allBranches, c_heading: 'اختر الشركة النشط', b_heading: 'اختر الفرع النشط' };

// ---------------- kot ----------------
const kotSlots = { table_label: 'Table', table_name: 'T12', takeaway_label: 'Takeaway', waiter: 'Omar', order_label: 'Order', order_no: '0042', timer: '12:40',
  item_1: 'Chicken Biryani', item_2: 'Masala Dosa', item_3: 'Fresh Lime Soda', qty_1: '2', qty_2: '1', qty_3: '3',
  st_queued: 'Queued', st_preparing: 'Preparing', st_ready: 'Ready', st_served: 'Served',
  type_label: 'Cancelled', old_qty: 'Old Qty = 3', disp_label: 'Disposition:', return_label: 'Return to Stock', waste_label: 'Mark as Wasted', disp_done: 'Disposition: Returned to Stock',
  dup_note: 'Duplicate KOT ( CHECK WITH CAPTAIN )', kot_comment: 'No onions please', item_comment: 'Extra spicy',
  agg_label: 'Aggregator', agg_name: 'Talabat', agg_id_label: 'Aggregator ID', agg_id: '48213907', serve_label: 'Serve', confirm_label: 'Confirm' };
const kotAr = { table_label: 'طاولة', takeaway_label: 'سفري', waiter: 'عمر', order_label: 'طلب', item_1: 'برياني دجاج', item_2: 'دوسا ماسالا', item_3: 'عصير ليمون طازج',
  st_queued: 'في الانتظار', st_preparing: 'قيد التحضير', st_ready: 'جاهز', st_served: 'قُدِّم', type_label: 'ملغى', old_qty: 'الكمية السابقة = 3', disp_label: 'المعالجة:', return_label: 'إعادة إلى المخزون', waste_label: 'تسجيل كهدر', disp_done: 'المعالجة: أُعيد إلى المخزون',
  dup_note: 'أمر مطبخ مكرر (راجع الكابتن)', kot_comment: 'بدون بصل من فضلك', item_comment: 'حار إضافي', agg_label: 'منصة التجميع', agg_name: 'طلبات', agg_id_label: 'معرّف المنصة', serve_label: 'تقديم', confirm_label: 'تأكيد' };

const specs = [
  { ...BASE, id: 'ury-mosaic-header', name: 'Mosaic Header', width: 1440, slots: headerSlots, rtlValues: headerAr,
    render: (v, p) => header(v, p),
    props: { view: 'home', menu: false },
    variants: {
      home: { props: { view: 'home' }, describe: 'Home route: logo, Company and Branch scope selectors, refresh and user button.' },
      board: { props: { view: 'board' }, describe: 'KOT board route: no scope selectors, only refresh and user button.' },
      'user-menu-open': { props: { view: 'home', menu: true }, describe: 'User dropdown open: w224 card with name and email, Switch to Dashboard, Logout in --rd.' },
      'refresh-hover': { props: { view: 'home', hover: 'refresh' }, state: 'hover', describe: 'Refresh button hover: bg --hover.' },
      'user-hover': { props: { view: 'board', hover: 'user' }, describe: 'User button hover: bg --hover, text --t1.' },
    },
    describe: D('mosaic KDS top bar: mosaic.jpg logo at h32, Company/Branch scope selectors on the home route, refresh, user dropdown.', 'Top of every mosaic route; the home route shows the scope selectors, the KOT board route does not. Arabic strings from mosaic/src/locales/ar.json.') },
  { ...BASE, id: 'ury-mosaic-scope-selector', name: 'Mosaic Scope Selector', width: 320, slots: headerSlots, rtlValues: headerAr,
    render: (v, p) => scopeSelector(v, p), props: { kind: 'company', open: false, sel: 0 },
    variants: {
      closed: { props: { kind: 'company', open: false, sel: 0 }, describe: 'Closed trigger showing "All Companies".' },
      open: { props: { kind: 'company', open: true, sel: 0 }, state: 'focus', describe: 'Popover w256 with heading "Select Active Company"; selected row uses --ac-t / --ac plus a check.' },
      'open-selected': { props: { kind: 'company', open: true, sel: 2 }, describe: 'A specific company selected; the trigger shows its name.' },
      branch: { props: { kind: 'branch', open: true, sel: 1 }, describe: 'Branch scope selector, popover open.' },
      hover: { props: { kind: 'company', hover: true }, state: 'hover', describe: 'Trigger hover: bg --hover.' },
      disabled: { props: { kind: 'company', disabled: true }, describe: 'Disabled while the scope is loading: opacity .5.' },
    },
    describe: D('Company/Branch filter dropdown: h28 trigger on --sunk with building icon, w256 popover with heading and check on the selected row.', 'Header, home route only; option 1 is always "All ..." and the rest come from the user\'s companies or branches.') },
  { ...BASE, id: 'ury-mosaic-production-card', name: 'Mosaic Production Card', width: 360,
    slots: { prod_title: 'Main Kitchen', prod_unit: 'Production Unit', n_active: '12', n_served: '38', n_total: '50', l_active: 'Active', l_served: 'Served', l_total: 'Total', prod_foot: 'Click to view KOTs' },
    rtlValues: { prod_unit: 'وحدة الإنتاج', l_active: 'نشط', l_served: 'قُدِّم', l_total: 'الإجمالي', prod_foot: 'انقر لعرض أوامر المطبخ', prod_title: 'المطبخ الرئيسي' },
    render: (v, p) => productionCard(v, p), props: { disabled: false },
    variants: {
      default: { props: { disabled: false }, describe: 'Production unit card with Active, Served and Total stat tiles.' },
      disabled: { props: { disabled: true }, describe: 'Disabled: opacity .5 with 1px blur, not-allowed cursor; click is ignored.' },
      idle: { props: {}, values: { n_active: { sample: '0' }, n_served: { sample: '0' }, n_total: { sample: '0' } }, describe: 'A unit with no orders yet.' },
    },
    describe: D('Production dashboard tile: empty 40px --ac-t tile, unit name, three stat tiles in Geist Mono, "Click to view KOTs" footer.', 'Production dashboard grid; one per production unit; click opens that unit\'s KOT board. "Main Kitchen" Arabic name is sample data.') },
  { ...BASE, id: 'ury-mosaic-kot-ticket', name: 'Mosaic KOT Ticket', width: 340, slots: kotSlots, rtlValues: kotAr,
    render: (v, p) => kotTicket(v, p), props: { type: 'dine' },
    variants: {
      'dine-in': { props: { type: 'dine' }, describe: 'Dine-in KOT: --panel with --hair2 border, table, waiter, order number, elapsed timer.' },
      takeaway: { props: { type: 'takeaway' }, describe: 'Takeaway KOT: --ac-t background and --ac-b border; no "Table" label.' },
      modified: { props: { type: 'modified' }, describe: 'Order Modified: --am-t background and --am-b border.' },
      cancelled: { props: { type: 'cancelled' }, describe: 'Cancelled KOT: --rd-t / --rd-b, "( Cancelled )" after the order number, [Old Qty = n] per item and disposition buttons Return to Stock (--gr) and Mark as Wasted (--rd).' },
      'partially-cancelled': { props: { type: 'partial' }, values: { type_label: { sample: 'Partially cancelled' } }, rtlValues: { type_label: 'ملغى جزئيًا' }, describe: 'Partially cancelled: same red treatment, disposition pending on the cancelled item only.' },
      'disposition-resolved': { props: { type: 'partial', resolved: true }, values: { type_label: { sample: 'Partially cancelled' } }, describe: 'Disposition resolved: the buttons are replaced by "( Disposition: Returned to Stock )".' },
      duplicate: { props: { type: 'duplicate' }, describe: 'Duplicate KOT: red note "Duplicate KOT ( CHECK WITH CAPTAIN )" under the header.' },
      aggregator: { props: { type: 'dine', aggregator: true }, describe: 'Aggregator order: Aggregator and Aggregator ID rows under the header, takeaway colours.' },
      'struck-item': { props: { type: 'dine', struck: true }, describe: 'Item tapped as done: line-through in --gr.' },
      overdue: { props: { type: 'dine', overdue: true }, values: { timer: { sample: '+0:20' } }, describe: 'Elapsed time past kot_alert_time: timer turns --rd.' },
      comments: { props: { type: 'dine', comments: true }, describe: 'KOT comment line and an item comment.' },
      'flip-serve': { props: { type: 'dine', flip: 'serve' }, describe: 'Card tapped: overlay (inset 0, opacity .9, --panel) with a Serve button.' },
      'flip-confirm': { props: { type: 'cancelled', flip: 'confirm' }, describe: 'Cancelled card tapped: the overlay button reads Confirm.' },
    },
    describe: D('Kitchen order ticket: p12 r8 card, inner width 256, table/takeaway header, elapsed timer 24/32 mono (ltr), items at 12.5/600 with status pill and mono qty.', 'Mosaic KOT board (masonry grid). Colour by type: dine-in panel, takeaway blue, modified amber, cancelled red. Timer and qty stay ltr in Arabic. The source sets an inline border-color of --hair2 on every card that overrides the colour class border; this mock follows the class list (--ac-b, --am-b, --rd-b).') },
  { ...BASE, id: 'ury-mosaic-item-pill', name: 'Mosaic Item Status Pill', width: 360, slots: kotSlots, rtlValues: kotAr,
    render: (v, p) => (p.only ? pillOne(p.only, v) : pills(v)), props: {},
    variants: {
      queued: { props: { only: 'queued' }, describe: 'Queued: --rd set (red).' },
      preparing: { props: { only: 'preparing' }, describe: 'Preparing: --am set (amber).' },
      ready: { props: { only: 'ready' }, describe: 'Ready: #EAF2FB / #1D5FA8 / #C3D9F0 (info blue).' },
      served: { props: { only: 'served' }, describe: 'Served: --gr set (green).' },
    },
    describe: D('Per-item KOT status badge: px6 py2 r4, 12/600, 1px border; default shows the four states side by side.', 'Beside each KOT item quantity; state progresses Queued, Preparing, Ready, Served.') },
  { ...BASE, id: 'ury-mosaic-alerts', name: 'Mosaic Alerts', width: 960,
    slots: { banner_title: 'Order Delayed', banner_inv: 'Order #: 0042', banner_table: 'Table: T12', banner_time: 'Time: 12:40:05', audio_msg: 'Audio notifications disabled. Click anywhere to enable.', toast_online: 'You are online', toast_offline: 'You are Offline', modal_title: 'Not Permitted', modal_body: 'Log in to access this page.', modal_btn: 'Login' },
    rtlValues: { banner_title: 'الطلب متأخر', banner_inv: 'رقم الطلب: 0042', banner_table: 'الطاولة: T12', banner_time: 'الوقت: 12:40:05', audio_msg: 'إشعارات الصوت معطلة. انقر في أي مكان للتفعيل.', toast_online: 'أنت متصل بالإنترنت', toast_offline: 'أنت غير متصل بالإنترنت', modal_title: 'غير مسموح', modal_body: 'سجّل الدخول للوصول إلى هذه الصفحة.', modal_btn: 'تسجيل الدخول' },
    render: (v, p) => alerts(v, p), props: { banner: true, audio: true, toast: 'online', modal: true },
    variants: {
      all: { props: { banner: true, audio: true, toast: 'online', modal: true }, describe: 'All four alerts layered as in the source (banner z-40 above the modal scrim z-10).' },
      'order-delayed': { props: { banner: true, audio: false, toast: null, modal: false }, describe: 'Order Delayed banner: --rd-t background, 3px --rd bottom border, dismiss button.' },
      'audio-disabled': { props: { banner: false, audio: true, toast: null, modal: false }, describe: 'Audio notifications disabled message, bold 24px --rd, centred at the top.' },
      'toast-online': { props: { banner: false, audio: false, toast: 'online', modal: false }, describe: 'Connection restored toast at the bottom end, --gr.' },
      'toast-offline': { props: { banner: false, audio: false, toast: 'offline', modal: false }, describe: 'Connection lost toast at the bottom end, --rd.' },
      'not-permitted': { props: { banner: false, audio: false, toast: null, modal: true }, describe: 'Not Permitted modal: scrim rgba(13,13,15,.2), panel max-w 448, shadow 0 8px 30px rgba(0,0,0,.12).' },
    },
    describe: D('KOT board system alerts: delayed-order banner, audio-disabled prompt, online/offline toast, Not Permitted login modal.', 'Shown over the KOT board when an order passes kot_alert_time, when browser audio is blocked, when connectivity changes, or when the session expires.') },
];
for (const s of specs) { s.na = { ...s.na, dark: dk(s.na.dark) }; s.describe = [s.describe[0], s.describe[1] + ' Modes: light and rtl only; dark is not applicable (' + s.na.dark.replace(/^na: /, '') + ').']; }
export { specs };
