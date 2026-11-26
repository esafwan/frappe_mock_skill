// Dashboard page renderer: chart + number-card grid from Dashboard JSON. Generic, deterministic.
// spec.meta.dashboard: { name|dashboard_name, charts:[{chart, width:'Full'|'Half'}], cards:[{card}], chart_options? }
// spec.meta.charts / spec.meta.number_cards (optional): definition lists keyed by name/label/chart_name.
// spec.data.charts[name], spec.data.number_cards[name]: same shapes as the workspace blocks.
import { chart as drawChart, CHART_TYPES } from '../../kit-lib/chart.mjs';
import { numberCard } from '../../kit-lib/numbercard.mjs';
import { renderMenu } from '../../shell/menus.mjs';
import { esc, icon, findIn } from '../workspace/blocks/common.mjs';

const TYPE = { Line: 'line', Bar: 'bar', Pie: 'pie', Donut: 'donut', Percentage: 'percentage', Heatmap: 'heatmap', 'Axis-Mixed': 'axis-mixed' };
const CSS = `<style data-ui="dashboard.layout">.menu-btn-group{position:relative}.menu-btn-group>.dropdown-menu{position:absolute;right:0;top:100%;z-index:5;min-width:180px;display:block}.dashboard-grid{padding-top:16px;display:flex;flex-wrap:wrap;margin:0 -8px;align-items:stretch}.dashboard-grid>.dashboard-cell{box-sizing:border-box;padding:0 8px 16px;min-width:0}.dashboard-cell.w-card .widget-body svg.icon,.dashboard-cell.w-card svg.icon{width:12px;height:12px;max-height:none}.dashboard-cell.w-card .widget{min-height:0}.dashboard-cell.w-full{width:100%;flex:0 0 100%}.dashboard-cell.w-half{width:50%;flex:0 0 50%}.dashboard-cell.w-card{width:25%;flex:0 0 25%}.dashboard-cell .widget{height:100%;box-sizing:border-box}.dashboard-cell .widget-body svg{display:block;width:100%;height:auto;max-height:300px}.dashboard-cell .chart-empty{display:flex;align-items:center;justify-content:center;min-height:240px}.dashboard-chart .widget-head{position:relative}.dashboard-chart .chart-filter-popover{position:absolute;right:8px;top:36px;z-index:5;min-width:220px;padding:10px;border:1px solid var(--outline-gray-1,#ededed);border-radius:8px;background:var(--surface-white,#fff);box-shadow:0 4px 12px rgba(0,0,0,.1)}.chart-filter-popover .filter-row{display:flex;flex-direction:column;gap:4px;margin-bottom:8px}.chart-filter-popover .filter-row label{font-size:12px}.dashboard-empty{display:flex;align-items:center;justify-content:center;min-height:240px}@media(max-width:767px){.dashboard-grid>.dashboard-cell{width:100%;flex-basis:100%}}</style>`;

const overlaysOf = (ctx, pred) => (ctx.useOverlays ? ctx.useOverlays('menu_open', pred) : (ctx.overlays || []).filter((o) => o.type === 'menu_open' && pred(o)));

function filterPopover(name, d, meta) {
  const f = d?.filters || meta?.filters || {};
  const rows = Object.keys(f).sort().map((k) => `<div class="filter-row"><label class="text-muted">${esc(k)}</label><input type="text" class="form-control input-xs" value="${esc(f[k])}" readonly aria-label="${esc(k)}"></div>`).join('') || `<div class="filter-row text-muted">No filters</div>`;
  return `<div class="chart-filter-popover" data-ui="dashboard.chart-filter:${esc(name)}">${rows}<div class="filter-actions"><button type="button" class="btn btn-xs btn-default">Reset Chart</button> <button type="button" class="btn btn-xs btn-primary">Set Filters</button></div></div>`;
}

