// Markup helpers for the POS shift screens (opening, closing, checklist gate). Class lists mirror
// pos/src/components/{POSOpeningScreen,POSOpeningPaymentTable,POSClosingDialog,ClosingPaymentTable,ChecklistGateDialog}.tsx.
import { ic, screen } from '../lib.mjs';

const W = 1440, H = 900;
const under = '<div class="pos-shift__under"></div>';
const badge = (label, val, cls = 'secondary') => `<span class="u-badge u-badge--${cls} u-badge--sm">${label}: ${val}</span>`;
const btn = (cls, label, { off = false, icon = '', ui = '' } = {}) => `<button type="button" class="u-btn ${cls}${off ? ' is-disabled' : ''}"${ui ? ` data-ui="${ui}"` : ''}>${icon}${label}</button>`;
const input = (txt, cls = '') => `<div class="pos-shift__input u-num ${cls}">${txt}</div>`;

/* ---------------- Opening screen ---------------- */
// props: alert none|no_profiles|no_permission|daily_close|main_cashier ; zero (zero-balance confirm) ; submitting ; profileSelect
export const openingBody = (v, p = {}) => {
  const blocked = p.alert && p.alert !== 'none';
  const zero = !!p.zero;
  const amt = (n, key) => (zero ? input('<span style="opacity:.6">0</span>', 'is-empty' + (blocked ? ' is-disabled' : '')) : input(v[key], blocked ? 'is-disabled' : ''));
  const alerts = {
    no_profiles: ['red', 'AlertTriangle', v.msg_no_profiles],
    no_permission: ['red', 'Lock', v.msg_no_permission],
    daily_close: ['orange', 'AlertTriangle', v.msg_daily_close],
    main_cashier: ['orange', 'AlertTriangle', v.msg_main_cashier],
  };
  const a = alerts[p.alert];
  const alertHtml = a ? `<div class="pos-shift__alert pos-shift__alert--${a[0]}" data-ui="pos-opening-alert">${ic(a[1], 20)}<p>${a[2]}</p></div>` : '';
  const zeroHtml = zero ? `<div class="pos-shift__alert pos-shift__alert--orange" data-ui="pos-opening-zero-warning">${ic('AlertTriangle', 20)}<p>${v.zero_warning}</p></div>` : '';
  const errHtml = p.error ? `<div class="pos-shift__alert pos-shift__alert--red pos-shift__alert--plain" data-ui="pos-opening-error"><p>${v.msg_error}</p></div>` : '';
  const profile = p.profileSelect
    ? `<div class="pos-shift__stack" style="gap:6px"><label class="pos-shift__sub" style="font-weight:500;color:hsl(var(--gray-700))">${v.l_profile}</label><div class="pos-shift__input" style="justify-content:space-between;text-align:start;font-size:14px">${v.profile}${ic('ChevronDown', 16)}</div></div>`
    : `<div class="pos-shift__profile"><span>${v.l_profile}:</span><span class="u-badge u-badge--info u-badge--sm" style="color:inherit">${v.profile}</span></div>`;
  const total = v[zero ? 'total_zero' : 'total_open'];
  const label = p.submitting ? `${ic('RefreshCw', 16, 'pos-shift__spin')}${v.btn_opening}` : zero ? v.btn_confirm : v.btn_open;
  const off = blocked || p.submitting;
  return `
<div class="pos-shift__card" data-ui="pos-opening-card">
  <div class="pos-shift__head" data-ui="pos-opening-header"><div class="pos-shift__head-row">
    <div class="pos-shift__icon">${ic('Store', 24)}</div>
    <div><h1 class="pos-shift__title">${v.title}</h1><p class="pos-shift__sub">${v.subtitle}</p></div>
  </div></div>
  <div class="pos-shift__body">
    <section class="pos-shift__sec" data-ui="pos-opening-details">
      <h2 class="pos-shift__label">${v.l_details}</h2>
      <div class="pos-shift__badges">${badge(v.l_company, v.company)}${badge(v.l_branch, v.branch)}${badge(v.l_restaurant, v.restaurant)}${badge(v.l_cashier, v.cashier)}${badge(v.l_start, v.start)}</div>
      ${profile}
    </section>
    <section class="pos-shift__sec" data-ui="pos-opening-balance">
      <div class="pos-shift__sec-row"><h2 class="pos-shift__label">${v.l_balance}</h2><span class="pos-shift__total u-num">${total}</span></div>
      <div class="pos-shift__stack">
        <p class="pos-shift__help">${v.help}</p>
        <div class="pos-shift__tablewrap"><table class="pos-shift__table" data-ui="pos-opening-table">
          <thead><tr><th>${v.l_mode}</th><th class="is-end">${v.l_amount}</th></tr></thead>
          <tbody>
            <tr><td>${v.mode1}</td><td>${amt(0, 'amt1')}</td></tr>
            <tr><td>${v.mode2}</td><td>${amt(0, 'amt2')}</td></tr>
            <tr><td>${v.mode3}</td><td>${amt(0, 'amt3')}</td></tr>
          </tbody></table></div>
        <div class="pos-shift__sumrow"><b>${v.l_total}</b><b class="u-num">${total}</b></div>
      </div>
    </section>
    ${errHtml}${zeroHtml}${alertHtml}
  </div>
  <div class="pos-shift__actions" data-ui="pos-opening-actions">
    ${btn('u-btn--default', label, { off, ui: 'pos-opening-submit' })}
    ${btn('u-btn--outline', v.btn_retry, { off: p.submitting, icon: ic('RefreshCw', 16) })}
    ${btn('u-btn--outline', v.btn_back)}
  </div>
</div>`;
};
export const openingScreen = (v, p = {}, id = '') => screen(W, H, `${under}<div class="pos-shift__scrim pos-shift__scrim--p4">${openingBody(v, p)}</div>`, id, 'pos-shift');

