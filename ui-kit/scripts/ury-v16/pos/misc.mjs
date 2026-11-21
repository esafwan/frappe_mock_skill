// Markup helpers for POS misc screens: OpenEntries, Settings (+POSCloseFlow), ScreenSizeDialog, InitialLoader, toasts.
// Sources: pos/src/pages/{OpenEntries,Settings}.tsx, pos/src/components/{POSCloseFlow,ScreenSizeDialog,InitialLoader,KotAlertListener}.tsx, packages/ui/src/components/{toast,spinner}.tsx
import { ic, screen } from '../lib.mjs';
import { header, footer } from './shell.mjs';

const EXTRA = {
  Smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
  ExternalLink: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  CheckCircle2: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  CheckCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  XCircle: '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/>',
  Info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
};
const I = (n, s = 16, c = '') => ic(n, s, c, EXTRA);
const W = 1440, H = 900;

// Shell frame (AppLayout) around a page body.
const app = (v, active, body) => `<div class="pmx__app">${header({ v, variant: 'default' })}<div class="pmx__page" data-ui="page">${body}</div>${footer(active, { v })}</div>`;
const root = (id, inner) => screen(W, H, inner, id, 'pmx');

/* ---------- OpenEntries ---------- */
// p: state list|empty|error|loading
export const openEntriesScreen = (v, p = {}, id = 'pos-screen-open-entries') => {
  const st = p.state || 'list';
  const rows = [1, 2, 3].map((n) => `<tr class="${n === 2 && p.hover ? 'is-hover' : ''}"><td class="is-user">${v['u' + n]}</td><td>${v['d' + n]}</td><td>${v['pr' + n]}</td></tr>`).join('');
  const inner = st === 'error' ? `<div class="pmx__center"><p class="pmx__err">${v.error_load}</p></div>`
    : st === 'loading' ? `<div class="pmx__spinwrap"><div role="status"><div class="pmx__ring" aria-hidden="true"></div><p class="pmx__spinmsg">${v.loading}</p></div></div>`
    : st === 'empty' ? `<div class="pmx__center"><p class="pmx__muted">${v.no_sessions}</p></div>`
    : `<div style="overflow-x:auto"><table class="pmx__table" data-ui="table"><thead><tr><th>${v.col_user}</th><th>${v.col_period_start}</th><th>${v.col_pos_profile}</th></tr></thead><tbody>${rows}</tbody></table></div>`;
  return root(id, app(v, 'sessions', `<div class="pmx__wrap6"><h1 class="pmx__h1" data-ui="title">${v.title}</h1><div class="pmx__card" data-ui="card"><div class="pmx__cc">${inner}</div></div></div>`));
};

/* ---------- Settings ---------- */
// p: state idle|confirm|closed
export const settingsScreen = (v, p = {}, id = 'pos-screen-settings') => {
  const st = p.state || 'idle';
  const close = st === 'closed'
    ? `<div class="pmx__card" data-ui="closed-card"><div class="pmx__cc pmx__cc--p8">${I('CheckCircle2', 40, 'pmx__done')}<h2 class="pmx__h2 pmx__h2--lg">${v.closed_title}</h2><p class="pmx__desc pmx__desc--6">${v.closed_description}</p><button type="button" class="u-btn u-btn--default" data-ui="back">${v.back_to_dashboard}</button></div></div>`
    : `<div class="pmx__card" data-ui="close-card"><div class="pmx__cc"><h2 class="pmx__h2">${v.close_pos_title}</h2><p class="pmx__desc">${v.close_pos_description}</p><button type="button" class="u-btn u-btn--danger pmx__btn" data-ui="close-pos">${I('LogOut', 16)}${v.close_pos_button}</button></div></div>`;
  const dlg = st === 'confirm'
    ? `<div class="pmx__dlg-wrap" data-ui="confirm-wrap"><div class="u-dialog-scrim"></div><div class="u-dialog u-dialog--md" role="dialog" aria-modal="true" data-ui="confirm-dialog"><button type="button" class="u-dialog-close" aria-label="Close">${I('X', 16)}</button><div class="u-dialog-header"><h2 class="u-dialog-title">${v.confirm_title}</h2><p class="u-dialog-desc">${v.confirm_description}</p></div><div class="u-dialog-footer"><button type="button" class="u-btn u-btn--outline">${v.confirm_cancel}</button><button type="button" class="u-btn u-btn--danger">${v.confirm_button}</button></div></div></div>`
    : '';
  const body = `<div class="pmx__wrap-md"><h1 class="pmx__h1--xl" data-ui="title">${v.title}</h1><div><h2 class="pmx__eod" data-ui="eod">${v.end_of_day}</h2>${close}</div><div class="pmx__card" data-ui="more-card"><div class="pmx__cc pmx__cc--p8"><p class="pmx__muted">${v.coming_soon}</p></div></div></div>`;
  return root(id, app(v, 'settings', body) + dlg);
};

