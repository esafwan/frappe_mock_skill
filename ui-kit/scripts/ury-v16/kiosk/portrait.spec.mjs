// URY v16 portrait self-service kiosk screens (T18): menu, cart-open, detail, idle. Sources: self-order/src/layouts/PortraitKioskLayout.tsx,
// layouts/shared/{SearchBar,ProductCard,MenuGrid,ProductDetail}.tsx, hooks/useIdleReset.ts. Markup is authored in this module (no shared helper file).
// Arabic: the self-order source has no i18n; fixed UI labels are translated by the kit, menu names are Arabic menu vocabulary. RTL is a kit extension (the source has no dir handling).
// Kiosk confirm copy (window.confirm in handleReset, a native browser dialog that cannot be drawn): 'Start a new order? Current cart will be cleared.'
import { ic, money } from '../lib.mjs';
import { MENU, CATS as CATN, CATS_AR, LATTE, CAPP, imgSlots, detailImg, stateImages } from './menu.mjs';

const G = 'ury-kiosk-screen-portrait-';
const aed = (n) => ({ ...money(n), sample: `${Number(n).toFixed(2)} د.إ` });
const ITEMS = MENU.map((m) => [m.n, m.ar, m.r]); // shared menu (menu.mjs): same items, prices and photos as the landscape kiosk
const CATS = CATN.map((c, i) => [c, CATS_AR[i]]);
const IN_CART = { [LATTE]: 'in_cart_1', [CAPP]: 'in_cart_2' }; // Latte x1 + Cappuccino x2 = 3 items
const IMG = (i) => 'p' + i + '_img';
// The page scrolls under the fixed bar (pb-24 reserves the bar height at the scroll end). A static frame shows whole rows only:
// ROWS rows of 2 cards sit above the reserve (the rest of the menu is further down the scroll).
const ROWS = { menu: 5, open: 3 };

const slotsBase = {
  img: detailImg(), title: 'Order for Pickup', new_order: 'New Order', placeholder: 'Search...', all_items: 'All Items',
  in_cart_1: 'In cart: 1', in_cart_2: 'In cart: 2', unavail: 'Sold out', checkout: 'Checkout', count_label: '3 items', cart_total: money(48),
  idle_title: 'Still there?', still_here: "I'm still here", close: 'Close',
  l1_name: 'Latte', l1_qty: '1', l2_name: 'Cappuccino', l2_qty: '2',
  d_back: 'Back', d_title: 'Cappuccino', d_desc: 'Double espresso with steamed milk and a light layer of foam.', d_rate: money(16), d_variants: 'Variants', d_addons: 'Add-ons',
  v1_name: 'Regular', v1_rate: money(16), v2_name: 'Large', v2_rate: money(20), a1_name: 'Extra shot', a1_rate: money(4), a2_name: 'Oat milk', a2_rate: money(3), d_qty: '1', add_to_cart: 'Add to cart',
};
const rtlBase = {
  title: 'طلب للاستلام', new_order: 'طلب جديد', placeholder: 'بحث...', all_items: 'جميع العناصر', in_cart_1: 'في السلة: 1', in_cart_2: 'في السلة: 2', unavail: 'نفد المخزون',
  checkout: 'الدفع', count_label: '3 عناصر', cart_total: aed(48), idle_title: 'هل ما زلت هنا؟', still_here: 'ما زلت هنا', close: 'إغلاق',
  l1_name: 'لاتيه', l2_name: 'كابتشينو', d_back: 'رجوع', d_title: 'كابتشينو', d_desc: 'إسبريسو مزدوج مع حليب مبخّر وطبقة خفيفة من الرغوة.', d_rate: aed(16), d_variants: 'الخيارات', d_addons: 'الإضافات',
  v1_name: 'عادي', v1_rate: aed(16), v2_name: 'كبير', v2_rate: aed(20), a1_name: 'جرعة إضافية', a1_rate: aed(4), a2_name: 'حليب الشوفان', a2_rate: aed(3), add_to_cart: 'أضف إلى السلة',
};
ITEMS.forEach(([en, ar, n], i) => { slotsBase['n' + i] = en; slotsBase['r' + i] = money(n); rtlBase['n' + i] = ar; rtlBase['r' + i] = aed(n); });
CATS.forEach(([en, ar], i) => { slotsBase['cat_' + (i + 1)] = en; rtlBase['cat_' + (i + 1)] = ar; });
Object.assign(slotsBase, imgSlots(IMG));

