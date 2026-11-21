// URY v16 POS register route (T09): category sidebar, quick filters, menu grid, order panel, empty cart, screens.
// Sources: pos/src/pages/POS.tsx, components/{Sidebar,OrderPanel,OrderTypeSelect,MenuList,MenuCard}.tsx, packages/ui sidebar.tsx + menu-item-card.tsx @100c43fe2e.
// CSS: tokens/css/ury-v16/components/pos-register.css
import { ic, screen, money } from '../lib.mjs';
import { header, footer, SHELL_SLOTS, SHELL_RTL, HEADER_KEYS, FOOTER_KEYS, PLACEHOLDERS, pick } from './shell.mjs';
import { stage, productDialog } from './dialogs.mjs';

const EXTRA = { Edit: '<path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>' };
const I = (n, s = 16, c = '') => ic(n, s, c, EXTRA);
const P = new Proxy({}, { get: (_, k) => `{{${String(k)}}}` });

export const REG_CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/pos-register.css'];
export const SCREEN_CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/pos-shell.css', 'ury-v16/components/pos-register.css'];
export const PRODUCT_CSS = [...SCREEN_CSS, 'ury-v16/components/pos-dialogs.css'];

// ---- data: mediterranean menu (data/menus/mediterranean.json), AED ----
const IMGDIR = '../../data/images/mediterranean/';
export const ITEMS = [
  ['hummus', 'Hummus', 'حمص', 22, 'Cold Meze', 'المقبلات الباردة'],
  ['moutabal', 'Moutabal', 'متبّل', 24, 'Cold Meze', 'المقبلات الباردة'],
  ['baba-ghanoush', 'Baba Ghanoush', 'بابا غنوج', 24, 'Cold Meze', 'المقبلات الباردة'],
  ['tabbouleh', 'Tabbouleh', 'تبولة', 26, 'Cold Meze', 'المقبلات الباردة'],
  ['fattoush', 'Fattoush', 'فتوش', 28, 'Cold Meze', 'المقبلات الباردة'],
  ['labneh', 'Labneh', 'لبنة', 20, 'Cold Meze', 'المقبلات الباردة'],
  ['muhammara', 'Muhammara', 'محمرة', 26, 'Cold Meze', 'المقبلات الباردة'],
  ['stuffed-vine-leaves', 'Stuffed Vine Leaves', 'ورق عنب', 30, 'Cold Meze', 'المقبلات الباردة'],
  ['falafel', 'Falafel', 'فلافل', 24, 'Hot Meze', 'المقبلات الساخنة'],
  ['kibbeh', 'Kibbeh', 'كبة', 32, 'Hot Meze', 'المقبلات الساخنة'],
  ['sambousek', 'Sambousek', 'سمبوسك', 28, 'Hot Meze', 'المقبلات الساخنة'],
  ['fried-halloumi', 'Fried Halloumi', 'حلوم مقلي', 32, 'Hot Meze', 'المقبلات الساخنة'],
  ['batata-harra', 'Batata Harra', 'بطاطا حرة', 26, 'Hot Meze', 'المقبلات الساخنة'],
  ['shish-tawook', 'Shish Tawook', 'شيش طاووق', 52, 'Grills & Kebabs', 'المشاوي والكباب'],
  ['lamb-kofta', 'Lamb Kofta', 'كفتة لحم ضأن', 58, 'Grills & Kebabs', 'المشاوي والكباب'],
];
export const CATS = [
  ['Cold Meze', 'المقبلات الباردة', 8, 'UtensilsCrossed'], ['Hot Meze', 'المقبلات الساخنة', 5, 'UtensilsCrossed'], ['Grills & Kebabs', 'المشاوي والكباب', 5, 'Utensils'],
  ['Shawarma & Wraps', 'الشاورما واللفائف', 4, 'ShoppingBag'], ['Mains & Rice', 'الأطباق الرئيسية والأرز', 3, 'Utensils'], ['Bread & Desserts', 'الخبز والحلويات', 4, 'Store'], ['Drinks', 'المشروبات', 3, 'Sparkles'],
];
export const ORDER_TYPES = [['dine_in', 'Utensils'], ['take_away', 'ShoppingBag'], ['delivery', 'Truck'], ['phone_in', 'Phone'], ['aggregators', 'Globe']];

