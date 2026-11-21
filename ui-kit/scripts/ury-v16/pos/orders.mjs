// Markup helpers for the POS Orders route. Class lists mirror pos/src/pages/Orders.tsx and
// components/{OrderStatusSidebar,OrderActionsMenu,SplitGroupPanel,MergedBillPanel}.tsx @100c43fe2e.
import { ic, screen } from '../lib.mjs';
import { header } from './shell.mjs';

const X = {
  GitBranch: '<path d="M15 6a9 9 0 0 0-9 9V3"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>',
  GitMerge: '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M6 21V9a9 9 0 0 0 9 9"/>',
  SplitSquareHorizontal: '<path d="M12 2v20"/><path d="M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3"/><path d="M8 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"/>',
  Link2: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>',
};
export const I = (n, s = 16, c = '') => ic(n, s, c, X);
export const STATUSES = ['draft', 'unbilled', 'recently_paid', 'paid', 'consolidated', 'return'];
export const STATUS_BADGE = { draft: 'secondary', unbilled: 'secondary', recently_paid: 'default', paid: 'default', consolidated: 'default', return: 'destructive' };
const EDITABLE = new Set(['draft', 'unbilled', 'recently_paid']);
export const isEditable = (st) => EDITABLE.has(st);

const tag = (icon, txt, ui = '') => `<span class="u-badge u-badge--tag u-badge--tagAccent po-tag"${ui ? ` data-ui="${ui}"` : ''}>${I(icon, 10)}${txt}</span>`;
const badge = (st, txt, ui = '') => `<span class="u-badge u-badge--${STATUS_BADGE[st] || 'default'}"${ui ? ` data-ui="${ui}"` : ''}>${txt}</span>`;

/* ---------------- status sidebar ---------------- */
// active: one of STATUSES. v: s_title, s_<status>
export const statusSidebar = (v, { active = 'draft', id = 'pos-orders-sidebar' } = {}) => `
<div class="po po-sidebar" data-ui="${id}"><nav class="po-sidebar__nav"><div class="po-sidebar__card">
<h2 class="po-sidebar__title">${v.s_title}</h2>
<div class="po-sidebar__list">${STATUSES.map((k) => { const on = k === active; return `<button type="button" class="po-sidebar__item${on ? ' is-active' : ''}"${on ? ' aria-current="true"' : ''} data-ui="${id}.${k}">${on ? '<div class="po-sidebar__bar"></div>' : ''}<div class="po-sidebar__lbl">${I('FileText', 16)}<span>${v['s_' + k]}</span></div></button>`; }).join('')}</div>
</div></nav></div>`;

/* ---------------- order card ---------------- */
// p: status (STATUSES key), split, merged, selected, warn, note ('split'|'merged'|'')
export const orderCard = (v, p = {}, id = 'pos-order-card') => {
  const st = p.status || 'draft';
  const linked = p.split || p.merged;
  const tags = `${p.merged ? tag('GitMerge', v.tag_merged) : ''}${p.split ? tag('GitBranch', v.tag_split) : ''}`;
  const note = p.merged ? `<p class="po-card__note">${v.note_merged}</p>` : p.split ? `<p class="po-card__note">${v.note_split}</p>` : '';
  return `
<div class="po po-card u-card${p.selected ? ' is-selected' : ''}${linked ? ' is-linked' : ''}" data-ui="${id}">
<div class="po-card__head" data-ui="${id}.head">
<div class="po-card__r1"><h3 class="po-card__name po-trunc">${v.name}</h3><div class="po-card__tags">${tags}</div></div>
<div class="po-card__r2"><div class="po-card__sub"><p>${v.meta}</p></div><div class="po-card__st">${badge(st, v[p.statusSlot || 'status'], id + '.status')}${p.warn ? `<span class="u-badge u-badge--outline po-warn" data-ui="${id}.warn">${v.warn}</span>` : ''}</div></div>
${note}</div>
<div class="po-card__body" data-ui="${id}.body"><p class="po-card__cust">${v.customer}</p>
<div class="po-card__time">${I('Clock', 14)}<span>${v.time}</span></div>
<div class="po-card__total u-num" data-ui="${id}.total"><span>${p.merged ? v.total_merged : v.total}</span></div></div>
</div>`;
};

