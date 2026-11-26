// Query / Script Report page (T-R3), page: 'query_report'. Port of query_report.js (filters, chart, summary, message,
// Prepared Report states, tree reports). Generic: every name comes from meta.report / data / view / overlays.
//
// Spec keys read here (all optional except meta.report):
//   meta.report   Report JSON: report_name, ref_doctype, report_type, filters[], columns[], prepared_report, add_total_row,
//                 disable_prepared_report, is_tree?, letter_head...
//   data.rows     array of objects (or arrays in column order); data.columns overrides meta.report.columns
//   data.chart    {type, labels, datasets} or Frappe {type, data:{labels, datasets}, colors?, height?}
//   data.report_summary [{label, value, datatype?, indicator?, currency?, precision?}, {separator: '-'}]  ("separator" or label "-")
//   data.message  string | string[] | {text, color}
//   data.prepared {status: queued|generating|ready|stale, name, creation, progress, runs[]}  (or view.prepared)
//   view.filters  {fieldname: value}; view.collapsible_filters / view.filters_collapsed; view.hide_chart; view.hide_summary;
//   view.tree     {parent_field, name_field, expanded:[names]} (or meta.report.is_tree); view.show_totals; view.sort
// Overlays drawn: button (page.actions / none), menu_open page.menu | page.actions.
// Default export render(spec, ctx) -> { document, head, main, title }.
import { esc } from '../../kit-lib/util.mjs';
import { icon } from '../../kit-lib/icons.mjs';
import { chart as drawChart } from '../../kit-lib/chart.mjs';
import { formatCell } from '../../kit-lib/cells.mjs';
import { renderReportDialogs } from './dialogs.mjs';
import { wrapFrappe } from '../../doctype/fields/base.mjs';
import { adaptReport } from '../../adapters/report.mjs';
import { loadFieldRenderers } from '../form/index.mjs';
import { menuList, toMenuItems, tidyDividers, takeMenu } from '../list/head.mjs';
import { renderShell } from '../../shell/shell.mjs';
import * as DT from '../../kit-lib/datatable/index.mjs';

const t = (v) => v === 1 || v === true || v === '1';
const pad = (n) => String(n).padStart(2, '0');
const kebab = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const parseJson = (v, d) => { if (typeof v !== 'string') return v ?? d; try { return JSON.parse(v); } catch { return d; } };
const COLORS = new Set(['red', 'orange', 'yellow', 'green', 'blue', 'cyan', 'purple', 'pink', 'gray', 'grey', 'light-blue', 'darkgrey']);
const color = (c) => (COLORS.has(String(c)) ? String(c) : 'blue');
const titleCase = (s) => String(s).replace(/_/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase());

export const reportName = (r = {}) => r.report_name || r.name || 'Report';

// ------------------------------------------------------------------ filters

/** Frappe filter fieldtypes this renderer draws itself (the shared field renderers have no such control). */
const OWN = new Set(['DateRange', 'Date Range', 'DatetimeRange', 'MultiSelectList', 'MultiSelectDropdown']);

function normFilter(f = {}) {
  const df = { ...f };
  df.fieldname = f.fieldname || kebab(f.label || '').replace(/-/g, '_');
  df.label = f.label ?? titleCase(df.fieldname);
  df.fieldtype = f.fieldtype || 'Data';
  if (t(f.mandatory)) df.reqd = 1;
  if (Array.isArray(f.options)) df.options = f.options.map((o) => (typeof o === 'object' ? o.value ?? o.label : o)).join('\n');
  if (df.fieldtype === 'Select' && typeof df.options === 'string' && !df.options.startsWith('\n') && !t(f.reqd) && !t(f.mandatory) && f.default === undefined) df.options = `\n${df.options}`;
  return df;
}

const rangeText = (v) => (Array.isArray(v) ? v.filter(Boolean).join(' to ') : v ? String(v) : '');

