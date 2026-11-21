// URY v16 POS Tables route: table card, legend, actions menu, layout view, grid and layout screens.
// Sources: pos/src/pages/Table.tsx, components/{TableCard,LayoutView,TableActionsMenu,MergeLinkConnector}.tsx,
// packages/ui/src/components/table-actions-menu.tsx @100c43fe2e. CSS: tokens/css/ury-v16/components/pos-tables.css
import { ic, money, screen } from '../lib.mjs';
import { SHELL_SLOTS, SHELL_RTL, PLACEHOLDERS, HEADER_KEYS, FOOTER_KEYS, pick, header, footer } from './shell.mjs';

const X = {
  Link2: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>',
  Circle: '<circle cx="12" cy="12" r="10"/>',
  RectangleHorizontal: '<rect width="20" height="12" x="2" y="6" rx="2"/>',
  Save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  ZoomIn: '<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="11" x2="11" y1="8" y2="14"/><line x1="8" x2="14" y1="11" y2="11"/>',
  ZoomOut: '<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/><line x1="8" x2="14" y1="11" y2="11"/>',
  CreditCard: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/><path d="M6 14h2"/>',
  Calendar: '<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>',
  Unlink: '<path d="m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" x2="8" y1="2" y2="5"/><line x1="2" x2="5" y1="8" y2="8"/><line x1="16" x2="16" y1="19" y2="22"/><line x1="19" x2="22" y1="16" y2="16"/>',
  ChevronDown: '<path d="m6 9 6 6 6-6"/>',
};
const I = (n, s = 16, c = '') => ic(n, s, c, X);

export const TABLES_CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/pos-tables.css'];
export const SCREEN_CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/pos-shell.css', 'ury-v16/components/pos-tables.css'];

// Sample tables. st: occupied | available; lock = active reservation lock window; x,y = layout canvas position.
export const TABLES = [
  { n: 1, shape: 'Circle', seats: 2, st: 'available', x: 120, y: 60 },
  { n: 2, shape: 'Square', seats: 4, st: 'occupied', x: 280, y: 60, time: '2:15 PM' },
  { n: 3, shape: 'Rectangle', seats: 4, st: 'available', lock: true, x: 480, y: 60 },
  { n: 4, shape: 'Rectangle', seats: 6, st: 'available', x: 720, y: 60 },
  { n: 5, shape: 'Circle', seats: 6, st: 'occupied', x: 1000, y: 60, time: '1:40 PM' },
  { n: 6, shape: 'Square', seats: 4, st: 'occupied', x: 120, y: 300, time: '12:55 PM' },
  { n: 7, shape: 'Circle', seats: 4, st: 'available', x: 320, y: 300 },
  { n: 8, shape: 'Rectangle', seats: 8, st: 'occupied', takeAway: true, x: 540, y: 300, time: '3:05 PM' },
  { n: 9, shape: 'Square', seats: 2, st: 'available', x: 900, y: 320 },
  { n: 10, shape: 'Circle', seats: 8, st: 'available', x: 1100, y: 320 },
  { n: 11, shape: 'Square', seats: 4, st: 'available', x: 160, y: 120 },
  { n: 12, shape: 'Rectangle', seats: 6, st: 'occupied', x: 420, y: 120, time: '4:20 PM' },
  { n: 13, shape: 'Circle', seats: 2, st: 'available', x: 760, y: 140 },
  { n: 14, shape: 'Rectangle', seats: 4, st: 'available', x: 980, y: 260 },
];
export const room = (n) => (n <= 10 ? 'room_a' : 'room_b');

