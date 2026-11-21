// URY v16 self-order tablet screens (T16): tablet menu (empty / filled cart / idle dialog), product detail inline, and the staff-only portable tablet assignment (PIN, table).
// Sources: self-order/src/layouts/TabletLayout.tsx, PortableTabletAssignment.tsx, shared/ProductDetail.tsx (+ the shared primitives of T14 components.mjs).
// Arabic: the self-order app has no i18n locale; the kit translates only the fixed UI labels, menu names are Arabic menu vocabulary, RTL is a kit extension (the source has no dir handling).
// Currency: the source prints raw server strings; the kit renders typed, formatted currency slots (money()).
import { ic, money, screen } from '../lib.mjs';
import { photo } from './cafe-images.mjs';
import { P, so_css, SAMPLE_IMG, categoryTabs, searchBar, productCard, optionRow, cartPanel } from './components.mjs';

const CSS = [...so_css, 'ury-v16/components/self-order-tablet.css'];
const BASE = { group: 'ury-self-order', static: true, width: 1280, height: 800, dsf: 2, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: 'touch UI: hover/focus are not shown; the source styles only the active/pressed scale transition' };
const aed = (n) => ({ ...money(n), sample: `${Number(n).toFixed(2)} د.إ` });
const RTL_NOTE = 'RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.';
const IDM = P + 'screen-tablet-menu', IDD = P + 'screen-tablet-detail', IDA = P + 'screen-tablet-assign';

const cats = { all: 'All', cat_1: 'Espresso', cat_2: 'Milk Coffee', cat_3: 'Filter & Cold Brew', cat_4: 'Iced', cat_5: 'Tea & Others' };
const catsAr = { all: 'الكل', cat_1: 'إسبريسو', cat_2: 'قهوة بالحليب', cat_3: 'قهوة مفلترة وباردة', cat_4: 'مثلجات', cat_5: 'شاي ومشروبات أخرى' };
const ITEMS = [['Espresso', 'إسبريسو', 12], ['Doppio', 'دوبيو', 16], ['Cortado', 'كورتادو', 18], ['Cappuccino', 'كابتشينو', 18], ['Latte', 'لاتيه', 20], ['Flat White', 'فلات وايت', 20], ['Mocha', 'موكا', 22], ['Croissant', 'كرواسون', 14]];
const STEMS = ['espresso', 'doppio', 'cortado', 'cappuccino', 'latte', 'flat-white', 'mocha', 'croissant'];
const cardSlots = (ar) => Object.fromEntries(ITEMS.flatMap(([en, a, r], i) => [['m' + (i + 1) + '_img', photo(STEMS[i])], ['m' + (i + 1) + '_name', ar ? a : en], ['m' + (i + 1) + '_rate', ar ? aed(r) : money(r)]]));
const cartSlots = { cart_title: 'Cart', c1_name: 'Latte', c1_qty: '1', c1_amount: money(20), c2_name: 'Croissant', c2_qty: '2', c2_amount: money(28), empty_text: 'Tap a menu item to add it to your cart.', count_label: '3 items', cart_total: money(48), place_order: 'Place Order' };
const cartSlotsAr = { cart_title: 'السلة', c1_name: 'لاتيه', c1_amount: aed(20), c2_name: 'كرواسون', c2_amount: aed(28), empty_text: 'اضغط على عنصر من القائمة لإضافته إلى السلة.', count_label: '3 عناصر', cart_total: aed(48), place_order: 'تأكيد الطلب' };
const idleSlots = { idle_title: 'Still there?', idle_still_here: "I'm still here", idle_close: 'Close' };
const idleSlotsAr = { idle_title: 'هل ما زلت هنا؟', idle_still_here: 'ما زلت هنا', idle_close: 'إغلاق' };
const na = { disabled: 'not applicable: no distinct disabled state on this screen', error: 'not applicable: the error banner prints a dynamic server message and is not a distinct designed state', loading: 'not applicable: the "Loading menu…" screen is a separate state not captured here' };

