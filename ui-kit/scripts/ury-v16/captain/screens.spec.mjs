// ury-captain full screens (T13): Tables, Order (menu / order-list on a phone) and the lg side-by-side Order screen.
// Source: ury-erp/version-16 @100c43fe2e, pos/src/captain/pages/CaptainTables.tsx and CaptainOrder.tsx; parts are the T12 captain components.
// Arabic: pos/src/i18n/locales/ar.json (captain.*, pos_ui.*, common.refresh). No Arabic exists for the hard-coded English labels
// Free / Mine / Billed / Update Order and the room names; only those fixed UI labels are translated here (tables.available, captain.billed_locked, pos_ui.send_order family).
// The source's CustomerSelect row (shared cashier component) is not part of these screens.
import { ic, money, screen, STATE_NA } from '../lib.mjs';
import { tableCard, menuPane, sendBar, IMG } from './components.mjs';

const base = {
  group: 'ury-captain', static: true, dsf: 3, canvas: 'hsl(var(--background))', darkTheme: '.dark', modes: ['light', 'dark', 'rtl'],
  css: ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/captain.css', 'ury-v16/components/captain-screens.css'],
  naDefault: STATE_NA.touch,
};
const na = (extra = {}) => ({ disabled: 'not applicable: this screen has no distinct disabled variant', error: 'not applicable: this screen has no error variant', loading: 'not applicable: this screen has no loading variant', empty: 'not applicable: this screen has no empty variant', ...extra });
const strip = (h) => h.replace(/ data-ui="[^"]*"/g, '');

/* ---------------- Tables ---------------- */
const CARDS = [
  [1, 'free', 'T1', 'Free', '', '', null, '2', ''],
  [2, 'mine', 'T2', 'Mine', '', '12m', 54, '4', ''],
  [3, 'occupied', 'T3', 'Rashid K.', 'Rashid K.', '45m', 86.5, '4', 'T4'],
  [4, 'occupied', 'T4', 'Rashid K.', 'Rashid K.', '45m', 86.5, '2', 'T3'],
  [5, 'billed', 'T5', 'Billed', 'Omar S.', '1h 20m', 210, '6', ''],
  [6, 'free', 'T6', 'Free', '', '', null, '4', ''],
  [7, 'occupied', 'T7', 'Layla M.', 'Layla M.', '1h 5m', 132.25, '4', ''],
  [8, 'occupied', 'T8', 'Yusuf A.', 'Yusuf A.', '1h 25m', 96.75, '2', ''],
  [9, 'free', 'T9', 'Free', '', '', null, '8', ''],
  [10, 'mine', 'T10', 'Mine', '', '8m', 38, '2', ''],
];
const tSlots = {}; const tRtl = {};
const AR_OWN = { 'Rashid K.': 'راشد', 'Omar S.': 'عمر', 'Layla M.': 'ليلى', 'Yusuf A.': 'يوسف' };
for (const [i, st, name, status, owner, el, tot, seats, merge] of CARDS) {
  tSlots[`t${i}_name`] = name; tSlots[`t${i}_status`] = status; tSlots[`t${i}_seats`] = seats;
  if (st === 'free') tRtl[`t${i}_status`] = 'متاح'; else if (st === 'mine') tRtl[`t${i}_status`] = 'طاولتي'; else if (st === 'billed') tRtl[`t${i}_status`] = 'تمت الفوترة / مقفلة'; else tRtl[`t${i}_status`] = AR_OWN[status];
  if (st !== 'free') { tSlots[`t${i}_elapsed`] = el; tSlots[`t${i}_total`] = money(tot); }
  if (st !== 'free' && st !== 'mine') { tSlots[`t${i}_owner`] = owner; tRtl[`t${i}_owner`] = AR_OWN[owner]; }
  if (merge) tSlots[`t${i}_merge`] = merge;
}
const card = (v, c) => {
  const [i, st, , , , , , , merge] = c;
  const vv = { table_name: v[`t${i}_name`], status: v[`t${i}_status`], owner_name: v[`t${i}_owner`], merge_list: v[`t${i}_merge`], elapsed: v[`t${i}_elapsed`], total: v[`t${i}_total`], seats: v[`t${i}_seats`] };
  return strip(tableCard(vv, { state: st, merge: !!merge })).replace('class="ucap', `data-ui="ury-captain-screen-tables-card-${i}" class="ucap`);
};
const tables = (v, p = {}) => {
  const room = (n, on) => `<span class="u-btn u-btn--tab u-btn--sm"${on ? ' data-selected="true"' : ''} data-ui="ury-captain-screen-tables-room-${n}">${v['room_' + n]}</span>`;
  const body = p.view === 'empty' ? `<div class="ucs-state" data-ui="ury-captain-screen-tables-empty">${ic('Square', 32)}<p>${v.empty_text}</p></div>`
    : p.view === 'error' ? `<div class="ucs-state ucs-state--error" data-ui="ury-captain-screen-tables-error">${ic('AlertTriangle', 32)}<p>${v.error_text}</p></div>`
    : `<div class="ucs-grid" data-ui="ury-captain-screen-tables-grid">${CARDS.map((c) => card(v, c)).join('')}</div>`;
  return screen(390, 844, `<div class="ucs-thead" data-ui="ury-captain-screen-tables-header"><div class="ucs-trow"><h1 class="ucs-ttitle" data-ui="ury-captain-screen-tables-title">${v.title}</h1><span class="u-btn u-btn--ghost u-btn--sm" data-ui="ury-captain-screen-tables-refresh">${v.refresh}</span></div>`
    + `<div class="ucs-rooms" data-ui="ury-captain-screen-tables-rooms">${room(1, true)}${room(2)}${room(3)}</div></div>`
    + `<div class="ucs-tbody" data-ui="ury-captain-screen-tables-body">${body}</div>`, 'ury-captain-screen-tables', 'ucap ucs');
};

