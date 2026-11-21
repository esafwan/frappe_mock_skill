// ury-pos static specs (T07): POS order dialogs. Source of truth /Users/safwan/Code/ury-v16-latest @100c43fe2e (pos/src/components + packages/ui views).
// Fixed UI labels come from pos/src/i18n/locales/{en,ar}.json. Where the source hard-codes English (the product dialog add-ons error, the
// reservation badge "Reserved for", the customer-create fallback errors) the Arabic is a translation of the fixed label only; sample data
// (room, table, customer and invoice names) is deliberately not translated. Currency slots are typed via money().
import { money } from '../lib.mjs';
import { STATE_NA } from '../lib.mjs';
import {
  stage, productDialog, tableSelectDialog, tableTransferDialog, billSplitDialog, billMergeDialog, commentDialog,
  customerPickerWidget, createCustomerDialog,
} from './dialogs.mjs';

const CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/pos-dialogs.css'];
const base = { group: 'pos', static: true, width: 1440, height: 900, dsf: 2, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: STATE_NA.desktop };
const AED = (n, ar) => [money(n), `د.إ ${n.toFixed(2)}`];
const IMG = '../../data/images/mediterranean/hummus.jpg';
const IMG_STATES = '../../../data/images/mediterranean/hummus.jpg';
// table: slotName -> [en, ar|null]; en may be a money() object or {type,sample}
const build = (tbl) => {
  const slots = {}; const rtlValues = {};
  for (const [k, [en, ar]] of Object.entries(tbl)) { slots[k] = en; if (ar != null) rtlValues[k] = ar; }
  return { slots, rtlValues };
};
const CANCEL = ['Cancel', 'إلغاء'];
const LOADING = ['Loading...', 'جاري التحميل...'];

// customer picker strings (packages/ui customer-picker.tsx labels, pos CustomerPicker.tsx)
const CP = {
  search_ph: ['Search customer...', 'ابحث عن عميل...'], change: ['Change', 'تغيير'], add_new: ['Add New Customer', 'إضافة عميل جديد'],
  searching: ['Searching...', 'جاري البحث...'], no_customers: ['No customers found', 'لم يتم العثور على عملاء'], failed_search: ['Failed to search customers', 'فشل البحث عن عملاء'],
  cust1_name: ['Ahmed Khalil', null], cust1_phone: ['+971 50 555 0123', null], cust2_name: ['Fatima Noor', null], cust2_phone: ['+971 55 555 0187', null],
  cust3_name: ['Hassan Ali', null], cust3_phone: ['+971 52 555 0142', null], query: ['Ah', null],
  create_title: ['Add New Customer', 'إضافة عميل جديد'], name_label: ['Name', 'الاسم'], phone_label: ['Phone', 'رقم الهاتف'],
  new_name: ['Ahmed Khalil', null], new_phone: ['+971505550123', null], add_button: ['Add Customer', 'إضافة العميل'], adding: ['Adding Customer...', 'جاري إضافة العميل...'],
  cancel: CANCEL, invalid_phone: ['Invalid mobile number format', 'صيغة رقم الجوال غير صالحة'], create_failed: ['Failed to create customer', 'فشل إنشاء العميل'],
};

