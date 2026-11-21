// Markup helpers for the URY v16 POS order dialogs (T07). Source: pos/src/components/{ProductDialog,TableSelectionDialog,TableTransferDialog,
// TableMergeDialog,TableUnmergeDialog,CaptainTransferDialog,BillSplitDialog,BillMergeDialog,CustomerPicker,CommentDialog}.tsx and the
// packages/ui views they wrap (product-configurator, table-picker-dialog, multi-select-table-dialog, user-picker-dialog, confirm-dialog,
// customer-picker, comment-dialog). Slot values are {{name}} placeholders filled by static-capture.
import { ic } from '../lib.mjs';

// lucide-react 0.525 paths for icons the shared set does not have (this task's own additions).
export const EXTRA = {
  Circle: '<circle cx="12" cy="12" r="10"/>',
  RectangleHorizontal: '<rect width="20" height="12" x="2" y="6" rx="2"/>',
  Link2: '<path d="M9 17H7A5 5 0 0 1 7 7h2"/><path d="M15 7h2a5 5 0 1 1 0 10h-2"/><line x1="8" x2="16" y1="12" y2="12"/>',
  UserPlus: '<path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="M19 16v6"/><path d="M22 19h-6"/>',
  Loader: '<path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>',
};
export const i = (name, size = 16, cls = '') => ic(name, size, cls, EXTRA);

export const s = (k) => `{{${k}}}`;
export const num = (k) => `<span class="u-num">{{${k}}}</span>`;
const cx = (...a) => a.filter(Boolean).join(' ');

// ---- frame ----
export const stage = (id, body, { scrim = true, cls = '' } = {}) =>
  `<div class="u-dialog-wrap pd${cls ? ' ' + cls : ''}" data-ui="${id}" style="width:1440px;height:900px">${scrim ? '<div class="u-dialog-scrim"></div>' : ''}${body}</div>`;
export const closeX = () => `<button type="button" class="u-dialog-close" aria-label="Close">${i('X', 16)}</button>`;
export const dialog = (cls, inner, { close = true, ui = '' } = {}) =>
  `<div class="u-dialog ${cls}" role="dialog" aria-modal="true"${ui ? ` data-ui="${ui}"` : ''}>${close ? closeX() : ''}${inner}</div>`;
export const header = (title, desc, { titleHtml = '' } = {}) =>
  `<div class="u-dialog-header" data-ui="header"><h2 class="u-dialog-title">${titleHtml || title}</h2>${desc ? `<p class="u-dialog-desc">${desc}</p>` : ''}</div>`;
export const btn = (cls, label, { disabled = false, ui = '' } = {}) =>
  `<button type="button" class="u-btn ${cls}"${disabled ? ' disabled' : ''}${ui ? ` data-ui="${ui}"` : ''}>${label}</button>`;
export const footer = (cancel, confirm, { confirmDisabled = false, confirmCls = 'u-btn--default', start = '' } = {}) =>
  `<div class="u-dialog-footer" data-ui="footer">${start}${btn('u-btn--outline', cancel, { ui: 'cancel' })}${btn(confirmCls, confirm, { disabled: confirmDisabled, ui: 'confirm' })}</div>`;
export const input = ({ ph = '', value = '', type = 'text', variant = '', readonly = false, cls = '', focus = false, error = false, ui = '' } = {}) =>
  `<input class="${cx('pd-input', variant && 'pd-input--' + variant, cls, focus && 'is-focus', error && 'is-error')}" type="${type}"${ph ? ` placeholder="${ph}"` : ''} value="${value}"${readonly ? ' readonly' : ''}${ui ? ` data-ui="${ui}"` : ''}>`;
export const textarea = ({ ph = '', value = '', focus = false, ui = '' } = {}) =>
  `<textarea class="${cx('pd-textarea', focus && 'is-focus')}" placeholder="${ph}"${ui ? ` data-ui="${ui}"` : ''}>${value}</textarea>`;
export const spinner = (msg) => `<div class="pd-spinner" role="status"><div><div class="pd-spinner__ring" aria-hidden="true"></div>${msg ? `<p class="pd-spinner__msg">${msg}</p>` : ''}</div></div>`;
export const cbox = (on, bold = false) => `<div class="${cx('pd-cbox', on && 'is-on', bold && 'pd-cbox--bold')}" aria-hidden="true">${on ? i('Check', 12) : ''}</div>`;
export const shapeIcon = (shape, size = 24) => i(shape === 'Circle' ? 'Circle' : shape === 'Square' ? 'Square' : 'RectangleHorizontal', size);