// ---- slots (English from pos/src/i18n/locales/en.json) and Arabic (ar.json) ----
const AD = (x) => String(x).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
const L = {
  l_room: ['Room', 'غرفة'], l_started: ['Started at:', 'بدأ في'], l_seats: ['Seats', 'مقاعد'], no_time: ['—', '—'],
  b_occupied: ['Occupied', 'مشغول'], b_available: ['Available', 'متاح'], b_reserved: ['Reserved', 'محجوزة'], b_merged: ['Merged', 'مدمج'],
  take_away: ['Take away', 'سفري'], res_for: ['Reserved for 7:30 PM', 'محجوزة لـ ٧:٣٠ م'],
  btn_preview: ['Preview', 'معاينة'], btn_print: ['Print', 'طباعة'], btn_printing: ['Printing...', 'جارٍ الطباعة...'],
  merge_label: ['With T6 + T7', 'مع T6 + T7'],
  room_a: ['Main Hall', 'القاعة الرئيسية'], room_b: ['Terrace', 'التراس'], count_a: ['4', AD(4)], count_b: ['1', AD(1)],
  layout_view: ['Layout View', 'عرض المخطط'], grid_view: ['Grid View', 'عرض الشبكة'], layout: ['Layout', 'مخطط'],
  edit_layout: ['Edit Layout', 'تعديل المخطط'], finish_editing: ['Finish Editing', 'إنهاء التعديل'],
  zoom_pct: ['100%', '100%'],
  hint_view: ['Use Scroll to zoom • Drag background to pan', 'استخدم التمرير للتكبير • اسحب الخلفية للتحريك'],
  hint_title: ['Editing Layout', 'تعديل المخطط'], hint_drag: ['• Drag tables to reposition', '• اسحب الطاولات لتغيير موضعها'], hint_save: ['• Changes autosave', '• يتم حفظ التغييرات تلقائيًا'],
  m_reserve: ['Reserve', 'حجز'], m_merge: ['Merge tables', 'دمج الطاولات'], m_unmerge: ['Unmerge tables', 'إلغاء دمج الطاولات'],
  m_transfer: ['Transfer table', 'نقل الطاولة'], m_captain: ['Transfer captain', 'نقل الكابتن'],
  p_edit: ['Edit Table Settings', 'تعديل إعدادات الطاولة'], p_info: ['Table Info', 'معلومات الطاولة'], p_name: ['Table Name', 'اسم الطاولة'],
  p_capacity: ['Capacity', 'السعة'], p_range: ['Valid range: 1-20 pax', 'النطاق الصالح: 1-20 شخص'], p_shape: ['Shape', 'الشكل'],
  p_circle: ['Circle', 'دائري'], p_square: ['Square', 'مربع'], p_rectangle: ['Rectangle', 'مستطيل'],
  p_status: ['Status', 'الحالة'], p_position: ['Position', 'الموقع'], p_size: ['Size', 'الحجم'], p_bill: ['Current Bill', 'الفاتورة الحالية'], p_total: ['Total Amount', 'المبلغ الإجمالي'],
  p_bill_total: ['86.50', '86.50'], p_x: ['280px', '280px'], p_y: ['60px', '60px'], p_w: ['100px', '100px'], p_h: ['100px', '100px'], p_cap: ['4', '4'],
};
for (const t of TABLES) {
  L[`t${t.n}_name`] = [`T${t.n}`, `T${t.n}`];
  L[`t${t.n}_seats`] = [String(t.seats), AD(t.seats)];
  if (t.time) L[`t${t.n}_time`] = [t.time, t.time.replace(/(\d+):(\d+) (AM|PM)/, (_, h, m, ap) => `${h}:${m} ${ap === 'AM' ? 'ص' : 'م'}`).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d])];
}
export const SLOTS = Object.fromEntries(Object.entries(L).map(([k, [en]]) => [k, en]));
export const RTL = Object.fromEntries(Object.entries(L).filter(([, [en, ar]]) => ar !== en).map(([k, [, ar]]) => [k, ar]));
export const keys = (re) => Object.keys(SLOTS).filter((k) => re.test(k));
export const only = (o, ks) => Object.fromEntries(ks.filter((k) => k in o).map((k) => [k, o[k]]));
export const specSlots = (ks) => ({ slots: only(SLOTS, ks), rtlValues: only(RTL, ks) });
// ---- slot key sets ----
export const CARD_KEYS = ['l_room', 'l_started', 'l_seats', 'no_time', 'b_occupied', 'b_available', 'b_reserved', 'take_away', 'res_for', 'btn_preview', 'btn_print', 'btn_printing', 'merge_label', 'room_a', 'room_b', 'm_reserve', 'm_merge', 'm_unmerge', 'm_transfer', 'm_captain', ...keys(/^t\d+_(name|seats|time)$/)];
export const LEGEND_KEYS = ['b_available', 'b_occupied', 'b_merged', 'b_reserved'];
export const MENU_KEYS = ['m_reserve', 'm_merge', 'm_unmerge', 'm_transfer', 'm_captain'];
export const LAYOUT_KEYS = ['room_a', 'room_b', 'grid_view', 'layout', 'edit_layout', 'finish_editing', 'zoom_pct', 'hint_view', 'hint_title', 'hint_drag', 'hint_save', 'b_available', 'b_occupied', 'p_edit', 'p_info', 'p_name', 'p_capacity', 'p_range', 'p_shape', 'p_circle', 'p_square', 'p_rectangle', 'p_status', 'p_position', 'p_size', 'p_bill', 'p_total', 'p_bill_total', 'p_x', 'p_y', 'p_w', 'p_h', 'p_cap', 'l_started', ...keys(/^t\d+_(name|seats|time)$/)];
export const SCREEN_TABLES_KEYS = [...new Set([...CARD_KEYS, ...LEGEND_KEYS, 'room_a', 'room_b', 'count_a', 'count_b', 'layout_view', 'b_merged'])];
export const hdrSlots = () => ({ ...pick(SHELL_SLOTS, HEADER_KEYS), search_placeholder: PLACEHOLDERS.default[0], ...pick(SHELL_SLOTS, FOOTER_KEYS) });
export const hdrRtl = () => ({ ...pick(SHELL_RTL, [...HEADER_KEYS, ...FOOTER_KEYS].filter((k) => k in SHELL_RTL)), search_placeholder: PLACEHOLDERS.default[1] });