// ---------------------------------------------------------------- 1. product dialog
const PRODUCT = {
  item_image: [{ type: 'image', sample: IMG }, null], item_name: ['Hummus', 'حمص'], item_code: ['Hummus', null], course_label: ['Cold Meze', null],
  special_label: ['Special Instructions', 'تعليمات خاصة'], special_ph: ['Add any special instructions or notes for this item...', 'أضف أي تعليمات خاصة أو ملاحظات لهذا العنصر...'],
  special_text: ['', null], qty_label: ['Quantity', 'الكمية'], qty: [{ type: 'number', sample: '1' }, null],
  variants_label: ['Variants', 'الخيارات'], v1_name: ['Hummus', 'حمص'], v1_price: AED(22), v2_name: ['Hummus with Pine Nuts', 'حمص بالصنوبر'], v2_price: AED(28),
  addons_label: ['Add-ons', 'الإضافات'], a1_name: ['Extra Pita Bread', 'خبز بيتا إضافي'], a1_price: AED(3), a2_name: ['Olive Oil Drizzle', 'رشة زيت زيتون'], a2_price: AED(2),
  a3_name: ['Spicy Harissa', 'هريسة حارة'], a3_price: AED(4), loading_addons: ['Loading add-ons...', 'جاري تحميل الإضافات...'], no_addons: ['No add ons', 'لا توجد إضافات'],
  addons_error: ['Failed to fetch item details', 'تعذر جلب تفاصيل الصنف'], total_label: ['Total', 'الإجمالي'], total: AED(22), submit_text: ['Add to Order', 'إضافة إلى الطلب'],
};
const productV = (props, values, extra = {}) => ({ props, values: { item_image: { type: 'image', sample: IMG_STATES }, ...values }, ...extra });
const product = {
  ...base, id: 'pos-product-dialog', name: 'POS Product Dialog', ...build(PRODUCT),
  describe: ['Product configurator dialog of the POS (ProductDialog.tsx wrapping packages/ui ProductConfigurator): item image column, name, code and course, special-instruction input, quantity stepper, single-select variants, multi-select add-ons, running total and the Add to Order / Update Order button. Three equal columns inside a 90rem dialog, white surface.',
    'Shown when a server taps a menu item that has variants or add-ons, or edits a line in the cart. Item name, price and image bind to menu.items[0] through bindings.json.'],
  na: { disabled: 'the disabled state is the submit-disabled variant (quantity 0)', error: 'the error state is the addons-error variant', loading: 'the loading state is the addons-loading variant', empty: 'the empty state is the no-addons variant' },
  props: {},
  render: (v, p) => stage('pos-product-dialog', productDialog(p)),
  variants: {
    'variant-selected': productV({ selVariant: 1 }, { total: money(28) }, { describe: 'Second variant chosen: blue-500 border and blue-50 fill on the variant row; total follows the variant price.' }),
    'addons-selected': productV({ sel: [0, 1] }, { qty: { type: 'number', sample: '2' }, total: money(54), special_text: 'Less lemon, please' }, { describe: 'Two add-ons toggled on, quantity 2 and a special instruction; total = (22 + 3 + 2) x 2.' }),
    'edit-mode': productV({ sel: [0] }, { qty: { type: 'number', sample: '2' }, total: money(50), special_text: 'Less lemon, please', submit_text: 'Update Order' }, { describe: 'Editing a cart line: the submit button reads Update Order.' }),
    'no-image': productV({ img: false }, {}, { describe: 'Item without a photo (or the image failed to load): gray-200 tile with the first two letters of the item name.' }),
    'addons-loading': productV({ addons: 'loading' }, {}, { state: 'loading', describe: 'Add-ons still loading from the Item doc.' }),
    'addons-error': productV({ addons: 'error' }, {}, { state: 'error', describe: 'Add-ons fetch failed: red message in place of the add-on list.' }),
    'no-addons': productV({ addons: 'none', variants: false }, {}, { state: 'empty', describe: 'Item without add-ons (and without variants): gray No add ons note.' }),
    'submit-disabled': productV({ submitDisabled: true }, { qty: { type: 'number', sample: '0' }, total: money(0) }, { state: 'disabled', describe: 'Quantity 0: submit is disabled (50% opacity) and the total is zero.' }),
  },
};