/* ---------------- actions menu ---------------- */
// p: merge, split (both default true), hover ('merge'|'split'), cancel (shows the cancel-reason dialog)
export const actionsMenu = (v, p = {}, id = 'pos-order-actions-menu') => {
  const merge = p.merge !== false, split = p.split !== false;
  const items = `${merge ? `<button type="button" class="po-am__item${p.hover === 'merge' ? ' is-hover' : ''}" data-ui="${id}.merge">${I('GitMerge', 16)}${v.merge_bill}</button>` : ''}${split ? `<button type="button" class="po-am__item${p.hover === 'split' ? ' is-hover' : ''}" data-ui="${id}.split">${I('SplitSquareHorizontal', 16)}${v.split_bill}</button>` : ''}`;
  const dlg = p.cancel ? cancelDialog(v) : '';
  return `<div class="po po-amstage${p.cancel ? ' po-amstage--cancel' : ''}" data-ui="${id}">
<div class="po-amstage__tb"><div class="po-am"><button type="button" class="po-kebab" aria-expanded="true" aria-label="${v.order_actions}">${I('MoreVertical', 16)}</button><div class="po-am__pop" data-ui="${id}.popover">${items}</div></div></div>${dlg}</div>`;
};
export const cancelDialog = (v, { value = '' } = {}) => `
<div class="po-cancel" role="dialog" aria-modal="true" data-ui="pos-order-cancel-dialog"><div class="po-cancel__head"><h2 class="po-cancel__t">${v.cancel_title}</h2><p class="po-cancel__d">${v.cancel_desc}</p></div>
<div class="po-cancel__in"><textarea class="po-textarea" placeholder="${v.cancel_placeholder}" data-ui="pos-order-cancel-reason">${value}</textarea></div>
<div class="po-cancel__f"><button type="button" class="u-btn u-btn--outline">${v.btn_cancel}</button><button type="button" class="u-btn u-btn--destructive">${v.btn_confirm_cancel}</button></div></div>`;

/* ---------------- detail panel ---------------- */
const splitPanel = (v) => `
<div class="po-link" data-ui="pos-order-detail.split-panel"><div class="po-link__top"><div class="po-link__ttl">${I('Link2', 16)}<h3>${v.related_bills}</h3></div>
<div class="po-link__nav"><button type="button" class="u-btn u-btn--outline">${v.open_original}</button><button type="button" class="u-btn u-btn--outline u-btn--icon is-disabled" aria-label="${v.prev_bill}">${I('ChevronLeft', 16)}</button><button type="button" class="u-btn u-btn--outline u-btn--icon" aria-label="${v.next_bill}">${I('ChevronRight', 16)}</button></div></div>
<div class="po-link__list">
<div class="po-sib is-current"><div class="po-sib__main"><span class="po-sib__n po-trunc">${v.sib1}</span><div class="po-sib__m"><span>${v.l_current}</span><span>${v.l_open}</span><span>${v.split_ind1}</span></div></div><span class="po-sib__amt u-num">${v.sib1_total}</span></div>
<div class="po-sib is-paid"><div class="po-sib__main"><span class="po-sib__n po-trunc">${v.sib2}</span><div class="po-sib__m"><span>${v.l_original}</span><span>${v.l_paid}</span><span>${v.split_ind2}</span></div></div><span class="po-sib__amt u-num">${v.sib2_total}</span></div>
</div></div>`;
const mergedPanel = (v) => `
<div class="po-link" data-ui="pos-order-detail.merged-panel"><div class="po-link__top"><div class="po-link__ttl">${I('Link2', 16)}<h3>${v.tag_merged}</h3></div><button type="button" class="u-btn u-btn--outline">${v.open_secondary}</button></div>
<div class="po-mbill"><b>${v.sec_name}</b><span class="u-num">${v.sec_total}</span></div>
<div><p class="po-link__lbl">${v.merged_items}</p><div class="po-link__lines"><div class="po-mline"><span class="po-trunc">${v.m_item}</span><span class="u-num">${v.m_item_calc}</span></div></div></div>
<div class="po-link__tot"><span>${v.combined_total}</span><span class="u-num">${v.combined_value}</span></div></div>`;

