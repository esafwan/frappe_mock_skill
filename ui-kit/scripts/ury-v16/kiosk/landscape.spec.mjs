// URY v16 landscape kiosk screens (T17): menu, product detail modal, cart, checkout, order status. 1920x1080 @1.
// Sources: self-order/src/layouts/LandscapeKioskLayout.tsx and layouts/shared/{CartPage,CheckoutScreen,OrderStatusScreen,CartPanel,ProductCard,ProductDetail,CategoryTabs,SearchBar}.tsx
// (ury-erp/version-16 @100c43fe2e). No welcome/attract screen exists in the source and none is invented.
// Arabic: the self-order app has no i18n/locale file; the fixed UI labels are translated by the kit (author translations, NEED NATIVE REVIEW) and the menu vocabulary is Arabic.
// RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties.
// Currency: the source prints raw server strings / numbers; the kit renders every amount as a formatted typed currency slot (money()).
// Scrollbars are not drawn (overflow-y-auto regions are clipped); the detail modal "options" variants show the panel scrolled to its end.
import { ic, money, screen } from '../lib.mjs';
import { MENU, CATS, CATS_AR, LATTE, CAPP, imgSlots, detailImg, stateImages } from './menu.mjs';

const G = 'ury-kiosk-screen-landscape-';
const CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/kiosk-landscape.css'];
const BASE = { group: 'ury-kiosk', static: true, width: 1920, height: 1080, dsf: 1, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: 'touch UI: hover/focus are not shown; the source styles only the active/pressed scale transition' };
const NA = { hover: 'touch UI: no hover state', focus: 'touch UI: no focus state', disabled: 'not applicable: only the disabled buttons shown as variants', error: 'not applicable: no distinct error state in this screen', loading: 'not applicable: no loading state in this screen', empty: 'not applicable: no empty state in this screen' };
const RTL_NOTE = 'Fixed UI labels are author translations for RTL (the self-order app has no locale file) and NEED NATIVE REVIEW; RTL is a kit extension.';
const aed = (n) => ({ ...money(n), sample: `${Number(n).toFixed(2)} د.إ` });
const E = (o) => o;

// ---- shared menu (menu.mjs): 5 courses x 3 items, one photo per item
const ITEMS = MENU;
const IMG = (i) => 'i' + (i + 1) + '_img';

const menuSlots = () => {
  const s = { title: 'Order for Pickup', new_order: 'New Order', all: 'All', placeholder: 'Search menu...', query: 'Sandwich',     no_results: 'No items match your search.', no_items: 'No items available.', in_cart_1: 'In cart: 1', in_cart_2: 'In cart: 2', unavail: 'Sold out',
    order_title: 'Your order so far', cart_title: 'Cart', total_label: 'Total', o1_name: 'Espresso', o1_qty: '1', o1_amount: money(10), o2_name: 'Doppio', o2_qty: '1', o2_amount: money(14), order_total: money(24),
    c1_name: 'Latte', c1_qty: '1', c2_name: 'Cappuccino', c2_qty: '2', empty_text: 'Tap a menu item to add it to your cart.', count_label: '3 items', cart_total: money(48),
    place_order: 'Place Order', placing: 'Placing order…', pay_online: 'Pay Online', request_bill: 'Request Bill',
    idle_title: 'Still there?', still_here: "I'm still here", close: 'Close' };
  CATS.forEach((c, i) => (s['cat_' + (i + 1)] = c));
  ITEMS.forEach((it, i) => { s['i' + (i + 1) + '_name'] = it.n; s['i' + (i + 1) + '_rate'] = money(it.r); });
  Object.assign(s, imgSlots(IMG));
  return s;
};
const menuRtl = () => {
  const s = { title: 'طلب للاستلام', new_order: 'طلب جديد', all: 'الكل', placeholder: 'ابحث في القائمة...', query: 'ساندويتش', no_results: 'لا توجد عناصر تطابق بحثك.', no_items: 'لا توجد عناصر متاحة.',
    in_cart_1: 'في السلة: 1', in_cart_2: 'في السلة: 2', unavail: 'نفد المخزون', order_title: 'طلبك حتى الآن', cart_title: 'السلة', total_label: 'المجموع',
    o1_name: 'إسبريسو', o1_amount: aed(10), o2_name: 'دوبيو', o2_amount: aed(14), order_total: aed(24), c1_name: 'لاتيه', c2_name: 'كابتشينو',
    empty_text: 'اضغط على عنصر من القائمة لإضافته إلى السلة.', count_label: '3 عناصر', cart_total: aed(48), place_order: 'تأكيد الطلب', placing: 'جارٍ إرسال الطلب…',
    pay_online: 'الدفع عبر الإنترنت', request_bill: 'طلب الفاتورة', idle_title: 'هل ما زلت هنا؟', still_here: 'ما زلت هنا', close: 'إغلاق' };
  CATS_AR.forEach((c, i) => (s['cat_' + (i + 1)] = c));
  ITEMS.forEach((it, i) => { s['i' + (i + 1) + '_name'] = it.ar; s['i' + (i + 1) + '_rate'] = aed(it.r); });
  return s;
};