/* ---------------- Order pieces ---------------- */
const header = (v, { toggle, active }) => `<div class="ucs-hd" data-ui="ury-captain-screen-order-header"><div class="ucs-hd-l"><span class="ucs-ibtn" data-ui="ury-captain-screen-order-back">${ic('ChevronLeft', 20)}</span>`
  + `<div><h1 class="ucs-title">${v.title}</h1><p class="ucs-sub">${v.subtitle}</p></div></div><div class="ucs-hd-r">`
  + (toggle ? `<div class="ucs-seg" data-ui="ury-captain-screen-order-toggle"><span class="ucs-seg-b${active === 'menu' ? ' ucs-seg-b--on' : ''}">${ic('UtensilsCrossed', 16)}${v.tab_menu}</span>`
    + `<span class="ucs-seg-b${active === 'order' ? ' ucs-seg-b--on' : ''}">${ic('ClipboardList', 16)}${v.tab_order}<span class="ucs-seg-n" data-ui="ury-captain-screen-order-count">${v.count}</span></span></div>` : '')
  + `<span class="ucs-ibtn" data-ui="ury-captain-screen-order-kebab">${ic('MoreVertical', 20)}</span></div></div>`;

const line = (v, k, i, comment) => {
  const btn = (n, x = '') => `<span class="ucap-ol-btn${x}">${ic(n, 16)}</span>`;
  const acts = k === 'delta' ? btn('Minus') + btn('Plus') : k === 'reduction' ? btn('RotateCcw') : btn('Minus') + btn('Trash2', ' ucap-ol-btn--danger');
  return `<div class="ucap-ol ucap-ol--${k}" data-ui="ury-captain-screen-order-line-${i}"><div class="ucap-ol-main"><div class="ucap-ol-title"><span class="ucap-ol-name">${v[`l${i}_qty`]} &times; ${v[`l${i}_name`]}</span></div>`
    + (comment ? `<p class="ucap-ol-comment">${ic('MessageSquare', 12)}${v[`l${i}_comment`]}</p>` : '')
    + `<p class="ucap-ol-price"><span class="u-num">${v[`l${i}_price`]}</span></p></div><div class="ucap-ol-actions">${acts}</div></div>`;
};
const pax = (v, editable) => `<div class="ucs-pax" data-ui="ury-captain-screen-order-pax"><span class="ucs-pax-l">${v.pax_label}</span>`
  + (editable ? `<div class="ucs-pax-c"><span class="ucs-pax-b">${ic('Minus', 16)}</span><span class="ucs-pax-n">${v.pax_value}</span><span class="ucs-pax-b">${ic('Plus', 16)}</span></div>` : `<span class="ucs-pax-v">${v.pax_value}</span>`) + `</div>`;
