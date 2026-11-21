// POS Orders route specs (T03): order card, order detail panel, actions menu and two full screens (1440x900).
// Sources: pos/src/pages/Orders.tsx, components/{OrderStatusSidebar,OrderActionsMenu,SplitGroupPanel,MergedBillPanel}.tsx @100c43fe2e.
// Arabic: fixed UI labels from pos/src/i18n/locales/ar.json (orders.*, order_status_types.*, order.*, bill_split.*, bill_merge.*, order_types.*, pos_ui.table).
// Customer / waiter / item names and the VAT descriptions have no Arabic source: translated by hand as demo data. Dates stay English (source formats them with en-US).
// The actions menu in the source holds Merge Bill and Split Bill (no Cancel / Print entries); the cancel-reason input is the Cancel Order dialog (order.enter_cancel_reason).
import { money, STATE_NA } from '../lib.mjs';
import { HEADER_KEYS, SHELL_SLOTS, SHELL_RTL, PLACEHOLDERS, pick } from './shell.mjs';
import { orderCard, orderDetail, orderDetailEmpty, actionsMenu, ordersScreen } from './orders.mjs';

const CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/pos-shell.css', 'ury-v16/components/pos-orders.css'];
const base = { dsf: 2, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], group: 'pos', static: true };
const na = { hover: STATE_NA.desktop, focus: STATE_NA.desktop, active: STATE_NA.desktop };
const cur = (n, ar) => [money(n), ar];

