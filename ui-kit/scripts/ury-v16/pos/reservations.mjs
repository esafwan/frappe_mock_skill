// Markup helpers for the URY v16 POS reservations route (T05). Class lists mirror pos/src/pages/Reservations.tsx and
// pos/src/components/TableReservation{Timeline,Dialog,EditDialog,CancelDialog,CompleteDialog,WarningDialog}.tsx @100c43fe2e. CSS: tokens/css/ury-v16/components/pos-reservations.css
import { ic, screen } from '../lib.mjs';
import { header as shellHeader, footer as shellFooter } from './shell.mjs';

// lucide-react 0.525 paths for icons the shared set lacks (this task's own additions).
export const EXTRA = {
  CheckCircle: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  CheckCircle2: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  XCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  Calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  RectangleHorizontal: '<rect width="20" height="12" x="2" y="6" rx="2"/>',
  X: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};
export const I = (n, s = 16, c = '') => ic(n, s, c, EXTRA);

export const RV_CSS = ['ury-v16/ury-fonts.css', 'ury-v16/ury-ui-tokens.css', 'ury-v16/ury-ui-base.css', 'ury-v16/components/pos-reservations.css'];
export const SCREEN_CSS = [...RV_CSS.slice(0, 3), 'ury-v16/components/pos-shell.css', RV_CSS[3]];

const W = 1440, H = 900;
const cx = (...a) => a.filter(Boolean).join(' ');

/* ---------------- status badges ---------------- */
export const STATUS = {
  Confirmed: ['success', 'status_confirmed', 'confirmed'],
  Active: ['warning', 'status_active', 'active'],
  Requested: ['outline', 'status_requested', 'requested'],
  Completed: ['completed', 'status_completed', 'completed'],
  Cancelled: ['cancelled', 'status_cancelled', 'cancelled'],
  'No Show': ['noshow', 'status_no_show', 'noshow'],
};
export const statusBadge = (v, status, ui = '') => `<span class="u-badge u-badge--${STATUS[status][0]}"${ui ? ` data-ui="${ui}"` : ''}>${v[STATUS[status][1]]}</span>`;

/* ---------------- reservation card ---------------- */
// p: {n:'c1', status, menu:false|'full'|'requested', hover, notes:false, phone:true}
export function card(v, p = {}, ui = 'pos-reservation-card') {
  const n = p.n || 'c1', status = p.status || 'Confirmed';
  const actionable = ['Confirmed', 'Active', 'Requested'].includes(status);
  const k = (s) => v[`${n}_${s}`];
  const menu = p.menu ? `<div class="rv-menu" data-ui="${ui}.menu">
      <button type="button" class="rv-menu__item">${I('Pencil', 14)}<span>${v.menu_edit}</span></button>
      ${status !== 'Requested' ? `<button type="button" class="rv-menu__item rv-menu__item--ok">${I('CheckCircle', 14)}<span>${v.menu_complete}</span></button>` : ''}
      <button type="button" class="rv-menu__item rv-menu__item--no">${I('XCircle', 14)}<span>${v.menu_cancel}</span></button></div>` : '';
  const kebab = actionable ? `<div class="rv-rel"><button type="button" class="rv-iconbtn${p.kebabHover ? ' is-hover' : ''}" data-ui="${ui}.kebab">${I('MoreVertical', 16)}</button>${menu}</div>` : '';
  return `<div class="rv rv-card${p.hover ? ' is-hover' : ''}" data-ui="${ui}"><div class="rv-card__in">
  <div class="rv-card__top">
    <div><div class="rv-lbl" data-ui="${ui}.label">${v.table_label}</div><div class="rv-card__table" data-ui="${ui}.table">${k('table')}</div></div>
    <div class="rv-card__right">${statusBadge(v, status, `${ui}.status`)}${kebab}</div>
  </div>
  <div class="rv-card__info" data-ui="${ui}.info">
    <div class="rv-row">${I('User', 16)}<span class="rv-row__name" data-ui="${ui}.name">${k('name')}</span></div>
    ${p.phone === false ? '' : `<div class="rv-row rv-row--xs">${I('Phone', 14)}<span class="u-num">${k('phone')}</span></div>`}
    <div class="rv-row rv-row--xs">${I('Users', 14)}<span>${k('guests')}</span></div>
    <div class="rv-row rv-row--xs rv-row--when">${I('CalendarClock', 14)}<span class="rv-row__when" data-ui="${ui}.when">${k('when')}</span></div>
    ${p.notes ? `<p class="rv-card__note" data-ui="${ui}.notes">"${k('notes')}"</p>` : ''}
  </div></div></div>`;
}

