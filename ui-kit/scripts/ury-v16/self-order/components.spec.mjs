// URY v16 self-order shared primitives (T14): category tabs, search, product card, option row, cart panel, idle dialog.
// Arabic: no self-order locale exists in the source (self-order has no i18n); the fixed UI labels are translated by the kit and item names/categories are
// Arabic menu vocabulary. RTL is a kit extension (the source has no dir handling).
import { money } from '../lib.mjs';
import { P, so_css, SAMPLE_IMG, categoryTabs, searchBar, productCard, optionRow, cartPanel, idleDialog } from './components.mjs';
const BASE = { group: 'ury-self-order', static: true, width: 390, dsf: 2, canvas: 'hsl(var(--background))', css: so_css, darkTheme: '.dark', modes: ['light', 'dark', 'rtl'], naDefault: 'touch UI: hover/focus are not shown; the source styles only the active/pressed scale transition' };
const aed = (n, ar) => (ar ? { ...money(n), sample: `${Number(n).toFixed(2)} د.إ` } : money(n));
const RTL_NOTE = 'RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels.';
const cats = { all: 'All', cat_1: 'Espresso', cat_2: 'Milk Coffee', cat_3: 'Filter & Cold Brew', cat_4: 'Iced', cat_5: 'Tea & Others' };
const catsAr = { all: 'الكل', cat_1: 'إسبريسو', cat_2: 'قهوة بالحليب', cat_3: 'قهوة مفلترة وباردة', cat_4: 'مثلجات', cat_5: 'شاي ومشروبات أخرى' };
const na = { disabled: 'not applicable: this component has no distinct disabled variant', error: 'not applicable: no error state', loading: 'not applicable: no loading state', empty: 'not applicable: no empty state' };

