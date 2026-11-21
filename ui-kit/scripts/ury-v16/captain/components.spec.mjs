// ury-captain components (T12): table card, order line, menu pane, actions menu, service requests, send bar.
// Source: ury-erp/version-16 @100c43fe2e. pos/src/captain/components/*, pos/src/captain/pages/CaptainOrder.tsx, pos/src/components/MenuCard.tsx,
// packages/ui menu-item-card. Arabic comes from pos/src/i18n/locales/ar.json (captain.*, pos_ui.*, menu.*, tables.*, dashboard.*).
// Where the source has no Arabic key (hard-coded English: Free, Mine, Billed, Update Order, request types Bill / Assistance, Ack pill text)
// only the fixed UI label is translated here (tables.available, tables.occupied, captain.billed_locked, captain.ack, ...). Item and owner names are demo data.
import { money } from '../lib.mjs';
import { STATE_NA } from '../lib.mjs';
import { tableCard, orderLine, menuPane, actionsMenu, serviceRequests, sendBar, IMG } from './components.mjs';

const base = {
  group: 'ury-captain', static: true, width: 390, dsf: 3, canvas: 'hsl(var(--background))', darkTheme: 'dark', modes: ['light', 'dark', 'rtl'],
  css: ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/captain.css'],
  naDefault: STATE_NA.touch,
};
const na = (extra = {}) => ({ disabled: 'not applicable: this component has no distinct disabled variant', error: 'not applicable: this component has no error variant', loading: 'not applicable: this component has no loading variant', empty: 'not applicable: this component has no empty variant', ...extra });

