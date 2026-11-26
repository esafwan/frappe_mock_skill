// List dialogs (T-L7): List Settings (fields picker, Reset Fields), Customize Quick Filters, Save view as, saved views dropdown.
// Generic: every name comes from meta / overlays. Pure functions return html strings; renderListDialogs() claims overlays.
// Dialog overlays are recognised by `kind` (list_settings | quick_filters | save_view) or, while the schema enum is
// closed, by a matching title ("<X> Settings", "Customize Quick Filters", "Save View ..."). Output uses the same modal chrome as kit-lib/draw.mjs.
import { renderDialog } from '../dialog.mjs';
import { esc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { menuList, toMenuItems, dtName } from './head.mjs';

const DLG_W = { small: 380, default: 520, large: 720, 'extra-large': 940 };
const t = (v) => v === 1 || v === true || v === '1';
const NO_LIST = new Set(['Section Break', 'Column Break', 'Tab Break', 'HTML', 'Table', 'Table MultiSelect', 'Button', 'Image', 'Fold', 'Heading', 'Text Editor', 'Code', 'Markdown Editor', 'HTML Editor', 'Signature', 'Geolocation', 'Password']);
const lbl = (f) => f.label || String(f.fieldname || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/** Fields that can appear as list columns, in meta order. */
export function listableFields(meta = {}) { return (meta.fields || []).filter((f) => f.fieldname && !NO_LIST.has(f.fieldtype) && !t(f.hidden)); }
/** Default Fields-picker content: in_list_view fields (the "Reset Fields" target). */
export function defaultListFields(meta = {}) { return listableFields(meta).filter((f) => t(f.in_list_view)); }

function frame({ title, size = 'default', kind, n = 0, body, primary, secondary, extra = '' }) {
  const btn = (a, st, id) => (a ? `<button type="button" class="btn btn-sm ${st === 'primary' ? 'btn-primary' : 'btn-default'}" data-ui="dialog.${n}.${id}">${esc(typeof a === 'string' ? a : a.label)}</button>` : '');
  const foot = [btn(secondary, 'default', 'secondary'), btn(primary, 'primary', 'primary')].filter(Boolean).join('');
  return `<div class="modal-dialog modal-${esc(size)}" style="--dlg-w:${DLG_W[size] || DLG_W.default}px" role="document" data-ui="dialog.${n}" data-dialog-kind="${esc(kind)}"${extra}><div class="modal-content"><div class="modal-header"><h4 class="modal-title">${esc(title)}</h4></div><div class="modal-body">${body}</div>${foot ? `<div class="modal-footer">${foot}</div>` : ''}</div></div>`;
}
const checkCtl = (name, label, on, help) => `<div class="frappe-control" data-fieldtype="Check" data-fieldname="${esc(name)}"><div class="form-group"><div class="checkbox"><label><span class="input-area"><input type="checkbox" class="input-with-feedback" data-fieldname="${esc(name)}"${on ? ' checked' : ''}></span><span class="label-area">${esc(label)}</span></label>${help ? `<p class="help-box small text-muted">${esc(help)}</p>` : ''}</div></div></div>`;
const section = (label, inner, ui) => `<div class="form-section" data-ui="${esc(ui)}">${label ? `<div class="section-head">${esc(label)}</div>` : ''}<div class="section-body">${inner}</div></div>`;

/** Fields picker: ordered, draggable rows with remove buttons plus "Add/Remove Fields" and "Reset Fields". */
export function fieldsPicker(fields = [], { ui = 'list-settings.fields' } = {}) {
  const rows = fields.map((f, i) => `<div class="control-input flex align-center form-control fields_order sortable-handle sortable" data-fieldname="${esc(f.fieldname)}" data-ui="${ui}.${i}"><div class="sortable-handle drag-handle" data-ui="${ui}.${i}.drag">${icon('grip-vertical')}</div><div class="fields_order-label ml-2">${esc(lbl(f))}</div><div class="ml-auto remove-field" data-ui="${ui}.${i}.remove">${icon('close')}</div></div>`).join('');
  return `<div class="fields_order-list" data-ui="${ui}">${rows || '<div class="text-muted small p-2">No fields selected</div>'}</div>`
    + `<div class="fields-picker-actions flex"><button type="button" class="btn btn-xs btn-default add-remove-fields" data-ui="${ui}.add">Add/Remove Fields</button><button type="button" class="btn btn-xs btn-default reset-fields" data-ui="${ui}.reset">Reset Fields</button></div>`;
}

/** "<DocType> Settings" list settings dialog. opts: {fields (selected, default in_list_view), values:{disable_count,...}, n, size, title} */
export function listSettingsDialog(meta = {}, opts = {}) {
  const v = opts.values || {};
  const fields = opts.fields || defaultListFields(meta);
  if (opts.kit) { // real field renderers: Check controls, then the fields picker in an HTML field
    return renderDialog({ kind: 'list_settings', title: opts.title || `${dtName(meta)} Settings`, size: opts.size, primary_action: opts.primary_action || 'Update', secondary_action: opts.secondary_action,
      fields: [{ fieldname: 'disable_count', fieldtype: 'Check', label: 'Disable Count' }, { fieldname: 'disable_comment_count', fieldtype: 'Check', label: 'Disable Comment Count' }, { fieldname: 'disable_auto_refresh', fieldtype: 'Check', label: 'Disable Auto Refresh' },
        { fieldname: 'fields_sb', fieldtype: 'Section Break', label: 'Fields' }, { fieldname: 'fields_html', fieldtype: 'HTML', options: fieldsPicker(fields) }],
      values: { disable_count: t(v.disable_count) ? 1 : 0, disable_comment_count: t(v.disable_comment_count) ? 1 : 0, disable_auto_refresh: t(v.disable_auto_refresh) ? 1 : 0 } }, opts.n || 0, opts.kit);
  }
  const body = section('', checkCtl('disable_count', 'Disable Count', t(v.disable_count)) + checkCtl('disable_comment_count', 'Disable Comment Count', t(v.disable_comment_count)) + checkCtl('disable_auto_refresh', 'Disable Auto Refresh', t(v.disable_auto_refresh)), 'list-settings.general')
    + section('Fields', fieldsPicker(fields), 'list-settings.fields-section');
  return frame({ title: opts.title || `${dtName(meta)} Settings`, size: opts.size, kind: 'list_settings', n: opts.n, body, primary: opts.primary_action || 'Update', secondary: opts.secondary_action });
}

/** Customize Quick Filters: chosen fields shown as removable chips, with the add control. */
export function quickFiltersDialog(meta = {}, opts = {}) {
  const sel = opts.fields || (meta.fields || []).filter((f) => t(f.in_standard_filter));
  const chips = sel.map((f, i) => `<span class="quick-filter-chip" data-fieldname="${esc(f.fieldname)}" data-ui="quick-filters.${i}">${esc(lbl(f))}<span class="remove-chip" data-ui="quick-filters.${i}.remove">${icon('close')}</span></span>`).join('');
  if (opts.kit) {
    const chipsHtml = `<div class="control-input flex flex-wrap form-control" data-ui="quick-filters">${chips}<input type="text" class="chip-input" placeholder="Add a field" data-ui="quick-filters.input"></div>`;
    return renderDialog({ kind: 'quick_filters', title: opts.title || 'Customize Quick Filters', size: opts.size, primary_action: opts.primary_action || 'Save', secondary_action: opts.secondary_action,
      fields: [{ fieldname: 'quick_filters_label', fieldtype: 'HTML', options: `<div class="control-label">Quick Filters</div>${chipsHtml}` }, { fieldname: 'quick_filters_help', fieldtype: 'HTML', options: '<p class="help-box small text-muted">Fields shown in the filter bar above the list</p>' }] }, opts.n || 0, opts.kit);
  }
  const body = `<div class="frappe-control" data-fieldtype="MultiSelect" data-fieldname="quick_filters"><div class="form-group"><div class="control-label">Quick Filters</div><div class="control-input flex flex-wrap form-control" data-ui="quick-filters">${chips}<input type="text" class="chip-input" placeholder="Add a field" data-ui="quick-filters.input"></div><p class="help-box small text-muted">Fields shown in the filter bar above the list</p></div></div>`;
  return frame({ title: opts.title || 'Customize Quick Filters', size: opts.size, kind: 'quick_filters', n: opts.n, body, primary: opts.primary_action || 'Save', secondary: opts.secondary_action });
}

/** Save view as: name + "Share with everyone" and the filters/columns being captured. */
export function saveViewDialog(meta = {}, opts = {}) {
  const v = opts.values || {};
  if (opts.kit) {
    return renderDialog({ kind: 'save_view', title: opts.title || 'Save View', size: opts.size || 'small', primary_action: opts.primary_action || 'Save', secondary_action: opts.secondary_action,
      fields: [{ fieldname: 'view_name', fieldtype: 'Data', label: 'View Name', reqd: 1, placeholder: `e.g. My open ${dtName(meta)}` }, { fieldname: 'public', fieldtype: 'Check', label: 'Share with everyone' }, ...(opts.summary ? [{ fieldname: 'summary', fieldtype: 'HTML', options: `<p class="help-box small text-muted" data-ui="save-view.summary">${esc(opts.summary)}</p>` }] : [])],
      values: { view_name: v.view_name || '', public: t(v.public) ? 1 : 0 } }, opts.n || 0, opts.kit);
  }
  const name = `<div class="frappe-control" data-fieldtype="Data" data-fieldname="view_name"><div class="form-group"><div class="control-label reqd">View Name</div><div class="control-input"><input type="text" class="input-with-feedback form-control" data-fieldname="view_name" value="${esc(v.view_name || '')}" placeholder="e.g. My open ${esc(dtName(meta))}" data-ui="save-view.name"></div></div></div>`;
  const summary = opts.summary ? `<p class="help-box small text-muted" data-ui="save-view.summary">${esc(opts.summary)}</p>` : '';
  const body = name + checkCtl('public', 'Share with everyone', t(v.public)) + summary;
  return frame({ title: opts.title || 'Save View', size: opts.size || 'small', kind: 'save_view', n: opts.n, body, primary: opts.primary_action || 'Save', secondary: opts.secondary_action });
}

/** Saved views dropdown. views: [string | {label, default?, shared?}]; current marks the active one. */
export function savedViewsMenu(views = [], { current, open = true, ui = 'list.saved-views', allowSave = true } = {}) {
  const items = toMenuItems(views).map((v) => (v.divider ? v : { ...v, checked: v.checked || (current != null && v.label === current), icon: undefined }));
  if (allowSave) items.push(...(items.length ? [{ divider: true }] : []), { label: 'Save View as...', icon: 'plus' });
  return menuList(items, { open, ui, right: false, extraCls: 'saved-views-menu' });
}

const KINDS = { list_settings: listSettingsDialog, quick_filters: quickFiltersDialog, save_view: saveViewDialog };
function kindOf(o, meta) {
  if (KINDS[o.kind]) return o.kind;
  const ti = String(o.title || '').toLowerCase();
  if (ti === `${dtName(meta).toLowerCase()} settings` || /\blist settings\b/.test(ti)) return 'list_settings';
  if (/quick filters/.test(ti)) return 'quick_filters';
  if (/^save (view|filters?|list view)\b/.test(ti)) return 'save_view';
  return null;
}
const pick = (o, meta) => (o.fields?.length ? o.fields.map((f) => (typeof f === 'string' ? (meta.fields || []).find((m) => m.fieldname === f) || { fieldname: f } : f)) : undefined);

/**
 * Claim list-dialog overlays and the saved-views menu. Returns { dialogs: [{overlay, html}], viewsMenu: html|null }.
 * Dialog html is for the modal layer (index/draw wraps it); `n0` is the first data-ui index.
 */
export function renderListDialogs({ spec = {}, meta = {}, ctx, n0 = 0 } = {}) {
  const out = { dialogs: [], viewsMenu: null };
  if (!ctx?.useOverlays) return out;
  let n = n0;
  const mine = ctx.useOverlays('dialog', (o) => !!kindOf(o, meta));
  for (const o of mine) {
    const k = kindOf(o, meta);
    out.dialogs.push({ overlay: o, html: KINDS[k](meta, { title: o.title, size: o.size, fields: pick(o, meta), values: o.values, primary_action: o.primary_action, secondary_action: o.secondary_action, n: n++, kit: ctx.dialogKit }) });
  }
  const m = ctx.useOverlays('menu_open', (o) => o.target === 'page.views' || o.target === 'saved_views')[0];
  if (m) out.viewsMenu = savedViewsMenu(m.items || spec.view?.saved_views || [], { current: m.current ?? spec.view?.current_saved_view });
  return out;
}
export default renderListDialogs;