/* ---------------- timeline ---------------- */
export const HOUR_W = 120, CARD_H = 74, LANE_GAP = 10, TOTAL_W = 24 * HOUR_W;
const hh = (h) => `${String(h).padStart(2, '0')}:00`;
// items: [{n, status, start:minutes, dur:minutes, pax:true, phone:true}] -> lane assignment identical to TableReservationTimeline.tsx
export function layout(items) {
  const parsed = items.map((it) => ({ ...it, end: it.start + it.dur })).sort((a, b) => a.start - b.start || b.dur - a.dur);
  const lanes = [], out = [];
  for (const it of parsed) {
    let lane = lanes.findIndex((e) => e <= it.start);
    if (lane === -1) { lane = lanes.length; lanes.push(it.end); } else lanes[lane] = it.end;
    out.push({ ...it, lane, left: (it.start / 60) * HOUR_W, width: Math.max(120, (it.dur / 60) * HOUR_W - 6), top: 16 + lane * (CARD_H + LANE_GAP) });
  }
  return { items: out, lanes: lanes.length };
}
const block = (v, it, ui, hover) => {
  const [, , cls] = STATUS[it.status], k = (s) => v[`${it.n}_${s}`];
  return `<div class="rv-blk rv-blk--${cls}${hover ? ' is-hover' : ''}" data-ui="${ui}.block-${it.n}" style="inset-inline-start:${it.left}px;top:${it.top}px;width:${it.width}px;height:${CARD_H}px">
  <div class="rv-blk__r1"><span class="rv-blk__tbl">${k('table')}</span><span class="rv-blk__time">${I('Clock', 12)}<span class="u-num">${k('time')}</span></span><div class="rv-blk__st">${statusBadge(v, it.status)}</div></div>
  <div class="rv-blk__r2">${I('User', 12)}<span class="rv-blk__name">${k('name')}</span><span class="rv-blk__pax u-num">(${k('pax')}p)</span></div>
  <div class="rv-blk__r3"><span class="rv-blk__rng u-num">${k('time')} - ${k('end')}</span>${it.phone === false ? '' : `<span class="rv-blk__ph">${I('Phone', 10)}<span class="u-num">${k('phone')}</span></span>`}</div>
</div>`;
};
// p: {items, scroll (px), loading, hover (n), h (px, default 100%)}
export function timeline(v, p = {}, ui = 'pos-reservation-timeline') {
  const style = p.h ? ` style="height:${p.h}px"` : '';
  if (p.loading) return `<div class="rv rv-tl rv-tl--load" data-ui="${ui}"${style}><div class="rv-tl__loading">${v.loading_timeline}</div></div>`;
  const items = p.items || [], L = layout(items), canvasH = Math.max(420, 32 + (L.lanes || 1) * (CARD_H + LANE_GAP));
  const axis = Array.from({ length: 24 }, (_, h) => `<div class="rv-tl__hr"><span>${hh(h)}</span><i class="rv-tl__tick"></i></div>`).join('');
  const cells = '<div class="rv-tl__cell"></div>'.repeat(24);
  const empty = L.items.length ? '' : `<div class="rv-tl__empty" data-ui="${ui}.empty"><div class="rv-tl__empty-ico">${I('BookLock', 24)}</div><p class="rv-tl__empty-t">${v.empty_timeline_title}</p><p class="rv-tl__empty-h">${v.empty_timeline_hint}</p></div>`;
  return `<div class="rv rv-tl" data-ui="${ui}"${style}><div class="rv-tl__scroll" data-ui="${ui}.scroll"><div class="rv-tl__wide" style="width:${TOTAL_W}px;margin-inline-start:-${p.scroll || 0}px">
  <div class="rv-tl__axis" data-ui="${ui}.axis">${axis}</div>
  <div class="rv-tl__canvas" data-ui="${ui}.canvas" style="width:${TOTAL_W}px;height:${canvasH}px"><div class="rv-tl__grid">${cells}</div>${empty}${L.items.map((it) => block(v, it, ui, p.hover === it.n)).join('')}</div>
</div></div></div>`;
}