// ---- 1. ProductConfigurator ----
// p: {img, edit, sel (addon idx[]), selVariant, addons:'list'|'loading'|'error'|'none', variants, closeBtn}
export function productDialog(p = {}) {
  const { img = true, selVariant = 0, sel = [], addons = 'list', variants = true, submitDisabled = false } = p;
  const media = img
    ? `<img src="{{item_image}}" alt="{{item_name}}" data-ui="image">`
    : `<div class="pd-product__initials" data-ui="image">{{item_name_initials}}</div>`;
  const vs = [1, 2].map((n, k) =>
    `<button type="button" class="u-btn u-btn--outline pd-pick${selVariant === k ? ' is-sel' : ''}" aria-pressed="${selVariant === k}" data-ui="variant-${n}"><div class="pd-pick__name">{{v${n}_name}}</div><div class="pd-pick__price">${num('v' + n + '_price')}</div></button>`).join('');
  const ao = [1, 2, 3].map((n, k) =>
    `<button type="button" class="u-btn u-btn--outline pd-pick pd-pick--addon${sel.includes(k) ? ' is-sel' : ''}" aria-pressed="${sel.includes(k)}" data-ui="addon-${n}"><div style="display:flex;align-items:center;justify-content:space-between;width:100%"><span>{{a${n}_name}}</span><span class="pd-pick__price" style="font-weight:400">+${num('a' + n + '_price')}</span></div></button>`).join('');
  const addonsHtml = addons === 'loading' ? `<div class="pd-product__addons-msg pd-product__addons-msg--load" data-ui="addons-state">{{loading_addons}}</div>`
    : addons === 'error' ? `<div class="pd-product__addons-msg pd-product__addons-msg--err" data-ui="addons-state">{{addons_error}}</div>`
    : addons === 'none' ? `<div class="pd-product__addons-msg pd-product__addons-msg--none" data-ui="addons-state">{{no_addons}}</div>`
    : `<div data-ui="addons"><h3>{{addons_label}}</h3><div class="pd-product__addon-list">${ao}</div></div>`;
  const inner = `<div class="pd-product__media" data-ui="media">${media}<button type="button" class="u-btn u-btn--outline u-btn--icon pd-product__close" aria-label="Close" data-ui="close">${i('X', 20)}</button></div>
<div class="pd-product__col" data-ui="details">
<h2 class="pd-product__title" data-ui="item-name">{{item_name}}</h2>
<div class="pd-product__meta"><span class="pd-product__code">{{item_code}}</span><span class="pd-product__dot">&bull;</span><span class="pd-product__course">{{course_label}}</span></div>
<div class="pd-product__sec" data-ui="instructions"><h3>{{special_label}}</h3>${input({ ph: '{{special_ph}}', value: '{{special_text}}', ui: 'comments' })}</div>
<div class="pd-product__sec" data-ui="quantity"><h3>{{qty_label}}</h3><div class="pd-product__qty" role="group"><button type="button" class="u-btn u-btn--outline u-btn--icon" aria-label="Decrease" data-ui="qty-minus">${i('Minus', 16)}</button>${input({ type: 'number', value: '{{qty}}', cls: 'pd-input--qty', ui: 'qty-input' })}<button type="button" class="u-btn u-btn--outline u-btn--icon" aria-label="Increase" data-ui="qty-plus">${i('Plus', 16)}</button></div></div>
${variants ? `<div class="pd-product__sec" data-ui="variants"><h3>{{variants_label}}</h3><div class="pd-product__variants">${vs}</div></div>` : ''}
</div>
<div class="pd-product__col pd-product__col--side" data-ui="side">
<div class="pd-product__addons">${addonsHtml}</div>
<div class="pd-product__foot" data-ui="total-bar"><div class="pd-product__total"><span>{{total_label}}&nbsp;</span><span data-ui="total">${num('total')}</span></div>
<button type="button" class="u-btn u-btn--default u-btn--lg pd-product__submit"${submitDisabled ? ' disabled' : ''} data-ui="submit">{{submit_text}}</button></div>
</div>`;
  return dialog('pd-dlg--scroll pd-product', inner, { close: false, ui: 'dialog' });
}