// ---------------------------------------------------------------- 2. table select dialog
const TSEL = {
  title: ['Select Table', 'اختر طاولة'], room1: ['Main Hall', null], room2: ['Terrace', null], room3: ['Private Room', null],
  table1: ['T1', null], table2: ['T2', null], table3: ['T3', null], table4: ['T4', null], table5: ['T5', null], table6: ['T6', null], table7: ['T7', null], table8: ['T8', null], table9: ['T9', null],
  occupied_badge: ['Occupied', 'مشغول'], reserved_badge: ['Reserved for 8:30 PM', 'محجوزة لـ 8:30 م'], merged_label: ['T4 + T6', null],
  warning: ['Table T5 is reserved for 8:30 PM. Please choose another table.', 'الطاولة T5 محجوزة لـ 8:30 م. يرجى اختيار طاولة أخرى.'],
  loading_rooms: ['Loading rooms...', 'جاري تحميل القاعات...'], loading_tables: ['Loading tables...', 'جاري تحميل الطاولات...'],
  no_rooms: ['No rooms found', 'لم يتم العثور على قاعات'], no_tables: ['No tables found', 'لم يتم العثور على طاولات'],
  error_rooms: ['Failed to load rooms', 'فشل في تحميل القاعات'], error_tables: ['Failed to load tables', 'فشل في تحميل الطاولات'],
};
const tableSelect = {
  ...base, id: 'pos-table-select-dialog', name: 'POS Table Select Dialog', ...build(TSEL),
  describe: ['Select Table dialog (TableSelectionDialog.tsx): 672px wide (max-w-2xl), 5/6 of the viewport high, header with close button, room tabs (tab buttons, selected room in primary-50) and a three-column grid of table chips with shape icon, occupied / reserved badges and merged-group label. The source has no search field, so none is drawn.',
    'Shown when a server starts a dine-in order and has to pick the table.'],
  na: { disabled: 'no disabled state in the source', error: 'the error state is the error variant', loading: 'the loading state is the loading-tables variant', empty: 'the empty state is the no-tables variant' },
  props: {},
  render: (v, p) => stage('pos-table-select-dialog', tableSelectDialog(p)),
  variants: {
    'table-selected': { props: { selected: 1 }, describe: 'Currently selected table: primary-600 border and primary-50 fill.' },
    'room-2': { props: { activeRoom: 1 }, describe: 'Second room tab selected.' },
    'merged-label': { props: { merged: true }, describe: 'Occupied table that is part of a merged group shows the combined label in primary-700.' },
    'reserved-warning': { props: { banner: true, selected: -1 }, describe: 'Amber warning banner after tapping a table inside its reservation lock window.' },
    'loading-rooms': { props: { state: 'loading-rooms' }, describe: 'Rooms are loading: spinner with message.' },
    'loading-tables': { props: { state: 'loading-tables' }, state: 'loading', describe: 'Tables of the room are loading.' },
    'no-rooms': { props: { state: 'no-rooms' }, describe: 'Branch has no rooms.' },
    'no-tables': { props: { state: 'no-tables' }, state: 'empty', describe: 'Room has no tables.' },
    error: { props: { state: 'error' }, state: 'error', describe: 'Failed to load rooms/tables: red alert icon with message.' },
  },
};
// no-tables keeps the room tabs, so render them: state 'no-tables' renders tabs + empty message (handled in tableSelectDialog)