/* ---------------- dialogs ---------------- */
const closeX = () => `<button type="button" class="u-dialog-close" aria-label="Close">${I('X', 16)}</button>`;
const btn = (cls, label, off) => `<button type="button" class="u-btn ${cls}${off ? ' is-disabled' : ''}">${label}</button>`;
const req = ' <span class="rv-req">*</span>';
const field = (label, inner, required = true) => `<div class="rv-fld"><label class="rv-flbl">${label}${required ? req : ''}</label>${inner}</div>`;
const inBox = (txt, cls = '', ph = false) => `<div class="rv-in ${cls}${ph ? ' is-ph' : ''}">${txt}</div>`;
const shapeHeader = (v, ui) => `<div class="rv-dh" data-ui="${ui}.header"><div class="rv-dh__row"><div class="rv-dh__chip">${I('RectangleHorizontal', 24)}</div><div><h2 class="rv-dh__title">${v.table}</h2><p class="rv-dh__desc">${v.seats}</p></div></div></div>`;
const customer = (v, p) => p.noCustomer
  ? `<div class="rv-fi"><div class="rv-in rv-in--search rv-in--pe is-ph">${v.search_placeholder}</div><span class="rv-chev">${I('ChevronDown', 16)}</span></div>`
  : `<div class="rv-cv${p.off ? ' is-off' : ''}"><div><p class="rv-cv__name">${v.customer_name}</p><p class="rv-cv__phone u-num">${v.customer_phone}</p></div>${btn('u-btn--ghost u-btn--sm', v.change, p.off)}</div>`;
const phoneAndPax = (v, p) => `<div class="rv-grid2">
  ${field(v.phone_label, `<div class="rv-fi">${I('Phone', 16, 'rv-fi__s')}${p.noCustomer ? inBox(v.phone_placeholder, 'rv-in--ps', true) : inBox(`<span class="u-num">${v.customer_phone}</span>`, 'rv-in--ps' + (p.off ? ' is-off' : ''))}</div>`)}
  ${field(v.pax_label, `<div class="rv-fi">${I('Users', 16, 'rv-fi__s')}${inBox(`<span class="u-num">${v.pax}</span>`, 'rv-in--ps' + (p.off ? ' is-off' : ''))}</div>`)}</div>`;
const dateAndTime = (v, p) => `<div class="rv-grid2">
  ${field(v.date_label, `<div class="rv-date${p.off ? ' is-off' : ''}"><span class="u-num">${v.date}</span>${I('Calendar', 16)}</div>`)}
  ${field(v.time_label, `<div class="rv-fi">${inBox(`<span class="u-num">${v.time}</span>`, 'rv-in--time' + (p.off ? ' is-off' : ''))}${I('Clock', 16, 'rv-fi__e')}</div>`)}</div>`;
const notes = (v, p) => field(v.notes_label, `<div class="rv-ta${p.notes ? '' : ' is-ph'}${p.off ? ' is-off' : ''}">${p.notes ? v.notes_val : v.notes_placeholder}</div>`, false);

function formDialog(v, p, ui) {
  const edit = p.kind === 'edit';
  const tableFld = !edit ? '' : field(v.table_label, `<div class="rv-sel"><div class="rv-in${p.tables === 'none' || p.tables === 'loading' ? ' is-ph' : ''}${p.off ? ' is-off' : ''}">${p.tables === 'loading' ? v.loading_tables : p.tables === 'none' ? v.no_available_tables : v.table_option}</div><span class="rv-chev">${I('ChevronDown', 16)}</span></div>${p.tables === 'none' ? `<p class="rv-warn-txt">${v.no_tables_for_slot}</p>` : ''}`);
  const err = p.error ? `<div class="rv-err" data-ui="${ui}.error">${v.error}</div>` : '';
  const confirmOff = p.off || p.noCustomer;
  return `<div class="u-dialog rv-dlg rv-dlg--${edit ? 'edit' : 'create'}" role="dialog" aria-modal="true" data-ui="${ui}.dialog">${closeX()}
  ${shapeHeader(v, ui)}
  <div class="rv-db" data-ui="${ui}.body">${err}<div class="rv-form" data-ui="${ui}.form">
    ${tableFld}${field(v.customer_label, customer(v, p))}${phoneAndPax(v, p)}${dateAndTime(v, p)}${notes(v, p)}
  </div></div>
  <div class="rv-df rv-df--gray" data-ui="${ui}.footer">${btn('u-btn--outline', v.btn_cancel, p.off)}${btn('u-btn--default', edit ? v.btn_save : v.btn_reserve, confirmOff)}</div></div>`;
}
const infoItem = (icon, label, val, semi) => `<div class="rv-item"><div class="rv-item__ico">${I(icon, 16)}</div><div><p class="rv-item__lbl">${label}</p><p class="rv-item__val${semi ? ' rv-item__val--semi' : ''}">${val}</p></div></div>`;
const panelTop = (v, badge, cls) => `<div class="rv-panel__top"><div><p class="rv-panel__lbl">${v.table_label}</p><p class="rv-panel__table rv-panel__table--${cls}">${v.table}</p></div>${badge}</div>`;