/** DateRange / DatetimeRange: text input with the range placeholder and the datepicker icon. */
function rangeControl(df, value) {
  const text = rangeText(value);
  const dt = df.fieldtype === 'DatetimeRange';
  return wrapFrappe({ ...df, fieldtype: df.fieldtype }, {
    inputHtml: `<input type="text" autocomplete="off" class="input-with-feedback form-control datepicker-input" data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}" placeholder="${dt ? 'YYYY-MM-DD HH:mm to YYYY-MM-DD HH:mm' : 'YYYY-MM-DD to YYYY-MM-DD'}"${text ? ` value="${esc(text)}"` : ''}>`,
    valueHtml: esc(text),
    inputWrapperPost: '',
  }).replace('</div>\n\t\t\t\t\t<div class="control-value', `${icon('calendar')}</div>\n\t\t\t\t\t<div class="control-value`);
}

/** MultiSelectList: input with the selected values as chips and a "dropdown" caret (frappe MultiSelectList). */
function multiSelectControl(df, value) {
  const vals = (Array.isArray(value) ? value : value ? String(value).split(',') : []).map((s) => String(s).trim()).filter(Boolean);
  const chips = vals.map((v) => `<span class="btn-xs btn-default multiselect-chip" data-value="${esc(v)}">${esc(v)}</span>`).join('');
  const shown = vals.length ? (vals.length > 2 ? `${vals.slice(0, 2).join(', ')} +${vals.length - 2}` : vals.join(', ')) : '';
  return wrapFrappe(df, {
    inputHtml: `<div class="multiselect-list" data-count="${vals.length}"><input type="text" autocomplete="off" class="input-with-feedback form-control" data-fieldtype="${esc(df.fieldtype)}" data-fieldname="${esc(df.fieldname)}" placeholder=""${shown ? ` value="${esc(shown)}"` : ''} readonly><span class="multiselect-caret">${icon('chevron-down')}</span><div class="selected-chips hide">${chips}</div></div>`,
    valueHtml: esc(vals.join(', ')),
  });
}

let KIT = null;
async function fieldKit() { return (KIT ??= { renderers: await loadFieldRenderers() }); }

/** One filter control through the shared field renderers (or the range / multiselect controls above). */
export function renderFilterControl(df0, value, kit = {}, ctx = {}) {
  const df = normFilter(df0);
  if (OWN.has(df.fieldtype)) return df.fieldtype.startsWith('MultiSelect') ? multiSelectControl(df, value) : rangeControl(df, value);
  const type = df.fieldtype === 'Date Range' ? 'DateRange' : df.fieldtype;
  if (type === 'DateRange') return rangeControl(df, value);
  const fn = kit.renderers?.[type] || kit.renderers?.Data;
  // filter controls are inline (no description box, not required unless mandatory); value is the current filter value
  const c = { value: value ?? undefined, doc: {}, doctype: ctx.ref_doctype || '', locale: ctx.locale || 'en', loadMeta: () => null, filter: true, df };
  const html = fn ? fn({ ...df, description: undefined }, c) : '';
  return html;
}

/** Default values: view.filters wins, then df.default (Today and friends are resolved against ctx.today). */
function filterValue(df, given, today) {
  if (given && given[df.fieldname] !== undefined) return given[df.fieldname];
  const d = df.default;
  if (d === undefined || d === null || d === '') return undefined;
  if (/^(today|__today)$/i.test(String(d))) return today;
  if (df.fieldtype === 'Check') return t(d) ? 1 : 0;
  return d;
}