// ---------------------------------------------------------------- 3. table transfer dialog (4 pickers)
const TT = {
  transfer_title: ['Transfer table', 'نقل الطاولة'], transfer_desc: ['Move order from T3 to any vacant table in this branch', 'انقل الطلب من T3 إلى أي طاولة فارغة في هذا الفرع'],
  current_table: ['Current table', 'الطاولة الحالية'], source_table: ['T3', null], transfer_search_ph: ['Search by table or room', 'ابحث باسم الطاولة أو الغرفة'],
  room1: ['Main Hall', null], room2: ['Terrace', null],
  dt1_name: ['T1', null], dt1_seats: ['4 Seats', '4 مقاعد'], dt2_name: ['T2', null], dt2_seats: ['2 Seats', '2 مقاعد'],
  dt3_name: ['T7', null], dt3_seats: ['6 Seats', '6 مقاعد'], dt4_name: ['T8', null], dt4_seats: ['4 Seats', '4 مقاعد'],
  cancel: CANCEL, transfer_confirm: ['Transfer', 'نقل'], no_dest: ['No vacant tables available in this branch', 'لا توجد طاولات فارغة متاحة في هذا الفرع'], loading: LOADING,
  transfer_failed: ['Failed to transfer table', 'فشل نقل الطاولة'],
  merge_title: ['Merge with T3', 'دمج مع T3'], merge_desc: ['Select one or more tables to merge with', 'حدد طاولة واحدة أو أكثر للدمج معها'],
  mt1_name: ['T1', null], mt1_seats: ['4 Seats', '4 مقاعد'], mt2_name: ['T2', null], mt2_seats: ['2 Seats', '2 مقاعد'], mt3_name: ['T4', null], mt3_seats: ['4 Seats', '4 مقاعد'],
  mt4_name: ['T5', null], mt4_seats: ['6 Seats', '6 مقاعد'], mt5_name: ['T6', null], mt5_seats: ['2 Seats', '2 مقاعد'], mt6_name: ['T8', null], mt6_seats: ['4 Seats', '4 مقاعد'],
  merge_selected: ['Merge 2 tables', 'دمج 2 طاولات'], merge_confirm: ['Merge', 'دمج'], merging: ['Merging tables...', 'جاري دمج الطاولات...'],
  merge_done: ['Tables merged successfully', 'تم دمج الطاولات بنجاح'], merge_empty: ['No available tables to merge', 'لا توجد طاولات متاحة للدمج'],
  unmerge_title: ['Unmerge table group?', 'إلغاء دمج مجموعة الطاولات؟'], unmerge_desc: ['This will separate T3, T4. They will no longer be linked.', 'سيؤدي هذا إلى فصل T3, T4. لن تكون مرتبطة بعد الآن.'],
  unmerge_confirm: ['Unmerge', 'إلغاء الدمج'],
  captain_title: ['Transfer captain', 'نقل الكابتن'], captain_desc: ['Choose a new captain for this order', 'اختر كابتن جديدًا لهذا الطلب'],
  current_captain: ['Current captain', 'الكابتن الحالي'], captain_current: ['sara.captain@example.com', null], captain_search_ph: ['Search by name or email', 'ابحث بالاسم أو البريد الإلكتروني'],
  cap1_name: ['Omar Nasser', null], cap1_email: ['omar.nasser@example.com', null], cap2_name: ['Layla Haddad', null], cap2_email: ['layla.haddad@example.com', null],
  cap3_name: ['Yusuf Rahman', null], cap3_email: ['yusuf.rahman@example.com', null], no_captains: ['No captains found', 'لم يتم العثور على كباتن'],
};
const tt = (props, extra = {}) => ({ props, ...extra });
const tableTransfer = {
  ...base, id: 'pos-table-transfer-dialog', name: 'POS Table Transfer Dialog', ...build(TT),
  describe: ['Table action dialogs of the dine-in floor, one component with four kinds: transfer (TablePickerDialog: current table, search, vacant tables grouped by room), merge (MultiSelectTableDialog: two-column table checklist with selected-count badge, merging and done phases), unmerge (ConfirmDialog with a danger button) and captain-transfer (UserPickerDialog: current captain, search, captain list).',
    'Shown from the table actions menu (Transfer table, Merge tables, Unmerge tables, Transfer captain).'],
  na: { disabled: 'the disabled state is the unselected confirm button shown in every picker kind', error: 'the error state is the transfer-error variant', loading: 'the loading state is the transfer-loading variant', empty: 'the empty state is the transfer-empty variant' },
  props: { kind: 'transfer' },
  render: (v, p) => stage('pos-table-transfer-dialog', tableTransferDialog(p)),
  variants: {
    transfer: tt({ kind: 'transfer' }, { describe: 'Transfer table: destination list grouped by room, confirm disabled until a table is picked.' }),
    'transfer-selected': tt({ kind: 'transfer', sel: 2 }, { describe: 'Destination chosen: primary border and primary-50/40 fill, Transfer enabled.' }),
    'transfer-loading': tt({ kind: 'transfer', state: 'loading' }, { state: 'loading', describe: 'Destination tables still loading.' }),
    'transfer-empty': tt({ kind: 'transfer', state: 'empty' }, { state: 'empty', describe: 'No vacant tables in the branch.' }),
    'transfer-error': tt({ kind: 'transfer', error: true, sel: 0 }, { state: 'error', describe: 'Transfer rejected: red message above the footer.' }),
    merge: tt({ kind: 'merge' }, { describe: 'Merge with a table: two-column checklist of free tables.' }),
    'merge-selected': tt({ kind: 'merge', sel: [0, 2] }, { describe: 'Two tables ticked: primary borders, count badge in the footer, Merge enabled.' }),
    'merge-occupied-hint': tt({ kind: 'merge', sel: [1] }, { values: { merge_desc: 'Add a free table to this active party', merge_selected: 'Merge 1 tables' }, describe: 'Source table already occupied: description changes to the active-party hint.' }),
    'merge-empty': tt({ kind: 'merge', empty: true }, { describe: 'No free table to merge.' }),
    merging: tt({ kind: 'merge', phase: 'merging' }, { describe: 'Merging phase: pulsing link icon, no close button.' }),
    'merge-done': tt({ kind: 'merge', phase: 'done' }, { describe: 'Done phase: green check and success message.' }),
    unmerge: tt({ kind: 'unmerge' }, { describe: 'Confirm dialog before unmerging a table group; destructive confirm button.' }),
    'captain-transfer': tt({ kind: 'captain' }, { describe: 'Transfer captain: current captain, search and captain list.' }),
    'captain-selected': tt({ kind: 'captain', sel: 1 }, { describe: 'Captain chosen: primary border, Transfer enabled.' }),
    'captain-loading': tt({ kind: 'captain', state: 'loading' }, { describe: 'Captain search in flight.' }),
    'captain-empty': tt({ kind: 'captain', state: 'empty' }, { describe: 'No captain matched.' }),
    'captain-error': tt({ kind: 'captain', state: 'error' }, { describe: 'Captain list failed to load.' }),
  },
};

