// Report View page (T-R2): page head with view switcher, inline filter bar + chips, group-by, chart toggle, menu, saved-report mode,
// Report Builder columns (incl. child columns). Generic: every name comes from spec, meta and data.
// View keys read (all optional): filters (tuples), show_filter_chips (default true), group_by (fieldname), group_by_open, chart {type,x_field,y_fields,title},
// chart_hidden, show_totals, sort{field,order}, page_length, state, view_variants. Saved report: meta.report {report_name|name, ref_doctype, json}
// with json {filters, fields:[[fieldname, doctype]], order_by, add_totals_row, page_length, column_widths, group_by, chart_args}.
// Overlays drawn: filter_chips, button, menu_open (page.menu, page.group_by, page.view_switcher, page.filter, page.sort).
import { esc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { button } from '../../kit-lib/buttons.mjs';
import { renderDatatable } from '../../kit-lib/datatable/index.mjs';
import { chart as drawChart } from '../../kit-lib/chart.mjs';
import { enabledViews, switcherVisible, renderViewSwitcher } from '../../kit-lib/viewswitch.mjs';
import { renderStandardFilters, renderFilterButton, renderFilterPopover, renderFilterChips, filterCount, normalizeFilters } from '../../kit-lib/filters.mjs';
import { menuList, takeMenu, toMenuItems, tidyDividers, dtName, listPerm, isSystemManager } from '../list/head.mjs';
import { listColumns, resolveRows, PAGE_LENGTHS, countLabel } from '../list/rows.mjs';

const t = (v) => v === 1 || v === true || v === '1';
const NUMERIC = new Set(['Currency', 'Float', 'Int', 'Percent']);
const SUMMABLE = new Set(['Currency', 'Float', 'Int']);
const parseJson = (v, d) => { if (typeof v !== 'string') return v ?? d; try { return JSON.parse(v); } catch { return d; } };

/** Saved-report mode info: { saved, title, json }. */
export function reportInfo(spec = {}, meta = {}) {
  const rep = spec.meta?.report && typeof spec.meta.report === 'object' ? spec.meta.report : null;
  const json = rep ? parseJson(rep.json, {}) : {};
  const title = rep ? (rep.report_name || rep.name || '') : '';
  return { rep, saved: !!title, title, json: json && typeof json === 'object' ? json : {} };
}

/** DocType for the report: meta.doctype, else meta.report.ref_doctype resolved by the engine. */
export function reportDoctype(spec = {}) {
  const dt = spec.meta?.doctype;
  return dt && typeof dt === 'object' ? dt : null;
}

const childMeta = (spec, name) => { const c = spec.meta?.children?.[name]; return c && typeof c === 'object' ? c : null; };
const hasTable = (meta, name) => (meta.fields || []).some((f) => f.fieldtype === 'Table' && f.options === name);

/**
 * Report Builder columns. json.fields [[fieldname, doctype]] -> [{key, fieldname, doctype, child, label, df, width?}].
 * "name" is "ID", "idx" is "Index", child columns are "Label (Child DocType)". With no json.fields the list columns are used.
 */
export function reportColumns(spec, meta, ctx = {}) {
  const { json } = reportInfo(spec, meta);
  const parent = dtName(meta);
  const widths = json.column_widths || {};
  const pick = Array.isArray(json.fields) && json.fields.length ? json.fields : null;
  const mk = (fieldname, doctype) => {
    const child = doctype && doctype !== parent;
    const m = child ? (childMeta(spec, doctype) || {}) : meta;
    const f = (m.fields || []).find((x) => x.fieldname === fieldname);
    const std = { name: 'ID', idx: 'Index', owner: 'Created By', creation: 'Created On', modified: 'Last Updated On', modified_by: 'Last Updated By', docstatus: 'Document Status' }[fieldname];
    const base = f?.label || std || fieldname;
    const df = f || { fieldname, fieldtype: fieldname === 'idx' ? 'Int' : fieldname === 'creation' || fieldname === 'modified' ? 'Datetime' : 'Data', label: base };
    const key = child ? `${doctype}:${fieldname}` : fieldname;
    return { key, fieldname, doctype: doctype || parent, child: !!child, label: child ? `${base} (${doctype})` : base, df: { ...df, label: base }, width: widths[`${fieldname}:${doctype || parent}`] ?? widths[fieldname] };
  };
  if (pick) return pick.map(([fn, dt]) => mk(fn, dt));
  return listColumns(spec, meta, ctx).filter((c) => c.kind === 'subject' || c.kind === 'field' || c.kind === 'id')
    .map((c) => ({ ...mk(c.fieldname, parent), label: c.kind === 'subject' || c.kind === 'id' ? (c.fieldname === 'name' ? 'ID' : c.label) : c.label }));
}

const cellValue = (row, col) => {
  const v = row[col.key] !== undefined ? row[col.key] : row[col.fieldname];
  return v;
};

/** Group-by on the loaded rows: [{value, count}] in first-seen order. */
export function groupRows(rows, fieldname) {
  const m = new Map();
  for (const r of rows) { const v = r[fieldname] ?? ''; m.set(v, (m.get(v) || 0) + 1); }
  return [...m].map(([value, count]) => ({ value, count }));
}

function sortRows(rows, sort, cols) {
  if (!sort?.field) return rows;
  const c = cols.find((x) => x.fieldname === sort.field);
  const num = c && NUMERIC.has(c.df.fieldtype);
  const dir = sort.order === 'asc' ? 1 : -1;
  return rows.map((r, i) => [r, i]).sort((a, b) => {
    const x = a[0][sort.field] ?? '', y = b[0][sort.field] ?? '';
    const d = num ? (Number(x) || 0) - (Number(y) || 0) : String(x).localeCompare(String(y));
    return d * dir || a[1] - b[1];
  }).map((p) => p[0]);
}


function tableHtml({ cols, rows, ctx, totals, sort, meta, state, view = {} }) {
  const columns = cols.map((c) => ({ ...c.df, fieldname: c.key, label: c.df.label || c.label, fieldtype: c.df.fieldtype, child_label: c.child ? c.doctype : undefined, width: c.width ? Math.max(50, Math.min(600, Number(c.width))) : undefined }));
  const data = rows.map((r) => Object.fromEntries(cols.map((c) => [c.key, cellValue(r, c)])));
  const dtOpts = { sort, checkbox: true, showTotals: !!totals, currency: ctx.system?.currency, dateFormat: ctx.system?.date_format, rtl: ctx.rtl, ui: 'report.table', menu: view.column_menu, resizing: view.resizing, editing: view.editing };
  const empty = !rows.length ? `<div class="datatable-empty text-muted" data-ui="report.empty">${state === 'no_results' ? 'No Data' : 'Nothing to show'}</div>` : '';
  const dt = renderDatatable(columns, data, dtOpts);
  return empty ? dt.replace(/<\/div><\/div>$/, `</div>${empty}</div>`) : dt;
}

function chartBlock({ spec, view, json, rows, cols, groupField, groups, hidden }) {
  const ca = view.chart || json.chart_args;
  if (!ca) return '';
  const type = ca.type || ca.chart_type || 'bar';
  const ctype = String(type).toLowerCase();
  let labels, values, name;
  if (groupField) { labels = groups.map((g) => String(g.value || 'Not Set')); values = groups.map((g) => g.count); name = 'Count'; }
  else {
    const colOf = (fn) => cols.find((c) => c.key === fn) || cols.find((c) => c.fieldname === fn);
    const xc = colOf(ca.x_field) || cols[0];
    const yc = colOf((ca.y_fields || [])[0]) || cols.find((c) => SUMMABLE.has(c.df.fieldtype));
    const get = (r, c) => (c ? (r[c.key] !== undefined ? r[c.key] : r[c.fieldname]) : undefined);
    labels = rows.map((r) => String(get(r, xc) ?? '')); values = rows.map((r) => Number(yc ? get(r, yc) : 1) || 0); name = yc?.df.label || yc?.fieldname || 'Count';
  }
  const body = hidden ? '' : drawChart(['line', 'bar', 'pie', 'donut', 'percentage', 'heatmap', 'axis-mixed'].includes(ctype) ? ctype : 'bar', { labels, datasets: [{ name, values }] }, { title: ca.title || '', width: 1080, height: 260 });
  return { toggle: button(hidden ? 'Show Chart' : 'Hide Chart', { cls: 'toggle-chart-btn', ui: 'report.chart-toggle' }), html: `<div class="chart-wrapper${hidden ? ' hide' : ''}" data-ui="report.chart">${body}</div>` };
}

/** Group-by selector: button + popover. Returns html. */
function groupBySelector({ meta, active, open, items }) {
  const fields = (meta.fields || []).filter((f) => f.fieldname && ['Select', 'Link', 'Data', 'Check', 'Date', 'Dynamic Link'].includes(f.fieldtype) && !t(f.hidden));
  const label = active ? `Group By: ${esc((fields.find((f) => f.fieldname === active)?.label) || active)}` : 'Group By';
  const rows = items
    ? items.map((i) => `<a class="dropdown-item" href="#">${esc(i.label)}</a>`).join('')
    : `<a class="dropdown-item${active ? '' : ' selected'}" href="#" data-ui="report.group-by.none">None</a>${fields.map((f) => `<a class="dropdown-item${f.fieldname === active ? ' selected' : ''}" href="#" data-fieldname="${esc(f.fieldname)}">${esc(f.label || f.fieldname)}</a>`).join('')}`;
  return `<div class="group-by-selector btn-group${open ? ' show' : ''}" data-ui="report.group-by"><button class="btn btn-default btn-sm" type="button" aria-haspopup="menu" aria-expanded="${!!open}"><span class="button-label">${label}</span>${icon('chevrons-up-down')}</button><div class="dropdown-menu${open ? ' show' : ''}" data-ui="report.group-by.menu">${rows}</div></div>`;
}

/** Report page menu in v16 order. */
export function buildReportMenu(spec, meta, ctx, { saved, totals }) {
  const items = [{ label: 'Pick Columns' }, { label: 'Toggle Sidebar', shortcut: 'Ctrl+K' }, { label: totals ? 'Hide Totals' : 'Show Totals' }, { divider: true }];
  if (listPerm(ctx, meta, 'export')) items.push({ label: 'Export' });
  if (listPerm(ctx, meta, 'email')) items.push({ label: 'Setup Auto Email' });
  items.push({ divider: true });
  if (saved) items.push({ label: 'Save' });
  items.push({ label: 'Save As' });
  if (saved && isSystemManager(ctx)) items.push({ label: 'Delete' });
  return tidyDividers(items);
}

const breadcrumbs = (ctx, meta, saved, title) => {
  const given = (ctx.breadcrumbs || []).map((c) => (typeof c === 'string' ? c : c?.label)).filter(Boolean);
  const trail = given.length ? given : [ctx.workspace, dtName(meta), saved ? title : 'Report'].filter(Boolean);
  const last = trail.length - 1;
  return `<nav class="es-breadcrumbs navbar-breadcrumbs" aria-label="Breadcrumbs"><ol>${trail.map((c, i) =>
    `<li><span class="es-breadcrumbs__item"${i === last ? ' aria-current="page"' : ''}><span class="es-breadcrumbs__label">${esc(c)}</span></span></li>`).join('')}</ol></nav>`;
};

/** Build the slots of a report view page. Returns { head, main, title, doctype, columns, rows }. */
export async function buildReportPage({ spec, meta, ctx }) {
  const view = spec.view || {};
  const dt = dtName(meta);
  const { saved, title, json } = reportInfo(spec, meta);
  const jsonFilters = (json.filters || []).filter((f) => Array.isArray(f));

  // filters
  const chipOv = ctx.useOverlays('filter_chips');
  const filters = [...jsonFilters, ...(view.filters || []), ...chipOv.flatMap((o) => o.items || [])];
  const fm = takeMenu(ctx, 'page.filter', null);
  const popoverOpen = chipOv.some((o) => o.open) || !!fm;
  const std = renderStandardFilters({ meta, filters });
  const sm = takeMenu(ctx, 'page.sort', null);
  const popover = popoverOpen ? renderFilterPopover({ meta, filters: fm?.custom ? undefined : filters, items: fm?.custom ? fm.items.map((i) => (Array.isArray(i) ? i : i.label)) : undefined }) : '';
  const chips = view.show_filter_chips !== false ? renderFilterChips({ meta, filters }) : '';

  // data
  const cols = reportColumns(spec, meta, ctx);
  const allRows = resolveRows(spec, meta, ctx);
  const sortSpec = view.sort || (() => { const m = /`?(?:tab[^`.]*`?\.)?`?(\w+)`?\s+(asc|desc)/i.exec(json.order_by || ''); return m ? { field: m[1], order: m[2].toLowerCase() } : null; })();
  const rows = sortRows(allRows, sortSpec, cols);
  const total = Number.isFinite(Number(spec.data?.total)) && spec.data?.total != null ? Number(spec.data.total) : rows.length;

  // group-by
  const gm = takeMenu(ctx, 'page.group_by', null);
  const gbRaw = view.group_by || (typeof json.group_by === 'string' ? (/(\w+)`?\s*$/.exec(json.group_by) || [])[1] : null) || null;
  const groupField = gbRaw && (meta.fields || []).some((f) => f.fieldname === gbRaw) ? gbRaw : (gbRaw === 'name' ? 'name' : null);
  const groups = groupField ? groupRows(rows, groupField) : [];
  const gbHtml = groupBySelector({ meta, active: groupField, open: !!gm || !!view.group_by_open, items: gm?.custom ? gm.items : undefined });

  // totals, chart
  const showTotals = view.show_totals ?? t(json.add_totals_row);
  const dfFor = (fn) => (meta.fields || []).find((f) => f.fieldname === fn) || { fieldname: fn, fieldtype: 'Data', label: fn };
  let tcols = cols, trows = rows;
  if (groupField) {
    const gdf = dfFor(groupField);
    tcols = [{ key: groupField, fieldname: groupField, doctype: dt, label: gdf.label || groupField, df: gdf }, { key: 'count', fieldname: 'count', doctype: dt, label: 'Count', df: { fieldname: 'count', fieldtype: 'Int', label: 'Count' } }];
    trows = groups.map((g) => ({ [groupField]: g.value, count: g.count }));
  }
  const totals = showTotals && trows.length ? Object.fromEntries(tcols.filter((c) => SUMMABLE.has(c.df.fieldtype)).map((c) => [c.key, trows.reduce((a, r) => a + (Number(cellValue(r, c)) || 0), 0)])) : null;
  const cb = chartBlock({ spec, view, json, rows, cols, groupField, groups, hidden: !!view.chart_hidden });

  // head
  const views = enabledViews(meta, { ...view, views: view.views ?? ['report'] }, ctx);
  let switcher = '';
  if (switcherVisible(meta, ctx)) {
    const m = takeMenu(ctx, 'page.view_switcher');
    const variants = { ...(view.view_variants || {}) };
    if (saved && !variants.report) variants.report = [title];
    switcher = renderViewSwitcher({ views, current: 'report', variants, open: !!m, items: m?.custom ? m.items : undefined, highlight: m?.highlight });
  }
  const customs = ctx.useOverlays('button', (b) => !b.target || b.target === 'page.actions');
  const customHtml = customs.map((b) => button(b.label, { primary: b.style === 'primary', icon: b.icon, cls: b.style === 'danger' ? 'btn-danger' : '', ui: `report.button.${b.label}` })).join('');
  const reload = `<span class="page-icon-group hidden-xs hidden-sm">${button('Refresh', { iconOnly: true, icon: 'refresh-cw', title: 'Refresh', cls: 'text-muted', ui: 'report.reload' })}</span>`;
  const defMenu = buildReportMenu(spec, meta, ctx, { saved, totals: !!showTotals });
  const mm = takeMenu(ctx, 'page.menu', defMenu);
  const menuItems = mm ? mm.items : defMenu;
  const menu = `<div class="menu-btn-group${mm ? ' show' : ''}">${button('Menu', { iconOnly: true, icon: 'ellipsis', cls: 'menu-more-button', title: 'Menu', ui: 'page.menu' }).replace('type="button"', 'type="button" aria-haspopup="menu"')}${menuList(menuItems, { open: !!mm, highlight: mm?.highlight, ui: 'report.menu' })}</div>`;
  const head = `<div class="page-head flex" data-ui="page-head"><div class="container"><div class="row flex-nowrap align-center page-head-content justify-between">`
    + `<div class="page-title"><button class="btn-reset sidebar-toggle-btn navbar-brand" type="button" data-ui="page-head.sidebar-toggle">${icon('panel-left-close', 'md')}</button>`
    + `<div class="flex title-area ellipsis">${breadcrumbs(ctx, meta, saved, title)}<span class="es-badge page-indicator-pill hide" data-testid="page-status"></span></div></div>`
    + `<div class="align-center flex standard-items-section"><div class="flex col page-actions justify-content-end"><div class="filters flex"></div>`
    + `<div class="custom-actions hidden-xs hidden-md">${switcher}${customHtml}</div><div class="custom-mobile-actions"></div>`
    + `<div class="standard-actions flex">${reload}${menu}</div></div></div></div></div></div>`;

  // body
  const sortSel = sm ? `<div class="sort-selector" data-ui="report.sort">${menuList(sm.items?.length ? sm.items : [], { open: true, ui: 'report.sort.menu' })}</div>` : '';
  const filterBar = `<div class="page-form flex report-page-form" data-ui="report.page-form">${std}<div class="filter-section flex">${renderFilterButton({ count: filterCount(filters), open: popoverOpen })}${gbHtml}${cb ? cb.toggle : ''}${sortSel}</div>${popover}</div>${chips}`;
  let state = view.state || 'normal';
  if (state === 'normal' && !trows.length) state = filters.length ? 'no_results' : 'empty';
  const pl = PAGE_LENGTHS.includes(Number(view.page_length || json.page_length)) ? Number(view.page_length || json.page_length) : 20;
  const table = state === 'loading'
    ? `<div class="datatable datatable-loading" data-ui="report.loading"><div class="dt-scrollable">${Array.from({ length: 6 }, () => '<div class="dt-row"><div class="dt-cell"><div class="dt-cell__content">&nbsp;</div></div></div>').join('')}</div></div>`
    : tableHtml({ cols: tcols, rows: state === 'normal' ? trows : [], ctx, totals, sort: groupField ? null : sortSpec, meta, state, view });
  const lens = PAGE_LENGTHS.map((p) => `<button type="button" class="es-pill" role="radio" data-state="${p === pl ? 'active' : 'inactive'}" aria-checked="${p === pl}" data-ui="report.page-length.${p}">${p}</button>`).join('');
  const count = groupField ? `${groups.length} group${groups.length === 1 ? '' : 's'}` : countLabel(rows.length, total);
  const footer = `<div class="list-paging-area level" data-ui="report.paging"><div class="level-left"><div class="es-tab-buttons" role="radiogroup" aria-label="Page length">${lens}</div></div><div class="level-right"><span class="list-count" data-ui="report.count">${esc(count)}</span></div></div>`;
  const main = `<div class="layout-main-report report-view" style="width:100%;max-width:none;box-sizing:border-box" data-ui="report-view"${saved ? ` data-saved-report="${esc(title)}"` : ''}>${filterBar}${cb ? cb.html : ''}<div class="report-wrapper">${table}</div>${footer}</div>`;
  return { head, main, title: saved ? title : `${dt} report`, doctype: dt, columns: tcols, rows: trows };
}