export function renderFilters(filters = [], { values = {}, collapsed = false, collapsible = true, kit, ctx = {} } = {}) {
  const dfs = filters.map(normFilter);
  const controls = dfs.map((df) => {
    const v = filterValue(df, values, ctx.today);
    return `<div class="form-group col-md-2 col-sm-4 report-filter" data-fieldname="${esc(df.fieldname)}" data-ui="report.filter.${esc(df.fieldname)}"${v !== undefined ? ` data-has-value="1"` : ''}>${renderFilterControl(df, v, kit, ctx)}</div>`;
  }).join('');
  const active = dfs.filter((df) => { const v = filterValue(df, values, ctx.today); return v !== undefined && v !== '' && v !== 0 && !(Array.isArray(v) && !v.length); }).length;
  const toggle = collapsible ? `<div class="filters-toggle flex align-center" data-ui="report.filters-toggle"><button type="button" class="btn btn-xs btn-default toggle-filters" aria-expanded="${collapsed ? 'false' : 'true'}">${icon(collapsed ? 'chevron-down' : 'chevron-up')}<span>${collapsed ? 'Show Filters' : 'Hide Filters'}</span>${collapsed && active ? `<span class="filter-count badge">${active}</span>` : ''}</button></div>` : '';
  return `<div class="page-form form-inline flex report-filters${collapsed ? ' collapsed' : ''}" data-ui="report.filters"${collapsed ? ' data-collapsed="1"' : ''}><div class="standard-filter-section flex row" style="${collapsed ? 'display:none' : 'display:flex'};flex-wrap:wrap;gap:var(--margin-md,8px)" data-ui="report.filter-fields">${controls}</div>${toggle}</div>`;
}

// ------------------------------------------------------------------ page head

function menuItems(rep, view, ctx) {
  const items = ['Edit', 'Export', 'Print', 'PDF', 'Setup Auto Email', 'Pick Columns', view.hide_chart ? 'Show Chart' : 'Toggle Chart', 'Toggle Sidebar', 'Save'];
  if (t(rep.add_total_row) || view.show_totals) items.push(view.show_totals ? 'Hide Totals' : 'Show Totals');
  if (rep.report_type === 'Script Report' && ctx.developer_mode) items.push('Edit Report');
  return toMenuItems(items);
}

function head(rep, view, ctx, st) {
  const title = reportName(rep);
  const trail = (ctx.breadcrumbs || []).map((c) => (typeof c === 'string' ? c : c?.label)).filter(Boolean);
  const crumbs = trail.length ? trail : [ctx.workspace, rep.ref_doctype, title].filter(Boolean);
  const last = crumbs.length - 1;
  const bc = `<nav class="es-breadcrumbs navbar-breadcrumbs" aria-label="Breadcrumbs"><ol>${crumbs.map((c, i) => `<li><span class="es-breadcrumbs__item"${i === last ? ' aria-current="page"' : ''}><span class="es-breadcrumbs__label">${esc(c)}</span></span></li>`).join('')}</ol></nav>`;
  const menuOv = takeMenu(ctx, 'page.menu', null);
  const menu = menuOv?.custom ? menuOv.items : menuItems(rep, view, ctx);
  const actionsOv = takeMenu(ctx, 'page.actions', null);
  const btns = ctx.useOverlays('button', (b) => !b.target || b.target === 'page.actions');
  const custom = btns.map((b, i) => `<button type="button" class="btn btn-sm ${b.style === 'primary' || b.primary_action ? 'btn-primary' : 'btn-default'} ellipsis" data-ui="report.button.${esc(kebab(b.label || i))}">${esc(b.label)}</button>`).join('');
  const refreshLabel = st.prepared ? 'Rebuild' : 'Refresh';
  const actions = actionsOv?.items ? `<div class="inner-group-button" data-label="Actions" data-ui="report.group.actions"><button class="btn btn-default btn-sm ellipsis" type="button" aria-haspopup="menu" aria-expanded="true">Actions</button>${menuList(actionsOv.items, { open: true })}</div>` : '';
  return `<div class="page-head flex" data-ui="page-head"><div class="container"><div class="row flex-nowrap align-center page-head-content justify-between" style="display:flex;align-items:center;justify-content:space-between;width:100%;margin:0"><div class="page-title" style="flex:1 1 auto;min-width:0;white-space:nowrap" data-ui="page.title"><div class="title-area flex">${bc}</div></div><div class="col page-actions justify-content-end" style="margin-left:auto;flex:0 0 auto;width:auto" data-ui="page.actions"><div class="standard-actions flex">${custom}${actions}<div class="menu-btn-group" data-ui="page.menu-group"><button type="button" class="btn btn-default icon-btn" data-ui="page.menu-button" aria-label="Menu" aria-haspopup="menu" aria-expanded="${menuOv ? 'true' : 'false'}">${icon('ellipsis')}</button>${menuList(menu, { open: !!menuOv, highlight: menuOv?.highlight, ui: 'page.menu' })}</div><button type="button" class="btn btn-sm btn-primary primary-action" data-ui="report.primary-action" data-label="${refreshLabel}">${esc(refreshLabel)}</button></div></div></div></div></div>`;
}

