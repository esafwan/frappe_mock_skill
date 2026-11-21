// URY v16 self-order MobileQR screens (T15): menu, detail, cart, checkout, status at 390x844 @3x.
// Sources: self-order/src/layouts/MobileQRLayout.tsx, layouts/shared/{ProductDetail,CartPage,CheckoutScreen,OrderStatusScreen}.tsx, App.tsx.
// Arabic: self-order has no i18n in the source; the fixed UI labels are translated by the kit (RTL is a kit extension) and item names are Arabic menu vocabulary.
import { ic, money, screen } from '../lib.mjs';
import { photo } from './cafe-images.mjs';
import { P, so_css, SAMPLE_IMG, categoryTabs, searchBar, productCard, optionRow } from './components.mjs';
const CSS = [...so_css, 'ury-v16/components/self-order-mobile.css'];
const BASE = { group: 'ury-self-order', static: true, width: 390, height: 844, dsf: 3, canvas: 'hsl(var(--background))', css: CSS, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: 'touch UI: hover/focus are not shown; the source styles only the active/pressed scale transition' };
const aed = (n) => ({ ...money(n), sample: `${Number(n).toFixed(2)} د.إ` });
const RTL = 'RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.';
const na = { hover: 'not applicable: touch UI', focus: 'not applicable: touch UI' };
const img = photo('cappuccino');
const wrap = (id, inner, cls = '') => screen(390, 844, inner, id, 'so som ' + cls);
const U = (s) => P + 'screen-' + s;

const cats = { all: 'All', cat_1: 'Espresso', cat_2: 'Milk Coffee', cat_3: 'Filter & Cold Brew', cat_4: 'Iced', cat_5: 'Tea & Others' };
const catsAr = { all: 'الكل', cat_1: 'إسبريسو', cat_2: 'قهوة بالحليب', cat_3: 'قهوة مفلترة وباردة', cat_4: 'مثلجات', cat_5: 'شاي ومشروبات أخرى' };

// ---------- Menu ----------
const menuSlots = { ...cats, table: 'Table 5', pickup_title: 'Order for Pickup', start_over: 'Start Over', order_title: 'Your order so far', pickup_code_label: 'Pickup code: A-27',
  o1_name: 'Espresso', o1_qty: '1', o1_amount: money(12), o2_name: 'Cappuccino', o2_qty: '2', o2_amount: money(36), total_label: 'Total', order_total: money(48),
  placeholder: 'Search menu...', query: 'Cappuccino',
  p1_img: photo('espresso'), p1_name: 'Espresso', p1_rate: money(12), p1_in_cart: 'In cart: 1', p1_unavail: 'Sold out',
  p2_img: photo('cappuccino'), p2_name: 'Cappuccino', p2_rate: money(18), p2_in_cart: 'In cart: 2', p2_unavail: 'Sold out',
  p3_img: photo('latte'), p3_name: 'Latte', p3_rate: money(20), p3_in_cart: 'In cart: 1', p3_unavail: 'Sold out',
  p4_img: photo('cold-brew'), p4_name: 'Cold Brew', p4_rate: money(22), p4_in_cart: 'In cart: 1', p4_unavail: 'Not available today',
  view_cart: 'View Cart (3 items) •', cart_total: money(48), error: 'This link is missing an ordering code. Please rescan the QR code on your table.', starting: 'Starting up…', loading: 'Loading menu…' };
const menuAr = { ...catsAr, table: 'طاولة 5', pickup_title: 'طلب للاستلام', start_over: 'ابدأ من جديد', order_title: 'طلبك حتى الآن', pickup_code_label: 'رمز الاستلام: A-27',
  o1_name: 'إسبريسو', o1_amount: aed(12), o2_name: 'كابتشينو', o2_amount: aed(36), total_label: 'المجموع', order_total: aed(48), placeholder: 'ابحث في القائمة...', query: 'كابتشينو',
  p1_name: 'إسبريسو', p1_rate: aed(12), p1_in_cart: 'في السلة: 1', p1_unavail: 'نفد المخزون', p2_name: 'كابتشينو', p2_rate: aed(18), p2_in_cart: 'في السلة: 2', p2_unavail: 'نفد المخزون',
  p3_name: 'لاتيه', p3_rate: aed(20), p3_in_cart: 'في السلة: 1', p3_unavail: 'نفد المخزون', p4_name: 'قهوة باردة', p4_rate: aed(22), p4_in_cart: 'في السلة: 1', p4_unavail: 'غير متوفر اليوم',
  view_cart: 'عرض السلة (3 عناصر) •', cart_total: aed(48), error: 'هذا الرابط يفتقد رمز الطلب. يرجى إعادة مسح رمز QR على طاولتك.', starting: 'جارٍ التشغيل…', loading: 'جارٍ تحميل القائمة…' };