// ---- 2. TableSelectionDialog ----
// p: {selected, banner, state:'tables'|'loading-rooms'|'loading-tables'|'no-rooms'|'no-tables'|'error'}
export function tableSelectDialog(p = {}) {
  const { selected = -1, banner = false, state = 'tables', activeRoom = 0 } = p;
  const rooms = [1, 2, 3].map((n, k) => `<button type="button" class="u-btn u-btn--tab pd-room" data-selected="${k === activeRoom}" data-ui="room-${n}">{{room${n}}}</button>`).join('');
  // [shape, status, merged label?]
  const defs = [['Rectangle', ''], ['Circle', ''], ['Square', ''], ['Rectangle', 'occ'], ['Circle', 'res'], ['Square', ''], ['Rectangle', ''], ['Circle', ''], ['Rectangle', '']];
  const tbl = defs.map(([shape, st], k) => {
    const n = k + 1; const isSel = selected === k;
    const cls = cx('u-btn u-btn--outline pd-tbl', isSel ? 'is-sel' : st === 'occ' ? 'is-occ' : st === 'res' ? 'is-res' : '');
    const badge = st === 'occ' ? `<span class="u-badge u-badge--secondary pd-badge-occ">{{occupied_badge}}</span>` : st === 'res' ? `<span class="u-badge u-badge--outline pd-badge-res">{{reserved_badge}}</span>` : '';
    const merged = p.merged && k === 3 ? `<div class="pd-tbl__merged">{{merged_label}}</div>` : '';
    return `<button type="button" class="${cls}" data-ui="table-${n}">${shapeIcon(shape, 32)}<div class="pd-tbl__txt"><div class="pd-tbl__name">{{table${n}}}</div>${merged}<div class="pd-tbl__badge">${badge}</div></div></button>`;
  }).join('');
  const msgEmpty = (txt, err) => `<div class="pd-empty${err ? ' pd-empty--err' : ''}">${i(err ? 'AlertTriangle' : 'Square', 32)}<span>${txt}</span></div>`;
  const bannerHtml = banner ? `<div class="pd-banner" data-ui="banner"><div class="pd-banner__main">${i('AlertTriangle', 20)}<span>{{warning}}</span></div><button type="button" class="u-btn u-btn--ghost pd-banner__x" aria-label="Dismiss">${i('X', 16)}</button></div>` : '';
  const roomsHtml = state === 'loading-rooms' ? `<div style="margin-bottom:24px">${spinner('{{loading_rooms}}')}</div>`
    : state === 'no-rooms' ? msgEmpty('{{no_rooms}}').replace('pd-empty', 'pd-empty pd-empty--rooms')
    : state === 'error' ? msgEmpty('{{error_rooms}}', true).replace('pd-empty', 'pd-empty pd-empty--rooms') : `<div class="pd-rooms" data-ui="rooms">${rooms}</div>`;
  const gridHtml = state === 'loading-tables' ? spinner('{{loading_tables}}')
    : state === 'no-tables' ? msgEmpty('{{no_tables}}')
    : state === 'error' ? msgEmpty('{{error_tables}}', true)
    : state === 'tables' ? `<div class="pd-tgrid" data-ui="tables">${tbl}</div>` : '';
  const inner = `<div class="pd-sel__head" data-ui="header"><h2 class="pd-sel__title">{{title}}</h2><button type="button" class="u-btn u-btn--ghost u-btn--icon" aria-label="Close" data-ui="close">${i('X', 20)}</button></div>
<div class="pd-sel__body">${bannerHtml}${roomsHtml}${gridHtml}</div>`;
  return dialog('pd-sel', inner, { close: false, ui: 'dialog' });
}