// ---- actions menu ----
const ITEMS = {
  reserve: ['Calendar', 'm_reserve', ''],
  merge: ['Link2', 'm_merge', ''],
  unmerge: ['Unlink', 'm_unmerge', ' ptb-pop__item--danger'],
  transfer: ['ArrowRightLeft', 'm_transfer', ''],
  captain: ['UserRound', 'm_captain', ''],
};
export function actionsPopover({ v, items = ['merge', 'transfer', 'captain'], id = '' }) {
  const rows = items.map((k) => {
    const [icon, slot, cls] = ITEMS[k];
    const sep = k === 'unmerge' ? '<div class="ptb-pop__sep"></div>' : '';
    return `${sep}<button type="button" class="ptb-btn ptb-pop__item${cls}">${I(icon, 16)}<span>${v[slot]}</span></button>`;
  }).join('');
  return `<div class="ptb-pop"${id ? ` data-ui="${id}"` : ''}>${rows}</div>`;
}
export const moreButton = (hover = false) => `<button type="button" class="ptb-btn ptb-more${hover ? ' is-hover' : ''}" aria-label="Table actions">${I('MoreVertical', 16)}</button>`;
export function actionsMenu({ v, items, hover = false, id = 'pos-table-actions-menu' }) {
  return `<div class="ptb ptb-stage ptb-stage--menu" data-ui="${id}"><div class="ptb-menu">${moreButton(hover)}${actionsPopover({ v, items, id: `${id}.popover` })}</div></div>`;
}