const T = {
  categories: ['Categories', 'فئات'], all_items: ['All Items', 'جميع الأصناف'], count_all: ['32', null],
  filter_all: ['All', 'الكل'], filter_special: ['Special Items', 'أصناف مميزة'],
  dine_in: ['Dine In', 'طلب محلي'], take_away: ['Take Away', 'سفري'], delivery: ['Delivery', 'توصيل'], phone_in: ['Phone In', 'طلب هاتفي'], aggregators: ['Aggregators', 'منصات تجميع'],
  customer_ph: ['Search customer...', 'ابحث عن عميل...'], customer_name: ['Rashid Mansoor', 'راشد منصور'], pax: ['Pax', 'عدد الأشخاص'], pax_n: ['2', null],
  edit_item: ['Edit item', 'تعديل العنصر'], clear_cart: ['Clear cart', 'إفراغ العربة'], total: ['Total', 'الإجمالي'],
  add_order: ['Add New Order', 'إضافة طلب جديد'], update_order: ['Update Order', 'تحديث الطلب'], add_comment: ['Add comment', 'إضافة تعليق'],
  kot_sent: ['Sent', 'أُرسل'], kot_preparing: ['Preparing', 'قيد التحضير'], kot_ready: ['Ready', 'جاهز'], kot_served: ['Served', 'قُدِّم'],
  empty_title: ['Your cart is empty', 'عربة التسوق فارغة'], empty_sub: ['Add items to get started with your order', 'أضف عناصر للبدء في طلبك'],
  click_to_add: ['Click items to add them', 'انقر على العناصر لإضافتها'], double_click: ['Double-click for customization options', 'انقر مرتين لخيارات التخصيص'],
  qty_1: ['1', null], qty_2: ['2', null],
  line_variant: ['Large', 'كبير'], line_addons: ['Extra Pita Bread, Spicy Harissa', 'خبز بيتا إضافي، هريسة حارة'],
  // multi-line sample lines (unbound)
  l2_name: ['Falafel', 'فلافل'], l2_price: [money(48), null], l3_name: ['Fattoush', 'فتوش'], l3_price: [money(28), null], l4_name: ['Kibbeh', 'كبة'], l4_price: [money(32), null],
  l1_name: ['Hummus', 'حمص'], l1_price: [money(22), null],
  total_multi: [money(130), null],
};
ITEMS.forEach(([id, en, ar, price, ce, ca], i) => {
  T['i' + (i + 1) + '_name'] = [en, ar]; T['i' + (i + 1) + '_price'] = [money(price), null]; T['i' + (i + 1) + '_course'] = [ce, ca];
  T['i' + (i + 1) + '_img'] = [{ type: 'image', sample: IMGDIR + id + '.jpg' }, null];
});
CATS.forEach(([en, ar, n], i) => { T['cat' + (i + 1) + '_name'] = [en, ar]; T['cat' + (i + 1) + '_count'] = [String(n), null]; });
T.total = ['Total', 'الإجمالي'];
T.total_amount = [money(22), null];

export const SLOTS = Object.fromEntries(Object.entries(T).map(([k, [en]]) => [k, en]));
export const RTL = Object.fromEntries(Object.entries(T).filter(([, [en, ar]]) => ar != null).map(([k, [, ar]]) => [k, ar]));
const only = (o, ks) => Object.fromEntries(ks.filter((k) => k in o).map((k) => [k, o[k]]));
const re = (rx) => Object.keys(SLOTS).filter((k) => rx.test(k));
export const KEYS = {
  panel: ['i1_name', 'i1_price', 'dine_in', 'take_away', 'delivery', 'phone_in', 'aggregators', 'customer_ph', 'customer_name', 'pax', 'pax_n', 'edit_item', 'clear_cart', 'total', 'add_order', 'update_order', 'add_comment', 'kot_sent', 'kot_preparing', 'kot_ready', 'kot_served', 'qty_1', 'qty_2', 'line_variant', 'line_addons', 'l1_name', 'l1_price', 'l2_name', 'l2_price', 'l3_name', 'l3_price', 'l4_name', 'l4_price', 'total_multi', 'total_amount'],
  empty: ['dine_in', 'take_away', 'delivery', 'phone_in', 'aggregators', 'customer_ph', 'pax', 'pax_n', 'empty_title', 'empty_sub', 'click_to_add', 'double_click'],
  grid: [...re(/^i\d+_/), 'filter_all', 'filter_special', 'categories', 'all_items', 'count_all', ...re(/^cat\d+_/)],
};
KEYS.screen = [...new Set([...KEYS.empty, ...KEYS.panel.filter((k) => !/^(l[1-4]_|total_multi|line_)/.test(k)), ...KEYS.grid, 'qty_1', 'total_amount'])];
export const hdr = () => ({ ...pick(SHELL_SLOTS, HEADER_KEYS), search_placeholder: PLACEHOLDERS.register[0], ...pick(SHELL_SLOTS, FOOTER_KEYS) });
export const hdrRtl = () => ({ ...pick(SHELL_RTL, [...HEADER_KEYS, ...FOOTER_KEYS].filter((k) => k in SHELL_RTL)), search_placeholder: PLACEHOLDERS.register[1] });
export const specSlots = (ks, extra = {}) => ({ slots: { ...only(SLOTS, ks), ...extra.slots }, rtlValues: { ...only(RTL, ks), ...extra.rtl } });