// Shared chrome: header (TabletLayout) + body + optional idle overlay.
const header = (id) => `<header class="sot-head" data-ui="${id}.header"><h1 class="sot-title">{{title}}</h1><button type="button" class="sot-new" data-ui="${id}.new-order">{{new_order}}</button></header>`;
const cart = (id, p) => cartPanel({ ...phv(CART_KEYS), }, { order: false, items: p.cart ? 2 : 0, ui: id + '.cart' });
const CART_KEYS = ['cart_title', 'c1_name', 'c1_qty', 'c1_amount', 'c2_name', 'c2_qty', 'c2_amount', 'empty_text', 'count_label', 'cart_total', 'place_order'];
const phv = (keys) => Object.fromEntries(keys.map((k) => [k, `{{${k}}}`]));
const idle = (id) => `<div class="sot-overlay" data-ui="${id}.idle"><div class="u-dialog-wrap"><div class="u-dialog-scrim"></div>
<div class="u-dialog u-dialog--md" role="dialog" aria-modal="true"><button type="button" class="u-dialog-close" aria-label="Close">${ic('X', 16)}<span class="u-sr-only">{{idle_close}}</span></button>
<div class="u-dialog-header"><h2 class="u-dialog-title">{{idle_title}}</h2></div><div class="u-dialog-footer"><button type="button" class="sot-idle-btn" data-ui="${id}.idle.still-here">{{idle_still_here}}</button></div></div></div></div>`;
const shell = (id, main, p) => screen(1280, 800, `${header(id)}<div class="sot-body" data-ui="${id}.body"><main class="sot-main" data-ui="${id}.main">${main}</main>${cart(id, p)}</div>${p.idle ? idle(id) : ''}`, id, 'so sot');

const menuMain = (v, p) => {
  const cards = ITEMS.map((_, i) => {
    const n = i + 1, q = p.cart ? (n === 5 ? 1 : n === 8 ? 2 : 0) : 0;
    return productCard({ name: v['m' + n + '_name'], rate: v['m' + n + '_rate'], in_cart: v['m' + n + '_in_cart'], img: v['m' + n + '_img'], unavail: '' }, { size: 'tablet', qty: q, ui: IDM + '.card-' + n });
  }).join('');
  return `<div class="sot-pane">${categoryTabs(v, { active: 0, n: 5, ui: IDM + '.tabs' })}<div class="sot-search">${searchBar(v, { ui: IDM + '.search' })}</div><div class="sot-grid" data-ui="${IDM}.grid">${cards}</div></div>`;
};

const detailMain = (v, p) => {
  const opt = (pre, n, sel) => Array.from({ length: n }, (_, i) => optionRow({ name: v[pre + (i + 1) + '_name'], rate: v[pre + (i + 1) + '_rate'] }, { selected: sel.includes(i + 1), ui: `${IDD}.${pre}row-${i + 1}` })).join('');
  const group = (label, key, html) => `<div class="sot-detail__group"><div class="sot-detail__label">{{${label}}}</div><div class="sot-detail__list" data-ui="${IDD}.${key}">${html}</div></div>`;
  return `<div class="sot-detail" data-ui="${IDD}.detail"><div class="sot-detail__back"><button type="button" class="sot-detail__backbtn" data-ui="${IDD}.back"><span class="so-flip">${ic('ChevronLeft', 16)}</span>{{back}}</button></div>
<img class="sot-detail__img" src="{{detail_img}}" alt="{{name}}" data-ui="${IDD}.image"><div class="sot-detail__info"><div><h1 class="sot-detail__name">{{name}}</h1><p class="sot-detail__desc">{{desc}}</p></div>
<div class="sot-detail__rate">{{rate}}</div>${p.options === false ? '' : group('variants_label', 'variants', opt('v', 2, p.sel ?? [1])) + group('addons_label', 'addons', opt('a', 2, p.sel ? [] : [2]))}
<div class="sot-detail__qty" data-ui="${IDD}.qty"><button type="button" class="sot-detail__step" aria-label="Decrease quantity">${ic('Minus', 16)}</button><div class="sot-detail__n">{{qty}}</div><button type="button" class="sot-detail__step" aria-label="Increase quantity">${ic('Plus', 16)}</button></div>
<button type="button" class="sot-detail__add" data-ui="${IDD}.add">{{add_to_cart}}</button></div></div>`;
};