const header = (v, id) => `<header class="kp-header" data-ui="${id}.header"><h1 class="kp-title" data-ui="${id}.title">${v.title}</h1><button type="button" class="kp-new" data-ui="${id}.new-order">${v.new_order}</button></header>`;
const search = (v, id) => `<div class="kp-searchcol" data-ui="${id}.search"><div class="kp-search"><span class="kp-search__icon">${ic('Search', 20)}</span><input class="kp-search__input" type="text" readonly aria-label="Search menu" placeholder="${v.placeholder}"></div></div>`;
const nav = (v, id, a) => `<nav class="kp-nav" aria-label="Menu categories" data-ui="${id}.categories"><button type="button" class="kp-cat${a === 0 ? ' kp-cat--on' : ''}">${v.all_items}</button>${CATS.map((_, i) => `<button type="button" class="kp-cat${a === i + 1 ? ' kp-cat--on' : ''}">${v['cat_' + (i + 1)]}</button>`).join('')}</nav>`;
const card = (v, i, p, id) => {
  const dis = p.soldOut === i, msg = dis ? `<div class="kp-card__msg kp-card__msg--bad">${v.unavail}</div>` : (p.bar && IN_CART[i]) ? `<div class="kp-card__msg kp-card__msg--cart">${v[IN_CART[i]]}</div>` : '';
  return `<button type="button" class="kp-card${dis ? ' is-disabled' : ''}"${dis ? ' disabled aria-disabled="true"' : ''} data-ui="${id}.card-${i}"><img class="kp-card__img" src="${v[IMG(i)]}" alt="${v['n' + i]}"><div class="kp-card__body"><div class="kp-card__name">${v['n' + i]}</div><div class="kp-card__rate">${v['r' + i]}</div>${msg}</div></button>`;
};
const grid = (v, p, id) => `<div class="kp-grid" data-ui="${id}.grid">${ITEMS.map((_, i) => i).slice(0, 2 * (p.open ? ROWS.open : ROWS.menu)).map((i) => card(v, i, { bar: p.bar !== false, ...p }, id)).join('')}</div>`;
const line = (v, i) => `<li><span>${v['l' + i + '_name']}</span><span class="kp-bar__ctl"><button type="button" class="kp-step" aria-label="Remove one">−</button>${v['l' + i + '_qty']}<button type="button" class="kp-step" aria-label="Add one more">+</button></span></li>`;
const bar = (v, p, id) => `<div class="kp-bar" data-ui="${id}.bar">${p.open ? `<div class="kp-bar__lines" data-ui="${id}.lines"><ul class="kp-bar__list">${[1, 2].slice(0, p.lines ?? 2).map((i) => line(v, i)).join('')}</ul></div>` : ''}
<div class="kp-bar__foot"><button type="button" class="kp-bar__toggle" aria-expanded="${!!p.open}" data-ui="${id}.toggle"><span>${v.count_label}</span><span class="kp-num" data-ui="${id}.total">${v.cart_total}</span></button><button type="button" class="kp-bar__checkout" data-ui="${id}.checkout">${v.checkout}</button></div></div>`;
const menuScreen = (v, p, id) => `<div class="kp kp--menu${p.open ? ' kp--open' : ''}" data-ui="${id}">${header(v, id)}<div class="kp-body"><div class="kp-row">${search(v, id)}${nav(v, id, p.cat ?? 0)}</div>${grid(v, p, id)}</div>${p.bar === false ? '' : bar(v, { ...p, bar: true }, id)}${p.idle ? idle(v, id) : ''}</div>`;
const opt = (v, k, on, id) => `<button type="button" class="kp-opt${on ? ' kp-opt--on' : ''}" data-ui="${id}.${k}"><span>${v[k + '_name']}</span><span class="kp-opt__rate">${v[k + '_rate']}</span></button>`;
const detailScreen = (v, p, id) => `<div class="kp" data-ui="${id}">${header(v, id)}<div class="kp-detail" data-ui="${id}.detail"><div class="kp-detail__back"><button type="button" data-ui="${id}.back"><span>${v.d_back}</span></button></div>
<img class="kp-detail__img" src="${v.img}" alt="${v.d_title}"><div class="kp-detail__content"><div><h1 class="kp-detail__h1" data-ui="${id}.name">${v.d_title}</h1><p class="kp-detail__desc">${v.d_desc}</p></div><div class="kp-detail__rate" data-ui="${id}.rate">${v.d_rate}</div>
${p.options === false ? '' : `<div class="kp-detail__grp"><div class="kp-detail__lbl">${v.d_variants}</div>${opt(v, 'v1', true, id)}${opt(v, 'v2', false, id)}</div><div class="kp-detail__grp"><div class="kp-detail__lbl">${v.d_addons}</div>${opt(v, 'a1', !!p.addon, id)}${opt(v, 'a2', false, id)}</div>`}
<div class="kp-qty" data-ui="${id}.qty"><button type="button" class="kp-qty__btn" aria-label="Decrease quantity">-</button><div class="kp-qty__n">${v.d_qty}</div><button type="button" class="kp-qty__btn" aria-label="Increase quantity">+</button></div>
<button type="button" class="kp-add" data-ui="${id}.add">${v.add_to_cart}</button></div></div></div>`;
const idle = (v, id) => `<div class="kp-idle" data-ui="${id}.idle"><div class="u-dialog-wrap"><div class="u-dialog-scrim"></div><div class="u-dialog u-dialog--md" role="dialog" aria-modal="true"><button type="button" class="u-dialog-close" aria-label="Close">${ic('X', 16)}<span class="u-sr-only">${v.close}</span></button>
<div class="u-dialog-header"><h2 class="u-dialog-title" data-ui="${id}.idle-title">${v.idle_title}</h2></div><div class="u-dialog-footer"><button type="button" class="kp-idle__btn" data-ui="${id}.still-here">${v.still_here}</button></div></div></div></div>`;