// ------------------------------------------------------------------ chart, summary, message

/** Frappe chart config {type, data:{labels,datasets}} or the flat {type, labels, datasets}. */
export function renderReportChart(c = {}, view = {}, ctx = {}) {
  const data = c.data && (c.data.labels || c.data.datasets) ? c.data : { labels: c.labels || [], datasets: c.datasets || [] };
  const type = String(c.type || 'bar').toLowerCase();
  const map = { axismixed: 'axis-mixed', 'axis-mixed': 'axis-mixed', line: 'line', bar: 'bar', pie: 'pie', donut: 'donut', percentage: 'percentage', heatmap: 'heatmap' };
  const kind = map[type] || 'bar';
  const empty = kind !== 'heatmap' && !(data.datasets || []).some((d) => (d.values || []).length);
  const svg = empty ? '<div class="chart-empty text-muted text-center">No data</div>' : drawChart(kind, data, { width: 1080, height: c.height || 240, colors: c.colors, system: ctx.formatSystem, rtl: ctx.rtl });
  return `<div class="chart-wrapper" data-ui="report.chart" data-chart-type="${esc(kind)}"><div class="chart-container">${svg}</div></div>`;
}

const SEP = new Set(['-', '+', '=', '*', '/', 'x', '÷', '×']);
function summaryValue(item, ctx) {
  const v = item.value;
  if (v === undefined || v === null || v === '') return '';
  const dt = item.datatype || (typeof v === 'number' ? (item.currency ? 'Currency' : Number.isInteger(v) ? 'Int' : 'Float') : 'Data');
  return formatCell({ fieldtype: dt, fieldname: 'v', precision: item.precision }, v, { currency: item.currency || ctx.currency, system: ctx.formatSystem, filterable: false }).html;
}
export function renderSummary(items = [], ctx = {}) {
  const arr = Array.isArray(items) ? items : [];
  if (!arr.length) return '';
  const cells = arr.map((it, i) => {
    if (it.separator !== undefined || (!it.label && SEP.has(String(it.value))) || t(it.is_separator))
      return `<div class="summary-separator" data-ui="report.summary.${i}.separator"><div class="summary-value">${esc(it.separator ?? it.value ?? '')}</div></div>`;
    const ind = it.indicator ? ` text-${color(it.indicator)}` : '';
    return `<div class="summary-stat" data-ui="report.summary.${i}"><div class="summary-title text-muted">${esc(it.label ?? '')}</div><div class="summary-value${ind}">${summaryValue(it, ctx)}</div></div>`;
  }).join('');
  return `<div class="report-summary" data-ui="report.summary" style="display:flex">${cells}</div>`;
}

export function renderMessage(m) {
  if (m === undefined || m === null || m === '') return '';
  const list = Array.isArray(m) ? m : [m];
  const body = list.map((x) => (typeof x === 'object' ? x : { text: x })).map((x) => `<div class="report-message-line${x.color ? ' alert alert-' + color(x.color) : ''}">${x.html ? x.text : esc(x.text)}</div>`).join('');
  return `<div class="report-message message-div" data-ui="report.message" role="status">${body}</div>`;
}