// ---- markup helpers
const hdr = (v, id) => `<header class="kl-head" data-ui="${id}.header"><h1 class="kl-title">${v.title}</h1><button type="button" class="kl-new" data-ui="${id}.new-order">${v.new_order}</button></header>`;
const tabs = (v, id, active, n = 5) => {
  const c = (on) => (on ? 'kl-chip kl-chip--on' : 'kl-chip kl-chip--off');
  const chips = [`<button type="button" class="${c(active === 0)}" data-ui="${id}.tab-all">${v.all}</button>`];
  for (let i = 1; i <= n; i++) chips.push(`<button type="button" class="${c(active === i)}" data-ui="${id}.tab-${i}">${v['cat_' + i]}</button>`);
  return `<nav class="kl-tabs" aria-label="Menu categories" data-ui="${id}.tabs">${chips.join('')}</nav>`;
};
const search = (v, id, filled) => `<div class="kl-searchw" data-ui="${id}.search"><div class="kl-search"><div class="kl-search__box"><span class="kl-search__icon">${ic('Search', 20)}</span>
<input class="kl-search__input" type="text" readonly aria-label="Search menu" placeholder="${v.placeholder}" value="${filled ? v.query : ''}">${filled ? `<button type="button" class="kl-search__clear" aria-label="Clear search">${ic('X', 16)}</button>` : ''}</div></div></div>`;
const card = (v, id, idx, p) => {
  const it = ITEMS[idx], k = 'i' + (idx + 1) + '_', dis = p.soldout === idx;
  const q = p.cart >= 1 && idx === LATTE ? 1 : p.cart >= 2 && idx === CAPP ? 2 : 0;
  const msg = dis ? `<div class="kl-pc__msg kl-pc__msg--bad">${v.unavail}</div>` : q ? `<div class="kl-pc__msg kl-pc__msg--cart">${v['in_cart_' + q]}</div>` : '';
  return `<button type="button" class="kl-pc${dis ? ' is-disabled' : ''}"${dis ? ' disabled aria-disabled="true"' : ''} data-ui="${id}.card-${idx + 1}"><img class="kl-pc__img" src="${v[IMG(idx)]}" alt="${v[k + 'name']}"><div class="kl-pc__body"><div class="kl-pc__name">${v[k + 'name']}</div><div class="kl-pc__rate">${v[k + 'rate']}</div>${msg}</div></button>`;
};
const cartPanel = (v, id, p) => {
  const n = p.cart, order = p.order;
  const line = (i) => `<li><span class="kl-cart__name">${v['c' + i + '_name']}</span><span class="kl-ctl"><button type="button" class="kl-step" aria-label="Remove one">−</button><span class="kl-qty">${v['c' + i + '_qty']}</span><button type="button" class="kl-step" aria-label="Add one more">+</button></span></li>`;
  const orderBlock = order ? `<section class="kl-cart__order"><h2 class="kl-h2">${v.order_title}</h2><ul class="kl-cart__rows"><li><span>${v.o1_name} × ${v.o1_qty}</span><span>${v.o1_amount}</span></li><li><span>${v.o2_name} × ${v.o2_qty}</span><span>${v.o2_amount}</span></li></ul><div class="kl-cart__total"><span>${v.total_label}</span><span>${v.order_total}</span></div></section>` : '';
  const lines = n === 0 ? `<p class="kl-cart__empty">${v.empty_text}</p>` : `<ul class="kl-cart__lines">${[1, 2].slice(0, n).map(line).join('')}</ul>`;
  const off = p.submitting || n === 0;
  return `<aside class="kl-cart" data-ui="${id}.cart-panel"><div class="kl-cart__scroll">${orderBlock}<section><h2 class="kl-h2">${v.cart_title}</h2>${lines}</section></div>
<div class="kl-cart__foot"><div class="kl-sum"><span>${v.count_label}</span><span class="kl-num" data-ui="${id}.cart-total">${v.cart_total}</span></div>
<button type="button" class="kl-btn kl-btn--place${off ? ' is-disabled' : ''}"${off ? ' disabled' : ''} data-ui="${id}.place-order">${p.submitting ? v.placing : v.place_order}</button>
${p.pay ? `<button type="button" class="kl-btn kl-btn--pay" data-ui="${id}.pay-online">${v.pay_online}</button>` : ''}${p.bill ? `<button type="button" class="kl-btn kl-btn--bill" data-ui="${id}.request-bill">${v.request_bill}</button>` : ''}</div></aside>`;
};
const idle = (v, id) => `<div class="kl-idle" data-ui="${id}.idle"><div class="u-dialog-wrap"><div class="u-dialog-scrim"></div><div class="u-dialog u-dialog--md" role="dialog" aria-modal="true"><button type="button" class="u-dialog-close" aria-label="Close">${ic('X', 16)}<span class="u-sr-only">${v.close}</span></button>
<div class="u-dialog-header"><h2 class="u-dialog-title">${v.idle_title}</h2></div><div class="u-dialog-footer"><button type="button" class="kl-idle__btn" data-ui="${id}.still-here">${v.still_here}</button></div></div></div></div>`;
const optRow = (v, k, on, id) => `<button type="button" class="kl-opt${on ? ' kl-opt--on' : ''}" data-ui="${id}"><span>${v[k + '_name']}</span><span class="kl-opt__rate">${v[k + '_rate']}</span></button>`;
const detail = (v, id, p) => {
  if (p.state === 'loading') return `<div class="kl-pd kl-pd--center" data-ui="${id}.product"><div class="kl-muted">${v.loading}</div><button type="button" class="kl-pd__link" data-ui="${id}.back">${v.back}</button></div>`;
  if (p.state === 'error') return `<div class="kl-pd kl-pd--center kl-pd--err" data-ui="${id}.product"><div class="kl-pd__err">${v.not_found}</div><button type="button" class="kl-pd__back" data-ui="${id}.back">${v.back_menu}</button></div>`;
  const sel = p.sel || [];
  return `<div class="kl-pd${p.end ? ' kl-pd--end' : ''}" data-ui="${id}.product"><div class="kl-pd__top"><button type="button" class="kl-pd__link" data-ui="${id}.back">${v.back}</button></div>
<img class="kl-pd__img" src="${v.img}" alt="${v.d_name}"><div class="kl-pd__body"><div><h1 class="kl-pd__h1" data-ui="${id}.name">${v.d_name}</h1><p class="kl-pd__desc">${v.d_desc}</p></div><div class="kl-pd__rate">${v.d_rate}</div>
<div class="kl-pd__grp"><div class="kl-pd__lbl">${v.variants_label}</div><div class="kl-pd__opts">${optRow(v, 'v1', sel.includes('v1'), id + '.variant-1')}${optRow(v, 'v2', sel.includes('v2'), id + '.variant-2')}</div></div>
<div class="kl-pd__grp"><div class="kl-pd__lbl">${v.addons_label}</div><div class="kl-pd__opts">${optRow(v, 'a1', sel.includes('a1'), id + '.addon-1')}${optRow(v, 'a2', sel.includes('a2'), id + '.addon-2')}${optRow(v, 'a3', sel.includes('a3'), id + '.addon-3')}</div></div>
<div class="kl-pd__qtyrow"><button type="button" class="kl-pd__q" aria-label="Decrease quantity">-</button><div class="kl-pd__n" data-ui="${id}.qty">${v.qty}</div><button type="button" class="kl-pd__q" aria-label="Increase quantity">+</button></div>
<button type="button" class="kl-pd__add" data-ui="${id}.add-to-cart">${v.add_to_cart}</button></div></div>`;
};
// Menu screen body (LandscapeKioskLayout default branch). p: cat, query, empty, cart, order, pay, bill, submitting, soldout, idle, modal
const menu = (v, id, p) => {
  const items = p.empty ? [] : ITEMS.map((_, i) => i).filter((i) => !p.cat || ITEMS[i].cat === p.cat);
  const none = items.length === 0 ? `<div class="kl-none" data-ui="${id}.empty">${p.query ? v.no_results : v.no_items}</div>` : '';
  return `<div class="kl-root kl-root--menu">${hdr(v, id)}
<div class="kl-strip" data-ui="${id}.strip"><div class="kl-strip__row">${tabs(v, id, p.cat || 0, p.empty ? 0 : 5)}</div>${search(v, id, !!p.query)}</div>
<div class="kl-body"><main class="kl-main"><div class="kl-grid" data-ui="${id}.grid">${items.map((i) => card(v, id, i, p)).join('')}</div>${none}</main>${cartPanel(v, id, p)}</div></div>
${p.modal ? `<div class="kl-scrim" data-ui="${id}.scrim"><div class="kl-modal" data-ui="${id}.modal">${detail(v, id, p.modal)}</div></div>` : ''}${p.idle ? idle(v, id) : ''}`;
};
// Repeated header + shared screen (cart / checkout / status)
const shell = (v, id, inner, scroll) => `<div class="kl-root">${hdr(v, id)}<div class="kl-fill${scroll ? ' kl-fill--scroll' : ''}">${inner}</div></div>`;