const orderList = (v, p = {}) => {
  const editable = !p.viewOnly;
  let body;
  if (p.empty) {
    body = `<div class="ucs-empty" data-ui="ury-captain-screen-order-empty">${ic('ClipboardList', 40)}<p>${v.empty_text}</p><span class="u-btn u-btn--outline u-btn--sm" data-ui="ury-captain-screen-order-browse">${v.browse}</span></div>`;
  } else {
    body = `<section data-ui="ury-captain-screen-order-g-ordered"><h2 class="ucs-sec-h">${v.h_ordered}</h2><div class="ucs-lines">`
      + [1, 2].map((i) => `<div>${line(v, 'confirmed', i, i === 1)}${editable ? `<span class="ucs-reduce" data-ui="ury-captain-screen-order-reduce-${i}">${v.reduce}</span>` : ''}</div>`).join('') + `</div></section>`
      + `<section data-ui="ury-captain-screen-order-g-new"><h2 class="ucs-sec-h ucs-sec-h--new">${v.h_new}</h2><div class="ucs-lines">${line(v, 'delta', 3, true)}${line(v, 'delta', 4, false)}</div></section>`
      + `<section data-ui="ury-captain-screen-order-g-reduction"><h2 class="ucs-sec-h ucs-sec-h--red">${v.h_reduction}</h2><div class="ucs-lines">${line(v, 'reduction', 5, false)}</div></section>`;
  }
  return `<div class="ucs-ol" data-ui="ury-captain-screen-order-list">${pax(v, editable)}${body}</div>`;
};
const widen = (h) => h.replace(/ style="width:\d+px"/, '');
const menu = (v, p = {}) => widen(strip(menuPane(v, p))).replace('class="ucap ucap-mp"', 'class="ucap ucap-mp" data-ui="ury-captain-screen-order-menu-pane"');
const bar = (v, p = {}) => widen(strip(sendBar(v, p))).replace('class="ucap ucap-sb"', 'class="ucap ucap-sb" data-ui="ury-captain-screen-order-sendbar"');