function chartCell(row, ctx, spec, dash) {
  const name = row.chart || row.chart_name;
  const meta = findIn(spec.meta?.charts || dash.chart_defs, ['chart_name', 'label', 'name'], name) || {};
  const d = spec.data?.charts?.[name];
  const label = meta.label || meta.chart_name || name;
  const half = String(row.width || 'Half').toLowerCase() !== 'full';
  let body;
  if (!d) { ctx.warn?.(`dashboard: no data.charts["${name}"]; rendering empty state`); body = `<div class="chart-empty text-muted" data-ui="chart.empty">No Data</div>`; }
  else {
    const t = TYPE[d.type] || String(d.type || 'line').toLowerCase();
    if (!CHART_TYPES.includes(t)) throw new Error(`dashboard: chart "${name}" has unknown type ${d.type}`);
    body = drawChart(t, d, { title: label, colors: d.colors, width: half ? 520 : 1060, height: 240 });
  }
  const open = overlaysOf(ctx, (o) => o.target === `dashboard.chart-filter:${name}` || (o.target === 'dashboard.chart-filter' && o.name === name)).length > 0;
  const controls = `<div class="widget-control" data-ui="dashboard.chart-controls:${esc(name)}"><span class="chart-filter-btn" data-ui="dashboard.chart-filter-btn:${esc(name)}">${icon('filter', 'sm')}</span><span class="chart-menu-btn">${icon('ellipsis', 'sm')}</span></div>`;
  const html = `<div class="widget dashboard-widget-box dashboard-chart" style="min-height:300px" data-ui="card:${esc(label)}" data-widget-name="${esc(label)}"><div class="widget-head"><div class="widget-label"><div class="widget-title"><span class="ellipsis" title="${esc(label)}">${esc(label)}</span></div><div class="widget-subtitle">${esc(d?.subtitle || '')}</div></div>${controls}${open ? filterPopover(name, d, meta) : ''}</div><div class="widget-body" style="min-height:240px">${body}</div></div>`;
  return `<div class="dashboard-cell ${half ? 'w-half' : 'w-full'}" data-ui="dashboard.chart-cell" data-width="${half ? 'half' : 'full'}">${html}</div>`;
}

function cardCell(row, ctx, spec, dash) {
  const name = row.card || row.number_card_name;
  const meta = findIn(spec.meta?.number_cards || dash.card_defs, ['number_card_name', 'label', 'name'], name) || {};
  const d = spec.data?.number_cards?.[name];
  if (!d) ctx.warn?.(`dashboard: no data.number_cards["${name}"]; rendering 0`);
  const v = d?.value ?? 0;
  const previous = d?.previous ?? (d?.delta !== undefined && d.delta !== -100 ? v / (1 + d.delta / 100) : undefined);
  const colour = d?.color || meta.color;
  const label = meta.label || name;
  const html = numberCard({ label, value: v, previous, currency: d?.currency || meta.currency, colour: colour ? String(colour).toLowerCase() : undefined, compact: d?.compact, locale: ctx.locale, subtitle: d?.subtitle, deltaLabel: d?.deltaLabel })
    .replace(/^<([a-zA-Z][\w-]*)/, (m, t) => `<${t} data-ui="card:${esc(label)}"`);
  return `<div class="dashboard-cell w-card" data-ui="dashboard.card-cell">${html}</div>`;
}

export default function render(spec, ctx) {
  const dash = spec.meta?.dashboard;
  if (!dash) throw new Error('dashboard renderer: spec.meta.dashboard is required');
  const title = dash.dashboard_name || dash.name || dash.title || 'Dashboard';
  const cards = (dash.cards || []).map((r) => cardCell(typeof r === 'string' ? { card: r } : r, ctx, spec, dash)).join('');
  const charts = (dash.charts || []).map((r) => chartCell(typeof r === 'string' ? { chart: r } : r, ctx, spec, dash)).join('');
  const empty = !cards && !charts;
  const menuOv = overlaysOf(ctx, (o) => o.target === 'dashboard.menu')[0];
  const menuOpen = !!menuOv;
  const menuItems = menuOv?.items || [{ label: 'Refresh All' }, { label: 'Edit' }, { label: 'New' }];
  const menu = `<div class="menu-btn-group" data-ui="dashboard.menu"><button class="btn btn-default icon-btn" data-ui="page.menu-button" aria-label="Menu">${icon('ellipsis', 'sm')}</button>${menuOpen ? renderMenu({ type: 'menu_open', target: 'page.menu', items: menuItems }) : ''}</div>`;
  const head = `<div class="page-head flex" data-ui="page-head"><div class="container"><div class="row flex-nowrap align-center page-head-content justify-between"><div class="page-title"><div class="flex title-area ellipsis"><nav class="es-breadcrumbs navbar-breadcrumbs" aria-label="Breadcrumbs"><ol><li><span class="es-breadcrumbs__item" aria-current="page"><span class="es-breadcrumbs__label">${esc(title)}</span></span></li></ol></nav></div></div><div class="align-center flex standard-items-section"><div class="flex col page-actions justify-content-end"><div class="standard-actions flex">${menu}</div></div></div></div></div></div>`;
  const body = empty ? `<div class="dashboard-empty text-muted" data-ui="dashboard.empty">This dashboard has no charts or cards yet.</div>` : `<div class="dashboard-grid" data-ui="dashboard.grid">${cards}${charts}</div>`;
  return { head, main: `${CSS}<div class="desk-page dashboard-page" data-ui="dashboard.page">${body}</div>`, title };
}
