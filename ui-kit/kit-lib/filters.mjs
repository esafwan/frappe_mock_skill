// Filter bar (T-L2): standard filter boxes, filter button, popover, chips, group-by buttons.
// Port of base_list.js setup_filter_area / FilterArea (V16-FACTS section 4). Pure, deterministic, generic.
import { esc } from './util.mjs';
import { icon } from './icons.mjs';

export const OP_LABELS = {
  '=': 'Equals', '!=': 'Not Equals', '>': 'Greater Than', '<': 'Less Than', '>=': 'Greater Than Or Equal To', '<=': 'Less Than Or Equal To',
  like: 'Like', 'not like': 'Not Like', in: 'In', 'not in': 'Not In', is: 'Is', between: 'Between', timespan: 'Timespan',
  'descendants of': 'Descendants Of', 'descendants of (inclusive)': 'Descendants Of (inclusive)', 'not descendants of': 'Not Descendants Of',
  'ancestors of': 'Ancestors Of', 'not ancestors of': 'Not Ancestors Of',
};

const TEXTY = new Set(['Data', 'Text', 'Small Text', 'Long Text', 'Text Editor', 'HTML Editor', 'Markdown Editor', 'Code', 'Phone', 'Autocomplete', 'Read Only', 'JSON', 'Barcode']);
const NOT_VALUE = new Set(['Section Break', 'Column Break', 'Tab Break', 'Fold', 'HTML', 'Heading', 'Button', 'Table', 'Table MultiSelect', 'Image', 'Password', 'Signature', 'Geolocation', 'Attach', 'Attach Image']);
const t = (v) => v === 1 || v === true || v === '1';

/** Filter tuples -> [{doctype, fieldname, op, value, label}]. Accepts [f,op,v] and [dt,f,op,v]. */
export function normalizeFilters(items = [], meta = {}) {
  const dt = meta.name || meta.doctype || '';
  const label = (f) => (meta.fields || []).find((x) => x.fieldname === f)?.label || (f === 'name' ? 'ID' : f);
  return (items || []).map((it) => {
    const a = Array.isArray(it) ? it : [it.fieldname, it.op || it.operator || '=', it.value];
    const four = a.length >= 4;
    const [doctype, fieldname, op, value] = four ? a : [dt, a[0], a[1], a[2]];
    return { doctype, fieldname, op: String(op || '=').toLowerCase(), value, label: label(fieldname) };
  });
}

export function formatFilterValue(v) {
  if (Array.isArray(v)) return v.map(String).join(', ');
  if (v === null || v === undefined || v === '') return '';
  if (v === true) return 'Yes';
  if (v === false) return 'No';
  return String(v);
}

/** Standard filter fields in render order: ID box, title field, then in_standard_filter value fields. */
export function standardFilterFields(meta = {}, { hideNameFilter = false, extra = [] } = {}) {
  const out = [];
  const seen = new Set();
  const push = (f) => { if (!seen.has(f.fieldname)) { seen.add(f.fieldname); out.push(f); } };
  if (!hideNameFilter) push({ fieldname: 'name', fieldtype: 'Data', label: 'ID', _id: true });
  const wanted = new Set(extra);
  for (const f of meta.fields || []) {
    if (!f.fieldname || NOT_VALUE.has(f.fieldtype) || f.hidden || f.is_virtual) continue;
    if (f.fieldname === meta.title_field || t(f.in_standard_filter) || wanted.has(f.fieldname)) push(f);
  }
  return out;
}