/* ---------------- shared slots ---------------- */
const hdr = { title: 'Table T4', subtitle: 'Updating order', tab_menu: 'Menu', tab_order: 'Order', count: '3' };
const hdrAr = { title: 'طاولة T4', subtitle: 'تحديث الطلب', tab_menu: 'القائمة', tab_order: 'الطلب' };
const barS = { total_label: 'Total', total: money(78), button: 'Update Order' };
const barAr = { total_label: 'الإجمالي', button: 'تحديث الطلب' };
const menuS = {
  search_placeholder: 'Search menu', chip_all: 'All', chip_2: 'Cold Meze', chip_3: 'Hot Meze', chip_4: 'Grills & Kebabs', chip_5: 'Shawarma & Wraps',
  note: "You can browse the menu, but you don't have permission to add items to this order.",
  name_1: 'Hummus', course_1: 'Cold Meze', price_1: money(22), image_1: { type: 'image', sample: IMG.hummus }, tag_1: 'Available',
  name_2: 'Falafel', course_2: 'Hot Meze', price_2: money(24), image_2: { type: 'image', sample: IMG.falafel }, tag_2: '3 left',
  name_3: 'Fattoush', course_3: 'Cold Meze', price_3: money(28), image_3: { type: 'image', sample: IMG.fattoush }, tag_3: 'Unavailable',
  name_4: 'Kibbeh', course_4: 'Hot Meze', price_4: money(32), image_4: { type: 'image', sample: IMG.kibbeh }, tag_4: '12 left',
};
const menuAr = {
  search_placeholder: 'ابحث في القائمة', chip_all: 'الكل', chip_2: 'المقبلات الباردة', chip_3: 'المقبلات الساخنة', chip_4: 'المشاوي والكباب', chip_5: 'الشاورما واللفائف',
  note: 'يمكنك تصفح القائمة، لكن ليس لديك صلاحية لإضافة أصناف إلى هذا الطلب.',
  name_1: 'حمص', course_1: 'المقبلات الباردة', name_2: 'فلافل', course_2: 'المقبلات الساخنة', name_3: 'فتوش', course_3: 'المقبلات الباردة', name_4: 'كبة', course_4: 'المقبلات الساخنة',
  tag_1: 'متاح', tag_2: 'متبقي 3', tag_3: 'غير متاح', tag_4: 'متبقي 12',
};
const listS = {
  pax_label: 'Pax', pax_value: '2', h_ordered: 'Already Ordered', h_new: 'New / Changed', h_reduction: 'Reduction Pending', reduce: 'Reduce & notify kitchen',
  empty_text: 'No items yet.', browse: 'Browse menu',
  l1_qty: '2', l1_name: 'Fattoush', l1_comment: 'Dressing on the side', l1_price: money(56),
  l2_qty: '1', l2_name: 'Hummus', l2_price: money(22),
  l3_qty: '+2', l3_name: 'Falafel', l3_comment: 'No onions', l3_price: money(48),
  l4_qty: '+1', l4_name: 'Kibbeh', l4_price: money(32),
  l5_qty: '−1', l5_name: 'Hummus', l5_price: money(22),
};
const listAr = {
  pax_label: 'عدد الضيوف', h_ordered: 'تم طلبه سابقاً', h_new: 'جديد / معدّل', h_reduction: 'تقليل قيد الانتظار', reduce: 'تقليل وإبلاغ المطبخ', empty_text: 'لا توجد أصناف بعد.', browse: 'تصفح القائمة',
  l1_name: 'فتوش', l1_comment: 'الصلصة على الجانب', l2_name: 'حمص', l3_name: 'فلافل', l3_comment: 'بدون بصل', l4_name: 'كبة', l5_name: 'حمص',
};

