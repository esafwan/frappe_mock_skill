// View switcher (T-L2). Port of list_view_select.js enabled-view logic (V16-FACTS section 5).
import { esc } from './util.mjs';
import { icon } from './icons.mjs';

/** All views in switcher order. */
export const VIEW_MODES = [
  { id: 'list', label: 'List View', icon: 'list' },
  { id: 'report', label: 'Report View', icon: 'sheet' },
  { id: 'dashboard', label: 'Dashboard View', icon: 'layout-dashboard' },
  { id: 'gantt', label: 'Gantt View', icon: 'square-chart-gantt' },
  { id: 'kanban', label: 'Kanban View', icon: 'square-kanban' },
  { id: 'calendar', label: 'Calendar View', icon: 'calendar' },
  { id: 'image', label: 'Image View', icon: 'image' },
  { id: 'inbox', label: 'Inbox View', icon: 'list' },
  { id: 'tree', label: 'Tree View', icon: 'list-tree' },
  { id: 'map', label: 'Map View', icon: 'map' },
];
const BY_ID = new Map(VIEW_MODES.map((v) => [v.id, v]));
const ID_ALIAS = { 'list view': 'list', 'report view': 'report', 'dashboard view': 'dashboard', 'gantt view': 'gantt', 'kanban view': 'kanban', 'calendar view': 'calendar', 'image view': 'image', 'inbox view': 'inbox', 'tree view': 'tree', 'map view': 'map' };
const viewId = (v) => { const s = String(v?.id ?? v ?? '').trim().toLowerCase(); return BY_ID.has(s) ? s : ID_ALIAS[s] || null; };

/** Frappe's own enabling rules, from DocType metadata. Used when view.views === "auto". */
export function autoViews(meta = {}, ctx = {}) {
  const has = (n) => (meta.fields || []).some((f) => f.fieldname === n);
  const isFile = (meta.name || meta.doctype) === 'File';
  const cal = meta.is_calendar_and_gantt || ctx.calendar_enabled;
  const on = ['list'];
  if (ctx.can_get_report !== false) on.push('report');
  on.push('dashboard');
  if (cal) on.push('gantt');
  if (!isFile) on.push('kanban');
  if (cal) on.push('calendar');
  if (meta.image_field) on.push('image');
  if (meta.name === 'Communication' || ctx.inbox_enabled) on.push('inbox');
  if (meta.is_tree || ctx.tree_enabled) on.push('tree');
  if ((has('latitude') && has('longitude')) || (meta.fields || []).some((f) => f.fieldtype === 'Geolocation')) on.push('map');
  return on;
}

/**
 * enabledViews(meta, view, ctx) -> [{id,label,icon}] in switcher order. List is always present.
 * Spec: view.views = ["kanban","calendar",...] lists the extra views; "auto" applies Frappe's rules.
 * view.disable_views removes views. The whole switcher is hidden by ctx.desk_settings.view_switcher=false
 * or meta.force_re_route_to_default_view (see switcherVisible).
 */
export function enabledViews(meta = {}, view = {}, ctx = {}) {
  const raw = view.views === 'auto' ? autoViews(meta, ctx) : Array.isArray(view.views) ? view.views : [];
  const on = new Set(['list', ...raw.map(viewId).filter(Boolean)]);
  for (const d of view.disable_views || []) { const id = viewId(d); if (id && id !== 'list') on.delete(id); }
  return VIEW_MODES.filter((v) => on.has(v.id));
}

export function switcherVisible(meta = {}, ctx = {}) {
  return ctx.desk_settings?.view_switcher !== false && !(meta.force_re_route_to_default_view === 1 || meta.force_re_route_to_default_view === true);
}

/**
 * renderViewSwitcher({ views, current, variants, active, open, items, highlight })
 *   current:  view id shown in the trigger (default "list")
 *   variants: { list:[layout names], kanban:[board names], report:[saved reports], calendar:[...], inbox:[...] }
 *   active:   the active variant label (replaces the trigger label)
 */
export function renderViewSwitcher({ views = [], current = 'list', variants = {}, active, open = false, items, highlight } = {}) {
  const cur = BY_ID.get(current) || VIEW_MODES[0];
  const label = active || cur.label;
  const rows = items
    ? items.map((i) => `<a class="dropdown-item" href="#">${esc(typeof i === 'string' ? i : i.label)}</a>`).join('')
    : views.map((v, i) => {
      const sel = v.id === cur.id;
      const sub = (variants[v.id] || []).length;
      return `<a class="dropdown-item${sel ? ' selected' : ''}${highlight === i ? ' highlighted' : ''}" style="display:flex;align-items:center;justify-content:flex-start;gap:8px;text-align:start" href="#" role="menuitem" data-view="${v.id}" aria-checked="${sel}" data-ui="list.view.${v.id}">`
        + `${icon(v.icon)}<span class="menu-item-label">${esc(v.label)}</span>${sel ? icon('check') : ''}${sub ? icon('chevron-right') : ''}</a>`;
    }).join('');
  const subs = !items && (variants[cur.id] || []).length
    ? `<div class="dropdown-divider"></div>${variants[cur.id].map((n) => `<a class="dropdown-item variant${n === active ? ' selected' : ''}" href="#" data-variant="${esc(n)}" data-ui="list.view.variant.${esc(n)}"><span class="menu-item-label">${esc(n)}</span>${n === active ? icon('check') : ''}</a>`).join('')}` : '';
  return `<div class="custom-btn-group view-switcher${open ? ' show' : ''}" data-ui="list.view-switcher">`
    + `<button class="es-button ellipsis" type="button" aria-haspopup="menu" aria-expanded="${open}" data-ui="page.view_switcher"><span class="es-spinner" aria-hidden="true"></span>${icon(cur.icon)}<span class="es-button__label hidden-xs custom-btn-group-label">${esc(label)}</span>${icon('chevrons-up-down', 'sm', { class: 'hidden-xs' })}</button>`
    + `<div class="dropdown-menu${open ? ' show' : ''}" role="menu" data-ui="list.view-switcher.menu">${rows}${subs}</div></div>`;
}