const BASE = { group: 'ury-kiosk', static: true, width: 1080, height: 1920, dsf: 1, canvas: 'hsl(var(--background))', darkTheme: '.dark', modes: ['light', 'dark', 'rtl'],
  css: ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/kiosk-portrait.css'], slots: slotsBase, rtlValues: rtlBase,
  naDefault: 'touch UI: hover/focus are not shown; the source styles only hover:bg-muted on category buttons and the active scale transition',
  na: { disabled: 'not applicable: only product cards disable (shown as the sold-out variant)', error: 'not applicable: this screen shows the source error banner only on a failed request', loading: 'not applicable: the "Loading menu…" splash is a separate state', empty: 'not applicable: no empty state is drawn' } };
const RTL = 'RTL is a kit extension (the source has no dir handling): the kit mirrors with logical properties and translates the fixed UI labels (self-order has no locale file).';

export const specs = [
  { ...BASE, id: G + 'menu', name: 'Portrait kiosk menu', render: (v, p) => menuScreen(v, p, G + 'menu'), props: { cat: 0, open: false },
    variants: {
      'category-active': { props: { cat: 2 }, describe: 'A course button is active (bg-primary); "All Items" falls back to text-foreground.' },
      'table-order': { props: {}, values: { title: 'Table 12' }, describe: 'Dine-in session: the h1 reads "Table {table}" instead of "Order for Pickup".' },
      'sold-out': { props: { soldOut: 5 }, describe: 'A sold-out card (availability gating): opacity-50, disabled, destructive reason replaces the in-cart badge.' },
      'empty-cart': { props: { bar: false }, describe: 'cartCount is 0: the bottom bar is not rendered (the grid keeps its pb-24 reserve).' } },
    describe: ['Portrait kiosk menu at 1080x1920: sticky header (px-6 py-4, h1 24/600, "New Order" bordered button), a row of w-40 search and a horizontal category nav (rounded-lg border p-2, buttons rounded-md px-3 py-3 14/500, active bg-primary, first "All Items"), a 2-column grid (gap 16) of rounded-xl cards with h-48 images, and the fixed bottom cart bar (border-t, shadow-lg, p-4) with the count/total button and Checkout.',
      'Use as the browse state of the large vertical self-service kiosk. The bar is collapsed (count and total only). The header title is the source h1 (Order for Pickup / Table N). ' + RTL] },
  { ...BASE, id: G + 'cart-open', name: 'Portrait kiosk cart open', render: (v, p) => menuScreen(v, p, G + 'cart-open'), props: { cat: 0, open: true, lines: 2 },
    variants: { 'single-line': { props: { lines: 1 }, values: { count_label: '1 item', cart_total: money(16) }, describe: 'Only the Latte in the cart.' } },
    describe: ['Cart bar expanded (cartExpanded): the lines block grows above the footer, max-h-[50vh] (960 px) with border-b and p-4; each line is the item name and a 32 px round bordered − / + stepper pair with the quantity between (gap-3).',
      'Use after the guest taps the count/total button. The footer keeps the count/total toggle (aria-expanded) and Checkout. ' + RTL] },
  { ...BASE, id: G + 'detail', name: 'Portrait kiosk product detail', render: (v, p) => detailScreen(v, p, G + 'detail'), props: {},
    variants: { 'addon-selected': { props: { addon: true }, describe: 'An add-on row is selected (border-primary, bg-primary/10).' }, 'no-options': { props: { options: false }, describe: 'Item without variants or add-ons: only quantity and Add to cart remain.' } },
    describe: ['Full-screen product detail (product_detail_enabled): the layout header, then ProductDetail: underlined Back, full-width image, h1 20/600 name, muted description, 18/500 rate, Variants and Add-ons option rows, a 36 px round quantity stepper and the full-pill Add to cart button.',
      'Use when a card is tapped and product detail is on. Image height follows the source (natural aspect, w-full). ' + RTL] },
  { ...BASE, id: G + 'idle', name: 'Portrait kiosk idle warning', render: (v, p) => menuScreen(v, p, G + 'idle'), props: { cat: 0, open: false, idle: true },
    variants: {}, describe: ['Unattended-kiosk idle warning: after session_idle_timeout_minutes without pointerdown/keydown (useIdleReset) a "Still there?" dialog covers the menu on a blurred scrim, with a full-width primary "I\'m still here" button; without a reply it resets the session after 15 s.',
      'Use on the menu screen when the guest walks away. ' + RTL] },
].map((sp) => stateImages(sp, IMG));