const menu = (v, p = {}) => {
  if (p.starting) return wrap(U('menu'), `<div class="som-center som-muted">${v.starting}</div>`);
  if (p.error) return wrap(U('menu'), `<div class="som-center som-center--pad" data-ui="${U('menu')}.error">${v.error}</div>`);
  const title = p.pickup ? v.pickup_title : v.table;
  const row = (i) => `<li><span>${v['o' + i + '_name']} × ${v['o' + i + '_qty']}</span><span>${v['o' + i + '_amount']}</span></li>`;
  const cards = [1, 2, 3, 4].map((i) => productCard(v, { size: 'mobile', pfx: 'p' + i + '_', qty: i === 3 || i === 4 ? 0 : i, unavailable: i === 4, ui: U('menu') + '.card-' + i })).join('');
  return wrap(U('menu'), `<div class="som-menu"><header class="som-head" data-ui="${U('menu')}.header"><h1 class="som-head__t">${title}</h1><button type="button" class="som-start">${v.start_over}</button></header>
<section class="som-order" data-ui="${U('menu')}.order"><h2 class="som-order__h">${v.order_title}</h2>${p.pickup ? `<p class="som-code" data-ui="${U('menu')}.pickup-code">${v.pickup_code_label}</p>` : ''}
<ul class="som-rows">${row(1)}${row(2)}</ul><div class="som-total"><span>${v.total_label}</span><span>${v.order_total}</span></div></section>
${categoryTabs(v, { n: 5, active: 0, ui: U('menu') + '.tabs' })}<div class="som-search">${searchBar(v, { ui: U('menu') + '.search' })}</div>
<div class="som-grid" data-ui="${U('menu')}.grid">${cards}</div></div>
<div class="som-bar" data-ui="${U('menu')}.bar"><button type="button" class="som-btn">${v.view_cart} ${v.cart_total}</button></div>`);
};

// ---------- Detail ----------
const detSlots = { back: 'Back', img, name: 'Cappuccino', description: 'Double espresso with steamed milk and a thin layer of foam.', rate: money(18), variants_h: 'Variants', v1_name: 'Regular', v1_rate: money(18), v2_name: 'Large', v2_rate: money(22),
  addons_h: 'Add-ons', a1_name: 'Extra shot', a1_rate: money(4), a2_name: 'Oat milk', a2_rate: money(3), qty: '1', add: 'Add to cart', loading: 'Loading item...', not_found: 'Item not found.', back_menu: 'Back to menu' };
const detAr = { back: 'رجوع', name: 'كابتشينو', description: 'إسبريسو مزدوج مع حليب مبخّر وطبقة رقيقة من الرغوة.', rate: aed(18), variants_h: 'الخيارات', v1_name: 'عادي', v1_rate: aed(18), v2_name: 'كبير', v2_rate: aed(22),
  addons_h: 'الإضافات', a1_name: 'جرعة إضافية', a1_rate: aed(4), a2_name: 'حليب الشوفان', a2_rate: aed(3), add: 'أضف إلى السلة', loading: 'جارٍ تحميل العنصر...', not_found: 'العنصر غير موجود.', back_menu: 'العودة إلى القائمة' };