// ---- table card ----
const shapeIcon = { Circle: 'Circle', Square: 'Square', Rectangle: 'RectangleHorizontal' };
// tableCard({v, t, id, menu:[items]|null, trigger:true, hover, merged, printing, lock, occupiedLock, cls})
export function tableCard({ v, t, id = 'pos-table-card-v16', menu = null, hover = false, merged = false, printing = false, lock = t.lock, cls = '', hoverBtn = false, trigger = true }) {
  const occ = t.st === 'occupied';
  const state = occ ? 'occupied' : lock ? 'reserved' : 'available';
  const k = `t${t.n}`;
  const rbadge = `<span class="u-badge ptb-rbadge ptb-nowrap">${v.b_reserved}</span>`;
  const badges = occ
    ? `<span class="u-badge u-badge--warning ptb-nowrap">${v.b_occupied}</span>${lock ? rbadge : ''}`
    : lock ? rbadge : `<span class="u-badge u-badge--success ptb-nowrap">${v.b_available}</span>`;
  const popover = menu ? actionsPopover({ v, items: menu, id: `${id}.menu` }) : '';
  const tools = `<div class="ptb-card__tools">${badges}${trigger ? `<div class="ptb-menu">${moreButton()}${popover}</div>` : ''}</div>`;
  const mergeP = merged ? `<p class="ptb-card__merge">${v.merge_label}</p>` : '<p class="ptb-card__merge is-hidden">&nbsp;</p>';
  const seats = `<div class="ptb-row"><span class="ptb-lbl">${v.l_seats}</span><span class="ptb-seats">${I('Users', 12)}<span class="u-num">${v[k + '_seats']}</span></span></div>`;
  const foot = occ
    ? `<button type="button" class="ptb-btn ptb-fbtn${hoverBtn ? ' is-hover' : ''}">${I('Eye', 12)}${v.btn_preview}</button>`
      + (printing
        ? `<button type="button" class="ptb-btn ptb-fbtn" disabled>${I('Loader2', 12)}${v.btn_printing}</button>`
        : `<button type="button" class="ptb-btn ptb-fbtn">${I('Printer', 12)}${v.btn_print}</button>`)
    : '';
  return `<div class="ptb-card ptb-card--${state}${hover ? ' is-hover' : ''}${menu ? ' is-menu-open' : ''}${cls ? ' ' + cls : ''}" role="${occ ? 'group' : 'button'}" data-ui="${id}">`
    + `<div class="ptb-card__main"><div class="ptb-card__head" data-ui="${id}.head"><div class="ptb-card__id"><div class="ptb-shrink ptb-card__shape">${I(shapeIcon[t.shape], 20)}</div><span class="ptb-card__name">${v[k + '_name']}</span></div>${tools}</div>`
    + `${mergeP}<div class="ptb-card__rows">`
    + `<div class="ptb-row"><span class="ptb-lbl">${v.l_room}</span><span>${v[room(t.n)]}</span></div>`
    + `<div class="ptb-row ptb-row--time"><span class="ptb-lbl">${v.l_started}</span><span class="u-num">${occ ? v[k + '_time'] : v.no_time}</span></div>`
    + seats
    + (t.takeAway ? `<span class="u-badge u-badge--pending">${v.take_away}</span>` : '')
    + (lock ? `<div class="ptb-strip" data-ui="${id}.reservation">${I('AlertTriangle', 14)}<span>${v.res_for}</span></div>` : '')
    + `</div></div><div class="ptb-card__foot${occ ? ' is-occ' : ''}" data-ui="${id}.footer">${foot}</div></div>`;
}
export const cardStage = (inner, id = 'pos-table-card-v16') => `<div class="ptb ptb-stage ptb-stage--card" data-ui="${id}">${inner}</div>`;

// ---- legend ----
export function legend({ v, reservations = true, id = 'pos-tables-legend', abs = false }) {
  const item = (k, slot) => `<div class="ptb-legend__item"><div class="ptb-sw ptb-sw--${k}"></div><span>${v[slot]}</span></div>`;
  return `<div class="ptb ptb-legend" data-ui="${id}"><div class="ptb-container"><div class="ptb-legend__row">${item('available', 'b_available')}${item('occupied', 'b_occupied')}${item('merged', 'b_merged')}${reservations ? item('reserved', 'b_reserved') : ''}</div></div></div>`;
}