/* ---------- ScreenSizeDialog ---------- */
export const screenSizeDialog = (v, p = {}, id = 'pos-screen-size-dialog') => root(id,
  `<div class="pmx__under">${app(v, 'sessions', '')}</div><div class="pmx__scrim"><div class="pmx__ssd" data-ui="dialog"><div>
<div class="pmx__ssd-ic" data-ui="icon"><div>${I('Monitor', 32)}${I('Smartphone', 16)}</div></div>
<h2 class="pmx__ssd-title" data-ui="title">${v.title}</h2>
<div class="pmx__ssd-msg"><p class="is-lg">${v.designed_for}</p><p class="is-sm">${v.mobile_note}</p></div>
<div class="pmx__ssd-cur" data-ui="current"><p><b>${v.current_width}</b></p><p><b>${v.required}</b></p></div>
<div class="pmx__ssd-alt" data-ui="alt"><p>${v.use_v1}</p><button type="button" class="u-btn pmx__ssd-btn${p.hover ? ' is-hover' : ''}" data-ui="switch">${I('ExternalLink', 16)}${v.switch_v1}</button></div>
</div></div></div>`);

/* ---------- InitialLoader ---------- */
export const initialLoader = (v, p = {}, id = 'pos-initial-loader') => root(id,
  `<div class="pmx__loader" data-ui="loader"><div><div role="status" aria-live="polite"><div><div class="pmx__ring pmx__ring--12" aria-hidden="true" data-ui="spinner"></div><p class="pmx__spinmsg">${v.loading}</p></div></div><p class="pmx__loader-t">${v.loading_ury_pos}</p><p class="pmx__loader-s">${v.please_wait_setup}</p></div></div>`);

/* ---------- Toasts ---------- */
const TI = { success: 'CheckCircle', error: 'XCircle', info: 'Info', warning: 'AlertTriangle' };
export const toast = (kind, msg, ui) => `<div class="pmx__toast pmx__toast--${kind}" role="alert" data-ui="${ui}"><div class="pmx__toast-body"><div class="pmx__toast-icon">${I(TI[kind], 20)}</div><div><span>${msg}</span></div></div><button type="button" class="pmx__toast-close" aria-label="close"><svg aria-hidden="true" viewBox="0 0 14 16" width="14" height="16"><path fill="currentColor" fill-rule="evenodd" d="M7.71 8.23l3.75 3.75-1.48 1.48-3.75-3.75-3.75 3.75L1 11.98l3.75-3.75L1 4.48 2.48 3l3.75 3.75L9.98 3l1.48 1.48-3.75 3.75z"/></svg></button><div class="pmx__toast-bar"></div></div>`;
export const toastStage = (kinds, v, id = 'pos-toast') =>
  `<div class="pmx pmx-toast-stage" data-ui="${id}">${kinds.map((k) => toast(k, v['msg_' + k], 'toast-' + k)).join('')}</div>`;