// ---- 3. TablePickerDialog / MultiSelectTableDialog / ConfirmDialog / UserPickerDialog ----
export function tableTransferDialog(p = {}) {
  const { kind = 'transfer' } = p;
  if (kind === 'unmerge') {
    return dialog('pd-dlg--md', `${header('{{unmerge_title}}', '{{unmerge_desc}}')}${footer('{{cancel}}', '{{unmerge_confirm}}', { confirmCls: 'u-btn--danger' })}`, { ui: 'dialog' });
  }
  if (kind === 'merge') {
    const { phase = 'select', sel = [] } = p;
    if (phase === 'merging') return dialog('pd-dlg--lg pd-dlg--scroll', `<div class="pd-phase pd-phase--merging" data-ui="phase">${i('Link2', 32)}<p>{{merging}}</p></div>`, { close: false, ui: 'dialog' });
    if (phase === 'done') return dialog('pd-dlg--lg pd-dlg--scroll', `<div class="pd-phase pd-phase--done" data-ui="phase">${i('Check', 32)}<p>{{merge_done}}</p></div>`, { ui: 'dialog' });
    const shapes = ['Rectangle', 'Circle', 'Square', 'Rectangle', 'Circle', 'Square'];
    const rows = shapes.map((sh, k) => `<button type="button" class="pd-mrow${sel.includes(k) ? ' is-sel' : ''}" data-ui="merge-table-${k + 1}">${cbox(sel.includes(k))}${shapeIcon(sh)}<div class="pd-mrow__txt"><p class="pd-mrow__name">{{mt${k + 1}_name}}</p><p class="pd-mrow__sub">{{mt${k + 1}_seats}}</p></div></button>`).join('');
    const body = p.empty ? `<p class="pd-note" style="text-align:center">{{merge_empty}}</p>` : `<div class="pd-mgrid">${rows}</div>`;
    const start = sel.length ? `<div class="pd-footer-start"><span class="u-badge u-badge--secondary" data-ui="selected-count">{{merge_selected}}</span></div>` : `<div class="pd-footer-start"></div>`;
    return dialog('pd-dlg--lg pd-dlg--scroll', `${header('{{merge_title}}', '{{merge_desc}}')}<div class="pd-mbody" data-ui="body">${body}</div>${footer('{{cancel}}', '{{merge_confirm}}', { confirmDisabled: !sel.length, start })}`, { ui: 'dialog' });
  }
  if (kind === 'captain') {
    const { sel = -1, state = 'list' } = p;
    const rows = [1, 2, 3].map((n, k) => `<button type="button" class="u-btn u-btn--ghost pd-opt${sel === k ? ' is-sel' : ''}" aria-pressed="${sel === k}" data-ui="captain-${n}"><div><p class="pd-opt__name">{{cap${n}_name}}</p><p class="pd-opt__sub">{{cap${n}_email}}</p></div></button>`).join('');
    const list = state === 'loading' ? `<div class="pd-center">${spinner('{{loading}}')}</div>` : state === 'error' ? `<p class="pd-note pd-note--err">{{transfer_failed}}</p>` : state === 'empty' ? `<p class="pd-note">{{no_captains}}</p>` : `<div class="pd-list pd-scroll64" data-ui="options">${rows}</div>`;
    const body = `<div class="pd-body"><label class="pd-label">{{current_captain}}</label>${input({ value: '{{captain_current}}', readonly: true, variant: 'search', cls: 'pd-input--mb4', ui: 'current' })}${input({ type: 'search', ph: '{{captain_search_ph}}', variant: 'search', cls: 'pd-input--mb3', ui: 'search' })}${list}</div>`;
    return dialog('pd-dlg--lg pd-dlg--scroll', `${header('{{captain_title}}', '{{captain_desc}}')}${body}${footer('{{cancel}}', '{{transfer_confirm}}', { confirmDisabled: sel < 0 })}`, { ui: 'dialog' });
  }
  // transfer (TablePickerDialog)
  const { sel = -1, state = 'list' } = p;
  const groups = [['room1', [1, 2]], ['room2', [3, 4]]];
  const shapes = ['Rectangle', 'Circle', 'Square', 'Rectangle'];
  const gh = groups.map(([room, ids]) => `<div><p class="pd-group__room">{{${room}}}</p><div class="pd-list">${ids.map((n) => `<button type="button" class="u-btn u-btn--ghost pd-opt${sel === n - 1 ? ' is-sel' : ''}" data-ui="dest-${n}">${shapeIcon(shapes[n - 1])}<div class="pd-opt__main"><p class="pd-opt__name">{{dt${n}_name}}</p><p class="pd-opt__sub">{{dt${n}_seats}}</p></div></button>`).join('')}</div></div>`).join('');
  const list = state === 'loading' ? `<div class="pd-center">${spinner('{{loading}}')}</div>` : state === 'empty' ? `<p class="pd-note">{{no_dest}}</p>` : `<div class="pd-group" data-ui="options">${gh}</div>`;
  const body = `<div class="pd-body"><label class="pd-label">{{current_table}}</label>${input({ value: '{{source_table}}', readonly: true, variant: 'search', cls: 'pd-input--mb4', ui: 'current' })}${input({ type: 'search', ph: '{{transfer_search_ph}}', variant: 'search', cls: 'pd-input--mb3', ui: 'search' })}${list}</div>${p.error ? `<p class="pd-err">{{transfer_failed}}</p>` : ''}`;
  return dialog('pd-dlg--lg pd-dlg--scroll', `${header('{{transfer_title}}', '{{transfer_desc}}')}${body}${footer('{{cancel}}', '{{transfer_confirm}}', { confirmDisabled: sel < 0 || state !== 'list' })}`, { ui: 'dialog' });
}