export const specs = [
  {
    ...base, id: 'ury-captain-table-card', name: 'URY Captain table card',
    describe: ['Captain "Tables" home card: table name, status badge (Free / Mine / owner name / Billed), owner row, elapsed time and bill total, seats. Free = emerald, Mine = sky, Occupied by another captain = amber, Billed = slate with a Lock, Merged adds a "+ T2, T3" line. The attention-timer variant is the newer frontend/ copy (AlertTriangle, destructive tint, 4px inline-start border).',
      'Captain tables grid (2 columns, 177px cards at 390px). Tap target only; no cashier chrome. Labels Free/Mine/Billed are hard-coded English in the source; the Arabic labels are translated UI words (tables.available, captain.billed_locked).'],
    na: na(),
    slots: { table_name: 'T1', status: 'Rashid K.', owner_name: 'Rashid K.', merge_list: 'T2, T3', elapsed: '45m', total: money(86.5), seats: '4' },
    rtlValues: { status: 'راشد', owner_name: 'راشد' },
    props: { state: 'occupied', merge: true },
    render: (v, p) => tableCard(v, p),
    variants: {
      free: { props: { state: 'free', merge: false }, values: { table_name: 'T3', status: 'Free', seats: '2' }, describe: 'Free table: emerald-300 border, emerald-50 fill, emerald-900 text, success badge, seats only.' },
      mine: { props: { state: 'mine', merge: false }, values: { table_name: 'T5', status: 'Mine', elapsed: '12m', total: money(54) }, describe: 'Table owned by the signed-in captain: sky-400 / sky-50 / sky-900, info badge, no owner row.' },
      occupied: { props: { state: 'occupied', merge: false }, values: { table_name: 'T7', elapsed: '1h 5m', total: money(132.25) }, describe: 'Occupied by another captain: amber-400 / amber-50 / amber-900, warning badge with the owner name, owner row (User 12), elapsed and total.' },
      billed: { props: { state: 'billed', merge: false }, values: { table_name: 'T4', status: 'Billed', elapsed: '1h 20m', total: money(210) }, describe: 'Invoice printed: slate-400 / slate-100 / slate-900, Lock 16 in the header, secondary "Billed" badge.' },
      merged: { props: { state: 'occupied', merge: true }, values: { table_name: 'T1' }, describe: 'Merged cluster: the "+ T2, T3" line (12/500, opacity .8) under the table name.' },
      'attention-newer': { props: { state: 'attention', merge: false }, values: { table_name: 'T9', elapsed: '1h 25m', total: money(96.75) }, describe: 'newer (frontend/ copy): open longer than the branch attention threshold. AlertTriangle in the header, destructive border/tint/text, 1px border with 4px inline-start border, radius 8, gap 4.' },
    },
  },
  {
    ...base, id: 'ury-captain-order-line', name: 'URY Captain order line',
    describe: ['One row of the delta-aware order list: "<qty> x name", optional comment, line price and round 36px action buttons. delta (new/changed, blue) has Minus and Plus; reduction (pending reduction, red, struck through) has RotateCcw; confirmed (already ordered, white) has Minus and a red Trash2.',
      'Captain order screen, Current Order list (366px wide at 390px).'],
    na: na(),
    slots: { qty_label: '+2', item_name: 'Falafel', comment: 'No onions', price: money(48) },
    rtlValues: { item_name: 'فلافل', comment: 'بدون بصل' },
    props: { variant: 'delta', comment: true },
    render: (v, p) => orderLine(v, p),
    variants: {
      delta: { props: { variant: 'delta', comment: true }, values: {}, describe: 'New or changed line: blue-50 background, blue-900 text "+2 x name", Minus and Plus buttons.' },
      'delta-no-comment': { props: { variant: 'delta', comment: false }, values: { qty_label: '+1', item_name: 'Hummus', price: money(22) }, describe: 'Delta line without a note: only the name and price lines.' },
      reduction: { props: { variant: 'reduction', comment: false }, values: { qty_label: '−1', item_name: 'Kibbeh', price: money(32) }, describe: 'Pending reduction: red-50 background, red-900 text with line-through, RotateCcw undo button.' },
      confirmed: { props: { variant: 'confirmed', comment: true }, values: { qty_label: '2', item_name: 'Fattoush', comment: 'Dressing on the side', price: money(56) }, describe: 'Already ordered: white background, Minus and a red-200 / red-600 Trash2 button.' },
    },
  },
  {
    ...base, id: 'ury-captain-menu-pane', name: 'URY Captain menu pane',
    describe: ['Touch menu browser of the captain order screen: sticky search (16px text), category chips (selected = blue-600), 2-column MenuCard grid (gap 12) with availability tags. Each card is a 240px high menu-item card (96px photo).',
      'Captain order screen, Menu tab. Browse-only variant: the captain may look but not add items, so an amber note shows and the cards are disabled. Item names, prices and photos bind to data/menus via bindings.json (--menu).'],
    na: na(),
    slots: {
      search_placeholder: 'Search menu', chip_all: 'All', chip_2: 'Cold Meze', chip_3: 'Hot Meze', chip_4: 'Grills & Kebabs', chip_5: 'Shawarma & Wraps',
      note: "You can browse the menu, but you don't have permission to add items to this order.",
      name_1: 'Hummus', course_1: 'Cold Meze', price_1: money(22), image_1: { type: 'image', sample: IMG.hummus }, tag_1: 'Available',
      name_2: 'Falafel', course_2: 'Hot Meze', price_2: money(24), image_2: { type: 'image', sample: IMG.falafel }, tag_2: '3 left',
      name_3: 'Fattoush', course_3: 'Cold Meze', price_3: money(28), image_3: { type: 'image', sample: IMG.fattoush }, tag_3: 'Unavailable',
      name_4: 'Kibbeh', course_4: 'Hot Meze', price_4: money(32), image_4: { type: 'image', sample: IMG.kibbeh }, tag_4: '12 left',
    },
    rtlValues: {
      search_placeholder: 'ابحث في القائمة', chip_all: 'الكل', chip_2: 'المقبلات الباردة', chip_3: 'المقبلات الساخنة', chip_4: 'المشاوي والكباب', chip_5: 'الشاورما واللفائف',
      note: 'يمكنك تصفح القائمة، لكن ليس لديك صلاحية لإضافة أصناف إلى هذا الطلب.',
      name_1: 'حمص', course_1: 'المقبلات الباردة', name_2: 'فلافل', course_2: 'المقبلات الساخنة', name_3: 'فتوش', course_3: 'المقبلات الباردة', name_4: 'كبة', course_4: 'المقبلات الساخنة',
      tag_1: 'متاح', tag_2: 'متبقي 3', tag_3: 'غير متاح', tag_4: 'متبقي 12',
    },
    props: {},
    render: (v, p) => menuPane(v, p),
    variants: {
      untagged: { props: { untagged: true }, values: {}, describe: 'Cards without availability tags (the captain screen passes no branch/company, so MenuCard shows no tag).' },
      'browse-only': { props: { browse: true }, state: 'disabled', values: {}, describe: 'canAddItems = false: amber note under the chips and every card disabled (opacity .5).' },
    },
  },
  {
    ...base, id: 'ury-captain-actions-menu', name: 'URY Captain actions menu',
    describe: ['Overflow menu of the captain order screen: MoreVertical trigger and a 224px panel with Reprint KOT, Transfer table, Transfer captain and Print bill (16px icons, 14px gray-700, 10px 16px padding).',
      'Top bar of the captain order screen. Items the captain may not use are not rendered (print-bill-only variant); a running reprint/print shows Loader2 and disables the item.'],
    na: na(),
    slots: { reprint_kot: 'Reprint KOT', transfer_table: 'Transfer table', transfer_captain: 'Transfer captain', print_bill: 'Print bill' },
    rtlValues: { reprint_kot: 'إعادة طباعة أمر المطبخ', transfer_table: 'نقل الطاولة', transfer_captain: 'نقل الكابتن', print_bill: 'طباعة الفاتورة' },
    props: {},
    render: (v, p) => actionsMenu(v, p),
    variants: {
      closed: { props: { open: false }, values: {}, describe: 'Closed: only the MoreVertical trigger.' },
      'print-bill-only': { props: { only: true }, values: {}, describe: 'Permission gated: only Print bill is rendered.' },
      'reprinting-kot': { props: { busy: 'kot' }, state: 'loading', values: {}, describe: 'KOT reprint in flight: Loader2 replaces the Printer icon and the item is disabled.' },
      'printing-bill': { props: { busy: 'bill' }, values: {}, describe: 'Bill print in flight: Loader2 replaces the Receipt icon and the item is disabled.' },
    },
  },
  {
    ...base, id: 'ury-captain-service-requests', name: 'URY Captain service requests',
    describe: ['Service request bell (48px, amber with a red count badge) and the 320px panel: title, close, rows "Table T1 · Assistance" with Clock meta, optional amber "Acknowledged" pill, Ack and resolve (Check) buttons.',
      'Floating over the captain screens. Request types are Bill and Assistance in the source; the panel polls open requests.'],
    na: na(),
    slots: {
      title: 'Service Requests', count: '3', acknowledged: 'Acknowledged', ack: 'Ack', empty: 'No open requests',
      row_1: 'Table T1 · Assistance', elapsed_1: '2 min ago', row_2: 'Table T4 · Bill', elapsed_2: '5 min ago', row_3: 'Table T2 · Assistance', elapsed_3: 'just now',
    },
    rtlValues: {
      title: 'طلبات الخدمة', acknowledged: 'تم الاستلام', ack: 'استلام', empty: 'لا توجد طلبات مفتوحة',
      row_1: 'الطاولة T1 · مساعدة', elapsed_1: 'منذ 2 دقيقة', row_2: 'الطاولة T4 · الفاتورة', elapsed_2: 'منذ 5 دقيقة', row_3: 'الطاولة T2 · مساعدة', elapsed_3: 'للتو',
    },
    props: {},
    render: (v, p) => serviceRequests(v, p),
    variants: {
      collapsed: { props: { open: false, count: 3 }, values: {}, describe: 'Panel closed: only the amber bell with the red count badge.' },
      'empty-panel': { props: { open: true, rows: 0, count: 0 }, state: 'empty', values: {}, describe: 'No open requests: panel shows "No open requests", the bell is white with a border and no badge.' },
      resolving: { props: { open: true, busy: true }, state: 'loading', values: {}, describe: 'Resolve in flight on the first row: Loader2 replaces the Check icon.' },
    },
  },
  {
    ...base, id: 'ury-captain-send-bar', name: 'URY Captain send bar',
    describe: ['Sticky primary action of the captain order screen: "Total" (14/600) with the amount (18/600) and a full width 48px default button (16px text): Send Order, Update Order, or the in-flight Loader2 state.',
      'Bottom of the captain order screen on mobile (390px).'],
    na: na(),
    slots: { total_label: 'Total', total: money(78), button: 'Send Order' },
    rtlValues: { total_label: 'الإجمالي', button: 'إرسال الطلب' },
    props: {},
    render: (v, p) => sendBar(v, p),
    variants: {
      update: { props: {}, values: { button: 'Update Order', total: money(134.5) }, describe: 'Existing order being changed: label "Update Order" (hard-coded English in the source).' },
      sending: { props: { busy: true }, state: 'loading', values: { button: 'Sending…' }, describe: 'Submitting a new order: Loader2 and "Sending…", button disabled (opacity .5).' },
      updating: { props: { busy: true }, values: { button: 'Updating…', total: money(134.5) }, describe: 'Submitting an update: Loader2 and "Updating…".' },
    },
  },
];
