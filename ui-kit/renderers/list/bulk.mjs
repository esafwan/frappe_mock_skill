// List bulk selection (T-L5): "N items selected" bar, bulk Actions menu, row action button/dropdown.
// Generic: labels come from meta/spec/ctx only. Pure functions, deterministic.
import { esc } from '../../kit-lib/util.mjs';
import { button } from '../../kit-lib/buttons.mjs';
import { menuList, listPerm, toMenuItems } from './head.mjs';

const t = (v) => v === 1 || v === true || v === '1';

/** "N item(s) selected" text; empty when n is 0. */
export const selectedLabel = (n) => (n > 0 ? `${n} item${n === 1 ? '' : 's'} selected` : '');

/**
 * Bulk Actions items in v16 order, filtered by perms/workflow/submittable.
 * Edit, Export, Assign To, Apply Assignment Rule, Add Tags, Print, Delete, Submit/Cancel (submittable, no workflow).
 * `ctx.bulk_actions` or spec.view.bulk_actions (array of labels/objects) replaces the defaults.
 */
export function bulkActionItems(spec = {}, meta = {}, ctx = {}) {
  const custom = spec.view?.bulk_actions || ctx.bulk_actions;
  if (Array.isArray(custom)) return toMenuItems(custom);
  const wf = !!meta.workflow || !!spec.meta?.workflow;
  const sub = t(meta.is_submittable);
  const allowEdit = t(spec.meta?.list_view_settings?.allow_edit);
  const items = ['Copy to Clipboard'];
  if (!wf || allowEdit) items.push('Edit');
  if (listPerm(ctx, meta, 'export')) items.push('Export');
  items.push('Assign To', 'Clear Assignment', 'Apply Assignment Rule', 'Add Tags');
  if (listPerm(ctx, meta, 'print') && !t(meta.hide_print)) items.push('Print');
  if (sub && !wf && listPerm(ctx, meta, 'submit')) items.push('Submit');
  if (sub && !wf && listPerm(ctx, meta, 'cancel')) items.push('Cancel');
  if (listPerm(ctx, meta, 'delete') && (!wf || allowEdit)) items.push('Delete');
  return toMenuItems(items).map((i) => (i.label === 'Delete' ? { ...i, danger: false } : i));
}

/** The selection bar shown in place of the column header: checkbox + "N items selected". */
export function renderBulkBar(n, { showCheck = true } = {}) {
  const cb = showCheck ? `<span class="level-item select-like"><input class="list-header-checkbox list-check-all" type="checkbox" title="Select All"${n ? ' checked' : ''}></span>` : '';
  return `<div class="level-left checkbox-actions"${n ? ' style="display:flex"' : ''} data-ui="list.bulk-bar"><div class="level list-subject">${cb}<span class="level-item list-header-meta" dir="auto" data-ui="list.bulk-count">${esc(selectedLabel(n))}</span></div></div>`;
}

/** The page-head "Actions" dropdown group. */
export function renderBulkActions(items, { open = false, highlight } = {}) {
  return `<div class="btn-group actions-btn-group${open ? ' show' : ''}">${button('Actions', { caret: true, ui: 'page.actions' })}${menuList(items, { open, highlight, ui: 'list.actions-menu' })}</div>`;
}

/** Row action: a single button ({b}) or a dropdown ({g:{label,items}}). `open` shows the menu. */
export function renderRowAction(n, action, { open = false } = {}) {
  if (action.b) return `<button class="btn btn-action btn-default btn-xs" data-ui="list.row.${n}.action.${esc(action.b.label)}">${esc(action.b.label)}</button>`;
  const items = toMenuItems(action.g.items || []);
  return `<div class="btn-group dropdown-button${open ? ' show' : ''}"><button class="btn btn-action btn-default btn-xs dropdown-toggle" data-toggle="dropdown" aria-expanded="${!!open}" data-ui="list.row.${n}.actions">${esc(action.g.label)}</button>${menuList(items, { open, ui: `list.row.${n}.actions-menu` })}</div>`;
}

/** Everything at once: { bar, actions, items } for a selection count. */
export function renderBulk(spec, meta, ctx, { selected = 0, open = false, highlight } = {}) {
  const items = bulkActionItems(spec, meta, ctx);
  return { items, bar: renderBulkBar(selected, { showCheck: ctx.desk_settings?.bulk_actions !== false }), actions: selected > 0 || open ? renderBulkActions(items, { open, highlight }) : '' };
}