// ---------------------------------------------------------------- 4. bill split dialog
const BS = {
  split_title: ['Split bill', 'تقسيم الفاتورة'], split_desc: ['Choose items to move to a new bill from INV-0042', 'اختر الأصناف التي سيتم نقلها من INV-0042 إلى فاتورة جديدة'],
  si1_name: ['Hummus', 'حمص'], si1_avail: ['1 available', 'المتاح 1'], si1_amount: AED(22),
  si2_name: ['Moutabal', 'متبّل'], si2_avail: ['3 available', 'المتاح 3'], si2_amount: AED(72),
  si3_name: ['Tabbouleh', 'تبولة'], si3_avail: ['1 available', 'المتاح 1'], si3_amount: AED(26),
  si4_name: ['Fattoush', 'فتوش'], si4_avail: ['2 available', 'المتاح 2'], si4_amount: AED(56),
  move_qty: ['Qty to move', 'الكمية المراد نقلها'], customer_for_new_bill: ['Customer for new bill', 'العميل للفاتورة الجديدة'], same_as_original: ['Same customer as original bill', 'نفس عميل الفاتورة الأصلية'],
  stays_on_bill: ['Stays on original bill', 'تبقى في الفاتورة الأصلية'], stays_total: AED(176), moves_to_new_bill: ['Moves to new bill', 'تنتقل إلى فاتورة جديدة'], moves_total: AED(0),
  cannot_move_all: ['At least one item must remain on the original bill', 'يجب أن يبقى صنف واحد على الأقل في الفاتورة الأصلية'], split_confirm: ['Split bill', 'تقسيم الفاتورة'], cancel: CANCEL,
  ...CP,
};
const bs = (props, values = {}, extra = {}) => ({ props, values, ...extra });
const billSplit = {
  ...base, id: 'pos-bill-split-dialog', name: 'POS Bill Split Dialog', ...build(BS),
  describe: ['Split bill dialog (BillSplitDialog.tsx): checklist of the invoice lines with 12px check boxes, per-line quantity mover for lines with qty above one, the Customer for new bill box (same-as-original checkbox or a customer picker), a stays / moves totals strip and the Split bill button.',
    'Shown from the order actions menu when a bill should be split into two.'],
  na: { disabled: 'the disabled state is the Split bill button with nothing selected (default)', error: 'the error state is the error variant', loading: 'not applicable: the submit label switches to Loading... only while the request is in flight', empty: 'not applicable: the dialog always lists the invoice items' },
  props: {},
  render: (v, p) => stage('pos-bill-split-dialog', billSplitDialog(p)),
  variants: {
    'item-selected': bs({ sel: { 0: 1 } }, { stays_total: money(154), moves_total: money(22) }, { describe: 'One single-quantity line ticked (dark check box, primary-50/40 row); Split bill enabled.' }),
    'qty-move': bs({ sel: { 1: 2 } }, { stays_total: money(128), moves_total: money(48) }, { describe: 'Line with quantity 3: the Qty to move stepper appears, 2 of 3 moving.' }),
    'multi-selected': bs({ sel: { 0: 1, 1: 2 } }, { stays_total: money(106), moves_total: money(70) }, { describe: 'Two lines selected.' }),
    'new-customer': bs({ sel: { 0: 1 }, same: false }, { stays_total: money(154), moves_total: money(22) }, { describe: 'Same-as-original unchecked: customer search field appears.' }),
    'new-customer-selected': bs({ sel: { 0: 1 }, same: false, customer: 'value' }, { stays_total: money(154), moves_total: money(22) }, { describe: 'New-bill customer chosen: name and phone with a Change button.' }),
    error: bs({ sel: { 0: 1, 1: 3 }, error: true }, { stays_total: money(82), moves_total: money(94) }, { state: 'error', describe: 'Validation message when every unit would move off the original bill.' }),
  },
};