// ------------------------------------------------------------------ prepared report

export const PREPARED = { queued: 'Queued', generating: 'In Progress', ready: 'Completed', stale: 'Completed' };
export function renderPrepared(p = {}, rep = {}) {
  if (!p || !p.status) return { banner: '', body: null };
  const status = PREPARED[p.status] ? p.status : 'ready';
  const when = p.creation ? esc(String(p.creation).slice(0, 16)) : '';
  const select = `<div class="frappe-control input-max-width prepared-report-select" data-fieldtype="Select" data-fieldname="prepared_report_name" data-ui="report.prepared-select"><div class="form-group"><div class="control-input-wrapper"><div class="control-input flex align-center"><select class="input-with-feedback form-control ellipsis" data-fieldname="prepared_report_name"><option>${esc(p.name || (when ? `${reportName(rep)} - ${when}` : 'Latest'))}</option>${(p.runs || []).map((r) => `<option>${esc(r)}</option>`).join('')}</select></div></div></div></div>`;
  let msg;
  if (status === 'queued') msg = `<span class="indicator-pill orange">Queued</span> <span>Report generation is queued. It will start shortly.</span>`;
  else if (status === 'generating') {
    const pr = Math.max(0, Math.min(100, Math.round(Number(p.progress) || 0)));
    msg = `<span class="indicator-pill blue">In Progress</span> <span>Report generation in progress${p.progress !== undefined ? ` (${pr}%)` : ''}.</span><div class="progress" style="max-width:240px;display:inline-block;width:240px;height:6px;border-radius:3px;overflow:hidden;background:var(--gray-200,#ededed);vertical-align:middle;margin-inline-start:8px"><div class="progress-bar progress-bar-success" style="width:${pr}%;height:100%;background:var(--primary,#171717);border-radius:3px"></div></div>`;
  } else if (status === 'stale') msg = `<span class="indicator-pill orange">Outdated</span> <span>This report was generated${when ? ` on ${when}` : ''}. To get the updated report, click on <a href="#" class="rebuild-link">Rebuild</a>.</span>`;
  else msg = `<span class="indicator-pill green">Completed</span> <span>This report was generated${when ? ` on ${when}` : ''}. To get the updated report, click on <a href="#" class="rebuild-link">Rebuild</a>.</span>`;
  const banner = `<div class="prepared-report-banner flex align-center" data-ui="report.prepared" data-status="${status}">${select}<div class="prepared-report-message">${msg}</div></div>`;
  return { banner, body: status === 'queued' || status === 'generating' ? status : null };
}

function waitingBody(status) {
  const text = status === 'queued' ? 'Report generation is queued' : 'Generating report';
  return `<div class="report-empty flex justify-center align-center text-muted" data-ui="report.waiting" style="min-height:240px"><div class="text-center"><div class="msg-box no-border">${icon('loader')}<p>${esc(text)}</p></div></div></div>`;
}

// ------------------------------------------------------------------ table (shared datatable, own fallback)

const cols = (rep, data) => (data.columns || rep.columns || []).map((c) => (typeof c === 'object' ? { ...c, fieldname: c.fieldname || kebab(c.label || '').replace(/-/g, '_'), fieldtype: c.fieldtype || 'Data' } : c));
const toObj = (cs, r) => (Array.isArray(r) ? Object.fromEntries(cs.map((c, i) => [c.fieldname, r[i]])) : r);