// ---------- 1. MENU
const menuSpec = { ...BASE, id: G + 'menu', name: 'URY landscape kiosk menu', slots: menuSlots(), rtlValues: menuRtl(), na: NA,
  render: (v, p) => screen(1920, 1080, menu(v, G + 'menu', p), G + 'menu', 'kl'), props: { cart: 2 },
  variants: {
    'category-active': { props: { cat: 2 }, describe: 'A course chip is active (bg-primary) and the grid shows only that course.' },
    'with-order': { props: { order: true, pay: true }, describe: 'Running order (pickup): the cart panel adds "Your order so far" and Pay Online. Request Bill is not offered: the backend ANDs request_bill_enabled with a table, so it is False for pickup.' },
    'table-order': { props: { order: true, pay: true, bill: true }, values: { title: 'Table 12' }, describe: 'Dine-in table order: the header reads "Table 12" and the cart panel adds Pay Online and Request Bill (request_bill_enabled needs a table).' },
    'empty-cart': { props: { cart: 0 }, values: { count_label: '0 items', cart_total: money(0) }, rtlValues: { count_label: '0 عناصر', cart_total: aed(0) }, describe: 'Empty cart: hint text, no "In cart" badges, Place Order disabled (opacity-50).' },
    submitting: { props: { submitting: true }, describe: 'Order being submitted: "Placing order…", button disabled.' },
    'sold-out': { props: { soldout: 0 }, describe: 'Availability gating: the first card is opacity-50 with a destructive "Sold out" reason.' },
    'no-results': { props: { query: true, empty: true }, describe: 'Search with no hits: the clear button shows and the grid is replaced by "No items match your search.".' },
    'no-items': { props: { empty: true }, describe: 'Empty menu without a query: "No items available." and only the All chip.' },
    idle: { props: { idle: true }, describe: 'Unattended-kiosk protection: the "Still there?" dialog over the blurred menu.' } },
  describe: ['Landscape kiosk menu at 1920x1080: header (px-10 py-6, 30px semibold title, "New Order" button), category chips with a w-80 search in a border-b strip, a five-column grid (xl, gap-6) of rounded-2xl cards with h-40 images, and the persistent w-[420px] cart panel at the end.', 'Use as the main ordering screen of an entrance/counter/food-court kiosk. Body text is 18px (text-lg); the grid scrolls in the app, so the lowest row is clipped. ' + RTL_NOTE] };