// ---- layout view ----
const dims = (shape, seats) => { const s = Math.max(60, Math.min(250, 60 + seats * 10)); return shape === 'Rectangle' ? [s * 1.5, s] : [s, s]; };
export const shapeBox = (t) => dims(t.shape, t.seats);
function shapeEl({ v, t, edit, selected, hover, id }) {
  const [w, h] = dims(t.shape, t.seats);
  const k = `t${t.n}`;
  return `<div class="ptb-shape ptb-shape--${t.shape.toLowerCase()} ptb-shape--${t.st}${edit ? ' is-edit' : ''}${selected ? ' is-selected' : ''}${hover ? ' is-hover' : ''}" style="left:${t.x}px;top:${t.y}px;width:${w}px;height:${h}px;transform:scale(1)" data-ui="${id}.table-${t.n}">`
    + `<div class="ptb-shape__txt"><div class="ptb-shape__name">${v[k + '_name']}</div><div class="ptb-shape__seats">${I('Users', 12)}<span class="u-num">${v[k + '_seats']}</span></div></div>`
    + (edit ? `<div class="ptb-drag">${I('Move', 8)}</div>` : '') + '</div>';
}
function panelEl({ v, t, edit, id }) {
  const [w, h] = dims(t.shape, t.seats);
  const occ = t.st === 'occupied';
  const fld = (txt, on) => `<div class="ptb-fld${on ? ' is-on' : ''}"><span class="u-num">${txt}</span></div>`;
  const sel = `<div class="ptb-fld${edit ? ' is-on' : ''}"><span>${v['p_' + t.shape.toLowerCase()]}</span>${I('ChevronDown', 16)}</div>`;
  return `<div class="ptb-panel" data-ui="${id}.panel"><div class="ptb-panel__head"><h4 class="ptb-panel__title">${edit ? v.p_edit : v.p_info}</h4><button type="button" class="ptb-btn ptb-panel__x" aria-label="Close">${I('X', 16)}</button></div>`
    + `<div class="ptb-panel__body"><div><label class="ptb-lab">${v.p_name}</label>${fld(v[`t${t.n}_name`], false)}</div>`
    + `<div><label class="ptb-lab">${v.p_capacity}</label>${fld(v[`t${t.n}_seats`], edit)}<p class="ptb-help">${v.p_range}</p></div>`
    + `<div><label class="ptb-lab">${v.p_shape}</label>${sel}</div>`
    + `<div><label class="ptb-lab">${v.p_status}</label><div class="ptb-status">${occ ? v.b_occupied : v.b_available}</div></div>`
    + `<div class="ptb-sep"><label class="ptb-lab ptb-lab--2">${v.p_position}</label><div class="ptb-pair"><div><em>X:</em><b class="u-num">${t.x}px</b></div><div><em>Y:</em><b class="u-num">${t.y}px</b></div></div></div>`
    + `<div><label class="ptb-lab ptb-lab--2">${v.p_size}</label><div class="ptb-pair"><div><em>W:</em><b class="u-num">${w}px</b></div><div><em>H:</em><b class="u-num">${h}px</b></div></div></div>`
    + (occ ? `<div class="ptb-sep"><label class="ptb-lab ptb-lab--2">${v.p_bill}</label><div class="ptb-bill"><div class="ptb-bill__row"><span>${v.l_started}</span><span class="u-num">${v[`t${t.n}_time`]}</span></div><div class="ptb-bill__row"><span>${v.p_total}</span><span class="ptb-bill__total u-num">${v.p_bill_total}</span></div></div></div>` : '')
    + '</div></div>';
}
// layoutView({v, roomKey:'a'|'b', edit, selected:<table n>, panel:boolean, hoverTable, id, style})
export function layoutView({ v, roomKey = 'a', edit = false, selected = null, panel = false, hoverTable = null, id = 'pos-layout-view', style = '', root = true }) {
  const list = TABLES.filter((t) => (roomKey === 'a' ? t.n <= 10 : t.n > 10));
  const sel = selected ? TABLES.find((t) => t.n === selected) : null;
  const hint = edit
    ? `<div class="ptb-lv__hint ptb-lv__hint--edit" data-ui="${id}.hint"><b>${v.hint_title}</b><div>${v.hint_drag}</div><div>${v.hint_save}</div></div>`
    : `<div class="ptb-lv__hint ptb-lv__hint--view" data-ui="${id}.hint">${v.hint_view}</div>`;
  const zoomBtn = (icon) => `<button type="button" class="u-btn u-btn--outline u-btn--icon">${I(icon, 20)}</button>`;
  const html = `<div class="ptb ptb-lv${root ? '' : ' ptb-lv--fill'}"${root ? ` data-ui="${id}"` : ''} style="${style}">`
    + `<div class="ptb-lv__hdr" data-ui="${id}.header"><div class="ptb-lv__row"><div class="ptb-lv__left"><button type="button" class="u-btn u-btn--outline">${I('Grid3X3', 16)}${v.grid_view}</button><h2 class="ptb-lv__title">${v['room_' + roomKey]} <span>|</span> ${v.layout}</h2></div>`
    + `<div><button type="button" class="u-btn u-btn--outline${edit ? ' is-edit' : ''}" data-ui="${id}.edit-toggle">${I(edit ? 'Save' : 'CreditCard', 16)}${edit ? v.finish_editing : v.edit_layout}</button></div></div></div>`
    + `<div class="ptb-lv__area"><div class="ptb-lv__zoom" data-ui="${id}.zoom">${zoomBtn('ZoomIn')}${zoomBtn('ZoomOut')}${zoomBtn('RotateCcw')}<div class="ptb-lv__pct">${v.zoom_pct}</div></div>${hint}`
    + `<div class="ptb-lv__canvas" data-ui="${id}.canvas"><div style="transform:translate(0px,0px);transform-origin:top left">${list.map((t) => shapeEl({ v, t, edit, selected: selected === t.n, hover: hoverTable === t.n, id })).join('')}</div></div></div>`
    + (panel && sel ? panelEl({ v, t: sel, edit, id }) : '') + '</div>';
  return html;
}

