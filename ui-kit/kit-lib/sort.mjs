// Sort selector (T-L2). Port of frappe.ui.SortSelector. Pure, deterministic, generic.
import { esc } from './util.mjs';
import { icon } from './icons.mjs';

const NO_VALUE = new Set(['Section Break', 'Column Break', 'Tab Break', 'Fold', 'HTML', 'Heading', 'Button', 'Table', 'Table MultiSelect', 'Image', 'Geolocation', 'Password', 'Signature', 'Long Text', 'Text', 'Small Text', 'Text Editor', 'HTML Editor', 'Markdown Editor', 'Code', 'JSON', 'Attach', 'Attach Image']);

/** Options [{fieldname, label}] for a DocType: sortable fields first, then the standard three. */
export function sortOptions(meta = {}, { extra = [] } = {}) {
  const out = []; const seen = new Set();
  const add = (fieldname, label) => { if (fieldname && !seen.has(fieldname)) { seen.add(fieldname); out.push({ fieldname, label }); } };
  for (const f of meta.fields || []) {
    if (!f.fieldname || NO_VALUE.has(f.fieldtype) || f.hidden || f.is_virtual) continue;
    if (f.reqd || f.search_index || f.in_list_view || f.in_standard_filter) add(f.fieldname, f.label || f.fieldname);
  }
  for (const e of extra) add(e.fieldname ?? e, e.label ?? e.fieldname ?? e);
  add('modified', 'Last Updated On');
  add('creation', 'Created On');
  add('name', 'ID');
  return out;
}

/** Current sort from spec.view.sort, else the DocType's sort_field/sort_order, else modified desc. */
export function currentSort(meta = {}, view = {}) {
  const v = view.sort || {};
  const field = v.field || meta.sort_field || 'modified';
  const order = String(v.order || meta.sort_order || 'desc').toLowerCase() === 'asc' ? 'asc' : 'desc';
  return { field, order };
}

export const sortLabel = (opts, field) => (opts.find((o) => o.fieldname === field)?.label) || field;

/**
 * renderSort({ meta, sort:{field,order}, options?, open?, items?, highlight? }) -> `.sort-selector` markup.
 * `items` (strings or {label,value}) replaces the generated dropdown options.
 */
export function renderSort({ meta = {}, sort, options, open = false, items, highlight } = {}) {
  const opts = options || sortOptions(meta);
  const cur = sort || currentSort(meta);
  const list = items ? items.map((i) => (typeof i === 'string' ? { fieldname: i, label: i } : { fieldname: i.value ?? i.fieldname ?? i.label, label: i.label })) : opts;
  const lis = list.map((o, i) => `<li><a class="dropdown-item option${o.fieldname === cur.field ? ' selected' : ''}${highlight === i ? ' highlighted' : ''}" data-value="${esc(o.fieldname)}" data-ui="list.sort.option.${esc(o.fieldname)}">${esc(o.label)}</a></li>`).join('');
  const ico = cur.order === 'desc' ? 'arrow-down-wide-narrow' : 'arrow-up-narrow-wide';
  return `<div class="sort-selector" data-ui="list.sort"><div class="btn-group${open ? ' show' : ''}">`
    + `<button class="btn btn-default btn-sm btn-order" data-value="${cur.order}" title="${cur.order === 'desc' ? 'descending' : 'ascending'}" data-ui="list.sort.order"><span class="sort-order">${icon(ico)}</span></button>`
    + `<button type="button" class="btn btn-default btn-sm sort-selector-button text-nowrap" data-toggle="dropdown" aria-haspopup="true" aria-expanded="${open}" data-ui="list.sort.field"><span class="dropdown-text hidden-sm">${esc(sortLabel(opts, cur.field))}</span><span>${icon('chevron-down')}</span></button>`
    + `<ul class="dropdown-menu dropdown-menu-right${open ? ' show' : ''}" data-ui="list.sort.menu">${lis}</ul></div></div>`;
}