// ---------- 2. DETAIL
const detSlots = () => ({ ...menuSlots(), img: detailImg(), d_name: 'Cappuccino', d_desc: 'Double espresso with steamed milk and a deep layer of foam.', d_rate: money(16), back: 'Back', variants_label: 'Variants', addons_label: 'Add-ons',
  v1_name: 'Regular', v1_rate: money(16), v2_name: 'Large', v2_rate: money(20), a1_name: 'Extra shot', a1_rate: money(4), a2_name: 'Oat milk', a2_rate: money(3), a3_name: 'Vanilla syrup', a3_rate: money(2),
  qty: '1', add_to_cart: 'Add to cart', loading: 'Loading item...', not_found: 'Item not found.', back_menu: 'Back to menu' });
const detRtl = () => ({ ...menuRtl(), d_name: 'كابتشينو', d_desc: 'إسبريسو مزدوج مع حليب مبخّر وطبقة كثيفة من الرغوة.', d_rate: aed(16), back: 'رجوع', variants_label: 'الأنواع', addons_label: 'الإضافات',
  v1_name: 'عادي', v1_rate: aed(16), v2_name: 'كبير', v2_rate: aed(20), a1_name: 'جرعة إسبريسو إضافية', a1_rate: aed(4), a2_name: 'حليب الشوفان', a2_rate: aed(3), a3_name: 'شراب الفانيلا', a3_rate: aed(2),
  add_to_cart: 'أضف إلى السلة', loading: 'جارٍ تحميل العنصر...', not_found: 'العنصر غير موجود.', back_menu: 'العودة إلى القائمة' });