// Assignment screen (PortableTabletAssignment). p: {step, pin (digits entered), error, table (filled), submitting}
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'];
const assign = (p = {}) => {
  const pin = p.pin ?? 4, step = p.step || 'pin';
  const err = p.error ? `<div class="sota-err" role="alert" data-ui="${IDA}.error"><div class="sota-err__t">{{error_title}}</div><div>{{error_msg}}</div></div>` : '';
  const boxes = Array.from({ length: 6 }, (_, i) => `<div class="sota-box${i < pin ? ' sota-box--on' : ''}">${i < pin ? '•' : ''}</div>`).join('');
  const keys = KEYS.map((k) => (k === '' ? '<div></div>' : `<button type="button" class="sota-key">${k}</button>`)).join('');
  const pinStep = `<div class="sota-step" data-ui="${IDA}.pin-step"><div class="sota-field"><label class="sota-label" for="pin-display">{{pin_label}}</label><p class="sota-hint">{{pin_hint}}</p></div>
<div class="sota-pin" id="pin-display" aria-label="PIN entry" data-ui="${IDA}.pin-display">${boxes}</div><div class="sota-keys" data-ui="${IDA}.keypad">${keys}</div>
<button type="button" class="sota-btn"${pin < 4 ? ' disabled' : ''} data-ui="${IDA}.continue">{{continue}}</button></div>`;
  const dis = p.submitting ? ' disabled' : '';
  const tableStep = `<div class="sota-step" data-ui="${IDA}.table-step"><div class="sota-field"><label class="sota-label" for="table-input">{{table_label}}</label><p class="sota-hint">{{table_hint}}</p></div>
<div class="sota-inwrap"><input id="table-input" class="sota-input${p.table && !p.submitting ? ' sota-input--focus' : ''}" type="text" readonly${dis} placeholder="{{table_placeholder}}" value="${p.table ? '{{table_value}}' : ''}" data-ui="${IDA}.table-input">${p.table ? '<p class="sota-hint">{{char_count}}</p>' : ''}</div>
<button type="button" class="sota-btn"${!p.table || p.submitting ? ' disabled' : ''} data-ui="${IDA}.assign">${p.submitting ? '<span class="sota-spin"></span>{{assigning}}' : '{{assign}}'}</button>
<button type="button" class="sota-back"${dis} data-ui="${IDA}.back">{{back}}</button></div>`;
  return screen(1280, 800, `<div class="sota-head" data-ui="${IDA}.head"><h1 class="sota-h1">{{title}}</h1><p class="sota-sub">{{subtitle}}</p></div>${err}${step === 'pin' ? pinStep : tableStep}`, IDA, 'so sota');
};

const menuSlots = { title: 'Table T12', new_order: 'New Order', ...cats, placeholder: 'Search menu...', ...cardSlots(false), m5_in_cart: 'In cart: 1', m8_in_cart: 'In cart: 2', ...cartSlots, ...idleSlots };
const menuRtl = { title: 'طاولة T12', new_order: 'طلب جديد', ...catsAr, placeholder: 'ابحث في القائمة...', ...cardSlots(true), m5_in_cart: 'في السلة: 1', m8_in_cart: 'في السلة: 2', ...cartSlotsAr, ...idleSlotsAr };

const detailSlots = { title: 'Table T12', new_order: 'New Order', back: 'Back', detail_img: photo('latte'), name: 'Latte', desc: 'Double-shot espresso with steamed milk.', rate: money(20), variants_label: 'Variants', v1_name: 'Regular', v1_rate: money(20), v2_name: 'Large', v2_rate: money(24),
  addons_label: 'Add-ons', a1_name: 'Extra shot', a1_rate: money(4), a2_name: 'Oat milk', a2_rate: money(3), qty: '1', add_to_cart: 'Add to cart', ...cartSlots };
const detailRtl = { title: 'طاولة T12', new_order: 'طلب جديد', back: 'رجوع', name: 'لاتيه', desc: 'إسبريسو مزدوج مع حليب مبخّر.', rate: aed(20), variants_label: 'الخيارات', v1_name: 'عادي', v1_rate: aed(20), v2_name: 'كبير', v2_rate: aed(24), addons_label: 'الإضافات', a1_name: 'جرعة إسبريسو إضافية', a1_rate: aed(4), a2_name: 'حليب الشوفان', a2_rate: aed(3), add_to_cart: 'أضف إلى السلة', ...cartSlotsAr };

const assignSlots = { title: 'Assign This Tablet', subtitle: 'Bind a portable tablet to a table', pin_label: 'Staff PIN', pin_hint: 'Enter the 4-6 digit PIN to proceed', continue: 'Continue', table_label: 'Table Name or Code', table_hint: 'Enter the table identifier to assign',
  table_placeholder: 'e.g. T12, Table A, 5', table_value: 'T12', char_count: '3 characters', assign: 'Assign Table', assigning: 'Assigning…', back: 'Back', error_title: 'Assignment Failed', error_msg: 'Could not assign this table. Please check the PIN and try again.' };
