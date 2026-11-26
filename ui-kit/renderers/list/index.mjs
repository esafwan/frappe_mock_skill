// List page renderer (T-L2 + T-L3). Engine contract: default export render(spec, ctx) -> { document, head, main, title }.
// View spec keys read here (all optional): sort{field,order}, page_length, state, views ([ids] | "auto"), disable_views, current_view,
// view_variants{view:[names]}, layout, group_by_fields (assigned_to|owner|tags), show_filter_chips, filters (tuples), show_tags,
// status_column, max_columns, count_upper_bound. Overlays drawn: filter_chips, list_select, button, menu_open, state.
import { esc } from '../../kit-lib/util.mjs';
import { renderSort, sortOptions, currentSort } from '../../kit-lib/sort.mjs';
import { renderStandardFilters, renderFilterButton, renderFilterPopover, renderFilterChips, filterCount, normalizeFilters } from '../../kit-lib/filters.mjs';
import { enabledViews } from '../../kit-lib/viewswitch.mjs';
import { applyCustomizations } from '../../doctype/lib/customize.mjs';
import { renderShell } from '../../shell/shell.mjs';
import { sidebarContainer, loadWorkspaceSidebar, dockFromWorkspaces } from '../form/index.mjs';
import { renderListHead, bulkItems, takeMenu, toMenuItems, dtName } from './head.mjs';
import { renderListBody, resolveRows, listColumns } from './rows.mjs';
import { bulkActionItems } from './bulk.mjs';
import { renderListDialogs } from './dialogs.mjs';
import { openFieldFor, groupCounts, renderGroupByDropdown } from './groupby.mjs';

const STATE_RE = /^(row:\d+|cell:\d+:.+|column:.+|button:.+|ui:.+)$/;
const STATE_CLASS = { disabled: 'disabled', loading: 'loading', active: 'active' };