const detSpec = { ...BASE, id: G + 'detail', name: 'URY landscape kiosk product detail', slots: detSlots(), rtlValues: detRtl(), na: NA,
  render: (v, p) => screen(1920, 1080, menu(v, G + 'detail', { cart: 2, modal: p }), G + 'detail', 'kl'), props: {},
  variants: {
    options: { props: { end: true, sel: ['v1', 'a1', 'a3'] }, values: { qty: '2' }, describe: 'Panel scrolled to its end: variant and two add-ons selected (border-primary, bg-primary/10), quantity 2, "Add to cart".' },
    loading: { props: { state: 'loading' }, describe: 'get_customer_product in flight: "Loading item..." with an underlined Back.' },
    'not-found': { props: { state: 'error' }, describe: 'Lookup failed: destructive "Item not found." and a "Back to menu" pill button.' } },
  describe: ['Product detail modal over the landscape menu: black/50 scrim, panel h-5/6 w-2/3 rounded-lg shadow-lg with an underlined Back, a full-width object-cover image (natural height, so the panel scrolls), name, description, price, Variants and Add-ons option rows, quantity stepper and a full-width "Add to cart" pill.', 'Opened by tapping a card when product_detail_enabled is on. The top of the panel is mostly the image; the "options" variant shows it scrolled to the end. ' + RTL_NOTE] };

// ---------- 3. CART
const cartSlots = () => ({ title: 'Order for Pickup', new_order: 'New Order', back_label: '← Back to menu', cart_title: 'Your Cart', c1_name: 'Latte', c1_qty: '1', c2_name: 'Cappuccino', c2_qty: '2',
  empty_text: 'Your cart is empty.', browse: 'Browse the menu', count_label: '3 items', cart_total: money(48), checkout: 'Proceed to checkout' });
const cartRtl = () => ({ title: 'طلب للاستلام', new_order: 'طلب جديد', back_label: '→ العودة إلى القائمة', cart_title: 'سلتك', c1_name: 'لاتيه', c2_name: 'كابتشينو', empty_text: 'سلتك فارغة.', browse: 'تصفح القائمة',
  count_label: '3 عناصر', cart_total: aed(48), checkout: 'المتابعة إلى الدفع' });