function cancelDialog(v, p, ui) {
  return `<div class="u-dialog rv-dlg rv-dlg--xl" role="dialog" aria-modal="true" data-ui="${ui}.dialog">${closeX()}
  <div class="rv-dh2" data-ui="${ui}.header"><h2 class="rv-dh2__title">${v.cancel_title}</h2><p class="rv-dh2__desc">${v.cancel_description}</p></div>
  <div class="rv-dbody" data-ui="${ui}.body"><div class="rv-panel rv-panel--cancel" data-ui="${ui}.panel">${panelTop(v, `<span class="u-badge u-badge--warning">${v.reserved_badge}</span>`, 'semi')}
    <div class="rv-panel__list">${infoItem('User', v.customer_label, v.customer_name, true)}${infoItem('Phone', v.phone_label, `<span class="u-num">${v.customer_phone}</span>`)}${infoItem('Users', v.pax_label, v.guests)}${infoItem('CalendarClock', v.reservation_time_label, `<span class="u-num">${v.time_raw}</span>`)}</div></div></div>
  <div class="rv-df rv-df--white" data-ui="${ui}.footer">${btn('u-btn--outline', v.keep_reservation, p.off)}${btn('u-btn--destructive', v.cancel_reservation, p.off)}</div></div>`;
}
function completeDialog(v, p, ui) {
  return `<div class="u-dialog rv-dlg rv-dlg--xl" role="dialog" aria-modal="true" data-ui="${ui}.dialog">${closeX()}
  <div class="rv-dh2" data-ui="${ui}.header"><h2 class="rv-dh2__title rv-dh2__title--xl rv-dh2__title--done">${I('CheckCircle2', 24)}${v.complete_title}</h2><p class="rv-dh2__desc rv-dh2__desc--gray">${v.complete_description}</p></div>
  <div class="rv-dbody" data-ui="${ui}.body"><div class="rv-panel rv-panel--done" data-ui="${ui}.panel">${panelTop(v, statusBadge(v, 'Confirmed'), 'bold')}
    <div class="rv-panel__list">${infoItem('User', v.customer_label, v.customer_name, true)}${infoItem('Phone', v.phone_label, `<span class="u-num">${v.customer_phone}</span>`)}${infoItem('Users', v.pax_label, v.guests)}${infoItem('CalendarClock', v.reservation_time_label, `<span class="u-num">${v.time_short}</span>`)}</div></div></div>
  <div class="rv-df rv-df--white" data-ui="${ui}.footer">${btn('u-btn--outline', v.btn_cancel, p.off)}${btn('u-btn--blue', v.complete_action, p.off)}</div></div>`;
}
function warningDialog(v, p, ui) {
  return `<div class="u-dialog rv-dlg rv-dlg--lg" role="dialog" aria-modal="true" data-ui="${ui}.dialog">${closeX()}
  <div class="rv-dh2 rv-dh2--warn" data-ui="${ui}.header"><h2 class="rv-dh2__title rv-dh2__title--xl rv-dh2__title--warn">${I('AlertTriangle', 24)}${v.warning_title}</h2><p class="rv-dh2__desc rv-dh2__desc--gray">${v.warning_description}</p></div>
  <div class="rv-dbody rv-dbody--warn" data-ui="${ui}.body"><div class="rv-banner" data-ui="${ui}.banner"><p class="rv-banner__t">${v.reserved_for}</p><p class="rv-banner__s">${v.choose_another}</p></div>
    <div class="rv-panel rv-panel--info" data-ui="${ui}.panel">${panelTop(v, `<span class="u-badge u-badge--warning">${v.reserved_badge}</span>`, 'bold')}
    <div class="rv-panel__list">${infoItem('CalendarClock', v.reservation_time_label, `<span class="u-num">${v.time_warn}</span>`, true)}${infoItem('User', v.customer_name_label, v.customer_name)}${infoItem('Phone', v.phone_label, `<span class="u-num">${v.customer_phone}</span>`)}${infoItem('Users', v.pax_label, v.guests)}
    <div class="rv-notes"><b>${v.notes_prefix}</b> ${v.notes_val}</div></div></div></div>
  <div class="rv-df rv-df--white" data-ui="${ui}.footer">${btn('u-btn--default', v.choose_another_action, p.off)}</div></div>`;
}
// p: {kind: create|edit|cancel|complete|warning, error, off, noCustomer, notes, tables: none|loading}
export function dialog(v, p = {}, ui = 'pos-reservation-dialog') {
  const kind = p.kind || 'create';
  const body = { create: formDialog, edit: formDialog, cancel: cancelDialog, complete: completeDialog, warning: warningDialog }[kind](v, { ...p, kind }, ui);
  return `<div class="rv rv-stage" data-ui="${ui}"><div class="u-dialog-scrim"></div>${body}</div>`;
}