const detail = (v, p = {}) => {
  const id = U('detail');
  if (p.loading) return wrap(id, `<div class="som-stack"><div class="som-muted">${v.loading}</div><button type="button" class="som-back__l" style="font-size:14px;text-decoration:underline">${v.back}</button></div>`);
  if (p.notFound) return wrap(id, `<div class="som-stack"><div class="som-stack__bad">${v.not_found}</div><button type="button" class="som-pill">${v.back_menu}</button></div>`);
  const sec = (h, pre, sel) => `<div class="som-sec" data-ui="${id}.${pre}"><div class="som-sec__h">${v[pre + '_h']}</div><div class="som-sec">${[1, 2].map((i) => optionRow({ name: v[pre.slice(0, 1) + i + '_name'], rate: v[pre.slice(0, 1) + i + '_rate'] }, { selected: sel.includes(i) })).join('')}</div></div>`;
  return wrap(id, `<div class="som-detail"><div class="som-back"><button type="button" class="som-back__l" data-ui="${id}.back"><span class="so-flip">${ic('ChevronLeft', 16)}</span>${v.back}</button></div>
<img class="som-detail__img" src="${v.img}" alt="${v.name}" data-ui="${id}.image"><div class="som-detail__body"><div><h1 class="som-detail__h">${v.name}</h1><p class="som-detail__d som-muted">${v.description}</p></div>
<div class="som-detail__rate">${v.rate}</div>${sec('v', 'variants', [1])}${sec('a', 'addons', [])}
<div class="som-qty" data-ui="${id}.qty"><button type="button" class="som-qty__b" aria-label="Decrease quantity">${ic('Minus', 16)}</button><div class="som-qty__n">${v.qty}</div><button type="button" class="som-qty__b" aria-label="Increase quantity">${ic('Plus', 16)}</button></div>
<button type="button" class="som-add" data-ui="${id}.add">${v.add}</button></div></div>`);
};

// ---------- Cart / Checkout shared ----------
const cartSlots = { back: '← Back to menu', title: 'Your Cart', l1_name: 'Espresso', l1_qty: '1', l2_name: 'Cappuccino', l2_qty: '2', note_label: 'Note:', l2_note: 'Less sugar', count: '3 items', total: money(48), checkout: 'Proceed to checkout',
  empty: 'Your cart is empty.', browse: 'Browse the menu', zero: '0 items', zero_total: money(0) };
const cartAr = { back: '← العودة إلى القائمة', title: 'سلتك', l1_name: 'إسبريسو', l2_name: 'كابتشينو', note_label: 'ملاحظة:', l2_note: 'سكر أقل', count: '3 عناصر', total: aed(48), checkout: 'المتابعة إلى الدفع',
  empty: 'سلتك فارغة.', browse: 'تصفّح القائمة', zero: '0 عناصر', zero_total: aed(0) };
const hdr = (id, back, title) => `<header class="som-hdr" data-ui="${id}.header"><button type="button" class="som-hdr__back">${back}</button><h1 class="som-hdr__t">${title}</h1><span class="som-hdr__sp" aria-hidden="true"></span></header>`;
const cart = (v, p = {}) => {
  const id = U('cart'), line = (i, note) => `<li class="som-line" data-ui="${id}.line-${i}"><div class="som-line__top"><span class="som-line__n">${v['l' + i + '_name']}</span><span class="som-line__ctl"><button type="button" class="som-line__st" aria-label="Remove one">−</button><span class="som-line__q">${v['l' + i + '_qty']}</span><button type="button" class="som-line__st" aria-label="Add one more">+</button></span></div>${note ? `<p class="som-line__note">${v.note_label} ${v.l2_note}</p>` : ''}</li>`;
  const body = p.empty ? `<div class="som-emptyc" data-ui="${id}.empty"><p>${v.empty}</p><button type="button" class="som-pill">${v.browse}</button></div>` : `<ul class="som-lines">${line(1)}${line(2, true)}</ul>`;
  return wrap(id, `<div class="som-page">${hdr(id, v.back, v.title)}<div class="som-cartbody">${body}</div>
<div class="som-foot" data-ui="${id}.footer"><div class="som-foot__sum"><span>${p.empty ? v.zero : v.count}</span><span>${p.empty ? v.zero_total : v.total}</span></div><button type="button" class="som-btn${p.empty ? ' is-disabled' : ''}"${p.empty ? ' disabled' : ''}>${v.checkout}</button></div></div>`);
};

const coSlots = { back: '← Back to cart', title: 'Checkout', summary_h: 'Order Summary', l1_name: 'Espresso', l1_qty: '1', l1_amount: money(12), l2_name: 'Cappuccino', l2_qty: '2', l2_amount: money(36), l3_name: 'Latte', l3_qty: '1', l3_amount: money(20) , count: '4 items', total: money(68),
  method_h: 'Payment Method', online: 'Pay Online', counter: 'Pay at Counter', bill: 'Request Bill', info: 'Payment request created (68.00 AED) — a staff member will assist with payment.', place: 'Place Order', placing: 'Placing order…', paying: 'Starting payment…' };