const assignRtl = { title: 'تعيين هذا الجهاز اللوحي', subtitle: 'ربط جهاز لوحي متنقل بطاولة', pin_label: 'رمز PIN للموظف', pin_hint: 'أدخل رمز PIN من 4 إلى 6 أرقام للمتابعة', continue: 'متابعة', table_label: 'اسم الطاولة أو رمزها', table_hint: 'أدخل معرّف الطاولة المراد تعيينها',
  table_placeholder: 'مثال: T12، طاولة A، 5', char_count: '3 أحرف', assign: 'تعيين الطاولة', assigning: 'جارٍ التعيين…', back: 'رجوع', error_title: 'فشل التعيين', error_msg: 'تعذّر تعيين هذه الطاولة. يرجى التحقق من رمز PIN والمحاولة مرة أخرى.' };

export const specs = [
  { ...BASE, id: IDM, name: 'Self-order tablet menu screen', slots: menuSlots, rtlValues: menuRtl, na,
    render: (v, p) => shell(IDM, menuMain(v, p), p), props: { cart: true },
    variants: {
      'empty-cart': { props: { cart: false }, values: { count_label: '0 items', cart_total: money(0) }, describe: 'Nothing in the cart: no "In cart" badges on the cards, the hint text shows in the cart panel and Place Order is disabled (opacity-50).' },
      'cart-filled': { props: { cart: true }, describe: 'Latte (1) and Croissant (2) in the cart: the cards carry the primary "In cart: N" badge and the cart panel lists the lines with the total.' },
      'idle-dialog': { props: { cart: true, idle: true }, describe: 'useIdleReset fired: the "Still there?" dialog overlays the whole layout on a blurred scrim with a full-width "I\'m still here" button.' } },
    describe: ['TabletLayout menu at 1280x800: header (px-6 py-4, border-b, H1 20/600 "Table T12", "New Order" button px-3 py-2 rounded-md border), then a split body: main pane 68% (p-6: category chips, search, 4-column grid gap-4 of cards min-w-150 rounded-xl with h-32 images) and the persistent CartPanel 32% (border-s, p-4).', 'Use for a tablet handed to a customer or fixed at a table. Base capture is the cart-filled state. Currency is a typed slot. ' + RTL_NOTE] },
  { ...BASE, id: IDD, name: 'Self-order tablet product detail screen', slots: detailSlots, rtlValues: detailRtl, na,
    render: (v, p) => shell(IDD, detailMain(v, p), { cart: true }), props: {},
    variants: {
      'nothing-selected': { props: { sel: [] }, describe: 'No variant or add-on chosen: every option row uses border-border.' },
      'no-options': { props: { options: false }, describe: 'The item has no variants or add-ons: the Variants and Add-ons groups are not rendered, only quantity and Add to cart.' } },
    describe: ['TabletLayout with screen === "detail": ProductDetail replaces the menu grid inside the 68% main pane (the header and the 32% CartPanel stay): Back link, full-width image, name 20/600, description, rate 18/500, Variants and Add-ons option rows, round -/+ quantity stepper and a full-width rounded-full "Add to cart" button.', 'Opened when product_detail_enabled is set and a card is tapped. The detail image is a wide sample photo (the source image keeps its natural aspect ratio). ' + RTL_NOTE] },
  { ...BASE, id: IDA, name: 'Self-order portable tablet assignment screen', slots: assignSlots, rtlValues: assignRtl, na,
    render: (v, p) => assign(p), props: { step: 'pin', pin: 4 },
    variants: {
      'pin-empty': { props: { step: 'pin', pin: 0 }, describe: 'No digits entered: six empty boxes (border-input) and the Continue button disabled (fewer than 4 digits).' },
      'pin-full': { props: { step: 'pin', pin: 6 }, describe: 'Maximum of six digits entered; the keypad ignores further taps.' },
      'pin-error': { props: { step: 'pin', pin: 0, error: true }, describe: 'A failed assignment returns to the PIN step with a cleared PIN and the destructive "Assignment Failed" alert above it.' },
      'table-empty': { props: { step: 'table' }, describe: 'Second step: free-text table field with its placeholder; Assign Table is disabled until a value is typed.' },
      'table-filled': { props: { step: 'table', table: true }, describe: 'A table typed: the field is focused (border-primary, ring) with a character count and Assign Table enabled.' },
      assigning: { props: { step: 'table', table: true, submitting: true }, describe: 'assign_device_table in flight: spinner and "Assigning…", the field, Assign and Back disabled (opacity-50).' } },
    describe: ['PortableTabletAssignment: staff provisioning, not a customer screen. A portable/shared URY Ordering Device has no table until staff enter the 4-6 digit PIN on the keypad (64px keys, rounded-xl border-2) and then a table name or code; the PIN is only verified server-side at assignment.', 'Shown once, before the tablet is handed to a customer; after a successful assignment the tablet menu takes over. Base capture is the PIN step with four digits. ' + RTL_NOTE] },
];
