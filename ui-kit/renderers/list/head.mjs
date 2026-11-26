// List page head (T-L2): breadcrumb, view switcher, custom buttons, reload, "..." menu, primary action / bulk Actions.
// Port of list_view.js setup_page / page.js (V16-FACTS sections 4 and 5). Generic: names come from meta/spec only.
import { esc, enc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { button } from '../../kit-lib/buttons.mjs';
import { enabledViews, switcherVisible, renderViewSwitcher } from '../../kit-lib/viewswitch.mjs';

const t = (v) => v === 1 || v === true || v === '1';
export const dtName = (meta = {}) => meta.name || meta.doctype || 'Document';

/** Permission lookup. ctx.perms = { "<DocType>": {ptype: bool} } or flat { ptype: bool }; default allowed. */
export function listPerm(ctx = {}, meta = {}, ptype) {
  const p = ctx.perms || {};
  const dt = p[dtName(meta)];
  if (dt && dt[ptype] !== undefined) return !!dt[ptype];
  if (typeof p[ptype] === 'boolean') return p[ptype];
  return true;
}
export const isSystemManager = (ctx = {}) => (ctx.user?.roles || ['System Manager']).includes('System Manager') || ctx.user?.name === 'Administrator';

/** Strings, "---" and objects -> [{label, icon?, shortcut?, danger?, disabled?, checked?, divider?}]. */
export function toMenuItems(items = []) {
  return items.map((i) => (i === '---' || i?.divider ? { divider: true } : typeof i === 'string' ? { label: i } : i));
}
export function tidyDividers(items) {
  return items.filter((it, i, a) => !it.divider || (i > 0 && i < a.length - 1 && !a[i - 1].divider));
}

/** Dropdown list markup. open adds `show` and the keyboard highlight. */
export function menuList(items, { open = false, highlight, ui, right = true, extraCls = '' } = {}) {
  let n = -1;
  const lis = items.map((it) => {
    if (it.divider) return '<li class="dropdown-divider"></li>';
    n += 1;
    const cls = ['grey-link', 'dropdown-item', it.danger && 'text-danger', it.disabled && 'disabled', highlight === n && 'highlighted', it.checked && 'selected'].filter(Boolean).join(' ');
    return `<li><a class="${cls}" href="#" data-label="${esc(it.label)}"${highlight === n ? ' data-state="focus"' : ''}>${it.icon ? icon(it.icon) : ''}<span class="menu-item-label" data-label="${esc(it.label)}">${esc(it.label)}</span>${it.checked ? icon('check') : ''}${it.shortcut ? `<kbd class="pull-right">${esc(it.shortcut)}</kbd>` : ''}</a></li>`;
  }).join('');
  return `<ul class="dropdown-menu${right ? ' dropdown-menu-right' : ''}${open ? ' show' : ''}${extraCls ? ' ' + extraCls : ''}" role="presentation"${ui ? ` data-ui="${esc(ui)}"` : ''}>${lis}</ul>`;
}

/**
 * Resolve a menu_open overlay for `target` (marks it drawn). Returns null, or
 * { open: true, items, custom, highlight } where `items` is the overlay's list (items + extra_items)
 * or `defaults`, and `custom` tells whether the overlay supplied its own items.
 */
export function takeMenu(ctx, target, defaults = []) {
  const o = ctx.useOverlays('menu_open', (x) => x.target === target)[0];
  if (!o) return null;
  let items = o.items ? toMenuItems(o.items) : defaults;
  if (o.extra_items) items = [...(items || []), ...toMenuItems(o.extra_items)];
  return { open: true, items, custom: !!(o.items || o.extra_items), highlight: o.highlight };
}

/** The "..." menu in v16 order (list_view.js get_menu_items). */
export function buildListMenuItems(spec = {}, meta = {}, ctx = {}) {
  const sm = isSystemManager(ctx);
  const dt = dtName(meta);
  const items = [];
  const add = (label, shortcut) => items.push(shortcut ? { label, shortcut } : { label });
  if (ctx.viewport?.device !== 'mobile') add('Customize Quick Filters');
  if (sm) add('List Settings');
  const cust = listPerm(ctx, meta, 'customize') && !t(meta.core);
  if (cust || (sm && ctx.developer_mode)) items.push({ divider: true });
  if (cust) { add(`Settings - ${dt}`); add('Customize', 'Ctrl+Y'); }
  if (sm && ctx.developer_mode) add('Edit DocType');
  if (sm) { items.push({ divider: true }); add('User Permissions'); add('Role Permissions Manager'); }
  if (meta.documentation) { items.push({ divider: true }); add('Documentation'); }
  return tidyDividers(items);
}

/** Bulk "Actions" items in v16 order (list_view.js get_actions_menu_items). */
export function bulkItems(spec = {}, meta = {}, ctx = {}) {
  const wf = !!meta.workflow || !!spec.meta?.workflow;
  const sub = t(meta.is_submittable);
  const lvs = spec.meta?.list_view_settings || {};
  const items = ['Copy to Clipboard'];
  if (!wf || t(lvs.allow_edit)) items.push('Edit');
  if (listPerm(ctx, meta, 'export')) items.push('Export');
  items.push('Assign To', 'Clear Assignment', 'Apply Assignment Rule', 'Add Tags');
  if (listPerm(ctx, meta, 'print') && !t(meta.hide_print)) items.push('Print');
  if (sub && listPerm(ctx, meta, 'submit') && !wf) items.push('Submit');
  if (sub && listPerm(ctx, meta, 'cancel') && !wf) items.push('Cancel');
  if (listPerm(ctx, meta, 'delete') && (!wf || t(lvs.allow_edit))) items.push('Delete');
  return toMenuItems(items);
}

/** Custom `button` overlays for the page head (target page.actions or none). Returns [{g}|{b}|{primary}]. */
function pageButtons(ctx) {
  const btns = ctx.useOverlays('button', (b) => !b.target || b.target === 'page.actions');
  const groups = new Map(); const out = [];
  for (const b of btns) {
    if (b.primary_action) { out.push({ primary: b }); continue; }
    if (b.group) {
      if (!groups.has(b.group)) { const g = { label: b.group, items: [] }; groups.set(b.group, g); out.push({ g }); }
      groups.get(b.group).items.push(b);
    } else out.push({ b });
  }
  return out;
}

const breadcrumbs = (ctx, meta) => {
  const given = (ctx.breadcrumbs || []).map((c) => (typeof c === 'string' ? c : c?.label)).filter(Boolean);
  const trail = given.length ? given : [ctx.workspace, dtName(meta)].filter(Boolean);
  const last = trail.length - 1;
  return `<nav class="es-breadcrumbs navbar-breadcrumbs" aria-label="Breadcrumbs"><ol>${trail.map((c, i) =>
    `<li><span class="es-breadcrumbs__item"${i === last ? ' aria-current="page"' : ''}><span class="es-breadcrumbs__label">${esc(c)}</span></span></li>`).join('')}</ol></nav>`;
};

/**
 * renderListHead(spec, meta, ctx, st) -> { html, labels }
 *   st: { selected: number, bulk: items|null, views: [..] }
 * Draws overlays: button (page head), menu_open page.menu / page.actions / page.primary / page.view_switcher / button_group:<g>.
 * `labels.primary` is the primary action label (for state targets `button:<label>`).
 */
export function renderListHead(spec = {}, meta = {}, ctx = {}, st = {}) {
  const dt = dtName(meta);
  const view = spec.view || {};
  const selected = st.selected || 0;
  const canCreate = listPerm(ctx, meta, 'create') && !t(ctx.read_only) && !t(meta.in_create);
  const bulk = st.bulk || bulkItems(spec, meta, ctx);
  const customs = pageButtons(ctx);
  const primaryOverride = customs.find((c) => c.primary)?.primary;

  // view switcher (hidden by desk_settings.view_switcher=false)
  let switcher = '';
  if (switcherVisible(meta, ctx)) {
    const views = st.views || enabledViews(meta, view, ctx);
    const m = takeMenu(ctx, 'page.view_switcher');
    switcher = renderViewSwitcher({ views, current: view.current_view || 'list', variants: view.view_variants || {}, active: view.layout || view.active_variant, open: !!m, items: m?.custom ? m.items : undefined, highlight: m?.highlight });
  }

  // custom buttons
  const customHtml = customs.filter((c) => !c.primary).map((c) => {
    if (c.g) {
      const mo = takeMenu(ctx, `button_group:${c.g.label}`);
      const links = c.g.items.map((b) => `<a class="dropdown-item" href="#" data-label="${enc(b.label)}" data-ui="list.button.${esc(b.label)}">${esc(b.label)}</a>`).join('');
      return `<div class="inner-group-button${mo ? ' show' : ''}" data-label="${esc(c.g.label)}">${button(c.g.label, { caret: true, ui: `list.button-group.${c.g.label}` })}<div role="presentation" class="dropdown-menu${mo ? ' show' : ''}">${links}</div></div>`;
    }
    const b = c.b;
    return button(b.label, { primary: b.style === 'primary', icon: b.icon, cls: b.style === 'danger' ? 'btn-danger' : '', ui: `list.button.${b.label}` });
  }).join('');

  // reload + "..." menu
  const reload = `<span class="page-icon-group hidden-xs hidden-sm">${button('Reload List', { iconOnly: true, icon: 'refresh-cw', title: 'Reload List', cls: 'text-muted', ui: 'list.reload' })}</span>`;
  const defMenu = buildListMenuItems(spec, meta, ctx);
  const mm = takeMenu(ctx, 'page.menu', defMenu);
  const menuItems = mm ? mm.items : defMenu;
  const menu = menuItems.length
    ? `<div class="menu-btn-group${mm ? ' show' : ''}">${button('Menu', { iconOnly: true, icon: 'ellipsis', cls: 'menu-more-button', title: 'Menu', ui: 'page.menu' }).replace('type="button"', 'type="button" aria-haspopup="menu"')}${menuList(menuItems, { open: !!mm, highlight: mm?.highlight, ui: 'list.menu' })}</div>` : '';

  // primary action, or bulk Actions while rows are selected
  const am = takeMenu(ctx, 'page.actions', bulk);
  let primary = '';
  let primaryLabel = '';
  if (selected > 0 || am) {
    const items = am ? am.items : bulk;
    const aOpen = !!am || !!st.actionsOpen;
    primary = `<div class="btn-group actions-btn-group${aOpen ? ' show' : ''}">${button('Actions', { caret: true, ui: 'page.actions' })}${menuList(items, { open: aOpen, highlight: am?.highlight, ui: 'list.actions-menu' })}</div>`;
  } else if (primaryOverride) {
    primaryLabel = primaryOverride.label;
    primary = button(primaryOverride.label, { primary: true, icon: primaryOverride.icon, ui: 'list.primary-action' });
  } else if (canCreate) {
    primaryLabel = `Add ${dt}`;
    const importOk = listPerm(ctx, meta, 'import') && t(meta.allow_import);
    const opts = [{ label: 'Add manually' }];
    if (t(ctx.enable_upload_first_workflow)) opts.push({ label: 'Upload' });
    const pm = takeMenu(ctx, 'page.primary', null);
    const btn = button(primaryLabel, { primary: true, icon: 'plus', ui: 'list.primary-action' });
    if (importOk || opts.length > 1 || pm) {
      const items = pm?.items || [...opts, ...(importOk ? [{ divider: true }, { label: 'Import' }] : [])];
      primary = `<div class="btn-group primary-action-group${pm ? ' show' : ''}">${btn}${button('More options', { iconOnly: true, icon: 'chevron-down', cls: 'primary-chevron', title: 'More options', ui: 'list.primary-chevron' })}${menuList(items, { open: !!pm, highlight: pm?.highlight, ui: 'list.primary-menu' })}</div>`;
    } else primary = btn;
  }

  const html = `<div class="page-head flex" data-ui="page-head"><div class="container"><div class="row flex-nowrap align-center page-head-content justify-between">`
    + `<div class="page-title"><button class="btn-reset sidebar-toggle-btn navbar-brand" type="button" data-ui="page-head.sidebar-toggle">${icon('panel-left-close', 'md')}</button>`
    + `<div class="flex title-area ellipsis">${breadcrumbs(ctx, meta)}<span class="es-badge page-indicator-pill hide" data-testid="page-status"></span></div></div>`
    + `<div class="align-center flex standard-items-section"><div class="flex col page-actions justify-content-end">`
    + `<div class="filters flex"></div>`
    + `<div class="custom-actions hidden-xs hidden-md">${switcher}${customHtml}</div><div class="custom-mobile-actions"></div>`
    + `<div class="standard-actions flex">${reload}${menu}${primary}</div>`
    + `</div></div></div></div></div>`;
  return { html, labels: { primary: primaryLabel } };
}