const coAr = { back: '← العودة إلى السلة', title: 'الدفع', summary_h: 'ملخص الطلب', l1_name: 'إسبريسو', l1_amount: aed(12), l2_name: 'كابتشينو', l2_amount: aed(36), l3_name: 'لاتيه', l3_amount: aed(20), count: '4 عناصر', total: aed(68),
  method_h: 'طريقة الدفع', online: 'الدفع عبر الإنترنت', counter: 'الدفع عند الكاشير', bill: 'طلب الفاتورة', info: 'تم إنشاء طلب الدفع (68.00 د.إ) — سيساعدك أحد الموظفين في الدفع.', place: 'تأكيد الطلب', placing: 'جارٍ إرسال الطلب…', paying: 'جارٍ بدء الدفع…' };
const checkout = (v, p = {}) => {
  const id = U('checkout'), sel = p.sel || 'counter', b = (k, label, extra = '') => `<button type="button" class="som-pay__b${sel === k ? ' is-on' : ''}"${extra}>${label}</button>`;
  const cta = sel === 'online' ? v.online : p.submitting ? v.placing : v.place, dis = p.submitting ? ' disabled' : '';
  return wrap(id, `<div class="som-page">${hdr(id, v.back, v.title)}<div class="som-co"><div class="som-co__in">
<section class="som-card" data-ui="${id}.summary"><h2 class="som-order__h">${v.summary_h}</h2><ul class="som-rows">${[1, 2, 3].map((i) => `<li><span>${v['l' + i + '_name']} × ${v['l' + i + '_qty']}</span><span>${v['l' + i + '_amount']}</span></li>`).join('')}</ul>
<div class="som-total"><span>${v.count}</span><span>${v.total}</span></div></section>
<section class="som-card" data-ui="${id}.methods"><h2 class="som-order__h">${v.method_h}</h2><div class="som-pay">${b('online', v.online)}${b('counter', v.counter)}${b('bill', v.bill)}</div>${p.info ? `<p class="som-info" data-ui="${id}.info">${v.info}</p>` : ''}</section>
<div class="som-cta"><button type="button" class="som-btn${p.submitting ? ' is-disabled' : ''}"${dis} data-ui="${id}.cta">${p.paying ? v.paying : cta}</button></div></div></div></div>`);
};

// ---------- Status ----------
const stSlots = { title: 'Order confirmed', thanks: 'Thanks — your order has been sent to the restaurant.', pickup_label: 'Pickup code', pickup_code: 'A-27', order_label: 'Order status', order_val: 'Submitted', bill_label: 'Bill status', bill_val: 'Not billed yet',
  req_h: 'Open service requests', r1_type: 'Call Waiter', r1_status: 'Open', add_more: 'Add more items', done: 'Done' };
const stAr = { title: 'تم تأكيد الطلب', thanks: 'شكرًا — تم إرسال طلبك إلى المطعم.', pickup_label: 'رمز الاستلام', order_label: 'حالة الطلب', order_val: 'تم الإرسال', bill_label: 'حالة الفاتورة', bill_val: 'لم تُصدر بعد',
  req_h: 'طلبات الخدمة المفتوحة', r1_type: 'استدعاء النادل', r1_status: 'مفتوح', add_more: 'أضف المزيد', done: 'تم' };
const status = (v, p = {}) => {
  const id = U('status');
  return wrap(id, `<div class="som-status so" style="display:flex;flex-direction:column"><h1 class="som-status__h" data-ui="${id}.title">${v.title}</h1><p class="som-status__p">${v.thanks}</p>
${p.pickup ? `<div class="som-pick" data-ui="${id}.pickup"><div class="som-pick__l">${v.pickup_label}</div><div class="som-pick__c">${v.pickup_code}</div></div>` : ''}
<div class="som-srows" data-ui="${id}.rows"><div class="som-srow"><span class="som-muted">${v.order_label}</span><b>${v.order_val}</b></div><div class="som-srow"><span class="som-muted">${v.bill_label}</span><b>${v.bill_val}</b></div>
${p.requests ? `<div class="som-srow" style="display:block"><div class="som-muted" style="margin-bottom:4px">${v.req_h}</div><div style="display:flex;justify-content:space-between"><span>${v.r1_type}</span><b>${v.r1_status}</b></div></div>` : ''}</div>
<div class="som-acts" data-ui="${id}.actions">${p.pickup ? '' : `<button type="button" class="som-btn" data-ui="${id}.add-more">${v.add_more}</button>`}<button type="button" class="som-btn som-btn--out" data-ui="${id}.done">${v.done}</button></div></div>`);
};