// ---- tables page / screens ----
function tabsRow(v, active) {
  const tab = (key, cnt) => `<button type="button" class="u-btn u-btn--tab ptb-tab"${active === key ? ' data-selected="true"' : ''}>${v['room_' + key]}<span class="u-badge u-badge--outline">${v['count_' + key]}</span></button>`;
  return `<div class="ptb-top" data-ui="pos-screen-tables.top"><div class="ptb-container"><div class="ptb-top__row"><div class="ptb-tabs">${tab('a')}${tab('b')}</div><div class="ptb-shrink"><button type="button" class="u-btn u-btn--tab ptb-layoutbtn">${I('Layout', 16)}${v.layout_view}</button></div></div></div></div>`;
}
// tablesGrid({v, ids}) for Main Hall: row of T1..T5, merged group T6 + T7, then T8..T10
export function tablesScreen({ v, id = 'pos-screen-tables', reservations = true, menuOn = null, hoverOn = null }) {
  const card = (n, o = {}) => tableCard({ v, t: TABLES[n - 1], id: `${id}.card-${n}`, merged: !!o.merged, cls: o.cls || '', menu: menuOn === n ? ['merge', 'transfer', 'captain'] : null, hover: hoverOn === n, lock: reservations ? TABLES[n - 1].lock : false });
  const grp = `<div class="ptb-group" data-ui="${id}.group">${card(6, { merged: true })}<div class="ptb-link" role="img">${I('Link2', 20)}</div>${card(7, { merged: true })}</div>`;
  const grid = `<div class="ptb-grid">${[1, 2, 3, 4, 5].map((n) => card(n)).join('')}${grp}${[8, 9, 10].map((n) => card(n)).join('')}</div>`;
  const main = `<div class="ptb-main"><div class="ptb-page">${tabsRow(v, 'a')}<div class="ptb-body"><div class="ptb-container">${grid}</div></div></div>${legend({ v, reservations, id: `${id}.legend` })}</div>`;
  return screen(1440, 900, header({ v, variant: 'default', id: `${id}.header` }) + main + footer('tables', { v, id: `${id}.footer` }), id, 'ptb ptb-screen');
}
export function layoutScreen({ v, id = 'pos-screen-tables-layout', roomKey = 'a', edit = false, selected = null, panel = false }) {
  const body = `<div class="ptb-main">${layoutView({ v, roomKey, edit, selected, panel, id: `${id}.view`, root: false }).replace('class="ptb ptb-lv ptb-lv--fill"', 'class="ptb-lv"')}</div>`;
  return screen(1440, 900, header({ v, variant: 'default', id: `${id}.header` }) + body + footer('tables', { v, id: `${id}.footer` }), id, 'ptb ptb-screen');
}
export { money };