// ---------------------------------------------------------------- 5. bill merge dialog
const BM = {
  merge_title: ['Merge bill', 'دمج الفاتورة'], merge_desc: ['Choose a bill to merge into INV-0042', 'اختر فاتورة لدمجها في INV-0042'], search_orders_ph: ['Search Orders', 'ابحث عن الطلبات'],
  mb1_name: ['INV-0043', null], mb1_sub: ['Walk-in Customer • Table T4', 'Walk-in Customer • طاولة T4'], mb1_amount: AED(86),
  mb2_name: ['INV-0044', null], mb2_sub: ['Ahmed Khalil • Table T6', 'Ahmed Khalil • طاولة T6'], mb2_amount: AED(142.5),
  mb3_name: ['INV-0045', null], mb3_sub: ['Walk-in Customer', null], mb3_amount: AED(54),
  mb4_name: ['INV-0046', null], mb4_sub: ['Fatima Noor • Table T2', 'Fatima Noor • طاولة T2'], mb4_amount: AED(210),
  mb5_name: ['INV-0047', null], mb5_sub: ['Walk-in Customer • Table T9', 'Walk-in Customer • طاولة T9'], mb5_amount: AED(37),
  mb6_name: ['INV-0048', null], mb6_sub: ['Hassan Ali • Table T7', 'Hassan Ali • طاولة T7'], mb6_amount: AED(118),
  load_more: ['Load more', 'عرض المزيد'], merge_confirm: ['Merge bills', 'دمج الفواتير'], no_candidates: ['No other open bills available to merge', 'لا توجد فواتير مفتوحة أخرى متاحة للدمج'],
  merge_failed: ['Failed to merge bills', 'فشل دمج الفواتير'], loading: LOADING, cancel: CANCEL,
};
const billMerge = {
  ...base, id: 'pos-bill-merge-dialog', name: 'POS Bill Merge Dialog', ...build(BM),
  describe: ['Merge bill dialog (BillMergeDialog.tsx): 672px dialog capped at 85vh with a search field, a scrolling list of open bills (name, customer and table, amount) and a Load more button. The combined total is not part of this dialog; it appears on the merged bill panel after merging.',
    'Shown from the order actions menu when another open bill should be merged into the current one.'],
  na: { disabled: 'the disabled state is the Merge bills button with no bill selected (default)', error: 'the error state is the error variant', loading: 'the loading state is the loading variant', empty: 'the empty state is the empty variant' },
  props: {},
  render: (v, p) => stage('pos-bill-merge-dialog', billMergeDialog(p)),
  variants: {
    'bill-selected': { props: { sel: 1 }, describe: 'A candidate bill chosen: primary border and primary-50/40 fill; Merge bills enabled.' },
    'no-more': { props: { more: false }, describe: 'All candidates loaded: no Load more button.' },
    loading: { props: { state: 'loading' }, state: 'loading', describe: 'Initial candidate fetch.' },
    empty: { props: { state: 'empty' }, state: 'empty', describe: 'No other open bill to merge.' },
    error: { props: { sel: 0, error: true }, state: 'error', describe: 'Merge rejected: red message under the list.' },
  },
};