/* ---------------- Closing dialog ---------------- */
// props: confirm, skip, error (submit error), empty, submitting, masked
const mutedDash = '—';
export const closingBody = (v, p = {}) => {
  const rows = [
    ['row1', 'open1', 'exp1', 'cl1', 'diff1', 'ok', false],
    ['row2', 'open2', 'exp2', 'cl2', 'diff2', 'bad', false],
    ['row3', 'open3', 'exp3', null, 'diff3', 'bad', true],
  ];
  const masked = !!p.masked;
  const th = (cls, label, tip) => `<th class="${cls}"><span title="">${label}<i aria-hidden="true">i</i></span></th>`;
  const tr = ([m, o, e, c, d, st, untouched]) => `<tr class="${untouched ? 'is-untouched' : ''}"><td class="is-mode">${v[m]}</td><td>${v[o]}</td><td>${masked ? mutedDash : v[e]}</td><td>${c ? input(v[c], 'is-center') : input('<span style="opacity:.6">0.00</span>', 'is-center is-empty is-warn')}</td><td class="is-diff ${masked ? '' : st === 'ok' ? 'is-green' : 'is-red'}">${masked ? mutedDash : v[d]}</td></tr>`;
  const table = p.empty ? `<p class="pos-shift__empty" data-ui="pos-closing-empty">${v.no_invoices}</p>` :
    `<div style="width:100%;overflow-x:auto"><table class="pos-shift__ctable" data-ui="pos-closing-table"><thead><tr>
      <th class="is-start">${v.h_mode}</th><th>${v.h_opening}</th>${th('', v.h_expected)}${th('is-center', v.h_closing)}${th('', v.h_diff)}
    </tr></thead><tbody>${rows.map(tr).join('')}</tbody></table></div>
    <p class="pos-shift__amber" data-ui="pos-closing-warning">${v.warn_zero}</p>`;
  const err = p.error ? `<p class="pos-shift__err" data-ui="pos-closing-error">${v.msg_fail}</p>` : '';
  return `
<div class="pos-shift__dlg" data-ui="pos-closing-dialog">
  <button type="button" class="pos-shift__dlg-x" aria-label="Close">${ic('X', 16)}</button>
  <div class="pos-shift__dlg-head"><h2 class="pos-shift__dlg-title">${v.title}</h2><p class="pos-shift__dlg-desc">${v.desc}</p></div>
  <div class="pos-shift__dlg-body">
    <div class="pos-shift__sum" data-ui="pos-closing-summary">
      <div class="pos-shift__sumcard"><p>${v.l_grand}</p><p>${masked ? mutedDash : v.grand}</p></div>
      <div class="pos-shift__sumcard"><p>${v.l_net}</p><p>${masked ? mutedDash : v.net}</p></div>
      <div class="pos-shift__sumcard"><p>${v.l_qty}</p><p>${v.qty}</p></div>
      <div class="pos-shift__sumcard"><p>${v.l_invoices}</p><p>${v.invoices}</p></div>
    </div>
    ${table}
  </div>
  ${err}
  <div class="pos-shift__dlg-foot" data-ui="pos-closing-footer">${btn('u-btn--outline', v.btn_cancel)}${btn('u-btn--default', p.submitting && !p.confirm ? v.btn_submitting : v.btn_close, { off: !!p.empty, ui: 'pos-closing-submit' })}</div>
</div>`;
};
export const closingConfirm = (v, p = {}) => `<div class="pos-shift__scrim pos-shift__scrim--z70" data-ui="pos-closing-confirm-scrim"><div class="pos-shift__confirm" data-ui="pos-closing-confirm"><h3>${v.confirm_title}</h3><p>${v.confirm_msg}</p><div class="pos-shift__confirm-row">${btn('u-btn--outline', v.confirm_back)}${btn('u-btn--default', p.submitting ? v.btn_submitting : v.confirm_yes, { ui: 'pos-closing-confirm-yes' })}</div></div></div>`;