// p: status, split, merged, discount (show -n% badge), reduce (minus buttons), actions (kebab menu), menu (popover open), cancelDlg
export const orderDetail = (v, p = {}, id = 'pos-order-detail') => {
  const st = p.status || 'draft';
  const ed = isEditable(st);
  const tags = `${p.split ? tag('GitBranch', v.tag_split) : ''}${p.merged ? tag('GitMerge', v.tag_merged) : ''}`;
  const kebab = p.actions ? `<div class="po-am"><button type="button" class="po-kebab" aria-label="${v.order_actions}" data-ui="${id}.actions">${I('MoreVertical', 16)}</button>${p.menu ? `<div class="po-am__pop" data-ui="${id}.popover"><button type="button" class="po-am__item">${I('GitMerge', 16)}${v.merge_bill}</button><button type="button" class="po-am__item">${I('SplitSquareHorizontal', 16)}${v.split_bill}</button></div>` : ''}</div>` : '';
  const acts = ed ? `${kebab}<button type="button" class="po-ibtn" aria-label="${v.edit_order}" data-ui="${id}.edit">${I('Pencil', 16)}</button><button type="button" class="po-ibtn po-ibtn--red" aria-label="${v.cancel_order}" data-ui="${id}.cancel">${I('X', 16)}</button>` : '';
  const item = (n, i) => `<div class="po-item" data-ui="${id}.item"><div class="po-item__main"><div class="po-item__nr"><p class="po-item__name">${v['item' + n]}</p>${n === 1 && p.discount ? `<span class="u-badge po-disc">${v.discount}</span>` : ''}</div>
<div class="po-item__q">${p.reduce ? `<button type="button" class="po-minus" aria-label="${v.reduce_label}">${I('Minus', 12)}</button>` : ''}<p class="po-item__qty">${v['qty' + n]}</p></div></div><div class="po-item__amt u-num"><p>${v['amt' + n]}</p></div></div>`;
  const pay = ed ? `<button type="button" class="u-btn u-btn--default po-pay" data-ui="${id}.payment">${v.payment}</button>` : '';
  const total = p.merged ? `<span class="po-df__total po-df__comb"><small>${v.combined_total}</small><span class="u-num">${v.combined_value}</span></span>` : `<span class="po-df__total u-num" data-ui="${id}.total">${v.total}</span>`;
  return `
<div class="po po-detail" data-ui="${id}">
<div class="po-dh" data-ui="${id}.header"><div class="po-dh__row"><h2 class="po-dh__title po-trunc">${v.name}</h2><div class="po-dh__acts">${acts}${badge(st, v[p.statusSlot || 'status'], id + '.status')}</div></div>${tags ? `<div class="po-dh__tags">${tags}</div>` : ''}</div>
<div class="po-db" data-ui="${id}.body">
${p.split ? splitPanel(v) : ''}${p.merged ? mergedPanel(v) : ''}
<div class="po-sec"><div class="po-info" data-ui="${id}.info">
<div class="po-info__col"><div class="po-info__row">${I('User', 16)}<b>${v.customer}</b></div><div class="po-info__row">${I('Clock', 16)}<span>${v.time}</span></div></div>
<div class="po-info__col"><div class="po-info__row">${I('UserCheck', 16)}<span>${v.waiter}</span></div><div class="po-info__row">${I('Receipt', 16)}<span>${v.table}</span></div></div></div></div>
<div class="po-sec"><h3 class="po-h3">${v.items_title}</h3><div class="po-items">${item(1)}${item(2)}${item(3)}</div></div>
<div class="po-sec"><h3 class="po-h3">${v.taxes_title}</h3><div class="po-taxes"><div class="po-tax"><span>${v.tax1}</span><b class="u-num">${v.tax1_amt}</b></div><div class="po-tax"><span>${v.tax2}</span><b class="u-num">${v.tax2_amt}</b></div></div></div>
</div>
<div class="po-df" data-ui="${id}.footer"><div class="po-df__row"><button type="button" class="u-btn u-btn--outline u-btn--icon" aria-label="${v.print}" data-ui="${id}.print">${ic('Printer', 20)}</button>${pay}${total}</div></div>
${p.cancelDlg ? `<div style="position:absolute;inset:0;background:rgba(0,0,0,.5);z-index:30"></div><div style="position:absolute;z-index:40;inset-inline:0;top:160px;display:flex;justify-content:center">${cancelDialog(v)}</div>` : ''}
</div>`;
};
export const orderDetailEmpty = (v, id = 'pos-order-detail') => `
<div class="po po-detail po-detail--empty" data-ui="${id}"><div><p class="po-detail__t">${v.select_to_view}</p><p class="po-detail__h">${v.click_to_view}</p></div></div>`;

/* ---------------- screens ---------------- */
const CARDS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
// p: selected (index into cards or -1)
export const ordersScreen = (v, p = {}, id = 'pos-screen-orders') => {
  const sel = p.selected ?? -1;
  const kinds = [{ status: 'draft' }, { status: 'unbilled', warn: true }, { status: 'recently_paid' }, { status: 'paid' }, { status: 'draft', split: true }, { status: 'unbilled', merged: true }];
  const cards = CARDS.map((c, i) => orderCard({ name: v[`${c}_name`], meta: v[`${c}_meta`], status: v[`${c}_status`], customer: v[`${c}_customer`], time: v[`${c}_time`], total: v[`${c}_total`], total_merged: v[`${c}_total`], warn: v.warn, tag_split: v.tag_split, tag_merged: v.tag_merged, note_split: v.note_split, note_merged: v.note_merged }, { ...kinds[i], selected: i === sel }, `pos-order-card-${i + 1}`)).join('');
  const detail = sel >= 0 ? orderDetail(v, { status: 'unbilled', actions: true, statusSlot: 'd_status' }, 'pos-order-detail') : orderDetailEmpty(v, 'pos-order-detail');
  const pager = `<div class="po-pager"><div class="po-pager__row" data-ui="pos-orders-pager"><button type="button" class="u-btn u-btn--outline u-btn--xs is-disabled">${v.previous}</button><span class="po-pager__page">${v.page}</span><button type="button" class="u-btn u-btn--outline u-btn--xs">${v.next}</button></div></div>`;
  return screen(1440, 900, `
${header({ v, variant: 'orders', printer: 'online' })}
<div class="po po-screen__row"><div style="height:852px;display:flex">${statusSidebar(v, { active: sel >= 0 ? 'unbilled' : 'draft' })}</div>
<div class="po-mid" data-ui="pos-orders-middle"><div class="po-mid__scroll"><div class="po-grid" data-ui="pos-orders-grid">${cards}</div>${pager}</div></div>
<div class="po-pane">${detail}</div></div>`, id, 'po po-screen');
};