/* ---------------- screen ---------------- */
const sel = (txt, cls = '') => `<div class="${cx('rv-sel', cls)}"><div class="rv-in rv-in--pe">${txt}</div><span class="rv-chev">${I('ChevronDown', 16)}</span></div>`;
export function pageHeader(v, p = {}, ui = 'pos-screen-reservations') {
  const tl = p.view === 'timeline';
  return `<div class="rv-hd" data-ui="${ui}.header">
  <div class="rv-hd__l"><div class="rv-hd__chip">${I('BookLock', 24)}</div><h1 class="rv-hd__h1">${v.page_title}<span class="rv-hd__count u-num" data-ui="${ui}.count">${v.count}</span></h1></div>
  <div class="rv-hd__r" data-ui="${ui}.filters">
    <div class="rv-w40">${sel(v.all_rooms)}</div><div class="rv-w40">${sel(v.all_tables)}</div>
    <div class="rv-step" data-ui="${ui}.stepper"><button type="button" class="rv-step__btn" aria-label="${v.previous_day}">${I('ChevronLeft', 16)}</button><span class="rv-step__date">${v.date_text}${I('Calendar', 16)}</span><button type="button" class="rv-step__btn" aria-label="${v.next_day}">${I('ChevronRight', 16)}</button></div>
    <div class="rv-w42 rv-sel rv-sel--native" data-ui="${ui}.status-filter"><div class="rv-in">${p.statusAll ? v.filter_all : v.status_confirmed}</div><span class="rv-chev">${I('ChevronDown', 16)}</span></div>
    <div class="rv-tog" data-ui="${ui}.toggle"><button type="button" class="rv-tog__btn${tl ? '' : ' is-on'}" aria-label="${v.list_view}">${I('List', 16)}</button><button type="button" class="rv-tog__btn${tl ? ' is-on' : ''}" aria-label="${v.timeline_view}">${I('CalendarClock', 16)}</button></div>
  </div></div>`;
}
// p: {view:'list'|'timeline', state:'list'|'loading'|'empty', cards:[{n,status,notes,phone}], menu:{n}, tlItems, scroll}
export function reservationsScreen(v, p = {}, id = 'pos-screen-reservations') {
  const tl = p.view === 'timeline';
  let main;
  if (tl) main = `<div class="rv-main rv-main--tl" data-ui="${id}.content">${timeline(v, { items: p.tlItems || [], scroll: p.scroll || 0, loading: p.state === 'loading' }, `${id}.timeline`)}</div>`;
  else if (p.state === 'loading') main = `<div class="rv-main rv-main--list" data-ui="${id}.content"><div class="rv-center rv-center--load">${v.loading_list}</div></div>`;
  else if (p.state === 'empty') main = `<div class="rv-main rv-main--list" data-ui="${id}.content"><div class="rv-center" data-ui="${id}.empty"><div class="rv-center__ico">${I('BookLock', 32)}</div><h3 class="rv-center__t">${v.empty_title}</h3><p class="rv-center__h">${v.empty_hint}</p></div></div>`;
  else main = `<div class="rv-main rv-main--list" data-ui="${id}.content"><div class="rv-grid" data-ui="${id}.grid">${(p.cards || []).map((c) => card(v, { ...c, menu: p.menu && p.menu.n === c.n ? 'full' : false }, `${id}.card-${c.n}`)).join('')}</div></div>`;
  return screen(W, H, `${shellHeader({ v, variant: 'reservations', printer: 'online' })}<div class="rv rv-pg">${pageHeader(v, p, id)}${main}</div>${shellFooter('reservations', { v })}`, id, 'rv-scr');
}
