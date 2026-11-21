// Markup helpers for ury-mosaic components (mosaic/src/components/{Header,ScopeSelector,production/ProductionCard,kot}.vue).
// Every text goes through a {{slot}} (v.<name>); structure/state through props.
import fs from 'node:fs';
const LOGO_SRC = '/Users/safwan/Code/ury-v16-latest/mosaic/src/assets/logos/mosaic.jpg';
const ROOT = new URL('../../../', import.meta.url).pathname;
const LOGO_LOCAL = ROOT + 'scripts/ury-v16/mosaic/assets/mosaic.jpg';
const logoFile = fs.existsSync(LOGO_SRC) ? LOGO_SRC : LOGO_LOCAL;
export const LOGO = 'data:image/jpeg;base64,' + fs.readFileSync(logoFile).toString('base64');

const S = (inner, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${inner}</svg>`;
export const MI = {
  refresh: `<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20" width="16" height="16"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 1v5h-5M2 19v-5h5m10-4a8 8 0 0 1-14.947 3.97M1 10a8 8 0 0 1 14.947-3.97"/></svg>`,
  user: S('<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
  chevron: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>`,
  monitor: S('<rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/>'),
  logout: S('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>'),
  building: S('<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4M8 7h2m4 0h2M8 11h2m4 0h2"/>'),
  down: S('<path d="m6 9 6 6 6-6"/>'),
  check: S('<path d="m5 12 4 4L19 6"/>'),
};

// ---- scope selector ----
// kind: 'company'|'branch'; opts: [{key,selected}] rendered from slot names; open: bool
export function scopeSelector(v, o = {}) {
  const { kind = 'company', open = false, hover = false, disabled = false, sel = 0, id = 'ury-mosaic-scope-selector', root = true } = o;
  const k = kind === 'company' ? 'c' : 'b';
  const opts = [`${k}_all`, `${k}_1`, `${k}_2`, `${k}_3`];
  const label = v[`${k}_sel${sel}`];
  const pop = open ? `<div class="mz-scope-pop mz-shadow-lg" data-ui="${id}-popover"><div class="mz-scope-head">${v[`${k}_heading`]}</div>${opts.map((n, i) => `<button type="button" class="mz-scope-opt${i === sel ? ' is-sel' : ''}"><span class="mz-trunc">${v[n]}</span>${i === sel ? MI.check : ''}</button>`).join('')}</div>` : '';
  const inner = `<div class="mz-scope"><button type="button" class="mz-scope-btn${open ? ' is-open' : ''}${hover ? ' is-hover' : ''}${disabled ? ' is-disabled' : ''}" data-ui="${id}-trigger"${disabled ? ' disabled' : ''}>${MI.building}<span class="mz-scope-label mz-trunc">${label}</span>${MI.down}</button>${pop}</div>`;
  return root ? `<div class="mz mz-scope-root${open ? ' is-open' : ''}" data-ui="${id}">${inner}</div>` : `<div class="mz-scope-root" data-ui="${id}-inline">${inner}</div>`;
}

// ---- header ----
export function header(v, o = {}) {
  const { view = 'home', menu = false, hover = '' } = o;
  const sels = view === 'home' ? scopeSelector(v, { kind: 'company', sel: 0, root: false }) + scopeSelector(v, { kind: 'branch', sel: 0, root: false }) : '';
  const dd = menu ? `<div class="mz-menu mz-shadow-lg" data-ui="ury-mosaic-header-menu"><div class="mz-menu-head"><p>${v.user_name}</p><p>${v.user_email}</p></div><div class="mz-menu-body"><button type="button" class="mz-menu-item">${MI.monitor}${v.switch_dashboard}</button><button type="button" class="mz-menu-item is-danger">${MI.logout}${v.logout}</button></div></div>` : '';
  return `<div class="mz mz-hdr-stage${menu ? ' is-open' : ''}" data-ui="ury-mosaic-header"><header class="mz-hdr" data-ui="ury-mosaic-header-bar"><a class="mz-hdr-logo"><img src="${LOGO}" alt="{{logo_alt}}" data-ui="ury-mosaic-header-logo"></a><div class="mz-hdr-right">${sels}<button type="button" class="mz-refresh${hover === 'refresh' ? ' is-hover' : ''}" data-ui="ury-mosaic-header-refresh">${MI.refresh}</button><div class="mz-user"><button type="button" class="mz-user-btn${hover === 'user' ? ' is-hover' : ''}" data-ui="ury-mosaic-header-user"><span class="mz-avatar">${MI.user}</span><span class="mz-user-name">${v.user_name}</span>${MI.chevron}</button>${dd}</div></div></header></div>`;
}