export const specs = [
  {
    ...base, id: 'ury-captain-screen-tables', name: 'URY Captain screen: Tables', width: 390, height: 844,
    describe: ['Captain "Tables" home screen: sticky white header (Tables 18/700, ghost Refresh, room tab buttons h36), gray-50 body with a 2-column grid (gap 12) of table cards in free, mine, occupied (merged), billed and attention states.',
      'First screen after Captain sign-in on a phone (390x844). Tapping a card opens the Order screen. Empty (Square icon) and error (AlertTriangle) replace the grid. Free / Mine / Billed and the room names are hard-coded English in the source; their Arabic is a translated UI label (tables.available, captain.billed_locked).'],
    na: na(), slots: {
      title: 'Tables', refresh: 'Refresh', room_1: 'Main Hall', room_2: 'Terrace', room_3: 'Garden', empty_text: 'No tables found in this room.', error_text: 'Unable to load tables', ...tSlots,
    },
    rtlValues: { title: 'الطاولات', refresh: 'تحديث', room_1: 'القاعة الرئيسية', room_2: 'التراس', room_3: 'الحديقة', empty_text: 'لا توجد طاولات في هذه القاعة.', error_text: 'تعذر تحميل الطاولات', ...tRtl },
    props: { view: 'grid' }, render: (v, p) => tables(v, p),
    variants: {
      empty: { props: { view: 'empty' }, values: {}, describe: 'Selected room has no tables: Square 32 icon and "No tables found in this room." in gray-500.' },
      error: { props: { view: 'error' }, values: {}, describe: 'Tables request failed: AlertTriangle 32 and the error text in red-500.' },
    },
  },
  {
    ...base, id: 'ury-captain-screen-order-menu', name: 'URY Captain screen: Order, Menu tab', width: 390, height: 844,
    describe: ['Captain order screen on a phone with the Menu pane active: header (back, "Table T4" over "Updating order", Menu | Order pill toggle with blue count badge, kebab), the touch menu browser and the sticky send bar.',
      'Opened from a table card to add items. The Order toggle switches to the order-list screen; below the lg breakpoint only one pane shows. Update Order is hard-coded English in the source.'],
    na: na(), slots: { ...hdr, ...menuS, ...barS }, rtlValues: { ...hdrAr, ...menuAr, ...barAr },
    props: {}, render: (v) => screen(390, 844, header(v, { toggle: true, active: 'menu' }) + `<div class="ucs-pane" data-ui="ury-captain-screen-order-pane">${menu(v)}</div><div class="ucs-bar">${bar(v)}</div>`, 'ury-captain-screen-order-menu', 'ucap ucs'),
    variants: {},
  },
  {
    ...base, id: 'ury-captain-screen-order-list', name: 'URY Captain screen: Order, Order tab', width: 390, height: 844,
    describe: ['Captain order screen with the Order tab: Pax stepper row and the delta-aware list in three groups (Already Ordered gray-500, New / Changed blue-600, Reduction Pending red-600) with the red "Reduce & notify kitchen" link under each confirmed line.',
      'Review and send the order. View-only (no modify permission): amber banner, no toggle, no stepper, no send bar. Empty: "No items yet." with a Browse menu button.'],
    na: na(), slots: { ...hdr, ...listS, ...barS }, rtlValues: { ...hdrAr, ...listAr, ...barAr },
    props: { view: 'list' },
    render: (v, p) => {
      const vo = p.view === 'viewonly';
      return screen(390, 844, header(v, { toggle: !vo, active: 'order' })
        + (vo ? `<div class="ucs-banner" data-ui="ury-captain-screen-order-banner"><p>${v.view_only}</p></div>` : '')
        + `<div class="ucs-pane" data-ui="ury-captain-screen-order-pane">${orderList(v, { viewOnly: vo, empty: p.view === 'empty' })}</div>`
        + (vo ? '' : `<div class="ucs-bar">${bar(v, {})}</div>`), 'ury-captain-screen-order-list', 'ucap ucs');
    },
    variants: {
      'view-only': { props: { view: 'viewonly' }, values: { view_only: "View only — you don't have permission to modify this table's order right now." }, describe: 'canModify false: amber-50 banner under the header, Pax shown as plain text, no Reduce link, no pill toggle and no send bar.' },
      empty: { props: { view: 'empty' }, values: { total: money(0) }, describe: 'No lines yet: ClipboardList 40 in gray-300, "No items yet." and an outline Browse menu button; the send bar total is zero.' },
    },
  },
  {
    ...base, id: 'ury-captain-screen-order-lg', name: 'URY Captain screen: Order, tablet', width: 1280, height: 800, dsf: 2,
    describe: ['Captain order screen at the lg breakpoint (tablet): Menu and Order panes side by side (gap 16, p12, white panels with r8 border) and the total + Update Order bar below (mx12 mb12, r8). The pill toggle is hidden.',
      'Captain on a tablet held landscape (1280x800). View-only shows only the order panel and no send bar.'],
    na: na(), slots: { ...hdr, ...menuS, ...listS, ...barS }, rtlValues: { ...hdrAr, ...menuAr, ...listAr, ...barAr },
    props: {},
    render: (v, p) => screen(1280, 800, header(v, { toggle: false })
      + (p.viewOnly ? `<div class="ucs-banner" data-ui="ury-captain-screen-order-banner"><p>${v.view_only}</p></div>` : '')
      + `<div class="ucs-lg-row" data-ui="ury-captain-screen-order-panes">${p.viewOnly ? '' : `<div class="ucs-lg-panel" data-ui="ury-captain-screen-order-menu-panel">${menu(v)}</div>`}<div class="ucs-lg-panel" data-ui="ury-captain-screen-order-list-panel">${orderList(v, { viewOnly: p.viewOnly })}</div></div>`
      + (p.viewOnly ? '' : `<div class="ucs-lg-bar">${bar(v)}</div>`), 'ury-captain-screen-order-lg', 'ucap ucs'),
    variants: {
      'view-only': { props: { viewOnly: true }, values: { view_only: "View only — you don't have permission to modify this table's order right now." }, describe: 'canModify false: banner, the order panel alone, no send bar.' },
    },
  },
];