// key: [en, ar]
const D = {
  s_title: ['Order Status', 'حالة الطلب'], s_draft: ['Draft', 'مسودة'], s_unbilled: ['Unbilled', 'غير مفوتر'], s_recently_paid: ['Recently Paid', 'مدفوع مؤخراً'],
  s_paid: ['Paid', 'مدفوع'], s_consolidated: ['Consolidated', 'مجمع'], s_return: ['Return', 'مرتجع'],
  name: ['INV-0042', 'INV-0042'], meta: ['Table T4 • Dine In', 'طاولة T4 • طلب محلي'], status: ['Unbilled', 'غير مفوتر'], d_status: ['Unbilled', 'غير مفوتر'],
  customer: ['Khalid Nasser', 'خالد ناصر'], time: ['Nov 21, 9:42 AM', 'Nov 21, 9:42 AM'], total: cur(132.25, undefined), total_merged: cur(186.25, undefined), warn: ['12m', '12m'],
  tag_split: ['Split 1 of 2', 'القسم 1 من 2'], tag_merged: ['Merged Bill', 'فاتورة مدموجة'],
  note_split: ['Split from INV-0040', 'مقسومة من INV-0040'], note_merged: ['Includes INV-0047', 'تشمل INV-0047'],
  waiter: ['Omar Farouk', 'عمر فاروق'], table: ['T4', 'T4'],
  items_title: ['Order Items', 'عناصر الطلب'], taxes_title: ['Taxes & Charges', 'الضرائب والرسوم'],
  item1: ['Chicken Shawarma Plate', 'صحن شاورما دجاج'], item2: ['Hummus', 'حمص'], item3: ['Fresh Lemon Mint', 'ليمون بالنعناع'],
  qty1: ['Qty: 2', 'الكمية: 2'], qty2: ['Qty: 1', 'الكمية: 1'], qty3: ['Qty: 3', 'الكمية: 3'],
  amt1: cur(72), amt2: cur(18), amt3: cur(36), discount: ['-10%', '-10%'],
  tax1: ['VAT 5%', 'ضريبة القيمة المضافة 5%'], tax1_amt: cur(6), tax2: ['Service Charge', 'رسوم الخدمة'], tax2_amt: cur(6.25),
  payment: ['Payment', 'الدفع'], print: ['Print', 'طباعة'], edit_order: ['Edit order', 'تعديل الطلب'], cancel_order: ['Cancel order', 'إلغاء الطلب'],
  order_actions: ['Order actions', 'إجراءات الطلب'], merge_bill: ['Merge Bill', 'دمج الفاتورة'], split_bill: ['Split Bill', 'تقسيم الفاتورة'],
  reduce_label: ['Reduce quantity of Chicken Shawarma Plate', 'تقليل كمية صحن شاورما دجاج'],
  combined_total: ['Combined Total', 'الإجمالي المجمّع'], combined_value: cur(186.25),
  select_to_view: ['Select an order to view details', 'حدد طلبًا لعرض التفاصيل'], click_to_view: ['Click on any order card to view its details', 'انقر على أي بطاقة طلب لعرض تفاصيلها'],
  related_bills: ['Related Bills', 'الفواتير المرتبطة'], open_original: ['Open Original', 'فتح الأصلية'], prev_bill: ['Previous bill', 'الفاتورة السابقة'], next_bill: ['Next bill', 'الفاتورة التالية'],
  sib1: ['INV-0042', 'INV-0042'], sib1_total: cur(66), sib2: ['INV-0040', 'INV-0040'], sib2_total: cur(66.25),
  l_current: ['Current', 'الحالية'], l_open: ['Open', 'مفتوحة'], l_original: ['Original', 'الأصلية'], l_paid: ['Paid', 'مدفوعة'],
  split_ind1: ['Split 1 of 2', 'القسم 1 من 2'], split_ind2: ['Split 2 of 2', 'القسم 2 من 2'],
  open_secondary: ['Open Merged Bill', 'فتح الفاتورة المدموجة'], sec_name: ['INV-0047', 'INV-0047'], sec_total: cur(54),
  merged_items: ['Items from merged bill', 'أصناف من الفاتورة المدموجة'], m_item: ['Mixed Grill', 'مشاوي مشكلة'], m_item_calc: cur(27),
  cancel_title: ['Cancel order', 'إلغاء الطلب'], cancel_desc: ['Please enter a reason for cancelling.', 'يرجى إدخال سبب للإلغاء.'], cancel_placeholder: ['Enter cancel reason', 'أدخل سبب الإلغاء'],
  btn_cancel: ['Cancel', 'إلغاء'], btn_confirm_cancel: ['Confirm Cancel', 'تأكيد الإلغاء'],
  previous: ['Previous', 'السابق'], next: ['Next', 'التالي'], page: ['Page 1', 'صفحة 1'],
  c1_name: ['INV-0041', 'INV-0041'], c1_meta: ['Table T2 • Dine In', 'طاولة T2 • طلب محلي'], c1_status: ['Draft', 'مسودة'], c1_customer: ['Layla Hassan', 'ليلى حسن'], c1_time: ['Nov 21, 9:12 AM', 'Nov 21, 9:12 AM'], c1_total: cur(86.5),
  c2_name: ['INV-0042', 'INV-0042'], c2_meta: ['Table T4 • Dine In', 'طاولة T4 • طلب محلي'], c2_status: ['Unbilled', 'غير مفوتر'], c2_customer: ['Khalid Nasser', 'خالد ناصر'], c2_time: ['Nov 21, 9:42 AM', 'Nov 21, 9:42 AM'], c2_total: cur(132.25),
  c3_name: ['INV-0043', 'INV-0043'], c3_meta: ['Take Away', 'سفري'], c3_status: ['Recently Paid', 'مدفوع مؤخراً'], c3_customer: ['Mariam Saleh', 'مريم صالح'], c3_time: ['Nov 21, 8:55 AM', 'Nov 21, 8:55 AM'], c3_total: cur(54),
  c4_name: ['INV-0044', 'INV-0044'], c4_meta: ['Delivery', 'توصيل'], c4_status: ['Paid', 'مدفوع'], c4_customer: ['Yusuf Ali', 'يوسف علي'], c4_time: ['Nov 20, 9:05 PM', 'Nov 20, 9:05 PM'], c4_total: cur(210),
  c5_name: ['INV-0045', 'INV-0045'], c5_meta: ['Table T7 • Dine In', 'طاولة T7 • طلب محلي'], c5_status: ['Draft', 'مسودة'], c5_customer: ['Noura Saeed', 'نورة سعيد'], c5_time: ['Nov 21, 9:30 AM', 'Nov 21, 9:30 AM'], c5_total: cur(66),
  c6_name: ['INV-0046', 'INV-0046'], c6_meta: ['Table T9 • Dine In', 'طاولة T9 • طلب محلي'], c6_status: ['Unbilled', 'غير مفوتر'], c6_customer: ['Hamad Rashid', 'حمد راشد'], c6_time: ['Nov 21, 9:20 AM', 'Nov 21, 9:20 AM'], c6_total: cur(186.25),
};
const slotOf = ([en]) => en;
const rtlOf = ([en, ar]) => (ar === undefined ? en : ar);
// Record which slot keys a render touches (union over default + variant props) so each spec lists exactly its slots.
const used = (render, specProps, variants, extraKeys = []) => {
  const seen = new Set(extraKeys);
  const px = new Proxy({}, { get: (_, k) => (typeof k === 'string' ? (seen.add(k), `{{${k}}}`) : undefined) });
  for (const p of [specProps, ...Object.values(variants).map((x) => ({ ...specProps, ...x.props }))]) render(px, p);
  return [...seen];
};
const pk = (keys) => ({
  slots: Object.fromEntries(keys.map((k) => { if (!(k in D)) throw new Error('orders.spec: no sample for slot ' + k); return [k, slotOf(D[k])]; })),
  rtlValues: Object.fromEntries(keys.map((k) => [k, rtlOf(D[k])])),
});
// variant value overrides: { key: [en, ar] } -> flat en values; the rtl run reuses the default Arabic unless overridden
const vv = (o) => Object.fromEntries(Object.entries(o).map(([k, x]) => [k, slotOf(x)]));
const build = (spec) => ({ ...base, ...spec, ...pk(used(spec.render, spec.props, spec.variants)), na, naDefault: STATE_NA.desktop });