// ---- markup ----
const num = (k) => `<span class="u-num">${k}</span>`;
export function sidebar({ v = P, id = 'pos-category-sidebar' } = {}) {
  const cats = CATS.map(([, , , icon], i) => `<button type="button" class="prg-item" data-ui="${id}.cat-${i + 1}"><div class="prg-item__lbl">${I(icon, 16)}<span>${v['cat' + (i + 1) + '_name']}</span></div><span class="prg-cnt">${v['cat' + (i + 1) + '_count']}</span></button>`).join('');
  return `<div class="prg-side" data-ui="${id}"><nav class="prg-nav"><div class="prg-sidecard"><h2 class="prg-sidehead">${v.categories}</h2><button type="button" class="prg-item prg-item--all is-active" data-ui="${id}.all"><div class="prg-ind"></div><div class="prg-item__lbl">${I('Grid3X3', 16)}<span>${v.all_items}</span></div><span class="prg-cnt">${v.count_all}</span></button><div class="prg-div"></div><div class="prg-cats">${cats}</div></div></nav></div>`;
}
export const filterBar = ({ v = P, active = 'all', id = 'pos-filter-bar' } = {}) =>
  `<div class="prg-filterbar" data-ui="${id}"><div class="prg-container"><div class="prg-filters"><button type="button" class="prg-pill${active === 'all' ? ' is-active' : ''}" data-ui="${id}.all">${I('Star', 16)}${v.filter_all}</button><button type="button" class="prg-pill${active === 'special' ? ' is-active' : ''}" data-ui="${id}.special">${I('TrendingUp', 16)}${v.filter_special}</button></div></div></div>`;
export const menuCard = ({ v = P, n, qty = null, id }) =>
  `<div class="prg-card" role="button" data-ui="${id}"><div class="prg-card__img"><img src="${v['i' + n + '_img']}" alt="${v['i' + n + '_name']}"></div><div class="prg-card__body"><h3 class="prg-card__name">${v['i' + n + '_name']}</h3><div class="prg-card__row"><p class="prg-card__course">${v['i' + n + '_course']}</p><span class="prg-card__price"><span class="u-num">${v['i' + n + '_price']}</span></span></div><div class="prg-card__spacer"></div></div>${qty ? `<div class="prg-qty" role="group" data-ui="${id}.qty"><button type="button" aria-label="Decrease">${I('Minus', 16)}</button><span>${v[qty]}</span><button type="button" aria-label="Increase">${I('Plus', 16)}</button></div>` : ''}</div>`;
export const grid = ({ v = P, qtyOn = { 1: 'qty_1' }, id = 'pos-item-grid' } = {}) =>
  `<div class="prg-gridwrap" data-ui="${id}"><div class="prg-gridin"><div class="prg-grid">${ITEMS.map((_, i) => menuCard({ v, n: i + 1, qty: qtyOn[i + 1] || null, id: `${id}.item-${i + 1}` })).join('')}</div></div></div>`;