/** Add data-state (and the matching class) to the first element whose data-ui equals `id`. Returns [html, found]. */
export function markState(html, id, state) {
  const re = new RegExp(`<([a-zA-Z][\\w-]*)([^>]*?)\\sdata-ui="${esc(id).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"([^>]*)>`);
  const m = re.exec(html);
  if (!m) return [html, false];
  let tag = m[0];
  tag = tag.replace(/\sdata-state="[^"]*"/, '');
  tag = tag.replace(/>$/, ` data-state="${state}">`);
  const cls = STATE_CLASS[state];
  if (cls) tag = /\sclass="/.test(tag) ? tag.replace(/\sclass="([^"]*)"/, (_, c) => ` class="${c.split(' ').includes(cls) ? c : `${c} ${cls}`}"`) : tag.replace(/^<(\w+)/, `<$1 class="${cls}"`);
  return [html.slice(0, m.index) + tag + html.slice(m.index + m[0].length), true];
}

/** Candidate data-ui ids for a state target. */
function stateIds(target, labels) {
  if (target.startsWith('row:')) return [`list.row.${target.slice(4)}`];
  if (target.startsWith('cell:')) { const [, n, ...f] = target.split(':'); return [`list.cell.${n}.${f.join(':')}`]; }
  if (target.startsWith('column:')) return [`list.column.${target.slice(7)}`];
  if (target.startsWith('ui:')) return [target.slice(3)];
  if (target.startsWith('button:')) {
    const l = target.slice(7);
    return l === 'primary' || l === labels.primary ? ['list.primary-action'] : [`list.button.${l}`, `list.button-group.${l}`, `list.row.0.action.${l}`];
  }
  return [];
}

/** Build the slots of a list page. Returns { head, main, title, doctype, columns, rows }. */
export async function buildListPage({ spec, meta, ctx }) {
  const view = spec.view || {};
  const dt = dtName(meta);

  // filters: filter_chips overlays + view.filters
  const chipOverlays = ctx.useOverlays('filter_chips');
  const filters = [...(view.filters || []), ...chipOverlays.flatMap((o) => o.items || [])];
  const filterOpenOverlay = chipOverlays.some((o) => o.open);
  const fm = takeMenu(ctx, 'page.filter', null);
  const popoverOpen = filterOpenOverlay || !!fm;

  // selection
  const sel = ctx.useOverlays('list_select');
  const rowsAll = resolveRows(spec, meta, ctx);
  const selected = new Set();
  for (const o of sel) {
    if (o.rows === 'all') rowsAll.forEach((_, i) => selected.add(i));
    else (o.rows || []).forEach((i) => selected.add(Number(i)));
  }
  const bulkOverlay = [...sel].reverse().find((o) => o.bulk);
  const bulk = bulkOverlay ? toMenuItems(bulkOverlay.bulk) : bulkActionItems(spec, meta, ctx);
  const actionsOpenByOverlay = sel.some((o) => o.open);

  // head
  const views = enabledViews(meta, view, ctx);
  const headRes = renderListHead(spec, meta, ctx, { selected: selected.size || (actionsOpenByOverlay ? 1 : 0), bulk, views, actionsOpen: actionsOpenByOverlay });
  let head = headRes.html;

  // filter area
  const groupBy = view.group_by_fields || (view.group_by ? [view.group_by] : []);
  const std = renderStandardFilters({ meta, filters, groupBy });
  const count = filterCount(filters);
  const sortOpts = sortOptions(meta);
  const sm = takeMenu(ctx, 'page.sort', null);
  const sort = renderSort({ meta, sort: currentSort(meta, view), options: sortOpts, open: !!sm, items: sm?.custom ? sm.items.map((i) => i.label) : undefined, highlight: sm?.highlight });
  const popover = popoverOpen ? renderFilterPopover({ meta, filters: fm?.custom ? undefined : filters, items: fm?.custom ? fm.items.map((i) => (Array.isArray(i) ? i : i.label)) : undefined }) : '';
  const chips = view.show_filter_chips ? renderFilterChips({ meta, filters }) : '';
  const form = `<div class="page-form flex list-page-form" data-ui="list.page-form">${std}<div class="filter-section flex"><div class="mobile-id-filter hidden-lg"></div>${renderFilterButton({ count, open: popoverOpen })}${sort}</div>${popover}</div>${chips}`;

  const body = renderListBody(spec, meta, ctx, { selected, filters: normalizeFilters(filters, meta), pageLength: view.page_length, state: view.state });
  let main = `<div class="layout-main-list" data-ui="list-view">${form}${body.html}</div>`;

  // list dialogs (settings, quick filters, save view) and the saved-views menu: built here, layered by kit-lib/draw.mjs
  const viewsOv = ctx.overlays.find((o) => o.type === 'menu_open' && (o.target === 'page.views' || o.target === 'saved_views'));
  const ld = renderListDialogs({ spec, meta, ctx });
  ctx.preDialogs = [...(ctx.preDialogs || []), ...ld.dialogs];
  if (ld.viewsMenu && viewsOv) ctx.preMenus = [...(ctx.preMenus || []), { overlay: viewsOv, html: ld.viewsMenu }];

  // group-by dropdowns (assigned_to, owner, tags) with counts from the loaded rows, v16 rules
  for (const o of ctx.overlays.filter((x) => x.type === 'menu_open' && openFieldFor(x.target))) {
    const field = openFieldFor(o.target);
    ctx.useOverlays('menu_open', (x) => x === o);
    const items = o.items ? o.items : groupCounts(rowsAll, field, { user: ctx.user?.name || '' });
    ctx.preMenus = [...(ctx.preMenus || []), { overlay: o, html: renderGroupByDropdown({ field, items, applied: o.applied, search: o.search || '', open: true }) }];
  }

  // pinned interaction states
  for (const o of ctx.overlays.filter((x) => x.type === 'state' && STATE_RE.test(x.target || ''))) {
    for (const id of stateIds(o.target, headRes.labels)) {
      let hit;
      [head, hit] = markState(head, id, o.state);
      if (!hit) [main, hit] = markState(main, id, o.state);
      if (hit) { ctx.useOverlays('state', (x) => x === o); break; }
    }
  }
  return { head, main, title: `${dt} list`, doctype: dt, columns: body.columns, rows: body.rows };
}

export default async function render(spec, ctx) {
  let meta = spec.meta?.doctype;
  if (!meta || typeof meta !== 'object') { ctx?.warn?.('list: meta.doctype did not resolve to a DocType'); return { main: '' }; }
  const custom = spec.meta?.custom;
  if (custom) {
    const cf = Array.isArray(custom) ? custom.flatMap((c) => c.custom_fields || (Array.isArray(c) ? c : [])) : (custom.custom_fields || []);
    const ps = Array.isArray(custom) ? custom.flatMap((c) => c.property_setters || []) : (custom.property_setters || []);
    if (cf.length || ps.length) meta = applyCustomizations(meta, cf, ps);
  }
  const page = await buildListPage({ spec, meta, ctx });
  const workspace = ctx.workspace || spec.ctx?.workspace || meta.module || '';
  const sidebarMeta = typeof spec.meta?.sidebar === 'object' ? spec.meta.sidebar : null;
  const sj = sidebarMeta || loadWorkspaceSidebar(workspace);
  const chrome = { dock: true, sidebar: 'expanded', navbar: false, ...(ctx.chrome || {}) };
  const sidebarHtml = !sj || chrome.sidebar === 'hidden' ? ''
    : sidebarContainer(sj, { active: { doctype: page.doctype }, collapsed: chrome.sidebar === 'collapsed', title: workspace });
  const sctx = spec.ctx || {};
  const vp = ctx.viewport && typeof ctx.viewport === 'object' ? `${ctx.viewport.width}x${ctx.viewport.height}` : (ctx.viewport || '1440x900');
  const document = renderShell({ ctx: {
    theme: ctx.theme, locale: ctx.locale, rtl: ctx.rtl, viewport: vp, app: ctx.app || workspace, workspace, user: ctx.user, chrome,
    dock: { ...(sctx.dock || {}), items: sctx.dock?.items || dockFromWorkspaces() },
    title: page.title, route: `List/${page.doctype}`, pageName: page.doctype, page: 'list',
    tokensPath: ctx.href ? ctx.href('tokens').replace(/\/$/, '') : '../tokens', notifications: sctx.notifications,
  }, head: page.head, main: page.main, right: '', sidebarHtml });
  return { document, head: page.head, main: page.main, title: page.title, sidebarHtml };
}
export { listColumns, resolveRows };