/** Rows after tree handling: indent from `indent` or the parent chain; children of collapsed parents are hidden. */
export function treeRows(rows, tree = {}, rep = {}) {
  const pf = tree.parent_field || 'parent';
  const nf = tree.name_field;
  const expanded = tree.expanded === 'all' ? null : new Set(tree.expanded || []);
  const byName = new Map();
  const key = (r) => (nf ? r[nf] : r.name ?? r.account ?? Object.values(r)[0]);
  rows.forEach((r) => byName.set(key(r), r));
  const kids = new Map();
  rows.forEach((r) => { const p = r[pf]; if (p) kids.set(p, (kids.get(p) || 0) + 1); });
  const depth = (r, seen = new Set()) => { if (r.indent !== undefined) return Number(r.indent); const p = r[pf]; const pr = p && byName.get(p); return pr && !seen.has(p) ? 1 + depth(pr, seen.add(p)) : 0; };
  const hidden = (r) => { let p = r[pf]; const seen = new Set(); while (p && byName.has(p) && !seen.has(p)) { seen.add(p); if (expanded && !expanded.has(p)) return true; p = byName.get(p)[pf]; } return false; };
  return rows.filter((r) => !hidden(r)).map((r) => ({ ...r, indent: depth(r), has_children: kids.has(key(r)), expanded: expanded ? expanded.has(key(r)) : true }));
}

function fallbackTable(columns, rows, o) {
  const th = columns.map((c) => `<th class="dt-cell dt-cell--header" style="text-align:${c.align || (/^(Int|Float|Currency|Percent)$/.test(c.fieldtype) ? 'right' : 'left')}"><div class="dt-cell__content">${esc(c.label || c.fieldname)}</div></th>`).join('');
  const tr = rows.map((r, i) => `<tr class="dt-row" data-row-index="${i}">${columns.map((c, ci) => {
    const f = formatCell(c, r[c.fieldname], { doc: r, currency: r.currency ?? o.currency, system: o.system, filterable: false });
    const ind = o.tree && ci === 0 ? `<span class="dt-tree-indent" style="padding-inline-start:${(r.indent || 0) * 20}px">${r.has_children ? icon(r.expanded ? 'chevron-down' : 'chevron-right') : ''}</span>` : '';
    return `<td class="dt-cell" style="text-align:${f.align}"><div class="dt-cell__content">${ind}${f.html}</div></td>`;
  }).join('')}</tr>`).join('');
  return `<div class="datatable" data-ui="datatable" data-rows="${rows.length}" data-cols="${columns.length}"><table class="dt-table"><thead><tr class="dt-row-header">${th}</tr></thead><tbody>${tr}</tbody></table></div>`;
}

function table(columns, rows, o) {
  try {
    const html = DT.renderDatatable(columns, rows, { sort: o.sort, tree: o.tree, treeColumn: 0, currency: o.currency, rtl: o.rtl, showTotals: !!o.totals });
    if (html) return html;
  } catch (e) { o.warn?.(`query_report: shared datatable failed (${e.message}); using the local table`); }
  return fallbackTable(columns, rows, o);
}

// ------------------------------------------------------------------ page