const cartPage = (v, id, p) => {
  const n = p.lines ?? 2;
  const line = (i) => `<li data-ui="${id}.line-${i}"><div class="kl-cp__row"><span class="kl-cp__name">${v['c' + i + '_name']}</span><span class="kl-ctl"><button type="button" class="kl-step" aria-label="Remove one">−</button><span class="kl-qty">${v['c' + i + '_qty']}</span><button type="button" class="kl-step" aria-label="Add one more">+</button></span></div></li>`;
  const body = n === 0 ? `<div class="kl-cp__empty" data-ui="${id}.empty"><p class="kl-muted">${v.empty_text}</p><button type="button" class="kl-cp__browse">${v.browse}</button></div>` : `<ul class="kl-cp__list">${[1, 2].slice(0, n).map(line).join('')}</ul>`;
  return `<div class="kl-cp" data-ui="${id}.page"><header class="kl-cp__head"><button type="button" class="kl-cp__back" aria-label="Back to menu" data-ui="${id}.back">${v.back_label}</button><h1 class="kl-cp__h1">${v.cart_title}</h1><span class="kl-cp__sp" aria-hidden="true"></span></header>
<div class="kl-cp__list-wrap">${body}</div><div class="kl-cp__foot"><div class="kl-cp__sum"><span>${v.count_label}</span><span data-ui="${id}.total">${v.cart_total}</span></div>
<button type="button" class="kl-cp__go${n === 0 ? ' is-disabled' : ''}"${n === 0 ? ' disabled' : ''} data-ui="${id}.checkout">${v.checkout}</button></div></div>`;
};
const cartSpec = { ...BASE, id: G + 'cart', name: 'URY landscape kiosk cart', slots: cartSlots(), rtlValues: cartRtl(), na: NA,
  render: (v, p) => screen(1920, 1080, shell(v, G + 'cart', cartPage(v, G + 'cart', p)), G + 'cart', 'kl'), props: { lines: 2 },
  variants: {
    'single-item': { props: { lines: 1 }, values: { count_label: '1 item', cart_total: money(16) }, rtlValues: { count_label: 'عنصر واحد', cart_total: aed(16) }, describe: 'One line: the count label is singular ("1 item").' },
    empty: { props: { lines: 0 }, values: { count_label: '0 items', cart_total: money(0) }, rtlValues: { count_label: '0 عناصر', cart_total: aed(0) }, describe: 'Empty cart: "Your cart is empty." with a "Browse the menu" button; Proceed to checkout disabled (opacity-50).' } },
  describe: ['Full-screen cart under the repeated kiosk header: CartPage with a bordered "← Back to menu" button, centred "Your Cart" title, bordered line cards with round −/+ steppers, then the item count, total and a full-width "Proceed to checkout" button.', 'The kiosk passes className="h-full", which drops CartPage\'s flex-col, so the footer follows the list instead of sitting at the bottom (faithful to the source). Text uses the shared screen\'s text-sm at kiosk size. ' + RTL_NOTE] };

// ---------- 4. CHECKOUT
const coSlots = () => ({ title: 'Order for Pickup', new_order: 'New Order', summary_title: 'Order Summary', l1_name: 'Latte', l1_qty: '1', l1_amount: money(16), l2_name: 'Cappuccino', l2_qty: '2', l2_amount: money(32),
  count_label: '3 items', cart_total: money(48), payment_title: 'Payment Method', pay_online: 'Pay Online', pay_counter: 'Pay at Counter', request_bill: 'Request Bill', bill_requested: 'Bill requested — staff notified',
  payment_note: 'Payment request created (48.00 AED) — a staff member will assist with payment.', place_order: 'Place Order', placing: 'Placing order…', starting: 'Starting payment…' });
const coRtl = () => ({ title: 'طلب للاستلام', new_order: 'طلب جديد', summary_title: 'ملخص الطلب', l1_name: 'لاتيه', l1_amount: aed(16), l2_name: 'كابتشينو', l2_amount: aed(32), count_label: '3 عناصر', cart_total: aed(48),
  payment_title: 'طريقة الدفع', pay_online: 'الدفع عبر الإنترنت', pay_counter: 'الدفع عند الكاشير', request_bill: 'طلب الفاتورة', bill_requested: 'تم طلب الفاتورة — تم إشعار الموظفين',
  payment_note: 'تم إنشاء طلب الدفع (48.00 AED) — سيساعدك أحد الموظفين في الدفع.', place_order: 'تأكيد الطلب', placing: 'جارٍ إرسال الطلب…', starting: 'جارٍ بدء الدفع…' });