// ---- customer picker pieces (shared with the bill split dialog) ----
export function customerPickerWidget(p = {}) {
  const { value = false, list = false, status = '', hl = 0, withResults = true, ui = 'picker' } = p;
  if (value) return `<div class="pd-cp" data-ui="${ui}"><div class="pd-cp__value" data-ui="value"><div><p class="pd-cp__value-name">{{cust1_name}}</p><p class="pd-cp__value-phone">{{cust1_phone}}</p></div><button type="button" class="u-btn u-btn--ghost u-btn--sm" data-ui="change">{{change}}</button></div></div>`;
  let dd = '';
  if (list) {
    const st = status === 'searching' ? `<div class="pd-cp__status">${i('Loader', 16)}{{searching}}</div>` : status === 'error' ? `<div class="pd-cp__status pd-cp__status--err">{{failed_search}}</div>` : status === 'none' ? `<p class="pd-cp__empty">{{no_customers}}</p>` : '';
    const rows = status || !withResults ? '' : [1, 2, 3].map((n, k) => `<button type="button" class="u-btn u-btn--ghost pd-cp__item${hl === k ? ' is-hl' : ''}" data-ui="customer-${n}"><div class="pd-cp__item-txt"><div class="pd-cp__item-name">{{cust${n}_name}}</div><div class="pd-cp__item-phone">{{cust${n}_phone}}</div></div></button>`).join('');
    dd = `<div class="pd-cp__list" data-ui="dropdown">${st}${rows}<button type="button" class="u-btn u-btn--ghost pd-cp__add${hl === 3 ? ' is-hl' : ''}" data-ui="add-new">${i('UserPlus', 16)}{{add_new}}</button></div>`;
  }
  return `<div class="pd-cp" data-ui="${ui}"><div class="pd-cp__field">${input({ type: 'search', ph: '{{search_ph}}', value: p.query || '', variant: 'search', cls: 'pd-input--pe', focus: !!p.focus, ui: 'search' })}${i('ChevronDown', 16, 'pd-cp__chev')}${dd}</div></div>`;
}

export function createCustomerDialog(p = {}) {
  const { error = '', phoneError = '', creating = false } = p;
  const form = `<div class="pd-cp-form">${error ? `<div class="pd-cp-form__err" data-ui="error">${error}</div>` : ''}
<div><label class="pd-cp-form__label">{{name_label}}</label>${input({ value: '{{new_name}}', ui: 'name' })}</div>
<div><label class="pd-cp-form__label">{{phone_label}}</label><div class="pd-cp-form__phone">${input({ type: 'tel', value: '{{new_phone}}', cls: 'pd-input--ps', error: !!phoneError, ui: 'phone' })}${i('Phone', 20)}</div>${phoneError ? `<p class="pd-cp-form__perr" data-ui="phone-error">${phoneError}</p>` : ''}</div>
<div class="pd-cp-form__btns"><button type="submit" class="u-btn u-btn--default"${creating ? ' disabled' : ''} data-ui="submit" style="height:36px">${creating ? i('Loader', 16) + '{{adding}}' : '{{add_button}}'}</button>${btn('u-btn--outline', '{{cancel}}', { ui: 'cancel' })}</div></div>`;
  return dialog('pd-dlg--md', `<div class="u-dialog-header" data-ui="header"><h2 class="u-dialog-title">{{create_title}}</h2></div>${form}`, { ui: 'dialog' });
}