export const specs = [
  { ...BASE, id: P + 'category-tabs', name: 'Self-order category tabs', slots: cats, rtlValues: catsAr, na,
    render: (v, p) => categoryTabs(v, p), props: { active: 0, n: 5 },
    variants: { 'all-active': { props: { active: 0 }, describe: 'The "All" chip is active (bg-primary); every course chip is inactive (border, bg-background).' }, 'category-active': { props: { active: 2 }, describe: 'A course chip is active, "All" falls back to the inactive style.' } },
    describe: ['Sticky horizontal category chip row (nav, bg-background/95, px-6 py-3, backdrop blur) with a leading "All" chip; rounded-full chips px-4 py-2 text-sm font-medium, active bg-primary, inactive border bg-background.', 'Use at the top of every self-order menu (tablet, kiosks, mobile). Rendered at 390 wide; it scrolls horizontally in the app so the last chips are clipped. ' + RTL_NOTE] },
  { ...BASE, id: P + 'search', name: 'Self-order search bar', slots: { placeholder: 'Search menu...', query: 'Cappuccino' }, rtlValues: { placeholder: 'ابحث في القائمة...', query: 'كابتشينو' }, na,
    render: (v, p) => `<div class="so so-search-wrap" data-ui="${P}search">${searchBar(v, p)}</div>`, props: {},
    variants: { filled: { props: { filled: true }, describe: 'A query is typed: the circular clear button (X, 16px) appears at the end of the field.' } },
    describe: ['Search field: rounded-md border-input bg-background px-3 py-2, 20px magnifier, text-sm input, and an inline clear button once text is entered.', 'Use above the menu grid. Placeholder is "Search menu...". ' + RTL_NOTE] },
  { ...BASE, id: P + 'product-card', name: 'Self-order product card', slots: { img: { type: 'image', sample: SAMPLE_IMG }, name: 'Espresso', rate: money(12), in_cart: 'In cart: 2', unavail: 'Sold out' },
    rtlValues: { name: 'إسبريسو', rate: aed(12, 1), in_cart: 'في السلة: 2', unavail: 'نفد المخزون' }, na,
    render: (v, p) => `<div class="so so-pc-wrap" data-ui="${P}product-card">${productCard(v, p)}</div>`, props: { size: 'mobile', qty: 2 },
    variants: {
      tablet: { props: { size: 'tablet' }, describe: 'Tablet layout: image h-32 (128), rounded-xl, text-left.' },
      landscape: { props: { size: 'landscape' }, describe: 'Landscape kiosk: image h-40 (160), rounded-2xl, text-lg.' },
      portrait: { props: { size: 'portrait' }, describe: 'Portrait kiosk: image h-48 (192), rounded-xl.' },
      'not-in-cart': { props: { qty: 0 }, describe: 'Nothing in the cart: only name and rate show.' },
      'sold-out': { props: { unavailable: true }, values: { unavail: 'Sold out' }, describe: 'Availability PLAN_EXHAUSTED / FG_OUT_OF_STOCK: opacity-50, the "Sold out" message replaces the in-cart badge.' },
      'not-available-today': { props: { unavailable: true }, values: { unavail: 'Not available today' }, describe: 'NOT_PRODUCED / NO_ACTIVE_PLAN: "Not available today".' },
      'temporarily-unavailable': { props: { unavailable: true }, values: { unavail: 'Temporarily unavailable' }, describe: 'BLOCKING_COMPONENT, MISSING_BOM and the other configuration codes: "Temporarily unavailable".' },
      'currently-unavailable': { props: { unavailable: true }, values: { unavail: 'Currently unavailable' }, describe: 'Unknown or missing reason code: "Currently unavailable".' } },
    describe: ['Menu item button: bordered card with image (h-24 mobile, h-32 tablet, h-40 landscape, h-48 portrait), name (font-medium), rate (muted) and an "In cart: N" primary badge; rounded-lg on mobile, xl/2xl on kiosks. Unavailable items are opacity-50 with a destructive reason in place of the badge.', 'Use inside the menu grid. Currency is a typed slot: the source prints the raw server string, the kit uses a formatted currency. ' + RTL_NOTE] },
  { ...BASE, id: P + 'option-row', name: 'Self-order option row', slots: { label: 'Variants', o1_name: 'Espresso', o1_rate: money(12), o2_name: 'Doppio', o2_rate: money(16), o3_name: 'Cortado', o3_rate: money(18) },
    rtlValues: { label: 'الخيارات', o1_name: 'إسبريسو', o1_rate: aed(12, 1), o2_name: 'دوبيو', o2_rate: aed(16, 1), o3_name: 'كورتادو', o3_rate: aed(18, 1) }, na,
    render: (v, p) => `<div class="so so-opt-wrap" data-ui="${P}option-row"><div class="so-opt-label">${v.label}</div><div class="so-opt-list">${[1, 2, 3].map((i) => optionRow({ name: v['o' + i + '_name'], rate: v['o' + i + '_rate'] }, { selected: (p.sel || [1]).includes(i), ui: P + 'option-row.row-' + i })).join('')}</div></div>`, props: { sel: [1] },
    variants: { 'none-selected': { props: { sel: [] }, describe: 'No row selected: all rows use border-border.' }, 'multi-selected': { props: { sel: [1, 3] }, values: { label: 'Add-ons' }, describe: 'Add-ons allow several selected rows (border-primary, bg-primary/10).' }, 'no-rate': { props: { sel: [1] }, values: { o3_rate: '—' }, describe: 'Option without a rate renders the em dash fallback.' } },
    describe: ['Variant or add-on option row from the product detail: flex justify-between rounded-lg border px-4 py-3; selected = border-primary bg-primary/10; rate in muted text, an em dash when the rate is null.', 'Use in the product detail screen under a "Variants" / "Add-ons" heading. ' + RTL_NOTE] },
  { ...BASE, id: P + 'cart-panel', name: 'Self-order cart panel', width: 410, height: 640, slots: {
      order_title: 'Your order so far', cart_title: 'Cart', total_label: 'Total', o1_name: 'Espresso', o1_qty: '1', o1_amount: money(12), o2_name: 'Cappuccino', o2_qty: '2', o2_amount: money(36), order_total: money(48),
      c1_name: 'Latte', c1_qty: '1', c2_name: 'Croissant', c2_qty: '2', empty_text: 'Tap a menu item to add it to your cart.', count_label: '3 items', cart_total: money(52),
      place_order: 'Place Order', placing: 'Placing order…', pay_online: 'Pay Online', paying: 'Starting payment…', request_bill: 'Request Bill', bill_requested: 'Bill requested — staff notified' },
    rtlValues: { order_title: 'طلبك حتى الآن', cart_title: 'السلة', total_label: 'المجموع', o1_name: 'إسبريسو', o1_amount: aed(12, 1), o2_name: 'كابتشينو', o2_amount: aed(36, 1), order_total: aed(48, 1), c1_name: 'لاتيه', c2_name: 'كرواسون',
      empty_text: 'اضغط على عنصر من القائمة لإضافته إلى السلة.', count_label: '3 عناصر', cart_total: aed(52, 1), place_order: 'تأكيد الطلب', placing: 'جارٍ إرسال الطلب…', pay_online: 'الدفع عبر الإنترنت', paying: 'جارٍ بدء الدفع…', request_bill: 'طلب الفاتورة', bill_requested: 'تم طلب الفاتورة — تم إشعار الموظفين' }, na,
    render: (v, p) => cartPanel(v, p), props: { order: true, items: 2 },
    variants: {
      'empty-cart': { props: { order: false, items: 0 }, values: { count_label: '0 items', cart_total: money(0) }, describe: 'No order yet and an empty cart: the hint text shows and Place Order is disabled (opacity-50).' },
      'cart-only': { props: { order: false, items: 2 }, describe: 'First order: no "Your order so far" block.' },
      submitting: { props: { submitting: true }, describe: 'Order being submitted: "Placing order…", button disabled.' },
      'pay-online': { props: { payOnline: true }, describe: 'customer_payment_enabled and an unbilled order: the primary "Pay Online" button.' },
      'paying-online': { props: { payOnline: true, paying: true }, describe: 'Payment starting: "Starting payment…", disabled.' },
      'request-bill': { props: { requestBill: true }, describe: 'request_bill_enabled and an unbilled order: outlined "Request Bill" button.' },
      'bill-requested': { props: { requestBill: true, billRequested: true }, describe: 'Bill already requested: "Bill requested — staff notified", disabled.' },
      'all-actions': { props: { payOnline: true, requestBill: true }, describe: 'Both optional buttons enabled.' } },
    describe: ['Persistent order-summary + cart aside (w-[32%], border-l, p-4): "Your order so far" block, "Cart" list with round −/+ steppers, tabular-nums total, Place Order, optional Pay Online / Request Bill.', 'Use on the tablet and landscape kiosk layouts; rendered at 410 wide. Amounts are typed currency slots (the source mixes raw server strings and formatCurrency). ' + RTL_NOTE] },
  { ...BASE, id: P + 'idle-dialog', name: 'Self-order idle dialog', height: 320, slots: { title: 'Still there?', still_here: "I'm still here", close: 'Close' },
    rtlValues: { title: 'هل ما زلت هنا؟', still_here: 'ما زلت هنا', close: 'إغلاق' }, na,
    render: (v, p) => idleDialog(v, p), props: {}, variants: {},
    describe: ['Idle-timeout dialog ("Still there?") shown by useIdleReset after 90 s without input: centred card on a blurred scrim, title and a full-width primary "I\'m still here" button (py-3, text-base, font-medium).', 'Use on tablet and kiosk screens before the session resets. ' + RTL_NOTE] },
];