const checkout = (v, id, p) => {
  const caps = p.caps || { online: true, counter: true, bill: false }, hasAny = caps.online || caps.counter || caps.bill;
  const sel = p.sel === undefined ? (caps.counter ? 'counter' : null) : p.sel;
  const pm = (key, label, extra = '') => `<button type="button" class="kl-pm${sel === key ? ' kl-pm--on' : ''}${extra}"${extra ? ' disabled' : ''} data-ui="${id}.pm-${key}">${label}</button>`;
  const methods = hasAny ? `<section class="kl-co__sec kl-co__sec--pay" data-ui="${id}.payment"><h2 class="kl-h2">${v.payment_title}</h2><div class="kl-co__pms">${caps.online ? pm('online', v.pay_online) : ''}${caps.counter ? pm('counter', v.pay_counter) : ''}${caps.bill ? pm('bill', p.billRequested ? v.bill_requested : v.request_bill, p.billRequested ? ' is-disabled' : '') : ''}</div>${p.note ? `<p class="kl-co__note">${v.payment_note}</p>` : ''}</section>` : '';
  const online = caps.online && sel === 'online';
  const label = online ? (p.paying ? v.starting : v.pay_online) : p.placing ? v.placing : v.place_order;
  const off = online ? p.paying : p.placing;
  return `<div class="kl-co" data-ui="${id}.checkout"><section class="kl-co__sec" data-ui="${id}.summary"><h2 class="kl-h2">${v.summary_title}</h2><ul class="kl-co__list"><li><span>${v.l1_name} × ${v.l1_qty}</span><span>${v.l1_amount}</span></li><li><span>${v.l2_name} × ${v.l2_qty}</span><span>${v.l2_amount}</span></li></ul>
<div class="kl-co__total"><span>${v.count_label}</span><span data-ui="${id}.total">${v.cart_total}</span></div></section>${methods}
<div class="kl-co__act"><button type="button" class="kl-co__go${off ? ' is-disabled' : ''}"${off ? ' disabled' : ''} data-ui="${id}.submit">${label}</button></div></div>`;
};
const coSpec = { ...BASE, id: G + 'checkout', name: 'URY landscape kiosk checkout', slots: coSlots(), rtlValues: coRtl(), na: NA,
  render: (v, p) => screen(1920, 1080, shell(v, G + 'checkout', checkout(v, G + 'checkout', p), true), G + 'checkout', 'kl'), props: {},
  variants: {
    'pay-online-selected': { props: { sel: 'online' }, describe: 'Pay Online selected (border-primary, bg-primary/10): the action button becomes "Pay Online".' },
    'paying-online': { props: { sel: 'online', paying: true }, describe: 'Online payment starting: "Starting payment…", button disabled.' },
    'table-order': { props: { caps: { online: true, counter: true, bill: true } }, values: { title: 'Table 12' }, describe: 'Dine-in table order: Request Bill is offered as a third option (request_bill_enabled is ANDed with a table in the backend, so a pickup kiosk never shows it).' },
    'bill-requested': { props: { caps: { online: true, counter: true, bill: true }, sel: 'bill', billRequested: true }, values: { title: 'Table 12' }, describe: 'Table order, bill already requested: the bill option is disabled and reads "Bill requested — staff notified".' },
    'payment-request': { props: { sel: 'online', note: true }, describe: 'A payment request without a URL was created: the muted text-xs note appears under the options.' },
    placing: { props: { placing: true }, describe: 'Order being placed: "Placing order…", button disabled.' },
    'counter-only': { props: { caps: { counter: true } }, describe: 'Only pay_at_counter_enabled: one option, preselected.' },
    'online-only': { props: { caps: { online: true } }, describe: 'Only customer_payment_enabled: one option, nothing preselected, the action stays "Place Order".' },
    'no-payment-options': { props: { caps: {} }, describe: 'No payment capability: the picker is not rendered and Place Order simply submits the cart.' } },
  describe: ['Checkout under the repeated kiosk header: "Order Summary" card with the lines, item count and total, a "Payment Method" card with full-width option buttons (Pay Online, Pay at Counter, Request Bill) and a full-width primary action.', 'The shared screen is not rescaled for the kiosk, so the cards span the whole 1920px width (mx-4). Which options appear depends on the capabilities. ' + RTL_NOTE] };

// ---------- 5. STATUS
const stSlots = () => ({ title: 'Order for Pickup', new_order: 'New Order', confirmed: 'Order confirmed', thanks: 'Thanks — your order has been sent to the restaurant.', pickup_label: 'Pickup code', pickup_code: 'K-482',
  order_status_label: 'Order status', order_status: 'Submitted', bill_status_label: 'Bill status', bill_status: 'Not billed yet', requests_label: 'Open service requests', r1_type: 'Water', r1_status: 'Open', r2_type: 'Cutlery', r2_status: 'Open',
  add_more: 'Add more items', done: 'Done' });