const CARD_W = 246, DETAIL_W = 384, DETAIL_H = 836;
const cardVariants = {
  draft: { props: { status: 'draft' }, values: vv({ status: ['Draft'], name: ['INV-0041'], meta: ['Table T2 • Dine In'] }), describe: 'Draft order: secondary badge, no tags.' },
  paid: { props: { status: 'paid' }, values: vv({ status: ['Paid'], name: ['INV-0044'], meta: ['Delivery'], customer: ['Yusuf Ali'], total: [money(210)] }), describe: 'Paid order: default (neutral) status badge (Recently Paid and Consolidated use the same variant).' },
  cancelled: { props: { status: 'return' }, values: vv({ status: ['Return'], name: ['INV-0048'] }), describe: 'Cancelled / returned order: destructive Return badge (the card has no separate "cancelled" status; Return is the destructive one in getBadgeVariant).' },
  'print-warning': { props: { status: 'unbilled', warn: true }, describe: 'Print warning: red-outline tag with the elapsed time beside the status badge (custom_invoice_warning_time exceeded).' },
  split: { props: { status: 'draft', split: true }, values: vv({ status: ['Draft'], name: ['INV-0045'] }), describe: 'Split bill: tagAccent "Split n of m" tag, 4px primary-500 start border and the primary-700 "Split from" note.' },
  merged: { props: { status: 'unbilled', merged: true }, values: vv({ status: ['Unbilled'], name: ['INV-0046'] }), describe: 'Merged bill: "Merged Bill" tag, 4px primary-500 start border, primary-700 "Includes" note and the combined total.' },
  selected: { props: { status: 'unbilled', selected: true }, describe: 'Selected card: ring-2 blue-500 plus shadow-lg.' },
};
const detailVariants = {
  paid: { props: { status: 'paid' }, values: vv({ d_status: ['Paid'] }), describe: 'Paid order: no edit / cancel buttons and no Payment button, just Print and the total.' },
  'with-actions': { props: { actions: true, menu: true }, describe: 'Split / merge allowed: the three-dot actions button precedes Edit and Cancel; popover open.' },
  discount: { props: { discount: true, reduce: true }, describe: 'Discounted item (-n% red-50 badge) and printed invoice: round 20px minus buttons to reduce quantity.' },
  split: { props: { split: true }, describe: 'Split bill: Split n of m tag and the Related Bills panel (primary-200 2px border, primary-50/60 fill) with the siblings.' },
  merged: { props: { merged: true }, describe: 'Merged bill: Merged Bill tag and panel; footer shows the combined total (label above the value).' },
  'cancel-dialog': { props: { cancelDlg: true }, describe: 'Cancel Order dialog open over the panel with the reason textarea.' },
};
const mkDetail = (v, p) => orderDetail(v, { status: 'unbilled', statusSlot: 'd_status', ...p });