// ---- 4. BillSplitDialog ----
// p: {sel: {rowIdx: moveQty}, same, customer:'search'|'value'|none, error}
export function billSplitDialog(p = {}) {
  const { sel = {}, same = true, customer = 'search', error = false } = p;
  const rows = [1, 2, 3, 4].map((n, k) => {
    const on = sel[k] != null && sel[k] > 0; const qtyAvail = [1, 3, 1, 2][k];
    const mover = on && qtyAvail > 1 ? `<div class="pd-split-row__qty" data-ui="qty-mover"><span class="pd-split-row__qtylabel">{{move_qty}}</span><button type="button" class="u-btn u-btn--outline u-btn--icon pd-step"${sel[k] <= 0 ? ' disabled' : ''}>${i('Minus', 12)}</button><span class="pd-split-row__qtyval">${sel[k]}</span><button type="button" class="u-btn u-btn--outline u-btn--icon pd-step"${sel[k] >= qtyAvail ? ' disabled' : ''}>${i('Plus', 12)}</button></div>` : '';
    return `<div role="button" tabindex="0" class="pd-split-row${on ? ' is-sel' : ''}" data-ui="item-${n}"><div class="pd-split-row__in">${cbox(on, true)}<div class="pd-split-row__main"><div class="pd-split-row__top"><div><p class="pd-split-row__name">{{si${n}_name}}</p><p class="pd-split-row__avail">{{si${n}_avail}}</p></div><span class="pd-split-row__amt">${num('si' + n + '_amount')}</span></div>${mover}</div></div></div>`;
  }).join('');
  const cust = `<div class="pd-split-cust" data-ui="customer"><p>{{customer_for_new_bill}}</p><label><input type="checkbox"${same ? ' checked' : ''}>{{same_as_original}}</label>${same ? '' : customerPickerWidget(customer === 'value' ? { value: true, ui: 'customer-picker' } : { ui: 'customer-picker' }).replace('class="pd-cp"', 'class="pd-cp" style="width:auto"')}</div>`;
  const totals = `<div class="pd-split-totals" data-ui="totals"><div><p>{{stays_on_bill}}</p><p>${num('stays_total')}</p></div><div><p>{{moves_to_new_bill}}</p><p class="is-move-val">${num('moves_total')}</p></div></div>`;
  const hasSel = Object.values(sel).some((q) => q > 0);
  return dialog('pd-dlg--lg pd-dlg--scroll', `${header('{{split_title}}', '{{split_desc}}')}<div class="pd-split-items" data-ui="items">${rows}</div>${cust}${totals}${error ? `<p class="pd-err" data-ui="error">{{cannot_move_all}}</p>` : ''}${footer('{{cancel}}', '{{split_confirm}}', { confirmDisabled: !hasSel })}`, { ui: 'dialog' });
}

// ---- 5. BillMergeDialog ----
// p: {sel, state:'list'|'loading'|'empty'|'error', more}
export function billMergeDialog(p = {}) {
  const { sel = -1, state = 'list', more = true, error = false } = p;
  const rows = [1, 2, 3, 4, 5, 6].map((n, k) => `<button type="button" class="pd-bm__row${sel === k ? ' is-sel' : ''}" data-ui="bill-${n}"><div class="pd-bm__row-txt"><p class="pd-bm__row-name">{{mb${n}_name}}</p><p class="pd-bm__row-sub">{{mb${n}_sub}}</p></div><span class="pd-bm__row-amt">${num('mb' + n + '_amount')}</span></button>`).join('');
  const list = state === 'loading' ? `<div class="pd-center">${spinner('{{loading}}')}</div>`
    : state === 'error' ? `<p class="pd-note pd-note--err">{{merge_failed}}</p>`
    : state === 'empty' ? `<p class="pd-note">{{no_candidates}}</p>`
    : `<div class="pd-bm__rows" data-ui="bills">${rows}${more ? `<div class="pd-bm__more">${btn('u-btn--outline', '{{load_more}}', { ui: 'load-more' })}</div>` : ''}</div>`;
  return dialog('pd-dlg--2xl pd-bm', `${header('{{merge_title}}', '{{merge_desc}}')}<div class="pd-bm__search"><input type="search" placeholder="{{search_orders_ph}}" value="" data-ui="search"></div><div class="pd-bm__list" data-ui="list">${list}</div>${error ? `<p class="pd-err" data-ui="error">{{merge_failed}}</p>` : ''}${footer('{{cancel}}', '{{merge_confirm}}', { confirmDisabled: sel < 0 || state === 'loading' })}`, { ui: 'dialog' });
}

// ---- 7. CommentDialog ----
export function commentDialog(p = {}) {
  const { focus = false, filled = false } = p;
  return dialog('pd-dlg--md', `<div class="u-dialog-header" data-ui="header"><h2 class="u-dialog-title pd-comment__title">${i('MessageSquare', 20)}{{title}}</h2></div>
<div class="pd-comment__body"><label class="pd-label" style="margin-bottom:8px">{{label}}</label>${textarea({ ph: '{{placeholder}}', value: filled ? '{{comment_text}}' : '', focus, ui: 'textarea' })}</div>
${footer('{{cancel}}', '{{save}}')}`, { ui: 'dialog' });
}
