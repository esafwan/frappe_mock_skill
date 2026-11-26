// Dialogs opened from the view pages (kanban, calendar, gantt, tree, image, map, inbox): Quick Entry ("Add a card",
// calendar slot click), Filter, Sort By and Pick Columns. Built on renderers/dialog.mjs and the existing overlay path:
// any view page declares `{ "type": "dialog", "kind": ... }` overlays and bin/mock.mjs claims them through ctx.preDialogs.
// Generic: every name comes from meta / overlays. Pure functions return html strings.
import { renderDialog } from '../dialog.mjs';
import { renderQuickEntry } from '../quick-entry.mjs';
import { pickColumnsDialog } from '../report/dialogs.mjs';

const t = (v) => v === 1 || v === true || v === '1';
const NO_COL = new Set(['Section Break', 'Column Break', 'Tab Break', 'HTML', 'Table', 'Table MultiSelect', 'Button', 'Image', 'Fold', 'Heading']);
const lbl = (f) => f.label || String(f.fieldname || '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const cols = (meta = {}) => (meta.fields || []).filter((f) => f.fieldname && !NO_COL.has(f.fieldtype) && !t(f.hidden));
const OPS = ['=', '!=', 'like', 'not like', 'in', 'not in', '>', '<', '>=', '<=', 'between', 'is'];

export const VIEW_DIALOG_KINDS = ['quick_entry', 'view_filter', 'view_sort', 'pick_columns'];

/** Filter dialog: one Field / Condition / Value row per filter ([field, op, value] or {fieldname, operator, value}) plus an empty row. */
export function viewFilterDialog(meta = {}, o = {}) {
  const list = (o.filters || o.items || []).map((f) => (Array.isArray(f) ? { fieldname: f[0], operator: f[1], value: f[2] } : f));
  const rows = [...list, { fieldname: '', operator: '=', value: '' }];
  const fieldOpts = ['', ...cols(meta).map((f) => f.fieldname)].join('\n');
  const fields = []; const values = {};
  rows.forEach((r, i) => {
    fields.push({ fieldname: `f${i}_field`, fieldtype: 'Select', label: i === 0 ? 'Field' : ' ', options: fieldOpts });
    fields.push({ fieldname: `f${i}_cb1`, fieldtype: 'Column Break' });
    fields.push({ fieldname: `f${i}_op`, fieldtype: 'Select', label: i === 0 ? 'Condition' : ' ', options: OPS.join('\n') });
    fields.push({ fieldname: `f${i}_cb2`, fieldtype: 'Column Break' });
    fields.push({ fieldname: `f${i}_value`, fieldtype: 'Data', label: i === 0 ? 'Value' : ' ' });
    if (i < rows.length - 1) fields.push({ fieldname: `f${i}_sb`, fieldtype: 'Section Break' });
    values[`f${i}_field`] = r.fieldname || ''; values[`f${i}_op`] = r.operator || '='; values[`f${i}_value`] = r.value ?? '';
  });
  return renderDialog({ kind: 'view_filter', title: o.title || 'Filter', size: o.size || 'large', primary_action: o.primary_action || 'Apply Filters', secondary_action: o.secondary_action ?? 'Clear Filters', fields, values }, o.n || 0, o.kit);
}

/** Sort By dialog: field and direction. */
export function viewSortDialog(meta = {}, o = {}) {
  const sortable = ['modified', 'creation', 'name', ...cols(meta).map((f) => f.fieldname)].filter((v, i, a) => a.indexOf(v) === i);
  const fields = [
    { fieldname: 'sort_by', fieldtype: 'Select', label: 'Sort By', options: sortable.join('\n') },
    { fieldname: 'sort_order', fieldtype: 'Select', label: 'Order', options: 'Descending\nAscending' },
  ];
  const v = o.values || {};
  return renderDialog({ kind: 'view_sort', title: o.title || 'Sort By', size: o.size || 'small', primary_action: o.primary_action || 'Apply', secondary_action: o.secondary_action, fields,
    values: { sort_by: v.sort_by ?? o.sort_by ?? 'modified', sort_order: v.sort_order ?? (String(o.sort_order || 'desc').toLowerCase().startsWith('asc') ? 'Ascending' : 'Descending') } }, o.n || 0, o.kit);
}

const KINDS = {
  quick_entry: (meta, o) => renderQuickEntry(meta, o, o.n || 0, o.kit),
  view_filter: viewFilterDialog,
  view_sort: viewSortDialog,
  pick_columns: (meta, o) => pickColumnsDialog(meta, { ...o, available: o.available || cols(meta).map((f) => ({ fieldname: f.fieldname, label: lbl(f), default: t(f.in_list_view) ? 1 : 0 })) }),
};

/**
 * Claim the dialog overlays a view page can open. Returns [{ overlay, html }] for ctx.preDialogs.
 * A quick_entry overlay without `doctype` opens the page's own DocType; one with `doctype` is left to the generic path.
 */
export function renderViewDialogs({ meta = {}, ctx, n0 = 0 } = {}) {
  const out = [];
  if (!ctx?.useOverlays || !meta) return out;
  let n = n0;
  for (const o of ctx.useOverlays('dialog', (x) => VIEW_DIALOG_KINDS.includes(x.kind) && !(x.kind === 'quick_entry' && x.doctype))) {
    const { kind, ...rest } = o;
    out.push({ overlay: o, html: KINDS[kind](meta, { ...rest, n: n++, kit: ctx.dialogKit }) });
  }
  return out;
}
export default renderViewDialogs;