// ---------------------------------------------------------------- 6. customer picker
const customerPicker = {
  ...base, id: 'pos-customer-picker', name: 'POS Customer Picker', ...build(CP),
  describe: ['Customer picker (CustomerPicker.tsx wrapping packages/ui CustomerPicker): search field with a dropdown of matching customers (name, phone) and an Add New Customer row; a chosen customer shows as a card with a Change button; Add New opens the Add New Customer dialog (name, phone with country calling code, Add Customer / Cancel).',
    'Used wherever a bill needs a customer: the order sidebar, the bill split dialog and checkout.'],
  na: { disabled: 'not applicable: the disabled state only dims the field', error: 'the error state is the search-error variant', loading: 'the loading state is the searching variant', empty: 'the empty state is the no-results variant' },
  props: {},
  render: (v, p) => (p.dialog
    ? stage('pos-customer-picker', createCustomerDialog(p))
    : stage('pos-customer-picker', `<div class="pd-cp-stage" style="align-self:flex-start">${customerPickerWidget({ list: true, ...p })}</div>`, { scrim: false })),
  variants: {
    searching: { props: { status: 'searching', query: '{{query}}' }, state: 'loading', describe: 'Search request in flight: spinner row above the Add New row.' },
    typed: { props: { query: '{{query}}', hl: 1 }, describe: 'Query typed, second result highlighted (primary-50).' },
    'no-results': { props: { status: 'none', query: '{{query}}' }, state: 'empty', describe: 'No customer matched.' },
    'search-error': { props: { status: 'error', query: '{{query}}' }, state: 'error', describe: 'Search failed.' },
    'add-new-highlighted': { props: { hl: 3 }, describe: 'Keyboard highlight on the Add New Customer row.' },
    selected: { props: { value: true, list: false }, describe: 'Customer chosen: card with name, phone and Change.' },
    create: { props: { dialog: true }, describe: 'Add New Customer dialog opened from the dropdown.' },
    'create-error': { props: { dialog: true, phoneError: '{{invalid_phone}}', error: '{{create_failed}}' }, describe: 'Create failed with an invalid phone: red banner, destructive field border and message.' },
    creating: { props: { dialog: true, creating: true }, describe: 'Create request in flight: submit disabled with spinner and Adding Customer...' },
  },
};

// ---------------------------------------------------------------- 7. comment dialog
const CM = {
  title: ['Order Comments', 'تعليقات الطلب'], label: ['Add comments for this order', 'أضف تعليقات لهذا الطلب'],
  placeholder: ['Enter any special instructions or comments...', 'أدخل أي تعليمات خاصة أو تعليقات...'], comment_text: ['Please bring the bill to the table.', null],
  cancel: CANCEL, save: ['Save Comment', 'حفظ التعليق'],
};
const comment = {
  ...base, id: 'pos-comment-dialog', name: 'POS Comment Dialog', ...build(CM),
  describe: ['Order comment dialog (CommentDialog.tsx wrapping packages/ui CommentDialog): message icon title, label, 128px textarea and Cancel / Save Comment buttons in a 448px dialog.',
    'Shown from the cart when a server adds a note to the whole order.'],
  na: { disabled: 'not applicable: both buttons are always enabled', error: 'not applicable: the dialog has no error state', loading: 'not applicable: the dialog saves synchronously', empty: 'the empty state is the default (placeholder shown)' },
  props: {},
  render: (v, p) => stage('pos-comment-dialog', commentDialog(p)),
  variants: {
    filled: { props: { filled: true }, describe: 'Existing comment loaded into the textarea.' },
    focus: { props: { filled: true, focus: true }, state: 'focus', describe: 'Textarea focused: primary border with the 2px ring and 2px offset.' },
  },
};

export const specs = [product, tableSelect, tableTransfer, billSplit, billMerge, customerPicker, comment];