/* ---------------- Checklist gate ---------------- */
// props: kind opening|closing ; state form|blocked|start ; items [{st:'P'|'F'|null, rem:slot|null, req:bool}] ; submitError
const radios = (v, st) => `<div class="pos-shift__radios"><label class="pos-shift__radio"><span class="pos-shift__dot${st === 'P' ? ' is-on' : ''}"></span>${v.pass}</label><label class="pos-shift__radio"><span class="pos-shift__dot${st === 'F' ? ' is-on' : ''}"></span>${v.fail}</label></div>`;
export const gateBody = (v, p = {}) => {
  const state = p.state || 'form';
  const items = p.items || [];
  const head = `<h2 class="pos-shift__gate-title">${v.gate_title}</h2><p class="pos-shift__gate-desc">${v.gate_desc}</p>`;
  let body;
  if (state === 'blocked') {
    body = `<div class="pos-shift__gate-block" data-ui="pos-checklist-blocked"><p class="h">${v.blocked_heading}</p><p class="m">${v.blocked_msg}</p>${btn('u-btn--outline', v.btn_recheck)}</div>`;
  } else if (state === 'start') {
    body = `<div class="pos-shift__gate-block" data-ui="pos-checklist-start"><p class="h">${v.blocked_heading}</p><p class="m" style="margin-bottom:0">${v.gate_desc}</p><button type="button" class="pos-shift__gate-btn pos-shift__gate-btn--auto" style="height:36px">${v.btn_start}</button></div>`;
  } else {
    const ok = items.every((it) => it.st) && items.every((it) => it.st !== 'F' || it.rem);
    const rows = items.map((it, i) => {
      const n = i + 1;
      let rem = '';
      if (it.st) rem = it.rem ? input(v[it.rem], '') : input(`<span style="opacity:.6">${it.st === 'F' ? v.ph_fail : v.ph_remarks}</span>`, 'is-empty');
      const req = it.st === 'F' && !it.rem ? `<p class="pos-shift__item-err">${v.fail_required}</p>` : '';
      return `<div class="pos-shift__item" data-ui="pos-checklist-item"><span class="pos-shift__item-t">${n}. ${v['item' + n]}${it.req ? '<em>*</em>' : ''}</span>${radios(v, it.st)}${rem}${req}</div>`;
    }).join('');
    body = `<div class="pos-shift__items" data-ui="pos-checklist-items">${rows}</div>${p.submitError ? `<p class="pos-shift__gate-err">${v.msg_incomplete}</p>` : ''}<button type="button" class="pos-shift__gate-btn${ok && !p.submitting ? '' : ' is-off'}" data-ui="pos-checklist-submit">${p.submitting ? v.btn_submitting : v.btn_submit}</button>`;
  }
  return `<div class="pos-shift__gate" data-ui="pos-checklist-card">${head}${body}</div>`;
};
export const skipBar = (v) => `<div class="pos-shift__skip" data-ui="pos-closing-skip"><div class="pos-shift__skip-in"><p>${v.skip_hint}</p>${btn('u-btn--outline u-btn--sm', v.skip)}</div></div>`;
export const gateScreen = (v, p = {}, id = '') => screen(W, H, `${under}<div class="pos-shift__scrim">${gateBody(v, p)}</div>${p.skip ? skipBar(v) : ''}`, id, 'pos-shift');
export const closingScreen = (v, p = {}, id = '') => screen(W, H, `${under}<div class="pos-shift__scrim">${closingBody(v, p)}</div>${p.confirm ? closingConfirm(v, p) : ''}`, id, 'pos-shift');