const stRtl = () => ({ title: 'طلب للاستلام', new_order: 'طلب جديد', confirmed: 'تم تأكيد الطلب', thanks: 'شكراً — تم إرسال طلبك إلى المطعم.', pickup_label: 'رمز الاستلام', order_status_label: 'حالة الطلب', order_status: 'تم الإرسال',
  bill_status_label: 'حالة الفاتورة', bill_status: 'لم تصدر الفاتورة بعد', requests_label: 'طلبات الخدمة المفتوحة', r1_type: 'ماء', r1_status: 'مفتوح', r2_type: 'أدوات المائدة', r2_status: 'مفتوح', add_more: 'إضافة المزيد', done: 'تم' });
const status = (v, id, p) => {
  const noStatus = p.noStatus;
  const rows = noStatus ? '' : `<div class="kl-st__row" data-ui="${id}.order-status"><span class="kl-muted">${v.order_status_label}</span><b>${v.order_status}</b></div><div class="kl-st__row" data-ui="${id}.bill-status"><span class="kl-muted">${v.bill_status_label}</span><b>${v.bill_status}</b></div>`;
  const reqs = p.requests ? `<div class="kl-st__req" data-ui="${id}.requests"><div class="kl-st__reqh">${v.requests_label}</div><ul>${[1, 2].slice(0, p.requests).map((i) => `<li><span>${v['r' + i + '_type']}</span><b>${v['r' + i + '_status']}</b></li>`).join('')}</ul></div>` : '';
  return `<div class="kl-st" data-ui="${id}.status"><h1 class="kl-st__h1">${v.confirmed}</h1><p class="kl-st__p">${v.thanks}</p>
${p.code === false ? '' : `<div class="kl-st__code" data-ui="${id}.pickup"><div class="kl-st__codel">${v.pickup_label}</div><div class="kl-st__coden">${v.pickup_code}</div></div>`}
<div class="kl-st__rows">${rows}${reqs}</div><div class="kl-st__acts">${p.more ? `<button type="button" class="kl-st__more" data-ui="${id}.add-more">${v.add_more}</button>` : ''}<button type="button" class="kl-st__done" data-ui="${id}.done">${v.done}</button></div></div>`;
};
const stSpec = { ...BASE, id: G + 'status', name: 'URY landscape kiosk order status', slots: stSlots(), rtlValues: stRtl(), na: NA,
  render: (v, p) => screen(1920, 1080, shell(v, G + 'status', status(v, G + 'status', p)), G + 'status', 'kl'), props: {},
  variants: {
    'add-more': { props: { more: true }, describe: 'add_to_running_table_enabled: a primary "Add more items" button above Done.' },
    billed: { props: {}, values: { bill_status: 'Billed' }, rtlValues: { bill_status: 'تم إصدار الفاتورة' }, describe: 'The order has been billed: the bill row reads "Billed".' },
    pending: { props: {}, values: { order_status: 'Pending' }, rtlValues: { order_status: 'قيد الانتظار' }, describe: 'Not yet submitted: the order row reads "Pending".' },
    'open-requests': { props: { requests: 2 }, describe: 'Open service requests listed in a bordered card (type left, status right).' },
    table: { props: { code: false }, values: { title: 'Table 12' }, rtlValues: { title: 'طاولة 12' }, describe: 'Dine-in table order: header reads "Table 12" and no pickup code card.' },
    'no-status': { props: { noStatus: true }, describe: 'get_order_status returned nothing: only the confirmation, pickup code and Done.' } },
  describe: ['Order confirmation under the repeated kiosk header: "Order confirmed", thanks line, a muted pickup-code card (3xl bold code), order / bill status rows (max-w-xs) and a Done button.', 'Shown after a successful submit; the post-submit screen is a plain column at 20px/14px type with no kitchen-stage data (none exists in the backend). ' + RTL_NOTE] };

export const specs = [menuSpec, detSpec, cartSpec, coSpec, stSpec].map((sp) => (/menu|detail$/.test(sp.id) ? stateImages(sp, IMG) : sp));