/** Build the slots of a query report page. Returns { head, main, title, columns, rows }. */
export async function buildQueryReportPage({ spec, ctx }) {
  const repRaw = spec.meta?.report;
  if (!repRaw || typeof repRaw !== 'object') { ctx.warn?.('query_report: meta.report did not resolve to a Report'); return { head: '', main: '', title: 'Report', columns: [], rows: [] }; }
  const rep = adaptReport(repRaw);
  const data = spec.data || {};
  const view = spec.view || {};
  const kit = await fieldKit();

  const columns = cols(rep, data);
  const rows0 = (Array.isArray(data.rows) ? data.rows : []).map((r) => toObj(columns, r));
  const treeCfg = view.tree || (t(rep.is_tree) ? { parent_field: rep.parent_field } : null);
  const rows = treeCfg ? treeRows(rows0, treeCfg, rep) : rows0;

  const prep = data.prepared || view.prepared || (t(rep.prepared_report) && !t(rep.disable_prepared_report) ? { status: 'ready' } : null);
  const pr = renderPrepared(prep, rep);

  const filters = parseJson(rep.filters, []);
  const collapsed = t(view.filters_collapsed) || t(view.collapsible_filters_collapsed);
  const filtersHtml = filters.length ? renderFilters(filters, { values: view.filters || {}, collapsed, collapsible: view.collapsible_filters !== false, kit, ctx: { ...ctx, ref_doctype: rep.ref_doctype } }) : '';

  const chartHtml = data.chart && !t(view.hide_chart) && !pr.body ? renderReportChart(data.chart, view, ctx) : '';
  const summaryHtml = !t(view.hide_summary) && !pr.body ? renderSummary(data.report_summary, ctx) : '';
  const messageHtml = renderMessage(data.message);

  let body;
  if (pr.body) body = waitingBody(pr.body);
  else if (!rows.length) body = `<div class="report-empty flex justify-center align-center text-muted" data-ui="report.empty" style="min-height:240px"><div class="msg-box no-border"><p>Nothing to show</p></div></div>`;
  else {
    const totals = t(rep.add_total_row) || view.show_totals ? { addRow: true } : null;
    body = table(columns, rows, { tree: !!treeCfg, sort: view.sort, currency: ctx.system?.currency, system: ctx.formatSystem, rtl: ctx.rtl, totals, warn: ctx.warn });
  }
  const main = `<style data-ui="report.table-fill">.report-body .datatable .dt-header,.report-body .datatable .dt-body,.report-body .datatable .dt-footer{min-width:100%;width:max-content;box-sizing:border-box}.report-body .datatable .dt-header .dt-cell,.report-body .datatable .dt-header .dt-cell__content{background:transparent}</style><div class="layout-main-section report-wrapper" data-ui="report" data-report-type="${esc(rep.report_type)}">${filtersHtml}${pr.banner}${messageHtml}${chartHtml}${summaryHtml}<div class="report-body" data-ui="report.body">${body}</div></div>`;
  return { head: head(rep, view, ctx, { prepared: !!prep }), main, title: `${reportName(rep)} report`, columns, rows, ref_doctype: rep.ref_doctype };
}

export default async function render(spec, ctx) {
  const page = await buildQueryReportPage({ spec, ctx });
  // report dialogs (Pick Columns, Export, Save As, Create Chart) over the report's own columns: same overlay path as the report view
  const dlgMeta = { name: spec.meta?.report?.report_name || '', fields: (page.columns || []).map((c) => ({ fieldname: c.fieldname, label: c.label, fieldtype: c.fieldtype || 'Data' })) };
  ctx.preDialogs = [...(ctx.preDialogs || []), ...renderReportDialogs({ spec, meta: dlgMeta, ctx, columns: page.columns || [] }).dialogs];
  const workspace = ctx.workspace || spec.ctx?.workspace || '';
  const chrome = { dock: true, sidebar: 'expanded', navbar: false, ...(ctx.chrome || {}) };
  const sctx = spec.ctx || {};
  const vp = ctx.viewport && typeof ctx.viewport === 'object' ? `${ctx.viewport.width}x${ctx.viewport.height}` : (ctx.viewport || '1440x900');
  const document = renderShell({ ctx: {
    theme: ctx.theme, locale: ctx.locale, rtl: ctx.rtl, viewport: vp, app: ctx.app || workspace, workspace, user: ctx.user, chrome,
    dock: { ...(sctx.dock || {}), items: sctx.dock?.items || [] },
    title: page.title, route: `query-report/${esc(spec.meta?.report?.report_name || '')}`, pageName: spec.meta?.report?.report_name, page: 'query_report',
    tokensPath: ctx.href ? ctx.href('tokens').replace(/\/$/, '') : '../tokens', notifications: sctx.notifications,
  }, head: page.head, main: page.main, right: '', sidebarHtml: '' });
  return { document, head: page.head, main: page.main, title: page.title };
}