// ---- production card ----
export function productionCard(v, o = {}) {
  const { disabled = false } = o;
  return `<div class="mz mz-prod${disabled ? ' is-disabled' : ''}" data-ui="ury-mosaic-production-card"><div class="mz-prod-head"><div class="mz-prod-tile" data-ui="ury-mosaic-production-card-tile"></div><div><h2 class="mz-prod-title">${v.prod_title}</h2><p class="mz-prod-unit">${v.prod_unit}</p></div></div><div class="mz-prod-stats"><div class="mz-stat is-active" data-ui="ury-mosaic-production-card-active"><div class="mz-stat-n">${v.n_active}</div><div class="mz-stat-l">${v.l_active}</div></div><div class="mz-stat is-served" data-ui="ury-mosaic-production-card-served"><div class="mz-stat-n">${v.n_served}</div><div class="mz-stat-l">${v.l_served}</div></div><div class="mz-stat is-total" data-ui="ury-mosaic-production-card-total"><div class="mz-stat-n">${v.n_total}</div><div class="mz-stat-l">${v.l_total}</div></div></div><div class="mz-prod-foot"><span>${v.prod_foot}</span></div></div>`;
}

// ---- item status pill ----
export const pill = (state, label, id = '', extra = '') => `<span class="mz mz-pill is-${state}${extra ? ' ' + extra : ''}"${id ? ` data-ui="${id}"` : ''}>${label}</span>`;
export const pills = (v) => `<div class="mz mz-pills" data-ui="ury-mosaic-item-pill">${pill('queued', v.st_queued)}${pill('preparing', v.st_preparing)}${pill('ready', v.st_ready)}${pill('served', v.st_served)}</div>`;
export const pillOne = (state, v) => `<div class="mz mz-pills" data-ui="ury-mosaic-item-pill">${pill(state, v['st_' + state])}</div>`;