export const specs = [
  build({
    id: 'pos-order-card', name: 'POS order card', width: CARD_W,
    props: { status: 'unbilled' },
    render: (v, p) => orderCard(v, p),
    variants: cardVariants,
    describe: ['Order card on the Orders grid (Card p-0): gray-50 header with order name, link tags, table / order type and status badge, then customer, date and total.', 'One card per order in the 3-column grid; click selects it and fills the detail panel.'],
  }),
  build({
    id: 'pos-order-detail', name: 'POS order detail panel', width: DETAIL_W, height: DETAIL_H,
    props: { status: 'unbilled' },
    render: (v, p) => mkDetail(v, p),
    variants: detailVariants,
    describe: ['384px order detail panel: sticky header (name, Pencil, red X, status badge), customer / time / waiter / table info, Order Items, Taxes & Charges and the gray-50 footer with Print, Payment and the total.', 'Right side of the Orders route once a card is selected.'],
  }),
  build({
    id: 'pos-order-actions-menu', name: 'POS order actions menu', width: 480, height: 360,
    props: {},
    render: (v, p) => actionsMenu(v, p),
    variants: {
      'merge-only': { props: { split: false }, describe: 'Only Merge Bill is allowed.' },
      'split-only': { props: { merge: false }, describe: 'Only Split Bill is allowed.' },
      hover: { props: { hover: 'split' }, describe: 'Pointer over an item: gray-100 background.' },
      'cancel-reason': { props: { cancel: true }, describe: 'Cancel Order dialog with the "Enter cancel reason" textarea (opened from the red X button, shown here beside the menu).' },
    },
    describe: ['192px popover under the three-dot button: Merge Bill and Split Bill items (rounded-lg, border, shadow-lg), plus the cancel-reason dialog as a variant.', 'Order detail header, when the order can be split or merged.'],
  }),
  (() => {
    const o = { ...base, width: 1440, height: 900, na, naDefault: STATE_NA.desktop };
    const hk = [...HEADER_KEYS];
    const hdr = { ...pick(SHELL_SLOTS, hk), search_placeholder: 'Search Orders' };
    const hdrR = { ...pick(SHELL_RTL, hk.filter((k) => k in SHELL_RTL)), search_placeholder: PLACEHOLDERS.orders[1] };
    const mk = (id, name, props, desc) => {
      const render = (v, p) => ordersScreen(v, p, id);
      const keys = used(render, props, {}).filter((k) => !hk.includes(k));
      const s = pk(keys);
      return { ...o, id, name, props, render, slots: { ...hdr, ...s.slots }, rtlValues: { ...hdrR, ...s.rtlValues }, variants: {}, describe: desc };
    };
    return [
      mk('pos-screen-orders', 'POS orders screen', {}, ['Orders route at 1440x900: header, 256px status sidebar (Draft active), 3-column card grid with Previous / Page / Next, and the empty 384px detail panel ("Select an order to view details").', 'Nothing selected yet.']),
      mk('pos-screen-orders-selected', 'POS orders screen with a selected order', { selected: 1 }, ['Orders route with a card selected (blue ring) and the 384px detail panel filled for that order.', 'After clicking an order.']),
    ];
  })(),
].flat();
