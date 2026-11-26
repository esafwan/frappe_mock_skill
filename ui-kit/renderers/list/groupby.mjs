// List group-by (T-L6, re-scoped): v16 has no list sidebar. Group-by buttons with count dropdowns, tag filter,
// "Assigned To" and "Created By" pickers live in the list toolbar. V16-FACTS section 4 (base_list.js:847-1122).
// Generic: labels and values come from rows/meta/ctx only. Open states use menu registry ids ("group_by:<field>").
import { esc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';

export const GROUP_LABELS = { assigned_to: 'Assigned To', owner: 'Created By', tags: 'Tags' };
export const GROUP_FIELDS = Object.keys(GROUP_LABELS);
const HIDDEN_USERS = new Set(['Guest', 'Administrator']);

/** Registry id for a group-by field's open dropdown (matches the `group_by:` prefix in menu-registry). */
export const groupByMenuId = (field) => `group_by:${field}`;
export const fieldFromMenuId = (id = '') => (String(id).startsWith('group_by:') ? String(id).slice(9) : null);

const asList = (v) => (Array.isArray(v) ? v : v == null || v === '' ? [] : typeof v === 'string' && v.startsWith('[') ? safeJson(v) : String(v).split(',').map((s) => s.trim()).filter(Boolean));
function safeJson(s) { try { const r = JSON.parse(s); return Array.isArray(r) ? r : []; } catch { return []; } }

/** Values a row holds for a group-by field (assigned_to -> _assign, owner -> owner, tags -> _user_tags). */
export function rowValues(row = {}, field) {
  if (field === 'assigned_to') return asList(row._assign);
  if (field === 'tags') return asList(row._user_tags);
  return asList(row[field === 'owner' ? 'owner' : field]);
}

/**
 * Counts for one field, v16 rules: null -> "Not Set", current user -> "Me" (first), Guest/Administrator removed,
 * zero counts removed, Check fields -> "No"/"Yes". Returns [{value, label, count}], rest sorted by count desc then label.
 */
export function groupCounts(rows = [], field, { user = '', fieldtype = '' } = {}) {
  const m = new Map();
  for (const r of rows) {
    let vals = rowValues(r, field);
    if (!vals.length) vals = [null];
    for (const v of new Set(vals)) m.set(v, (m.get(v) || 0) + 1);
  }
  const out = [];
  for (const [v, count] of m) {
    if (!count || (v !== null && HIDDEN_USERS.has(v) && field !== 'tags')) continue;
    const label = v === null ? 'Not Set' : v === user && field !== 'tags' ? 'Me' : fieldtype === 'Check' ? (Number(v) ? 'Yes' : 'No') : String(v);
    out.push({ value: v, label, count });
  }
  out.sort((a, b) => (a.label === 'Me' ? -1 : b.label === 'Me' ? 1 : b.count - a.count || a.label.localeCompare(b.label)));
  return out;
}

const item = (it, ui, applied) => `<div class="group-by-item${applied ? ' selected' : ''}" data-name="${esc(it.value ?? '')}" data-ui="${ui}"><a class="dropdown-item">${applied ? icon('check') : ''}<span class="group-by-value ellipsis">${esc(it.label)}</span><span class="group-by-count">${esc(it.count)}</span></a></div>`;

/**
 * One dropdown panel. items from groupCounts; applied = selected value (shown first with check).
 * Empty items -> empty state. `search` fills the search box and filters by label.
 */
export function renderGroupByDropdown({ field, items = [], applied, search = '', open = false, label } = {}) {
  const ui = `list.group-by.${field}`;
  const q = String(search).toLowerCase();
  let list = items.filter((i) => !q || i.label.toLowerCase().includes(q));
  const a = list.find((i) => i.value === applied);
  if (a) list = [a, ...list.filter((i) => i !== a)];
  const body = list.length
    ? list.map((i, n) => item(i, `${ui}.item.${n}`, i === a)).join('')
    : `<div class="empty-state text-muted" data-ui="${ui}.empty">${field === 'tags' ? 'No Tags' : 'No values'}</div>`;
  return `<div class="dropdown-menu group-by-dropdown${open ? ' show' : ''}" role="menu" data-field="${esc(field)}" data-ui="${ui}.menu"><div class="dropdown-search"><input type="text" class="form-control input-xs" placeholder="${esc(`Search ${label || GROUP_LABELS[field] || field}`)}" value="${esc(search)}" data-ui="${ui}.search"></div><div class="group-by-list">${body}</div></div>`;
}

/** Toolbar button (matches kit-lib/filters renderGroupByButtons markup) with its dropdown. */
export function renderGroupByField({ field, label, items = [], applied, search, open = false } = {}) {
  const lab = label || GROUP_LABELS[field] || field;
  const sel = applied !== undefined && applied !== null ? items.find((i) => i.value === applied) : null;
  const text = sel ? `${lab}: ${sel.label}` : lab;
  return `<div class="group-by-field list-link${open ? ' show' : ''}" data-fieldname="${esc(field)}" data-label="${esc(lab)}" data-ui="list.group-by.${esc(field)}"><a class="btn btn-default btn-sm list-sidebar-button${sel ? ' active' : ''}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="${open}"><span class="button-label">${esc(text)}</span>${icon('chevrons-up-down')}</a>${open ? renderGroupByDropdown({ field, items, applied, search, open, label: lab }) : ''}</div>`;
}

/**
 * Toolbar group: rows + fields -> buttons. opts: { user, applied:{field:value}, openField, search, fieldtypes:{field:type},
 * counts:{field:[items]} (override computed counts) }. Fields beyond assigned_to/owner/tags are skipped (they are
 * standard filter boxes in v16). Returns { html, opened } where opened is the field whose menu is drawn.
 */
export function renderGroupByToolbar(rows = [], fields = [], opts = {}) {
  const { user = '', applied = {}, openField, search = '', fieldtypes = {}, counts = {} } = opts;
  const html = fields.filter((f) => GROUP_LABELS[f]).map((f) => renderGroupByField({
    field: f,
    items: counts[f] || groupCounts(rows, f, { user, fieldtype: fieldtypes[f] }),
    applied: applied[f], search: openField === f ? search : '', open: openField === f,
  })).join('');
  return { html, opened: openField && fields.includes(openField) ? openField : null };
}

/** Resolve a menu_open overlay target to a group-by field, or null. */
export const openFieldFor = (target) => { const f = fieldFromMenuId(target); return f && GROUP_LABELS[f] ? f : null; };