function filterBox(f, applied, i) {
  const ft = f.fieldtype;
  const hit = applied.find((a) => a.fieldname === f.fieldname && (a.op === '=' || a.op === 'like'));
  const val = hit ? formatFilterValue(hit.value).replace(/^%|%$/g, '') : '';
  const cls = `form-group frappe-control input-max-width col-md-2`;
  const ui = `list.standard-filter.${esc(f.fieldname)}`;
  const label = f.label || f.fieldname;
  let ctl;
  if (ft === 'Link') {
    ctl = `<div class="link-field ui-front" style="position: relative;"><div class="awesomplete"><input type="text" class="input-with-feedback form-control input-xs" maxlength="140" data-fieldtype="Link" data-fieldname="${esc(f.fieldname)}" placeholder="${esc(label)}" data-target="${esc(f.options || '')}" autocomplete="off" aria-expanded="false" role="combobox" value="${esc(val)}" data-ui="${ui}.input"><ul hidden="" role="listbox"></ul></div></div>`;
  } else if (ft === 'Select' || ft === 'Check') {
    const opts = ft === 'Check' ? ['', 'Yes', 'No'] : ['', ...String(f.options || '').split('\n').map((s) => s.trim()).filter(Boolean)];
    const sel = ft === 'Check' && hit ? (Number(hit.value) ? 'Yes' : 'No') : val;
    ctl = `<select class="input-with-feedback form-control input-xs" data-fieldtype="${ft}" data-fieldname="${esc(f.fieldname)}" placeholder="${esc(label)}" data-ui="${ui}.input">${opts.map((o) => `<option value="${esc(o)}"${o === sel ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
  } else {
    const dataFt = TEXTY.has(ft) || ft === 'Data' ? 'Data' : ft;
    const like = dataFt === 'Data';
    const match = like ? `<div class="input-group-btn mr-0"><button type="button" class="btn btn-default match-type-dropdown-btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-ui="${ui}.match">${icon('equal-approximately')}</button><ul class="dropdown-menu match-type-dropdown-menu dropdown-menu-right"><li class="dropdown-item" data-match-type="=">Equals</li><li class="dropdown-item" data-match-type="like">Like</li></ul></div>` : '';
    ctl = `<div class="input-group"><input type="text" autocomplete="off" class="input-with-feedback form-control input-xs" maxlength="140" data-fieldtype="${esc(dataFt)}" data-fieldname="${esc(f.fieldname)}" placeholder="${esc(label)}" value="${esc(val)}" data-ui="${ui}.input">${match}</div>`;
  }
  return `<div class="${cls}" data-fieldtype="${esc(ft === 'Check' ? 'Select' : TEXTY.has(ft) ? 'Data' : ft)}" data-fieldname="${esc(f.fieldname)}" data-ui="${ui}" data-idx="${i}">${ctl}<span class="tooltip-content">${esc(f.fieldname)}</span></div>`;
}

const GROUP_BY_LABEL = { assigned_to: 'Assigned To', owner: 'Created By', tags: 'Tags' };
export const GROUP_BY_BUTTONS = Object.keys(GROUP_BY_LABEL);

/** Group-by buttons (only assigned_to, owner, tags render as buttons in v16). */
export function renderGroupByButtons(fields = [], { open } = {}) {
  return fields.filter((g) => GROUP_BY_LABEL[g]).map((g) =>
    `<div class="group-by-field list-link${open === g ? ' show' : ''}" data-fieldname="${g}" data-label="${GROUP_BY_LABEL[g]}" data-ui="list.group-by.${g}"><a class="btn btn-default btn-sm list-sidebar-button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="${open === g}"><span class="button-label">${GROUP_BY_LABEL[g]}</span>${icon('chevrons-up-down')}</a></div>`).join('');
}

/**
 * renderStandardFilters({ meta, filters, groupBy, hideNameFilter, extra }) -> `.standard-filter-section`.
 * Boxes reflect applied "=" / "like" filters on the same field.
 */
export function renderStandardFilters({ meta = {}, filters = [], groupBy = [], hideNameFilter = false, extra = [] } = {}) {
  const applied = normalizeFilters(filters, meta);
  const boxes = standardFilterFields(meta, { hideNameFilter, extra }).map((f, i) => filterBox(f, applied, i)).join('');
  return `<div class="standard-filter-section flex" data-ui="list.standard-filters">${boxes}${renderGroupByButtons(groupBy)}</div>`;
}

/** Filter count is the number of applied filters (standard-box filters included, as Frappe counts them). */
export function filterCount(filters = []) { return (filters || []).length; }

/** Filter button + clear button (`.filter-selector`). */
export function renderFilterButton({ count = 0, open = false } = {}) {
  const lab = count ? `${count} filter${count > 1 ? 's' : ''}` : 'Filter';
  return `<div class="filter-selector" data-ui="list.filter"><div class="btn-group${open ? ' show' : ''}">`
    + `<button class="btn btn-default btn-sm filter-button${count ? ' btn-filter-applied' : ''}" aria-expanded="${open}" data-ui="page.filter"><span class="filter-icon button-icon">${icon('funnel')}</span><span class="button-label hidden-xs">${lab}</span></button>`
    + (count ? `<button class="btn btn-default btn-sm filter-x-button" title="Clear all filters" data-ui="list.filter.clear"><span class="filter-icon button-icon">${icon('x')}</span></button>` : '')
    + `</div></div>`;
}

/** Filter popover with one row per applied filter (shown when overlay open:true or menu_open page.filter). */
export function renderFilterPopover({ meta = {}, filters = [], items } = {}) {
  const list = normalizeFilters(items ?? filters, meta);
  const rows = list.map((f, i) => `<div class="filter-box" data-ui="list.filter.row.${i}"><div class="list_filter"><div class="filter-field flex">`
    + `<div class="form-group frappe-control"><input class="form-control input-xs" type="text" value="${esc(f.label)}" readonly data-fieldname="${esc(f.fieldname)}"></div>`
    + `<div class="form-group frappe-control condition"><select class="form-control input-xs condition">${Object.entries(OP_LABELS).map(([op, l]) => `<option value="${esc(op)}"${op === f.op ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></div>`
    + `<div class="form-group frappe-control filter-value"><input class="form-control input-xs" type="text" value="${esc(formatFilterValue(f.value))}"></div>`
    + `<button class="btn btn-default btn-xs remove-filter" title="Remove filter" data-ui="list.filter.remove.${i}">${icon('x')}</button></div></div></div>`).join('');
  const empty = list.length ? '' : `<div class="empty-filters text-muted">No filters selected</div>`;
  return `<div class="popover filter-popover show bs-popover-bottom" role="tooltip" data-ui="list.filter.popover"><div class="popover-body"><div class="filter-edit-area"><div class="filter-area">${rows}${empty}</div>`
    + `<hr><div class="filter-action-buttons"><div class="text-muted add-filter"><button class="btn btn-xs btn-default add-filter-btn">+ Add a Filter</button></div><div class="clear-filters-container">${list.length ? '<button class="btn btn-xs btn-default clear-filters">Clear Filters</button>' : ''}</div></div></div></div></div>`;
}

/** Optional chip row, one chip per applied filter: "Label = value". */
export function renderFilterChips({ meta = {}, filters = [] } = {}) {
  const list = normalizeFilters(filters, meta);
  if (!list.length) return '';
  return `<div class="filter-chips flex" data-ui="list.filter-chips">${list.map((f, i) =>
    `<span class="es-badge filter-chip" data-theme="grey" data-ui="list.filter-chip.${i}"><span class="es-badge__label">${esc(f.label)} ${esc(OP_LABELS[f.op]?.toLowerCase() || f.op)} ${esc(formatFilterValue(f.value))}</span>${icon('x')}</span>`).join('')}</div>`;
}