const types = (v, active, disabled) => ORDER_TYPES.map(([k, icon]) => `<button type="button" class="prg-type${active === k ? ' is-active' : ''}${disabled && k === 'dine_in' ? ' is-disabled' : ''}"${disabled && k === 'dine_in' ? ' disabled' : ''}>${I(icon, 16)}${v[k]}</button>`).join('');
const KOT = { sent: 'kot_sent', preparing: 'kot_preparing', ready: 'kot_ready', served: 'kot_served' };
// line: {name, price, qty, variant, addons, kot}
const lineHtml = (v, l, i, id) => `<div class="prg-line" data-ui="${id}.line-${i + 1}"><div class="prg-line__row"><div class="prg-line__main"><div class="prg-line__top"><h3 class="prg-line__name">${v[l.name]}</h3>${l.kot ? `<span class="prg-kot prg-kot--${l.kot}" data-ui="${id}.kot-${i + 1}">${v[KOT[l.kot]]}</span>` : ''}</div>${l.variant ? `<p class="prg-line__var">${v.line_variant}</p>` : ''}${l.addons ? `<p class="prg-line__add">${v.line_addons}</p>` : ''}<p class="prg-line__price"><span class="u-num">${v[l.price]}</span></p></div><div class="prg-line__ctl"><button type="button" class="prg-icon prg-icon--edit" title="${v.edit_item}" data-ui="${id}.edit-${i + 1}">${I('Edit', 16)}</button><div class="prg-step"><button type="button" class="prg-round" aria-label="Decrease">-</button><span>${v[l.qty]}</span><button type="button" class="prg-round" aria-label="Increase">+</button></div><button type="button" class="prg-icon prg-icon--del" aria-label="Remove" data-ui="${id}.delete-${i + 1}">${I('Trash2', 20)}</button></div></div></div>`;
export const LINES = {
  one: [{ name: 'i1_name', price: 'i1_price', qty: 'qty_1' }],
  multi: [{ name: 'l1_name', price: 'l1_price', qty: 'qty_1', kot: 'sent' }, { name: 'l2_name', price: 'l2_price', qty: 'qty_2', kot: 'preparing' }, { name: 'l3_name', price: 'l3_price', qty: 'qty_1', kot: 'ready' }, { name: 'l4_name', price: 'l4_price', qty: 'qty_1', kot: 'served' }],
  config: [{ name: 'l1_name', price: 'l1_price', qty: 'qty_1', variant: true, addons: true }],
};
// orderPanel({v, lines:'one'|'multi'|'config'|'empty', type, update, comment, disabled, customer:false, id})
export function orderPanel({ v = P, lines = 'one', type = 'take_away', update = false, comment = false, disabled = false, customer = false, totalKey = 'total_amount', id = 'pos-order-panel-v16' } = {}) {
  const head = `<div class="prg-phead" data-ui="${id}.header"><div class="prg-types" data-ui="${id}.types">${types(v, type, disabled)}</div><div class="prg-cust${customer ? ' prg-cust--val' : ''}" data-ui="${id}.customer"><span>${customer ? v.customer_name : v.customer_ph}</span>${I('ChevronDown', 16)}</div><div class="prg-pax" data-ui="${id}.pax"><span class="prg-pax__lbl">${v.pax}</span><div class="prg-step"><button type="button" class="prg-round" aria-label="Decrease"${update ? '' : ''}>-</button><span>${v.pax_n}</span><button type="button" class="prg-round" aria-label="Increase">+</button></div></div></div>`;
  let body;
  if (lines === 'empty') {
    body = `<div class="prg-empty" data-ui="${id}.empty"><div class="prg-empty__circle">${I('Frown', 48)}</div><h3 class="prg-empty__title">${v.empty_title}</h3><p class="prg-empty__sub">${v.empty_sub}</p><div class="prg-empty__add">${I('Plus', 16)}<span>${v.click_to_add}</span></div><div class="prg-empty__hint" data-ui="${id}.hint">${v.double_click}</div></div>`;
  } else {
    const tk = lines === 'multi' ? 'total_multi' : lines === 'config' ? 'l1_price' : totalKey;
    body = `<div class="prg-lines" data-ui="${id}.lines">${LINES[lines].map((l, i) => lineHtml(v, l, i, id)).join('')}<button type="button" class="prg-clear" data-ui="${id}.clear">${v.clear_cart}</button></div><div class="prg-pfoot" data-ui="${id}.footer"><div class="prg-total"><div class="prg-total__l"><button type="button" class="prg-cmt${comment ? ' is-set' : ''}" title="${v.add_comment}" data-ui="${id}.comment">${I('MessageSquare', 16)}</button><span class="prg-total__t">${v.total}</span></div><span class="prg-total__t" data-ui="${id}.total"><span class="u-num">${v[tk]}</span></span></div><button type="button" class="u-btn u-btn--default prg-submit" data-ui="${id}.submit"${disabled ? ' disabled' : ''}>${update ? v.update_order : v.add_order}</button></div>`;
  }
  return `<div class="prg prg-panel" data-ui="${id}">${head}${body}</div>`;
}
export const panelStage = (inner) => `<div class="prg" style="display:inline-block;background:hsl(var(--gray-100))">${inner}</div>`;

function registerInner({ v, id, lines = 'one' }) {
  const main = `<div class="prg-main"><div class="prg-row">${sidebar({ v, id: `${id}.sidebar` })}<div class="prg-center">${filterBar({ v, id: `${id}.filters` })}${grid({ v, qtyOn: lines === 'empty' ? {} : { 1: 'qty_1' }, id: `${id}.grid` })}</div></div>${orderPanel({ v, lines, type: 'dine_in', id: `${id}.panel` })}</div>`;
  return header({ v, variant: 'register', id: `${id}.header` }) + main + footer('pos', { v, id: `${id}.footer` });
}
export const registerScreen = ({ v = P, id = 'pos-screen-register', lines = 'one' } = {}) => screen(1440, 900, registerInner({ v, id, lines }), id, 'prg prg-screen');
export function registerProductScreen({ v = P, id = 'pos-screen-register-product' } = {}) {
  const inner = registerInner({ v, id, lines: 'one' }) + `<div class="prg-overlay">${stage(`${id}.dialog`, productDialog({}))}</div>`;
  return screen(1440, 900, inner, id, 'prg prg-screen');
}