export const specs = [
  { ...BASE, id: U('menu'), name: 'Self-order mobile menu screen', slots: menuSlots, rtlValues: menuAr, na, render: menu, props: {},
    variants: {
      pickup: { props: { pickup: true }, values: { }, describe: 'QR Pickup session: header reads "Order for Pickup" and the order card carries the "Pickup code" bar (bg-muted).' },
      'missing-token': { props: { error: true }, describe: 'No ordering context and an error: centred text-destructive message asking to rescan the QR code.' },
      'starting-up': { props: { starting: true }, describe: 'Provisioned device bootstrapping (App.tsx): centred muted "Starting up…".' } },
    describe: ['MobileQR menu at 390x844: sticky blurred header ("Table 5" 18/600, "Start Over" border button), "Your order so far" card with Total row, category chips, search, 2-column product grid (gap 12) and a fixed bottom bar with "View Cart (3 items) • total" (rounded-md bg-primary py-3).', 'Use as the first screen after scanning a table QR code. ' + RTL] },
  { ...BASE, id: U('detail'), name: 'Self-order mobile product detail screen', slots: detSlots, rtlValues: detAr, na, render: detail, props: {},
    variants: { loading: { props: { loading: true }, describe: 'get_customer_product in flight: centred "Loading item..." with an underlined Back link.' }, 'not-found': { props: { notFound: true }, describe: 'No detail returned: destructive "Item not found." and a rounded-full "Back to menu" button.' } },
    describe: ['Product detail: "Back" underlined link, full-width image, p-6 gap-4 body with h1 (text-xl semibold), muted description, price (text-lg medium), Variants and Add-ons option rows, 36px round quantity steppers and a rounded-full "Add to cart" button.', 'Opened when a menu card is tapped and product_detail_enabled is set. ' + RTL] },
  { ...BASE, id: U('cart'), name: 'Self-order mobile cart screen', slots: cartSlots, rtlValues: cartAr, na, render: cart, props: {},
    variants: { empty: { props: { empty: true }, describe: 'No lines: "Your cart is empty." with a "Browse the menu" button; Proceed to checkout is disabled (opacity-50).' } },
    describe: ['Full-screen cart: header with "← Back to menu", centred "Your Cart" and a w-[92px] spacer; rounded-lg line cards with 28px −/+ steppers and an optional "Note:" line; footer with item count, total and "Proceed to checkout".', 'Reached from the fixed "View Cart" bar. ' + RTL] },
  { ...BASE, id: U('checkout'), name: 'Self-order mobile checkout screen', slots: coSlots, rtlValues: coAr, na, render: checkout, props: {},
    variants: { 'payment-request-info': { props: { info: true, sel: 'bill' }, describe: 'A payment request without a payment_url was created: muted note under the methods; Request Bill selected.' },
      submitting: { props: { submitting: true }, describe: 'Order submission in flight: "Placing order…", button disabled.' },
      'pay-online': { props: { sel: 'online' }, describe: 'Pay Online selected: the CTA switches to "Pay Online".' },
      'starting-payment': { props: { sel: 'online', submitting: true, paying: true }, describe: 'Online payment starting: "Starting payment…", disabled.' } },
    describe: ['Checkout: header ("← Back to cart", "Checkout"), Order Summary card with item rows and total, Payment Method card (Pay Online / Pay at Counter selected / Request Bill; selected = border-primary bg-primary/10) and a full-width "Place Order" button.', 'Final step before the order is sent. ' + RTL] },
  { ...BASE, id: U('status'), name: 'Self-order mobile order status screen', slots: stSlots, rtlValues: stAr, na, render: status, props: { requests: true },
    variants: { pickup: { props: { pickup: true, requests: false }, describe: 'Pickup order: the pickup code card (max-w-xs, bg-muted, text-3xl bold) shows and "Add more items" is hidden.' }, 'no-requests': { props: { requests: false }, describe: 'No open service requests.' } },
    describe: ['Order confirmation: centred column (py-8), "Order confirmed" (text-xl semibold), thanks line, order/bill status rows (max-w-xs), optional open service requests, "Add more items" and "Done".', 'Shown after the order is submitted. ' + RTL] },
];