// ---- kot ticket ----
// o.type: dine|takeaway|modified|cancelled|partial|duplicate ; flags: aggregator, resolved, struck, overdue, comments, flip
export function kotTicket(v, o = {}) {
  const { type = 'dine', aggregator = false, resolved = false, struck = false, overdue = false, comments = false, flip = '' } = o;
  const canc = type === 'cancelled' || type === 'partial';
  const cls = type === 'takeaway' || (aggregator && type === 'dine') ? 'is-takeaway' : type === 'modified' ? 'is-modified' : canc ? 'is-cancelled' : '';
  const isTake = type === 'takeaway' || aggregator;
  const who = `${isTake ? '' : `<span class="mz-kot-lbl">${v.table_label} </span>`}<span class="mz-kot-val">${isTake ? v.takeaway_label : v.table_name} <span class="mz-kot-lbl">( ${v.waiter} )</span></span><br>`
    + (aggregator ? `<span class="mz-kot-lbl">${v.agg_label}</span><span class="mz-kot-ms mz-kot-val">${v.agg_name} </span><br><span class="mz-kot-lbl">${v.agg_id_label}</span><span class="mz-kot-ms mz-kot-val">${v.agg_id} </span><br>` : '')
    + `<span class="mz-kot-lbl">${v.order_label}</span><span class="mz-kot-ms mz-kot-val mz-kot-mono" dir="ltr">${v.order_no}</span>`
    + (canc ? `<span class="mz-kot-ms mz-kot-val"> ( ${v.type_label} )</span>` : '');
  const items = [1, 2, 3].map((n) => {
    const state = ['preparing', 'queued', 'served'][n - 1];
    const isStruck = struck && n === 1;
    const pend = canc && n <= (type === 'cancelled' ? 2 : 1);
    return `<div class="mz-kot-item" data-ui="ury-mosaic-kot-ticket-item"><div class="mz-kot-row${isStruck ? ' is-struck' : ''}"><div><span class="mz-kot-ms">${v[`item_${n}`]}</span><br>${canc ? `<span class="mz-kot-ms">[${v.old_qty}]</span>` : ''}</div><div>${pill(state, v['st_' + state], 'ury-mosaic-kot-ticket-pill', 'mz-kot-pill')}<span class="mz-kot-qty">${v[`qty_${n}`]}</span></div></div>`
      + (comments && n === 2 ? `<p class="mz-kot-icom">${v.item_comment}</p>` : '')
      + (pend && !(resolved && n === 1) ? `<div class="mz-kot-disp" data-ui="ury-mosaic-kot-ticket-disposition"><span>${v.disp_label}</span><button type="button" class="mz-kot-dbtn is-return">${v.return_label}</button><button type="button" class="mz-kot-dbtn is-waste">${v.waste_label}</button></div>` : '')
      + (resolved && canc && n === 1 ? `<div class="mz-kot-done" data-ui="ury-mosaic-kot-ticket-resolved">( ${v.disp_done} )</div>` : '')
      + `<hr></div>`;
  }).join('');
  const overlay = flip ? `<div class="mz-kot-flip" data-ui="ury-mosaic-kot-ticket-flip"><button type="button">${flip === 'confirm' ? v.confirm_label : v.serve_label}</button></div>` : '';
  return `<div class="mz mz-kot ${cls}" data-ui="ury-mosaic-kot-ticket">${overlay}<div class="mz-kot-in"><div class="mz-kot-top"><div class="mz-kot-who">${who}</div><div class="mz-kot-timer${overdue ? ' is-late' : ''}" data-ui="ury-mosaic-kot-ticket-timer" dir="ltr">${v.timer}</div></div>`
    + (type === 'duplicate' ? `<div class="mz-kot-dup">( ${v.dup_note} )</div>` : '')
    + (comments ? `<div class="mz-kot-note">( ${v.kot_comment} )</div>` : '')
    + `<div>${items}</div></div></div>`;
}

// ---- alerts ----
export function alerts(v, o = {}) {
  const { banner = true, audio = true, toast = 'online', modal = true } = o;
  return `<div class="mz mz-alerts" data-ui="ury-mosaic-alerts">`
    + (modal ? `<div class="mz-scrim" data-ui="ury-mosaic-alerts-modal"><div class="mz-scrim-in"><div class="mz-modal"><p class="mz-modal-t"><span class="mz-modal-dot"></span>${v.modal_title}</p><hr><p class="mz-modal-b">${v.modal_body}</p><div><button type="button" class="mz-modal-btn">${v.modal_btn}</button></div></div></div></div>` : '')
    + (banner ? `<div class="mz-banner" data-ui="ury-mosaic-alerts-banner"><div class="mz-banner-l"><div class="mz-banner-ico">⚠️</div><div><p class="mz-banner-t">${v.banner_title}</p><p class="mz-banner-s"><span>${v.banner_inv}</span> | ${v.banner_table} | ${v.banner_time}</p></div></div><button type="button" class="mz-banner-x">✕</button></div>` : '')
    + (audio ? `<div class="mz-audio" data-ui="ury-mosaic-alerts-audio">${v.audio_msg}</div>` : '')
    + (toast ? `<div class="mz-toast is-${toast}" data-ui="ury-mosaic-alerts-toast">${toast === 'online' ? v.toast_online : v.toast_offline}</div>` : '')
    + `</div>`;
}
